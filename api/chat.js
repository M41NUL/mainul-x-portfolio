// api/chat.js - Complete Chat API with Gemini & Groq
// Author: Md. Mainul Islam
// GitHub: M41NUL

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse body
    let parsedBody = req.body;
    if (typeof req.body === 'string') {
      try {
        parsedBody = JSON.parse(req.body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON format' });
      }
    }
    
    const { message, type = 'gemini' } = parsedBody;
    
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
    console.error('Chat API Error:', error);
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
    // Try multiple model names
    const models = [
      'gemini-1.5-pro',
      'gemini-pro',
      'gemini-1.0-pro'
    ];
    
    let lastError = null;
    
    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: message }]
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800
              }
            })
          }
        );
        
        const data = await response.json();
        
        if (!data.error && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return res.status(200).json({
            candidates: [{
              content: {
                parts: [{
                  text: data.candidates[0].content.parts[0].text
                }]
              }
            }]
          });
        }
        
        lastError = data.error;
      } catch (e) {
        lastError = e;
        continue;
      }
    }
    
    // If all models fail, try Groq as fallback
    console.log('Gemini failed, trying Groq...');
    return await handleGroq(message, res);

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
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
- Be friendly, short and helpful`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Groq API Error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

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
