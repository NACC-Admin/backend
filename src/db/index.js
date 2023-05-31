require('dotenv').config();
import mongodb from 'mongodb';


export default async function makeDb () {
  const MongoClient = mongodb.MongoClient
  const url = process.env.DATABASE_URL;
  const dbName = 'masterislamDB'

  const client = new MongoClient(url, { useUnifiedTopology: true, keepAlive: true,
    })

  try {
    await client.connect()
  } catch (e) {
    //console.error(e);
  }
  
  const db = await client.db(dbName)
  db.makeId = makeIdFromString
  return db

}

function makeIdFromString (id) {
  return new mongodb.ObjectID(id)
}