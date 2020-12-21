const url = require('url')
const MongoClient = require('mongodb').MongoClient

let cachedDb = null

export async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  const db = await client.db(url.parse(uri).pathname.substr(1))

  cachedDb = db
  return db
}

export const ObjectId = require('mongodb').ObjectId
