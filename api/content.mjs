import { MongoClient } from 'mongodb';
import * as OTPAuth from 'otpauth';

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
      
      // --- FLEXIBLE LOGIN LOGIC ---
      
      // A. Try 2FA Code (If provided and enabled)
      if (twoFactorCode && currentConfig?.twoFactorSecret) {
        const totp = new OTPAuth.TOTP({
          secret: currentConfig.twoFactorSecret
        });
        const delta = totp.validate({ token: twoFactorCode, window: 1 });
        
        if (delta !== null) {
          // 2FA worked!
          if (content && Object.keys(content).length > 0) {
            await collection.updateOne(
              { _id: 'main_content' },
              { $set: { ...content, updatedAt: new Date() } },
              { upsert: true }
            );
          }
          return res.status(200).json({ success: true });
        }
      }

      // B. Fallback to Password
      const validPassword = currentConfig?.adminPassword || process.env.ADMIN_PASSWORD;
      if (password && password === validPassword) {
        if (content && Object.keys(content).length > 0) {
          await collection.updateOne(
            { _id: 'main_content' },
            { $set: { ...content, updatedAt: new Date() } },
            { upsert: true }
          );
        }
        return res.status(200).json({ success: true });
      }

      // If we reach here, neither worked
      return res.status(401).json({ 
        error: 'Unauthorized', 
        details: 'Invalid code or password.' 
      });
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
