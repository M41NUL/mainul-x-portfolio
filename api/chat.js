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
    const { message, onlyEmojis = false, lastLanguage = 'en', type = 'gemini' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create prompt based on message type
    let prompt = message;
    
    if (onlyEmojis) {
      prompt = `The user sent only these emojis: "${message}". 
Understand the emotion and reply naturally in ${lastLanguage} language.
Examples:
🙂 → friendly reply
😂 → laugh with the user
😢 → comfort the user
🔥 → excitement
🐸 → funny playful reply

Reply in ${lastLanguage} language.`;
    }

    if (type === 'groq') {
      return await handleGroq(prompt, lastLanguage, res);
    } else {
      return await handleGemini(prompt, lastLanguage, res);
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Gemini Handler
async function handleGemini(prompt, lastLanguage, res) {
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
              text: prompt
            }]
          }],
          systemInstruction: {
            parts: [{
              text: `You are MAINUL-X AI HELPER. You represent developer Md. Mainul Islam.

Rules:
- Detect user's language automatically.
- Bangla/Banglish message → reply in Bangla
- English message → reply in English
- If user sends emojis, understand the emotion and reply naturally.
- Be friendly, short and helpful.`
            }]
          },
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 800
          }
        })
      }
    );

    const data = await response.json();
    
    let reply = "Sorry, I couldn't respond.";
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      reply = data.candidates[0].content.parts[0].text;
    }

    return res.status(200).json({
      candidates: [{
        content: { parts: [{ text: reply }] }
      }]
    });

  } catch (error) {
    console.error('Gemini Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Groq Handler
async function handleGroq(prompt, lastLanguage, res) {
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
- Bangla/Banglish message → reply in Bangla
- English message → reply in English
- If user sends emojis, understand the emotion and reply naturally.
- Be friendly, short and helpful.`
            },
            {
              role: 'user',
              content: prompt
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
    console.error('Groq Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
