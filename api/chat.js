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

// Gemini AI Handler with System Instruction
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
              text: `You are MAINUL-X AI HELPER.

Rules:
- Detect user's language automatically.
- If user writes in Bangla → reply in Bangla.
- If user writes in English → reply in English.
- If user sends only emojis → reply in the same language as previous message.
- Be friendly, short and helpful.
- You represent developer Md. Mainul Islam.`
            }]
          }
        })
      }
    );

    const data = await response.json();
    
    // Safe response parsing
    let reply = "Sorry, I couldn't process that.";
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      reply = data.candidates[0].content.parts[0].text;
    }

    return res.status(200).json({
      candidates: [{
        content: {
          parts: [{
            text: reply
          }]
        }
      }]
    });
    
  } catch (error) {
    console.error('Gemini Error:', error);
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
              content: `You are MAINUL-X AI HELPER.

Rules:
- Detect user's language automatically.
- If user writes in Bangla → reply in Bangla.
- If user writes in English → reply in English.
- Be friendly, short and helpful.
- You represent developer Md. Mainul Islam.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      }
    );

    const data = await response.json();
    
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

    return res.status(200).json({
      candidates: [{
        content: {
          parts: [{
            text: reply
          }]
        }
      }]
    });

  } catch (error) {
    console.error('Groq Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
