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

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // ===== GEMINI TRY =====

    try {

      const GEMINI_KEY = process.env.GEMINI_API_KEY;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
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

      if (data.candidates) {
        return res.status(200).json(data);
      }

    } catch (err) {
      console.log("Gemini failed → switching to Groq");
    }

    // ===== GROQ FALLBACK =====

    const GROQ_KEY = process.env.GROQ_API_KEY;

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + GROQ_KEY
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "user", content: message }
          ]
        })
      }
    );

    const groqData = await groqResponse.json();

    return res.status(200).json({
      candidates: [
        {
          content: {
            parts: [
              { text: groqData.choices[0].message.content }
            ]
          }
        }
      ]
    });

  } catch (error) {

    console.error("API ERROR:", error);

    return res.status(500).json({
      error: error.message
    });

  }
}
