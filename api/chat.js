// api/chat.js - Vercel Serverless Function for Gemini & Groq
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
    // এখানে history অ্যাড করা হয়েছে মেমোরির জন্য
    const { message, history = [], type = 'gemini' } = req.body;

    if (!message) { 
      return res.status(400).json({ error: 'Message is required' }); 
    } 
    
    // Route to appropriate AI handler 
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

// ===== Gemini AI Handler =====
async function handleGemini(message, history, res) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  // মেমোরি (History) জেমিনির ফরম্যাটে সাজানো
  const formattedHistory = history.map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  // নতুন মেসেজ অ্যাড করা
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
              text: "You are MAINUL-X AI HELPER.\nRules:\n- Detect user's language automatically.\n- If user writes in Bangla → reply in Bangla.\n- If user writes in English → reply in English.\n- If user sends only emojis → reply in the same language as previous message.\n- Be friendly, short and helpful.\n- You represent developer Md. Mainul Islam."
            }]
          },
          contents: formattedHistory
        })
      }
    );

    const data = await response.json(); 
    return res.status(200).json(data); 

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// ===== Groq AI Handler =====
async function handleGroq(message, history, res) {
  const API_KEY = process.env.GROQ_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  // মেমোরি (History) Groq-এর ফরম্যাটে সাজানো
  const groqMessages = [
    {
      role: 'system',
      content: "You are MAINUL-X AI HELPER. Detect user's language automatically and reply in that language. Be friendly, short and helpful. You represent developer Md. Mainul Islam."
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
          temperature: 0.7,
          max_tokens: 1024
        })
      }
    );

    const data = await response.json(); 
    // Transform Groq response to match Gemini format 
    return res.status(200).json({ 
      candidates: [{ content: { parts: [{ text: data.choices[0].message.content }] } }] 
    }); 

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
