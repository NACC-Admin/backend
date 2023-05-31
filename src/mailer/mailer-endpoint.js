import {
    UniqueConstraintError,
    InvalidPropertyError,
    RequiredParameterError
  } from '../helpers/errors';
  import makeHttpError from '../helpers/http-error';
  import makeMailer from './mailer';

export default function makeMailerEndpointHandler({mailerQuery}){
    return async function handle(httpRequest){
        switch (httpRequest.method) {
            case 'POST':
              return postMailer(httpRequest)

            case 'GET':
              return getMessages(httpRequest)

            default:
              return makeHttpError({
                statusCode: 405,
                errorMessage: `${httpRequest.method} method not allowed.`
              })
        }
    }

    async function getMessages (httpRequest) {
      const { max, before, after } = httpRequest.queryParams || {}

      const result = await mailerQuery.getMessages({ max, before, after })

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      }

    }


    async function postMailer (httpRequest) {
        let mailerInfo = httpRequest.body
        if (!mailerInfo) {
          return makeHttpError({
            statusCode: 400,
            errorMessage: 'Bad request. No POST body.'
          })
        }
    
        if (typeof httpRequest.body === 'string') {
          try {
            mailerInfo = JSON.parse(mailerInfo)
          } catch {
            return makeHttpError({
              statusCode: 400,
              errorMessage: 'Bad request. POST body must be valid JSON.'
            })
          }
        }
    
        try {

          const mailer = makeMailer(mailerInfo)
            const result = await mailerQuery.add(mailer)
            return {
              headers: {
                'Content-Type': 'application/json'
              },
              statusCode: 201,
              data: JSON.stringify(result)
            }
          
        } catch (e) {
          return makeHttpError({
            errorMessage: e.message,
            statusCode:
              e instanceof UniqueConstraintError
                ? 409
                : e instanceof InvalidPropertyError ||
                  e instanceof RequiredParameterError
                  ? 400
                  : 500
          })
        }
    }



}