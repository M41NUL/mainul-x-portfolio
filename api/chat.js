// api/chat.js - Vercel Serverless Function with Memory Context
export default async function handler(req, res) {
  // CORS headers
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

// Store conversation in memory (last 10 messages)
let conversationMemory = [];

// Gemini Handler with Memory
async function handleGemini(message, res) {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    // Add user message to memory
    conversationMemory.push({ role: "user", content: message });
    
    // Keep only last 10 messages
    if (conversationMemory.length > 10) {
      conversationMemory.shift();
    }
    
    // Build conversation context
    let context = "";
    for (let i = 0; i < conversationMemory.length; i++) {
      const msg = conversationMemory[i];
      context += `${msg.role}: ${msg.content}\n`;
    }
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ 
              text: `Previous conversation:\n${context}\n\nUser: ${message}\nAssistant:` 
            }]
          }],
          systemInstruction: {
            parts: [{
              text: `You are MAINUL-X AI HELPER.
Remember the previous conversation and answer naturally.
Be friendly, short and helpful.
You represent developer Md. Mainul Islam.`
            }]
          }
        })
      }
    );

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      return res.status(200).json({ candidates: [{ content: { parts: [{ text: "I couldn't process that. Please try again." }] } }] });
    }
    
    const reply = data.candidates[0].content.parts[0].text;
    
    // Save bot reply to memory
    conversationMemory.push({ role: "assistant", content: reply });
    
    // Keep only last 10 messages
    if (conversationMemory.length > 10) {
      conversationMemory.shift();
    }
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Gemini Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Groq Handler
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
              content: 'You are MAINUL-X Helper, an AI assistant for Md. Mainul Islam\'s portfolio. Answer helpfully and concisely.'
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
    
    if (!data.choices || data.choices.length === 0) {
      return res.status(200).json({
        candidates: [{
          content: {
            parts: [{
              text: "I couldn't process that. Please try again."
            }]
          }
        }]
      });
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
