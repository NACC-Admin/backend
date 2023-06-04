import makeActivities from './activities'
import { UniqueConstraintError } from '../helpers/errors'

export default function makeActivitiesQuery({database}){
    return Object.freeze({
        add,
        findById,
        findByMonth,
        findByYear,
        findByDaynMonthnYear,
        getActivities,
        deleteById
    });

    async function getActivities ({ max = 100, before, after } = {}) {

        const db = await database;
        const query = {}
        if (before || after) {
        query._id = {}
        query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id
        query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id
        }

        return (await db
        .collection('Activities')
        .find(query)
        .limit(Number(max))
        .toArray()).map(documentToActivities)
    }


    async function add ({ activitiesId, ...activities }) {
        const db = await database
        if (activitiesId) {
          activities._id = db.makeId(activitiesId)
        }
        const { result, ops } = await db
          .collection('Activities')
          .insertOne(activities)
          .catch(mongoError => {
            const [errorCode] = mongoError.message.split(' ')
            if (errorCode === 'E11000') {
              const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ')
              throw new UniqueConstraintError(
                
              )
            }
            throw mongoError
          })
        return {
            success: result.ok === 1,
            created: documentToActivities(ops[0])
        }
    }

 
  async function findById ({ id }) {
    const db = await database
    const found = await db
      .collection('Activities')
      .findOne({ _id: db.makeId(id) })
    if (found) {
      return documentToActivities(found)
    }
    return null
  }

  async function findByMonth({ month }) {
    const db = await database;
    
    return (await db
      .collection('Activities')
      .find({ month: month })
      .toArray()).map(documentToActivities)
  }

  async function findByYear({ year }) {
    const db = await database;
    
    return (await db
      .collection('Activities')
      .find({ year: year })
      .toArray()).map(documentToActivities)
  }

  async function findByDaynMonthnYear({ day, month, year }) {
    const db = await database;
    
    return (await db
      .collection('Activities')
      .find({ day: day, month: month, year: year })
      .toArray()).map(documentToActivities)
  }

  async function deleteById ({ id }) {
    const db = await database

    const { result } = await db.collection('Activities').deleteOne({"_id": db.makeId(id)})
    if (result.deletedCount > 0){
      return {
        status: "Success"
      }
    }
    else {
      return {
        status: "Error"
      }
    }
  }

  function documentToActivities ({ _id: id, ...doc }) {
    return makeActivities({ id, ...doc })
  }
}