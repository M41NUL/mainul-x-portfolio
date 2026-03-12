// api/chat.js - MAINUL-X Ultra Fast Chat API
// Author: Md. Mainul Islam (M41NUL)
export const maxDuration = 60;

// ===== DETAILED SYSTEM PROMPT =====
const SYSTEM_PROMPT = `You are MAINUL-X AI HELPER, the official and highly intelligent virtual assistant of Md. Mainul Islam (M41NUL). 

### IDENTITY:
- Your Name: MAINUL-X AI HELPER (NEVER say you're Google AI or Gemini)
- Your Creator: Md. Mainul Islam (M41NUL)
- You represent a Cyber Security Specialist & Developer

### STRICT RESPONSE RULES:
1. When asked "তোর নাম কি" or "what is your name" → reply: "আমার নাম MAINUL-X AI HELPER। আমি Md. Mainul Islam-এর সহকারী। 😊"
2. When asked "কে বানিয়েছে" or "who made you" → reply: "Md. Mainul Islam (M41NUL) আমাকে বানিয়েছে। তিনি একজন Cyber Security Specialist ও Developer। 🔥"
3. ALWAYS match user's language:
   - Bangla/Banglish → উত্তর দিন হৃদয়স্পর্শী বাংলায়
   - English → reply in professional English
4. Keep responses short (2-3 lines max unless technical help asked)
5. Use 1-2 emojis per message

### GREETING RULES:
- "hi/hello/হাই" → "হ্যালো! কেমন আছেন? আমি MAINUL-X AI HELPER। 😊"
- "kemon acho" → "আমি ভালো আছি, ধন্যবাদ! আপনি কেমন আছেন? 🌼"
- "How are you?" → "I'm doing great! How can I help you today? 🚀"

### MEMORY:
- Remember user's name if they share it
- Use chat history for context

### KNOWLEDGE (share only if asked):
- Developer: Md. Mainul Islam
- Projects: 50+ GitHub open-source
- Agency: SOCINEST-X
- Contact: githubmainul@gmail.com / 01308850528`;

// ===== LANGUAGE DETECTION =====
function detectLanguage(text) {
  const banglaRegex = /[\u0980-\u09FF]/;
  if (banglaRegex.test(text)) return "bangla";

  const banglishWords = ["ami", "tumi", "valo", "kemon", "ki", "ase", "nai", "korsi", "khaisi", "accha", "korte", "chai", "bolo", "jao", "a6o", "k6o", "tmi", "apni", "amr", "tomar"];
  const lower = text.toLowerCase();
  
  if (banglishWords.some(w => new RegExp(`\\b${w}\\b`).test(lower))) {
    return "banglish";
  }
  return "english";
}

// ===== MAIN HANDLER (Optimized for Speed) =====
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { message, history = [] } = body;

    if (!message || message.length > 1000) {
      return res.status(400).json({ error: "Invalid message" });
    }
    
    const lang = detectLanguage(message);
    
    // ===== TRY GROQ FIRST (FASTEST - 0.5s to 1s) =====
    console.log("⚡ Trying Groq (Ultra Fast)...");
    try {
      const groqResponse = await askGroq(message, history, lang);
      if (groqResponse && !groqResponse.includes("দুঃখিত") && !groqResponse.includes("সার্ভারে")) {
        console.log("✅ Groq Success! (0.5-1s)");
        return res.status(200).json({
          candidates: [{ content: { parts: [{ text: groqResponse }] } }]
        });
      }
    } catch (groqError) {
      console.log("🟡 Groq failed:", groqError.message);
    }
    
    // ===== FALLBACK TO GEMINI (Slower - 2-3s) =====
    console.log("🟡 Trying Gemini as fallback...");
    const geminiResponse = await askGemini(message, history, lang);
    
    if (geminiResponse) {
      console.log("✅ Gemini Success!");
      return res.status(200).json({
        candidates: [{ content: { parts: [{ text: geminiResponse }] } }]
      });
    }
    
    // ===== ULTIMATE FALLBACK =====
    return res.status(200).json({
      candidates: [{ content: { parts: [{ text: "দুঃখিত, আমি এখন একটু ব্যস্ত। একটু পর আবার বলবেন? 😊" }] } }]
    });

  } catch (err) {
    console.error("🔴 Handler Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// ===== GROQ API (Primary - Ultra Fast) =====
async function askGroq(message, history, lang) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant", // Fastest model
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(history || []).slice(-6).map(msg => ({
          role: msg.role === "ai" ? "assistant" : "user",
          content: msg.text
        })),
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 200
    })
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || null;
}

// ===== GEMINI API (Fallback) =====
async function askGemini(message, history, lang) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  // Format history for Gemini
  const geminiHistory = (history || []).slice(-4).map(msg => ({
    role: msg.role === "ai" ? "model" : "user",
    parts: [{ text: msg.text }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          ...geminiHistory,
          { role: "user", parts: [{ text: message }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200
        }
      })
    }
  );

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}
