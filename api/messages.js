const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  console.error("MONGODB_URI is missing from environment variables!");
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

module.exports = async (req, res) => {
  if (!uri) {
    return res.status(500).json({ error: "Configuration Error: MONGODB_URI is missing." });
  }

  try {
    const connectedClient = await clientPromise;
    const db = connectedClient.db('portfolio_db');
    const messagesCollection = db.collection('messages');
    const contentCollection = db.collection('content');

    // POST: Save a new message (Public)
    if (req.method === 'POST') {
      const { name, email, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newMessage = {
        name,
        email,
        message,
        createdAt: new Date(),
        read: false
      };

      await messagesCollection.insertOne(newMessage);
      return res.status(200).json({ success: true });
    }

    // AUTH CHECK for GET and DELETE
    const { password } = req.headers;
    const currentConfig = await contentCollection.findOne({ _id: 'main_content' });
    const validPassword = currentConfig?.adminPassword || process.env.ADMIN_PASSWORD;

    if (!password || password !== validPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // GET: Fetch all messages (Admin Only)
    if (req.method === 'GET') {
      const messages = await messagesCollection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(messages);
    }

    // DELETE: Remove a message (Admin Only)
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing message ID' });

      await messagesCollection.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error("Messages API Error:", error);
    return res.status(500).json({ error: "Database Error", details: error.message });
  }
};
