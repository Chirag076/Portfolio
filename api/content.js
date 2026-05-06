const { MongoClient } = require('mongodb');
const { authenticator } = require('otplib');

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

    // GET: Load all portfolio data + Increment visitor count
    if (req.method === 'GET') {
      // Increment visitor count on every main site load
      const updateResult = await collection.findOneAndUpdate(
        { _id: 'main_content' },
        { $inc: { visitorCount: 1 } },
        { upsert: true, returnDocument: 'after' }
      );
      
      // Handle different MongoDB driver return structures
      const data = updateResult.value || updateResult;
      
      // Security: Remove sensitive data before sending to client
      if (data) {
        if (data.adminPassword) delete data.adminPassword;
        if (data.twoFactorSecret) {
          data.has2FA = true;
          delete data.twoFactorSecret;
        }
      }

      return res.status(200).json(data || {});
    }

    // POST: Update all portfolio data / Login
    if (req.method === 'POST') {
      const { password, content, twoFactorCode } = req.body;
      
      // Check password against DB override first, then env
      const currentConfig = await collection.findOne({ _id: 'main_content' });
      const validPassword = currentConfig?.adminPassword || process.env.ADMIN_PASSWORD;

      if (!password || password !== validPassword) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Password' });
      }

      // 2FA CHECK
      if (currentConfig?.twoFactorSecret) {
        if (!twoFactorCode) {
          return res.status(401).json({ error: '2FA Code Required', requires2FA: true });
        }
        const isValid = authenticator.check(twoFactorCode, currentConfig.twoFactorSecret);
        if (!isValid) {
          return res.status(401).json({ error: 'Invalid 2FA Code', requires2FA: true });
        }
      }

      // If just checking password/2FA (empty content)
      if (content && Object.keys(content).length > 0) {
        await collection.updateOne(
          { _id: 'main_content' },
          { $set: { ...content, updatedAt: new Date() } },
          { upsert: true }
        );
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ 
      error: "Database Connection Error", 
      details: error.message 
    });
  }
};
