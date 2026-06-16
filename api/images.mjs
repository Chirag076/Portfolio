import { MongoClient, ObjectId } from 'mongodb';

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

    // --- GET: RETRIEVE IMAGE ---
    if (req.method === 'GET') {
      const id = req.query?.id || new URL(req.url, 'http://localhost').searchParams.get('id');
      if (!id) {
        return res.status(400).json({ error: 'Missing image id' });
      }

      try {
        const imagesCollection = db.collection('images');
        const img = await imagesCollection.findOne({ _id: new ObjectId(id) });
        
        if (!img) {
          return res.status(404).json({ error: 'Image not found' });
        }

        const buffer = img.data.buffer ? Buffer.from(img.data.buffer) : Buffer.from(img.data);
        res.setHeader('Content-Type', img.contentType || 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.status(200).send(buffer);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
    }

    // --- POST: UPLOAD IMAGE ---
    if (req.method === 'POST') {
      const password = req.headers.password;
      const contentCollection = db.collection('content');
      const currentConfig = await contentCollection.findOne({ _id: 'main_content' });
      const validPassword = currentConfig?.adminPassword || process.env.ADMIN_PASSWORD;

      if (!password || password !== validPassword) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { image, fileName } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Image data is required' });
      }

      const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ error: 'Invalid base64 image format' });
      }

      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      const imagesCollection = db.collection('images');
      const insertResult = await imagesCollection.insertOne({
        fileName: fileName || 'upload.png',
        contentType,
        data: buffer,
        uploadedAt: new Date()
      });

      return res.status(200).json({ 
        success: true, 
        url: `/api/images?id=${insertResult.insertedId}` 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error("Images API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
