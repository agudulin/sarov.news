import fetch from 'isomorphic-unfetch'
import { connectToDatabase, ObjectId } from '../../../lib/db'

export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.MONGODB_URI)
  const feedCollection = await db.collection('feed')

  const { id } = req.query
  console.log(id)

  const item = await feedCollection.findOne({ _id: new ObjectId(id) })

  res.json(item)
}

