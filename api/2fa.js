const { MongoClient } = require('mongodb');
const { authenticator } = require('otplib');
const QRCode = require('qrcode');

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

module.exports = async (req, res) => {
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

    // GET: Generate Setup Data
    if (req.method === 'GET') {
      const secret = authenticator.generateSecret();
      const otpauth = authenticator.keyuri('Admin', 'Portfolio', secret);
      const qrCodeUrl = await QRCode.toDataURL(otpauth);

      return res.status(200).json({ secret, qrCodeUrl });
    }

    // POST: Enable 2FA (Verify and Save)
    if (req.method === 'POST') {
      const { secret, code } = req.body;
      
      const isValid = authenticator.check(code, secret);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid 2FA code' });
      }

      await collection.updateOne(
        { _id: 'main_content' },
        { $set: { twoFactorSecret: secret } }
      );

      return res.status(200).json({ success: true });
    }

    // DELETE: Disable 2FA
    if (req.method === 'DELETE') {
      await collection.updateOne(
        { _id: 'main_content' },
        { $unset: { twoFactorSecret: "" } }
      );
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
