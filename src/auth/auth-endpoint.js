import {
  UniqueConstraintError,
  InvalidPropertyError,
  RequiredParameterError
} from '../helpers/errors';
import makeHttpError from '../helpers/http-error';
import makeAuth from './auth';

export default function makeAuthEndpointHandler({authQuery}){
 
  return async function handle(httpRequest){
    switch (httpRequest.method) {
        
        case 'GET':
          return getAllHeaders(httpRequest)

        case 'POST':
          return getAllHeaders(httpRequest)

        default:
          return makeHttpError({
            statusCode: 405,
            errorMessage: `${httpRequest.method} method not allowed.`
          })
    }
  }
  

  async function getAllHeaders (httpRequest) { 

    const { email } = httpRequest.queryParams || {}
    var token = httpRequest.headers.authorization

    if (email !== undefined ){
      const result = await authQuery.checkToken(token, email)
      
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      }

    }
    else {
      var token = httpRequest.headers.authorization
      const result = await authQuery.findByHeader(token)

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      }

    }
   
      
  }

  // async function getHeader(httpRequest) {
    
  //   var token = httpRequest.headers.authorization
  //   const result = await authQuery.findByHeader(token);

  //   if(result == "token expired") {
  //     return {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       data: {
  //         status: 400,
  //         message: "Unauthorized access, token expired"
  //       }
        
  //     }
  //   }
  //   else if(result == "error") {
  //     return {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       data: {
  //         status: 405,
  //         message: "Unauthorized access, error"
  //       }
  //     }
  //   }
  //   else {
  //     return {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       data: {
  //         status: 200,
  //         message: "found"
  //       }
  //     }
  //   }

  // }

}