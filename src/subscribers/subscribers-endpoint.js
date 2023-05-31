import {
    UniqueConstraintError,
    InvalidPropertyError,
    RequiredParameterError
  } from '../helpers/errors';
  import makeHttpError from '../helpers/http-error';
  import makeSubscribers from './subscribers';

export default function makeSubscribersEndpointHandler({subscribersQuery}){
    return async function handle(httpRequest){
        switch (httpRequest.method) {
            case 'POST':
              return postSubscribers(httpRequest)
      
            case 'GET':
              return getSubscribers(httpRequest)

            case 'PUT':
              return updateSubscribers(httpRequest)
      
            case 'DELETE':
              return deleteSubscribers(httpRequest)


            default:
              return makeHttpError({
                statusCode: 405,
                errorMessage: `${httpRequest.method} method not allowed.`
              })
        }
    }

    async function getSubscribers (httpRequest) {


      const { id } = httpRequest.queryParams || {}
      // const { mid } = httpRequest.queryParams || {} 
      // const { memid } = httpRequest.queryParams || {} 
      // const { m_id, mem_id } = httpRequest.queryParams || {} 
      const { max, before, after } = httpRequest.queryParams || {}
      
      

      if (id !== undefined ){
        const result = await subscribersQuery.findById({ id })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else {
        const result = await subscribersQuery.getSubscribers({ max, before, after })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }
        
      }
        
    }
    

    async function postSubscribers (httpRequest) {
        let subInfo = httpRequest.body
        if (!subInfo) {
          return makeHttpError({
            statusCode: 400,
            errorMessage: 'Bad request. No POST body.'
          })
        }
    
        if (typeof httpRequest.body === 'string') {
          try {
            subInfo = JSON.parse(subInfo)
          } catch {
            return makeHttpError({
              statusCode: 400,
              errorMessage: 'Bad request. POST body must be valid JSON.'
            })
          }
        }
    
        try {
          
          if (httpRequest.path == '/follower/update-member'){
            const subscriber = makeSubscribers(subInfo)
           
            const result = await subscribersQuery.updateSub(subscriber);
            return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 201,
                data: JSON.stringify(result)
              }
          }
          else {
            const subscriber = makeSubscribers(subInfo)
            const result = await subscribersQuery.add(subscriber)
            return {
              headers: {
                'Content-Type': 'application/json'
              },
              statusCode: 201,
              data: JSON.stringify(result)
            }
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


  async function updateSubscribers(httpRequest) {
    
    let subInfo = httpRequest.body
    
    if (!subInfo) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.'
      })
    }

    if (typeof httpRequest.body === 'string') {
      try {
        subInfo = JSON.parse(subInfo)
      } catch {
        return makeHttpError({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.'
        })
      }
    }

    try {
      const subscriber = makeSubscriber(subInfo);
      const result = await subscriberQuery.update(subscriber)
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

  async function deleteSubscribers (httpRequest) {
    const { id } = httpRequest.queryParams || {}

   // const { customer_id } = httpRequest.pathParams || {}

     
    try {
      const result = await subscriberQuery.deleteById({ id })
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      }
    }
    catch (e){
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