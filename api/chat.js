export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const message = body.message;
    const type = body.type || "gemini";

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // GEMINI
    if (type === "gemini") {

      const API_KEY = process.env.GEMINI_API_KEY;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: message }]
            }]
          })
        }
      );

      const data = await response.json();

      return res.status(200).json(data);
    }

    // TELEGRAM
    if (type === "telegram") {

      const token = process.env.TELEGRAM_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      });

      return res.status(200).json({ ok: true });
    }

  } catch (error) {

    console.error("API ERROR:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}
