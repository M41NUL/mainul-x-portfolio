// api/chat.js
// MAINUL-X Smart Chat API (Fixed Memory & Gemini Integration)
// Author: Md. Mainul Islam

// ===== LANGUAGE DETECT =====
function detectLanguage(text) {
  const banglaRegex = /[\u0980-\u09FF]/;
  if (banglaRegex.test(text)) return "bangla";

  const banglishWords = ["ami", "tumi", "valo", "kemon", "ki", "ase", "nai", "korsi", "khaisi"];
  const lower = text.toLowerCase();
  
  // Simple word boundary check for better Banglish detection
  if (banglishWords.some(w => new RegExp(`\\b${w}\\b`).test(lower))) {
    return "banglish";
  }

  return "english";
}

// ===== SYSTEM PROMPT =====
function getPrompt(lang) {
  return `You are MAINUL-X AI HELPER. You represent developer Md. Mainul Islam.
  
  CRITICAL RULES:
  - If the user writes in Bangla, YOU MUST reply ONLY in standard Bangla script.
  - If the user writes in Banglish (Bengali words written in English letters), YOU MUST reply in Banglish.
  - If the user writes in English, reply in English.
  - Current detected language context: ${lang}. Ensure your response matches this.
  - Keep responses short, natural, and friendly.
  - If the user asks about your identity, say you are an AI assistant created by Md. Mainul Islam.`;
}

// ===== MAIN HANDLER =====
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: "Invalid JSON format" });
      }
    }

    // 🔥 FIXED: Receive 'history' from the frontend instead of using a global variable
    const { message, history = [] } = body;

    if (!message || message.length > 1000) {
      return res.status(400).json({ error: "Invalid or too long message" });
    }

    const lang = detectLanguage(message);

    // Try Gemini First
    console.log("Trying Gemini...");
    const geminiResponse = await askGemini(message, history, lang);

    if (geminiResponse) {
      return res.status(200).json({
        candidates: [{ content: { parts: [{ text: geminiResponse }] } }]
      });
    }

    // Fallback to Groq if Gemini fails
    console.log("Gemini failed or returned null, trying Groq...");
    const groqResponse = await askGroq(message, history, lang);
    
    return res.status(200).json({
      candidates: [{ content: { parts: [{ text: groqResponse }] } }]
    });

  } catch (err) {
    console.error("Main Handler Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// ===== GEMINI API HANDLER =====
async function askGemini(message, history, lang) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("GEMINI_API_KEY is missing");
    return null;
  }

  // Format history for Gemini
  const formattedHistory = history.map(msg => ({
    role: msg.role === "ai" ? "model" : "user",
    parts: [{ text: msg.text }]
  }));

  // Append current message
  formattedHistory.push({
    role: "user",
    parts: [{ text: message }]
  });

  try {
    // 🔥 FIXED: Using the model name that worked in your curl command
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: getPrompt(lang) }]
          },
          contents: formattedHistory,
          generationConfig: {
            temperature: 0.7, // Increased slightly for more natural responses
            maxOutputTokens: 800
          }
        })
      }
    );

    const data = await res.json();
    
    if (data.error) {
      console.error("Gemini API returned an error:", data.error);
      return null;
    }

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

  } catch (err) {
    console.error("Gemini Fetch Error:", err);
    return null;
  }
}

// ===== GROQ API HANDLER (Fallback) =====
async function askGroq(message, history, lang) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    console.error("GROQ_API_KEY is missing");
    return "AI is currently unavailable due to missing configuration.";
  }

  // Format history for Groq
  const groqMessages = [
    { role: "system", content: getPrompt(lang) },
    ...history.map(msg => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.text
    })),
    { role: "user", content: message }
  ];

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await res.json();
    
    if (data.error) {
       console.error("Groq API returned an error:", data.error);
       return "Sorry, I am having trouble connecting right now.";
    }

    return data?.choices?.[0]?.message?.content || "No response generated.";

  } catch (err) {
    console.error("Groq Fetch Error:", err);
    return "An error occurred while trying to generate a response.";
  }
}
