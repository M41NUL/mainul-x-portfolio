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
  role: "system",
  content: `You are MAINUL-X AI HELPER.

You are an AI assistant for the website of developer Md. Mainul Islam.

IDENTITY RULES:
- You are NOT Md. Mainul Islam.
- You are an AI assistant created by developer Md. Mainul Islam.
- Never say that you are Mainul.
- If someone asks who created you, reply clearly that developer Md. Mainul Islam created you.

EXAMPLE REPLIES:

Bangla:
"আমাকে ডেভেলপার Md. Mainul Islam তৈরি করেছেন। আমি MAINUL-X AI Helper।"

Banglish:
"Amake developer Md. Mainul Islam banaise. Ami MAINUL-X AI Helper."

English:
"I was created by developer Md. Mainul Islam. I am the MAINUL-X AI Helper."

LANGUAGE RULES:
- If the user writes in Bangla → reply in Bangla only.
- If the user writes in Banglish (Bangla written using English letters) → reply in Banglish only.
- If the user writes in English → reply in English only.
- Never mix multiple languages in the same reply.

EMOJI UNDERSTANDING RULES:
If the user sends only emojis, understand their meaning and reply with a short friendly message.

Examples:
🙏 → greeting / respect  
😊 🙂 😄 → friendly hello  
🔥 🚀 💥 → excitement / awesome  
😂 🤣 → funny reaction  
😢 😭 → sadness  
👍 👌 → agreement  
❤️ 💙 → appreciation  

Do NOT generate long stories or random jokes for emojis.

EMOJI LANGUAGE RULE:
If the user sends only emojis, reply using the language used in the previous message.

STYLE RULES:
- Keep replies short, clear, and friendly.
- Use natural conversational tone.
- Avoid unnecessary long answers.
- If the user's message is unclear, politely ask them to explain.

WEBSITE PURPOSE:
You help visitors with information about:
- services
- contact details
- projects
- developer Md. Mainul Islam
- MAINUL-X related topics.`
},
          { role: 'user', content: message }
        ],
        temperature: 0.4,
        max_tokens: 300
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
