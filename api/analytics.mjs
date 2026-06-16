import { MongoClient } from 'mongodb';

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

// User-Agent parser helper
function parseUA(ua) {
  if (!ua) return { os: 'Unknown OS', browser: 'Unknown Browser' };
  let os = 'Unknown OS';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('iPhone')) os = 'iOS (iPhone)';
  else if (ua.includes('iPad')) os = 'iOS (iPad)';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('Linux')) os = 'Linux';

  let browser = 'Unknown Browser';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Chrome') && !ua.includes('Chromium')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Trident')) browser = 'Internet Explorer';
  return { os, browser };
}

// Country Code to Flag Emoji helper
function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode === 'Unknown') return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return '🌐';
  }
}

export default async function handler(req, res) {
  try {
    const connectedClient = await connectToDatabase();
    const db = connectedClient.db('portfolio_db');
    const contentCollection = db.collection('content');
    const analyticsCollection = db.collection('analytics');

    // --- GET: FETCH RECENT LOGS (Admin Authenticated) ---
    if (req.method === 'GET') {
      const password = req.headers.password;
      const currentConfig = await contentCollection.findOne({ _id: 'main_content' });
      const validPassword = currentConfig?.adminPassword || process.env.ADMIN_PASSWORD;

      if (!password || password !== validPassword) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const logs = await analyticsCollection
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

      return res.status(200).json(logs);
    }

    // --- POST: LOG EVENT & NOTIFY ---
    if (req.method === 'POST') {
      const { event, metadata = {} } = req.body;
      if (!event) {
        return res.status(400).json({ error: 'Event name is required' });
      }

      // 1. Get Client IP & Vercel Location Headers
      const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
      const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : null;
      const region = req.headers['x-vercel-ip-country-region'] || null;
      const country = req.headers['x-vercel-ip-country'] || null;
      const timezone = req.headers['x-vercel-ip-timezone'] || null;
      const userAgent = req.headers['user-agent'] || '';

      const { os, browser } = parseUA(userAgent);

      // 2. Cooldown Throttling (15-minute window per IP per event)
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
      const recentEvent = await analyticsCollection.findOne({
        ip,
        event,
        createdAt: { $gte: fifteenMinsAgo }
      });
      const shouldNotify = !recentEvent;

      // 3. IP Intelligence Lookup (Only if not throttled and not local IP)
      let company = 'Generic ISP';
      let lookupDetails = null;
      const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');

      if (shouldNotify && !isLocal) {
        try {
          const lookupRes = await fetch(`http://ip-api.com/json/${ip}`);
          if (lookupRes.ok) {
            const data = await lookupRes.json();
            if (data.status === 'success') {
              lookupDetails = data;
              company = data.org || data.isp || 'Generic ISP';
            }
          }
        } catch (err) {
          console.error("IP Lookup failed:", err);
        }
      }

      // Final Geolocation parsing
      const finalCity = city || lookupDetails?.city || 'Unknown';
      const finalRegion = region || lookupDetails?.regionName || 'Unknown';
      const finalCountry = country || lookupDetails?.country || 'Unknown';
      const finalTimezone = timezone || lookupDetails?.timezone || 'Unknown';
      const flagEmoji = getFlagEmoji(finalCountry);

      // 4. Save entry to DB
      const logEntry = {
        event,
        metadata,
        ip,
        location: {
          city: finalCity,
          region: finalRegion,
          country: finalCountry,
          timezone: finalTimezone,
          flag: flagEmoji
        },
        device: { os, browser },
        company,
        createdAt: new Date()
      };
      await analyticsCollection.insertOne(logEntry);

      // 5. Send Webhook Alerts (If not throttled)
      if (shouldNotify) {
        const currentConfig = await contentCollection.findOne({ _id: 'main_content' });
        const discordUrl = currentConfig?.notifications?.discordWebhookUrl;
        const tgToken = currentConfig?.notifications?.telegramBotToken;
        const tgChatId = currentConfig?.notifications?.telegramChatId;

        // Formatted details
        const refName = metadata.ref || 'Direct Visit';
        const durationText = metadata.duration ? ` (${metadata.duration}s)` : '';
        
        let eventEmoji = '🚀';
        let eventName = 'Portfolio Visit';
        if (event === 'resume_view') {
          eventEmoji = '📄';
          eventName = `Resume Preview Opened${durationText}`;
        } else if (event === 'resume_download') {
          eventEmoji = '💾';
          eventName = 'Resume Downloaded';
        }

        // --- DISCORD ALERT ---
        if (discordUrl) {
          try {
            const embed = {
              title: `${eventEmoji} ${eventName}`,
              color: event === 'portfolio_visit' ? 15418782 : event === 'resume_view' ? 9128950 : 16348950, // Pink, Purple, Orange
              fields: [
                { name: "🏢 Company/ISP", value: `\`${company}\``, inline: true },
                { name: "📍 Location", value: `${flagEmoji} ${finalCity}, ${finalRegion}, ${finalCountry}`, inline: true },
                { name: "🔗 Source / Ref", value: `\`${refName}\``, inline: true },
                { name: "💻 Device / Browser", value: `${os} / ${browser}`, inline: true },
                { name: "⚡ IP Address", value: `\`${ip}\``, inline: true },
                { name: "🕒 Timezone", value: `${finalTimezone}`, inline: true }
              ],
              timestamp: new Date().toISOString()
            };

            await fetch(discordUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ embeds: [embed] })
            });
          } catch (discordErr) {
            console.error("Failed to dispatch Discord webhook:", discordErr);
          }
        }

        // --- TELEGRAM ALERT ---
        if (tgToken && tgChatId) {
          try {
            const message = 
              `🔔 *Recruiter Activity Alert*\n\n` +
              `*Event:* ${eventEmoji} ${eventName}\n` +
              `*Company:* \`${company}\`\n` +
              `*Location:* ${flagEmoji} ${finalCity}, ${finalRegion}, ${finalCountry}\n` +
              `*Ref/Source:* \`${refName}\`\n` +
              `*Device:* ${os} / ${browser}\n` +
              `*IP:* \`${ip}\``;

            await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: tgChatId,
                text: message,
                parse_mode: "Markdown"
              })
            });
          } catch (tgErr) {
            console.error("Failed to dispatch Telegram message:", tgErr);
          }
        }
      }

      return res.status(200).json({ success: true, notified: shouldNotify });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error("Analytics API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
