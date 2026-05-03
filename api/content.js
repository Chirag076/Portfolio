const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  try {
    await client.connect();
    const db = client.db('portfolio_db');
    const collection = db.collection('content');

    // GET: Load all portfolio data
    if (req.method === 'GET') {
      const data = await collection.findOne({ _id: 'main_content' });
      return res.status(200).json(data || {});
    }

    // POST: Update all portfolio data (Secure)
    if (req.method === 'POST') {
      const { password, content } = req.body;
      
      // Simple server-side password check
      if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
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
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
};
