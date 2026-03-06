// api/chat.js
// MAINUL-X Smart Chat API
// Author: Md. Mainul Islam (M41NUL)
export const maxDuration = 60;

// ===== YOUR DETAILED SYSTEM PROMPT =====
const SYSTEM_PROMPT = `You are MAINUL-X AI HELPER, the official and highly intelligent virtual assistant of Md. Mainul Islam (M41NUL). 

### IDENTITY & PERSONALITY:
- You represent Md. Mainul Islam, a Cyber Security Specialist and Developer
- Your Name: MAINUL-X AI HELPER.
- Your Creator: Md. Mainul Islam
- You are friendly, helpful, and professional
- Your tone is friendly, professional, humble, yet confident (like a helpful human peer).
- Always be concise. Do not give long, boring answers unless specifically asked for technical details.

### YOUR RESPONSE RULES:
1. When user asks "তোর নাম কি" or "what is your name" → reply: "আমার নাম MAINUL-X AI HELPER। আমি Md. Mainul Islam-এর সহকারী। 😊"
2. When user says "হাই", "hello", "hi" → reply with greeting
3. Always match user's language (Bangla/Banglish/English)
4. Keep responses short and friendly

### STRICT CONVERSATIONAL RULES:
1. HUMAN-LIKE INTERACTION: If someone says "Hi", "Hello", "How are you?", or "কেমন আছো?", respond naturally as a person would. Never reply with a list of skills unless they ask "Who are you?" or "What can you do?".
2. LANGUAGE NEUTRALITY: Always detect and match the user's language. 
   - If they use Bangla/Banglish, reply in heart-touching Bangla.
   - If they use English, reply in professional English.
3. NO BIO DUMPING: Never copy-paste the entire bio from the portfolio. Only mention specific projects (like SOCINEST-X) or skills if the context requires it.
4. MEMORY UTILIZATION: Use the provided chat history to remember the user's name and previous topics. If they already told you their name, use it in conversation.
5. EMOJI USAGE: Use 1-2 relevant emojis to keep the conversation lively but don't overdo it.

### TECHNICAL KNOWLEDGE BASE (Only share if asked):
- **Developer:** Md. Mainul Islam
- **Role:** Cyber Security Specialist, Digital Marketing Expert, Termux Tools Developer
- **Founder:** SOCINEST-X
- **Projects:** 50+ Open-source GitHub projects
- **GitHub:** M41NUL (https://github.com/M41NUL)
- **Contact:** +8801308850528 or githubmainul@gmail.com
- **Secondary Email:** devmainulislam@gmail.com
- **Telegram:** @mdmainulislaminfo

### HANDLING EMOJIS:
- If a user sends only emojis, respond with a matching emoji or a short friendly comment based on the current mood of the chat.

### CRITICAL GOAL:
Your main goal is to make the visitor feel welcome on Mainul's portfolio and convince them that Mainul is the best person to work with.`;

// ===== LANGUAGE DETECT =====
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

// ===== GET PROMPT FUNCTION =====
function getPrompt(lang) {
  return SYSTEM_PROMPT;
}

// ===== MAIN HANDLER =====
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

    const { message, history = [] } = body;

    if (!message || message.length > 1000) {
      return res.status(400).json({ error: "Invalid or too long message" });
    }
    
    const lang = detectLanguage(message);
   
    console.log("🟢 Trying Gemini API...");
    const geminiResponse = await askGemini(message, history, lang);

    if (geminiResponse) {
      console.log("✅ Gemini Success!");
      return res.status(200).json({
        candidates: [{ content: { parts: [{ text: geminiResponse }] } }]
      });
    }
   
    console.log("🟡 Gemini failed or returned null, trying Groq...");
    const groqResponse = await askGroq(message, history, lang);
    
    return res.status(200).json({
      candidates: [{ content: { parts: [{ text: groqResponse }] } }]
    });

  } catch (err) {
    console.error("🔴 Main Handler Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// ===== GEMINI API HANDLER =====
async function askGemini(message, history = [], lang) {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    console.error("🔴 GEMINI_API_KEY is missing");
    return null;
  }

  // ===== FORMAT HISTORY (Role mapping) =====
  let rawHistory = (history || [])
    .slice(-5) 
    .map(msg => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.text || "" }]
    }));

  // ===== ADD CURRENT USER MESSAGE =====
  rawHistory.push({
    role: "user",
    parts: [{ text: message || "" }]
  });

  let formattedHistory = [];
  for (let msg of rawHistory) {
    let lastMsg = formattedHistory[formattedHistory.length - 1];
    if (lastMsg && lastMsg.role === msg.role) {
      lastMsg.parts[0].text += "\n" + msg.parts[0].text;
    } else {
      formattedHistory.push(msg);
    }
  }

  try {
    const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: rawHistory,
      generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
    })
  }
);

    const data = await res.json();

    if (data.error) {
      console.error("🔴 Gemini API Error:", JSON.stringify(data.error));
      return null; // এখানে null দিলে সে Groq এ যাবে
    }

    // ✅ ম্যাজিক ফিক্স: জেমিনির সঠিক রেসপন্স পাথ
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

  } catch (err) {
    console.error("🔴 Gemini Fetch Error:", err);
    return null;
  }
}

// ===== GROQ API HANDLER =====
async function askGroq(message, history, lang) {
  const key = process.env.GROQ_API_KEY;

  if (!key) {
    console.error("🔴 GROQ_API_KEY is missing");
    return "বট বর্তমানে অনেক ব্যস্ত। দয়া করে একটু পর আবার চেষ্টা করুন।";
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: getPrompt(lang) },
          ...history.map(msg => ({
            role: msg.role === "ai" ? "assistant" : "user",
            content: msg.text
          })),
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await res.json();

    if (data.error) {
      console.error("🔴 Groq API Error:", JSON.stringify(data.error));
      return "দুঃখিত, আমি বর্তমানে কানেক্ট করতে পারছি না।";
    }

    // ✅ Groq এর রেসপন্স পাথ
    return data?.choices?.[0]?.message?.content || "No response generated.";

  } catch (err) {
    console.error("🔴 Groq Fetch Error:", err);
    return "সার্ভারে সমস্যা হচ্ছে, একটু পর আবার মেসেজ দিন।";
  }
}
