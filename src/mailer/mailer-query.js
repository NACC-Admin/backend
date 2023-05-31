const nodemailer = require('nodemailer');
//const sgMail = require('@sendgrid/mail')

import makeMailer from './mailer'
import { UniqueConstraintError } from '../helpers/errors'

export default function makeMailerQuery({database}){
    return Object.freeze({
        add,
        getMessages
    });

    async function getMessages ({ max = 100, before, after } = {}) {
        
        const db = await database;
        const query = {}
        if (before || after) {
        query._id = {}
        query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id
        query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id
        }
  
        return (await db
        .collection('Messages')
        .find(query)
        .limit(Number(max))
        .toArray()).map(documentToMailer)
      }
   
    async function add ({ mailerId, ...mailer }) {
      console.log("Add query called")
      console.log(mailer._id)
        const db = await database
        if (mailerId) {
          mailer._id = db.makeId(mailerId)
        }
        const { result, ops } = await db
          .collection('Messages')
          .insertOne(mailer)
          .catch(mongoError => {
            const [errorCode] = mongoError.message.split(' ')
            if (errorCode === 'E11000') {
              const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ')
              throw new UniqueConstraintError(
                
              )
            }
            throw mongoError
          })

          console.log("After message query")
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'thenaccproject@gmail.com',//'masterislamproject@gmail.com',
            pass: 'uwumygrocoicpiwy', //'lxoawljozobqbmuo',
            },
        });

        const mailerResult = transporter.sendMail({
            from:  '"NACC Admin" <thenaccproject@gmail.com>', // sender address
            to: mailer.send_to, // list of receivers
            subject: mailer.topic, // Subject line
            text: mailer.comment+"<br><br>"+mailer.send_as, // plain text body
            html: mailer.comment+"<br><br>"+mailer.send_as, // html body
            }, function(error, info){
                if (error) {
                resolve(false); // or use rejcet(false) but then you will have to handle errors
                } 
            else {
                resolve(true);
                }
            });
        
        if (mailerResult == false){

            return {
                status: "error",
                message: "Mail not sent"
            }
        }
        else {
            return {
                status: "success",
                message: "Mail sent"
            }
        }

    }

    function documentToMailer ({ _id: id, ...doc }) {
        return makeMailer({ id, ...doc })
      }

}









// //import makeHttpError from '../helpers/http-error';

// const nodemailer = require('nodemailer');

// const sgMail = require('@sendgrid/mail')

// export default function makeQuery () {

//     return async function handle(httpRequest){
//         let resp = await getMailer(httpRequest);
//         if(resp == true){
//             return {
//                 headers: {
//                   'Content-Type': 'application/json'
//                 },
//                 statusCode: 200,
//                 data: JSON.stringify(resp)
//               }
//         }
//         else {
//             return makeHttpError({
//                 errorMessage: e.message,
//                 statusCode:
//                   e instanceof UniqueConstraintError
//                     ? 409
//                     : e instanceof InvalidPropertyError ||
//                       e instanceof RequiredParameterError
//                       ? 400
//                       : 500
//               })
//         }
        
//     }

//     async function getMailer (httpRequest) {
//         return new Promise((resolve,reject)=>{
//             let msgInfo = httpRequest.body
            
//             if (!msgInfo) {
//                 return makeHttpError({
//                 statusCode: 400,
//                 errorMessage: 'Bad request. No POST body.'
//                 })
//             }

//             if (typeof httpRequest.body === 'string') {
//                 try {
//                     msgInfo = JSON.parse(msgInfo)
//                 } catch {
//                 return makeHttpError({
//                     statusCode: 400,
//                     errorMessage: 'Bad request. POST body must be valid JSON.'
//                 })
//                 }
//             }
    
            

            
//             const transporter = nodemailer.createTransport({
//                 service: 'gmail',
//                 auth: {
//                 user: 'masterislamproject@gmail.com',
//                 pass: '!123MasterIslam',
//                 },
//             });

           

//             const template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
//             <html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
//             <head>
//                 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
//                 <title>Wonder Double Season Greetings</title>
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            
               
//             </head>
//             <body style="margin: 0; padding: 0;">
//                 <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
//                     <tr>
//                         <td align="center" bgcolor="#edebea">
//                         <p style="color:#343c64; font-size:14px;">&copy Wongafix 2021</p>
//                         </td>
//                     </tr>
//                 </table>
//             </body>
//             </html>`;

            

//            transporter.sendMail({
//                 from:  '"MasterIslam" <masterislam@gmail.com>', // sender address
//                 to: msgInfo.email, // list of receivers
//                 subject: msgInfo.topic, // Subject line
//                 text: msgInfo.message, // plain text body
//                 html: msgInfo.message, // html body
//                 }, function(error, info){
//                     if (error) {
//                     resolve(false); // or use rejcet(false) but then you will have to handle errors
//                     } 
//                 else {
//                     resolve(true);
//                     }
//                 });
//         })
//     }
 

    
// }