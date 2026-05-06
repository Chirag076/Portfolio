import { MongoClient } from 'mongodb';
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';

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
    const currentConfig = await collection.findOne({ _id: 'main_content' });

    const { password } = req.headers;
    const validPassword = currentConfig?.adminPassword || process.env.ADMIN_PASSWORD;

    if (!password || password !== validPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const secret = new OTPAuth.Secret();
      const totp = new OTPAuth.TOTP({
        issuer: 'Portfolio',
        label: 'Admin',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret
      });

      const qrCodeUrl = await QRCode.toDataURL(totp.toString());
      return res.status(200).json({ 
        secret: secret.base32, 
        qrCodeUrl 
      });
    }

    if (req.method === 'POST') {
      const { secret, code } = req.body;
      
      const totp = new OTPAuth.TOTP({
        secret: secret
      });
      
      const delta = totp.validate({ token: code, window: 1 });
      if (delta === null) {
        return res.status(400).json({ error: 'Invalid 2FA code' });
      }

      await collection.updateOne(
        { _id: 'main_content' },
        { $set: { twoFactorSecret: secret } }
      );

      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      await collection.updateOne(
        { _id: 'main_content' },
        { $unset: { twoFactorSecret: "" } }
      );
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error("2FA API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
