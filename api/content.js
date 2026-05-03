const { MongoClient } = require('mongodb');

// Create the client outside the handler for connection pooling
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
  // 1. Check if URI exists
  if (!uri) {
    return res.status(500).json({ error: "Configuration Error: MONGODB_URI is missing." });
  }

  try {
    const connectedClient = await clientPromise;
    const db = connectedClient.db('portfolio_db');
    const collection = db.collection('content');

    // GET: Load all portfolio data
    if (req.method === 'GET') {
      const data = await collection.findOne({ _id: 'main_content' });
      // Return empty object so frontend keeps its local defaults if DB is empty
      return res.status(200).json(data || {});
    }

    // POST: Update all portfolio data
    if (req.method === 'POST') {
      const { password, content } = req.body;
      
      if (!password || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Password' });
      }

      if (!content) {
        return res.status(400).json({ error: 'Bad Request: No content provided' });
      }

      await collection.updateOne(
        { _id: 'main_content' },
        { $set: { ...content, updatedAt: new Date() } },
        { upsert: true }
      );

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error("API Error:", error);
    // Return the actual error message to the frontend for debugging
    return res.status(500).json({ 
      error: "Database Connection Error", 
      details: error.message 
    });
  }
};
