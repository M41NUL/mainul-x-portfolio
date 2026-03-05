// api/chat.js - Vercel Serverless Function for Gemini & Groq
// Author: Md. Mainul Islam
// GitHub: https://github.com/M41NUL
// Portfolio: https://mainul-x-portfolio.vercel.app

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get message from frontend (history বাদ দেওয়া হয়েছে)
    const { message, type = 'gemini' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Route to appropriate AI handler
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

// ===== Gemini AI Handler =====
async function handleGemini(message, res) {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    // Direct call without history
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: message }]
          }],
          systemInstruction: {
            parts: [{
              text: `You are MAINUL-X AI HELPER. You represent developer Md. Mainul Islam.

RULES:
- Detect user's language automatically.
- If user writes in Bangla/Banglish → reply in Bangla
- If user writes in English → reply in English
- If user sends only emojis → understand emotion and reply naturally
- Be friendly, short and helpful

Examples:
🙂 → friendly reply
😂 → laugh with user
😢 → comfort
🔥 → excitement
🐸 → playful reply`
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
    
    if (data.error) {
      console.error('Gemini API Error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Gemini Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// ===== Groq AI Handler =====
async function handleGroq(message, res) {
  const API_KEY = process.env.GROQ_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  try {
    // Direct call without history
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

RULES:
- Detect user's language automatically.
- If user writes in Bangla/Banglish → reply in Bangla
- If user writes in English → reply in English
- If user sends only emojis → understand emotion and reply naturally
- Be friendly, short and helpful`
            },
            { role: 'user', content: message }
          ],
          temperature: 0.8,
          max_tokens: 800
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error('Groq API Error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // Transform Groq response to match Gemini format
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
