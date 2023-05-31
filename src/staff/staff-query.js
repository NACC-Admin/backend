require('dotenv').config();
import makeStaff from './staff'
import { UniqueConstraintError } from '../helpers/errors'

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

export default function makeStaffQuery({database}){
    return Object.freeze({
        add,
        getStaff,
        findById,
        findByEmail,
        auth,
        reset,
        deleteById
    });

    async function getStaff ({ max = 100, before, after } = {}) {
    
      console.log("Staff get found")
      const db = await database;
      const query = {}
      if (before || after) {
      query._id = {}
      query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id
      query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id
      }

      return (await db
      .collection('Staff')
      .find(query)
      .limit(Number(max))
      .toArray()).map(documentToStaff)
    }

    async function add ({ staffId, ...staff}) {
        const db = await database
        if (staffId) {
          staff._id = db.makeId(staffId)
        }
        staff.password = bcrypt.hashSync(staff.password, 10);

        const found = await db
          .collection('Staff')
          .findOne({ email: staff.email })

        if (found) {
          return {
            status: "Error",
            message: "Email already exist"
          };
        }

        const { result, ops } = await db
          .collection('Staff')
          .insertOne(staff)
          .catch(mongoError => {
            const [errorCode] = mongoError.message.split(' ')
            if (errorCode === 'E11000') {
              const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ')
              throw new UniqueConstraintError(
                mongoIndex === 'ContactEmailIndex' ? 'emailAddress' : 'contactId'
              )
            }
            throw mongoError
          })
        return {
          status: "Success",
          message: "Staff created"
        }
    }

    async function auth ({ email, password }) {
       console.log("staff query entered")
        const db = await database
        const found = await db
          .collection('Staff')
          .findOne({ email: email })
          console.log("staff query queried")

        if (found) {
          console.log("staff query password found")
            const passwordValid = await bcrypt.compare(password, found.password);
           
            if (passwordValid){
               
                const token = jwt.sign({ password: password }, process.env.JWT_SECRET, {
                    expiresIn: '1d'
                });
                return {
                    token: token,
                    status: "Login Successful",
                    user: {
                      "email": found.email,
                      "department": found.department,
                      "name": found.name
                    }
                };
            }
            else {
                return {
                    token: "Nil",
                    status: "Password not match"
                };
            }
            
        }
        else {
            return {
                token: "Nil",
                status :"Email not found"
            }
            
        }
       
    }

    async function reset ({ id, ...staff }) {
      
        const db = await database
        const query = {
          _id: db.makeId(id)
        }
        

        const newSet = {
          $set : {

            lastname: staff.lastname, 
            othernames: staff.othernames, 
            email: staff.email, 
            gender: staff.gender, 
            phone: staff.phone, 
            bday: staff.bday, 
            bmonth: staff.bmonth, 
            department: staff.department, 
            position: staff.position, 
            password: bcrypt.hashSync(staff.password, 10),
            date: staff.date

          } 
        }
        /*if (id) {
          _id = db.makeId(id)
        }*/
        const { result } = await db
          .collection('Staff')
          .updateOne(query, newSet, {upsert:true})
          

          if (result) {
            return {
              status: "success",
              message: "Reset successfully"
            }
          }
          else {
            return {
              status: "error",
              message: "Error updating"
            }
          }
        
    }

    async function findById ({ id }) {
      const db = await database
      const found = await db
        .collection('Staff')
        .findOne({ _id: db.makeId(id) })
      if (found) {
        return documentToStaff(found)
      }
      return null
    }

    async function findByEmail ({ email }) {
      const db = await database
      const found = await db
        .collection('Staff')
        .findOne({ email: email })
      if (found) {
        return documentToStaff(found)
      }
      return null
    }


   
  async function deleteById ({ id }) {
    const db = await database

    const { result } = await db.collection('Staff').deleteMany({"_id": db.makeId(id)})
    return {
      success: result.n
    }
    
  }

  function documentToStaff ({ _id: id, ...doc }) {
    return makeStaff({ id, ...doc })
  }
}