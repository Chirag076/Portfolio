import { MongoClient } from 'mongodb';
import * as otplib from 'otplib';

const { authenticator } = otplib;
const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  if (!uri) throw new Error("MONGODB_URI is missing");
  
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  try {
    const connectedClient = await connectToDatabase();
    const db = connectedClient.db('portfolio_db');
    const collection = db.collection('content');

    if (req.method === 'GET') {
      const updateResult = await collection.findOneAndUpdate(
        { _id: 'main_content' },
        { $inc: { visitorCount: 1 } },
        { upsert: true, returnDocument: 'after' }
      );
      
      const data = updateResult.value || updateResult;
      
      if (data) {
        if (data.adminPassword) delete data.adminPassword;
        if (data.twoFactorSecret) {
          data.has2FA = true;
          delete data.twoFactorSecret;
        }
      }

      return res.status(200).json(data || {});
    }

    if (req.method === 'POST') {
      const { password, content, twoFactorCode } = req.body;
      
      const currentConfig = await collection.findOne({ _id: 'main_content' });
      const validPassword = currentConfig?.adminPassword || process.env.ADMIN_PASSWORD;

      if (!password || password !== validPassword) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Password' });
      }

      if (currentConfig?.twoFactorSecret) {
        if (!twoFactorCode) {
          return res.status(401).json({ error: '2FA Code Required', requires2FA: true });
        }
        const isValid = authenticator.check(twoFactorCode, currentConfig.twoFactorSecret);
        if (!isValid) {
          return res.status(401).json({ error: 'Invalid 2FA Code', requires2FA: true });
        }
      }

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
}
