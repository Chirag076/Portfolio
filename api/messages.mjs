import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  try {
    const connectedClient = await connectToDatabase();
    const db = connectedClient.db('portfolio_db');
    const collection = db.collection('messages');

    if (req.method === 'GET') {
      const messages = await collection.find({}).sort({ createdAt: -1 }).limit(10).toArray();
      return res.status(200).json(messages);
    }

    if (req.method === 'POST') {
      const { text, author = "Anonymous Visitor" } = req.body;
      
      if (!text || text.length > 200) {
        return res.status(400).json({ error: "Message too long or empty (max 200 chars)" });
      }

      const newMessage = {
        text,
        author,
        createdAt: new Date(),
      };

      await collection.insertOne(newMessage);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
