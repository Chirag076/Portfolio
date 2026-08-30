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
      /* The contact form posts { name, email, message }. This handler used to
         accept only { text, author } and rejected anything else with a 400,
         so every submission from the site failed. Both shapes work now. */
      const body = req.body || {};
      const name = (body.name || body.author || "Anonymous Visitor").toString().trim();
      const email = (body.email || "").toString().trim();
      const message = (body.message || body.text || "").toString().trim();

      if (!message) {
        return res.status(400).json({ error: "Message is empty" });
      }
      if (message.length > 4000) {
        return res.status(400).json({ error: "Message too long (max 4000 characters)" });
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "That email address doesn't look right" });
      }

      const newMessage = {
        name,
        email,
        message,
        /* kept so the existing admin dashboard, which reads text/author,
           keeps rendering without a change */
        text: message,
        author: name,
        read: false,
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
