import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

/* The admin dashboard sends the admin password in a `password` header, the
   same way the analytics and images routes expect it. */
async function isAdmin(req, db) {
  const password = req.headers.password;
  if (!password) return false;
  const config = await db.collection('content').findOne({ _id: 'main_content' });
  const validPassword = config?.adminPassword || process.env.ADMIN_PASSWORD;
  return !!validPassword && password === validPassword;
}

export default async function handler(req, res) {
  try {
    const connectedClient = await connectToDatabase();
    const db = connectedClient.db('portfolio_db');
    const collection = db.collection('messages');

    /* --- GET: the inbox (admin only — these are visitors' names and emails) --- */
    if (req.method === 'GET') {
      if (!(await isAdmin(req, db))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const messages = await collection.find({}).sort({ createdAt: -1 }).limit(50).toArray();
      return res.status(200).json(messages);
    }

    /* --- POST: the contact form --- */
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
        /* kept so older dashboard builds, which read text/author, still render */
        text: message,
        author: name,
        read: false,
        createdAt: new Date(),
      };

      await collection.insertOne(newMessage);
      return res.status(200).json({ success: true });
    }

    /* --- DELETE ?id=…: remove one message (admin only) --- */
    if (req.method === 'DELETE') {
      if (!(await isAdmin(req, db))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const id = req.query?.id || new URL(req.url, 'http://localhost').searchParams.get('id');
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Missing or invalid message id' });
      }
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
