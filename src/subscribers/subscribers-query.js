import makeSubscribers from './subscribers'
import { UniqueConstraintError } from '../helpers/errors'

export default function makeSubscribersQuery({database}){
    return Object.freeze({
        add,
        update,
        findById,
        getSubscribers,
        deleteById
    });

    async function getSubscribers ({ max = 100, before, after } = {}) {
        const db = await database;
        const query = {}
        if (before || after) {
        query._id = {}
        query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id
        query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id
        }

        return (await db
        .collection('Subscribers')
        .find(query)
        .limit(Number(max))
        .toArray()).map(documentToSubscribers)
    }


    async function add ({ subscriberId, ...subscribers }) {

      let date = new Date()
      subscribers.date = date.toISOString()

        const db = await database
        if (subscriberId) {
          subscribers._id = db.makeId(subscriberId)
        }

        return db.collection("Subscribers") 
          .insertOne(subscribers)
          .then(result => {
            // return {
            //   success: result.ok === 1,
            //   id: result.insertedId
            //   }
            return {
              message: "Success",
              status: result.insertedId
            };
        }).catch(mongoError => {
          const [errorCode] = mongoError.message.split(' ')
              if (errorCode === 'E11000') {
                const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ')
                throw new UniqueConstraintError(
                  //mongoIndex === 'ContactEmailIndex' ? 'emailAddress' : 'contactId'
                )
              }
              throw mongoError
        });

    }

  async function update ({ id, ...subscriber}) {
      const db = await database
      const query = {
        _id: db.makeId(id)
      }
      
      const newSet = {
        $set : {

          category: subscriber.category,
          company: subscriber.company,
          address: subscriber.address,
          contact_person: subscriber.contact_person,
          phone: subscriber.phone,
          email: subscriber.email,
          business_activities: subscriber.business_activities,
          date: subscriber.date
        } 
      }
      /*if (id) {
        _id = db.makeId(id)
      }*/
      const { result } = await db
        .collection('Subscribers')
        .updateOne(query, newSet, {upsert:true})

        if (result) {
          return {
            status: "success",
            message: "Updated successfully"
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
      .collection('Subscribers')
      .findOne({ _id: db.makeId(id) })
    if (found) {
      return documentToSubscribers(found)
    }
    return null
  }


  async function deleteById ({ id }) {
    const db = await database

    const { result } = await db.collection('Subscribers').deleteMany({"_id": db.makeId(id)})
    return {
      success: result.n
    }
    
  }

  function documentToSubscribers ({ _id: id, ...doc }) {
    return makeSubscribers({ id, ...doc })
  }
}