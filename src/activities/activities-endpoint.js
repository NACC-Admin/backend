import {
    UniqueConstraintError,
    InvalidPropertyError,
    RequiredParameterError
  } from '../helpers/errors';
  import makeHttpError from '../helpers/http-error';
  import makeActivities from './activities';

export default function makeActivitiesEndpointHandler({activitiesQuery}){
    return async function handle(httpRequest){
        switch (httpRequest.method) {
            case 'POST':
              return postActivities(httpRequest)
      
            case 'GET':
              return getActivities(httpRequest)
      
            case 'DELETE':
              return deleteActivities(httpRequest)

            default:
              return makeHttpError({
                statusCode: 405,
                errorMessage: `${httpRequest.method} method not allowed.`
              })
        }
    }

    async function getActivities (httpRequest) {
      
      const { id } = httpRequest.queryParams || {}
      const { month } = httpRequest.queryParams || {}
      const { year } = httpRequest.queryParams || {}
      const { dday, dmonth, dyear } = httpRequest.queryParams || {} //category and password
      const { max, before, after } = httpRequest.queryParams || {}
      console.log("Activities get called")
      
      if (dday !== undefined && dmonth !== undefined && dyear !== undefined){
        console.log("Activities dday, dmonth, dyear")
        const day = dday;
        const month = dmonth;
        const year = dyear

        const result = await activitiesQuery.findByDaynMonthnYear({ day, month, year })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else if (month !== undefined ){
        console.log("Activities month")
        const result = await activitiesQuery.findByMonth({ month })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }

      else if (year !== undefined ){
        console.log("Activities year")
        const result = await activitiesQuery.findByYear({ year })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      
      else if (id !== undefined ){
        console.log("Activities id")
        const result = await activitiesQuery.findById({ id })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else {
        console.log("Activities else")
        const result = await activitiesQuery.getActivities({ max, before, after })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }
        
      }
        
    }

    async function postActivities (httpRequest) {
        let activitiesInfo = httpRequest.body
        if (!activitiesInfo) {
          return makeHttpError({
            statusCode: 400,
            errorMessage: 'Bad request. No POST body.'
          })
        }
    
        if (typeof httpRequest.body === 'string') {
          try {
            activitiesInfo = JSON.parse(activitiesInfo)
          } catch {
            return makeHttpError({
              statusCode: 400,
              errorMessage: 'Bad request. POST body must be valid JSON.'
            })
          }
        }
    
        try {
          const activities = makeActivities(activitiesInfo)
          const result = await activitiesQuery.add(activities)
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

    async function deleteActivities (httpRequest) {
      const { id } = httpRequest.queryParams || {}
  
      try {
        const result = await activitiesQuery.deleteById({ id })
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