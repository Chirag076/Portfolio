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
      const validPassword = currentConfig?.adminPassword || process.env.ADMIN_PASSWORD;
      const has2FA = !!currentConfig?.twoFactorSecret;

      let isAuthorized = false;
      let used2FA = false;

      // 1. Try 2FA Authentication
      if (has2FA && twoFactorCode) {
        const totp = new OTPAuth.TOTP({
          secret: currentConfig.twoFactorSecret
        });
        const delta = totp.validate({ token: twoFactorCode, window: 1 });
        if (delta !== null) {
          isAuthorized = true;
          used2FA = true;
        }
      }

      // 2. Try Password Authentication (if not already authorized by 2FA)
      if (!isAuthorized && password && password === validPassword) {
        isAuthorized = true;
      }

      // 3. Final Check
      if (!isAuthorized) {
        return res.status(401).json({ 
          error: 'Unauthorized', 
          details: 'Invalid password or 2FA code.' 
        });
      }

      // 4. Enforce 2FA for changes if it is enabled
      const isMakingChanges = content && Object.keys(content).length > 0;
      if (isMakingChanges && has2FA && !used2FA) {
        return res.status(401).json({ 
          error: 'Unauthorized', 
          details: 'A valid 2FA code is required to save changes.' 
        });
      }

      // 5. Apply Changes
      if (isMakingChanges) {
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
