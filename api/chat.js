export default async function handler(req, res) {
  const { message } = req.body;
  
  // Vercel Settings-এ এই ২টা নাম দিয়ে API Key সেভ করবেন
  const keys = [process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2];

  for (let key of keys) {
    if (!key) continue;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return res.status(200).json(data); // সফল হলে ডাটা পাঠিয়ে দিবে
      }
    } catch (err) {
      console.error("Key failed, trying next...");
    }
  }

  res.status(500).json({ error: "All API keys failed" });
}
