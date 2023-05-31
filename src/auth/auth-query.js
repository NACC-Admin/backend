require('dotenv').config();
import makeAuth from './auth'
import { UniqueConstraintError } from '../helpers/errors'

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

export default function makeAuthQuery({database}){
    return Object.freeze({
      findByHeader,
      checkToken
    });

    async function findByHeader(token) {

      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
      const email = decoded.email
  
      const db = await database
      const found = await db
        .collection('Staff')
        .findOne({ email: email })
  
      if (found) {
        console.log("Found")
        return found
      }
      else {
        return "error"
      }
  
    }
  
    async function checkToken (token, email) {
  
      try {

        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
        const decode_email = decoded.email
  
        // const db = await database
        // const found = await db
        //   .collection('Users')
        //   .findOne({ email: email })
  
        if (decode_email == email) {
          console.log("Found")
          return {
            status: 200,
            message: "Token Valid"
          }
        }
        else {
          return {
            status: 400,
            message: "Token Invalid"
          }
        }
  
      } catch (error) {
        return {
          status: 400,
          message: "Token Expired"
        }
      }
  
      
    }

  
}