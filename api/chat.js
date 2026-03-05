// MAINUL-X API - Md. Mainul Islam (M41NUL)
// GitHub: https://github.com/M41NUL
// Portfolio: https://mainul-x-portfolio.vercel.app

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
    const { message, type = 'gemini' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (type === 'groq') {
      return await handleGroq(message, res);
    } else {
      return await handleGemini(message, res);
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Gemini AI Handler
async function handleGemini(message, res) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }],
          systemInstruction: {
            parts: [{
              text: `You are MAINUL-X AI HELPER. You represent developer Md. Mainul Islam.

Rules:
- Detect user's language automatically.
- If user writes Bangla → reply Bangla.
- If user writes English → reply English.
- If user writes Banglish → reply Banglish.

Emoji Rules:
- If user sends only emojis, understand the emotion.
- Reply naturally based on emoji meaning.
- Use the same language as the previous message.

Examples:
🙂 → friendly reply
😂 → laugh with the user
😢 → comfort the user
🔥 → excitement
🐸 → funny playful reply
🐸🐸 → double frog, even more playful

Be friendly, human-like and short.`
            }]
          },
          generationConfig: {
            temperature: 0.8,
            topP: 0.9,
            maxOutputTokens: 800
          }
        })
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Groq AI Handler
async function handleGroq(message, res) {
  const API_KEY = process.env.GROQ_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are MAINUL-X AI HELPER. You represent developer Md. Mainul Islam.

Rules:
- Detect user's language automatically.
- If user writes Bangla → reply Bangla.
- If user writes English → reply English.
- If user writes Banglish → reply Banglish.

Emoji Rules:
- If user sends only emojis, understand the emotion.
- Reply naturally based on emoji meaning.
- Use the same language as the previous message.

Examples:
🙂 → friendly reply
😂 → laugh with the user
😢 → comfort the user
🔥 → excitement
🐸 → funny playful reply

Be friendly, human-like and short.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.8,
          max_tokens: 800
        })
      }
    );

    const data = await response.json();

    return res.status(200).json({
      candidates: [{
        content: {
          parts: [{
            text: data.choices[0].message.content
          }]
        }
      }]
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
