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
    const { message, history = [], type = 'gemini' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (type === 'groq') {
      return await handleGroq(message, history, res);
    } else {
      return await handleGemini(message, history, res);
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function handleGemini(message, history, res) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const formattedHistory = history.map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  formattedHistory.push({
    role: 'user',
    parts: [{ text: message }]
  });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `You are MAINUL-X AI HELPER. You represent developer Md. Mainul Islam.

RULES:
- Detect language automatically (Bangla, Banglish, English)
- Bangla/Banglish message → reply in Bangla
- English message → reply in English
- If user sends only emojis, understand emotion and reply naturally
- Be friendly, short and helpful

Examples:
🙂 → friendly reply
😂 → laugh with user
😢 → comfort
🔥 → excitement
🐸 → playful reply`
            }]
          },
          contents: formattedHistory,
          generationConfig: {
            temperature: 0.8,
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

async function handleGroq(message, history, res) {
  const API_KEY = process.env.GROQ_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  const groqMessages = [
    {
      role: 'system',
      content: `You are MAINUL-X AI HELPER. You represent developer Md. Mainul Islam.

RULES:
- Detect language automatically (Bangla, Banglish, English)
- Bangla/Banglish message → reply in Bangla
- English message → reply in English
- If user sends only emojis, understand emotion and reply naturally
- Be friendly, short and helpful`
    },
    ...history.map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.text
    })),
    { role: 'user', content: message }
  ];

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
          messages: groqMessages,
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
