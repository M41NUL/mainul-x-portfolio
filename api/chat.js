// api/chat.js - MAINUL-X V1.0.0 VERSION
// Author: Md. Mainul Islam (M41NUL)
export const maxDuration = 60;

// ===== ADVANCED SYSTEM PROMPT (Bangla Optimized) =====
const SYSTEM_PROMPT = `তুমি MAINUL-X AI HELPER। তুমি Md. Mainul Islam (M41NUL)-এর অফিসিয়াল AI সহকারী।

🎯 **তোমার পরিচয়:**
- নাম: MAINUL-X AI HELPER (কখনো বলবে না যে তুমি Google AI বা Gemini)
- স্রষ্টা: Md. Mainul Islam (M41NUL) - Cyber Security Specialist & Developer
- তুমি বন্ধুত্বপূর্ণ, সহায়ক, এবং পেশাদার

📝 **ভাষা নীতি:**
1. **সর্বদা ব্যবহারকারীর ভাষায় উত্তর দাও:**
   - যদি ব্যবহারকারী বাংলা/বাংলিশ লেখে → তুমিও বাংলায় উত্তর দাও (সহজ ও সাবলীল বাংলায়)
   - যদি ইংরেজি লেখে → ইংরেজিতে উত্তর দাও
   - বাংলা ও ইংরেজি মিক্স করবে না

2. **উত্তরের দৈর্ঘ্য:**
   - সাধারণ কথোপকথন: ২-৩ লাইন
   - টেকনিক্যাল প্রশ্ন: প্রয়োজনমতো বিস্তারিত

3. **প্রত্যেক উত্তরে ১-২টি ইমোজি ব্যবহার করো** (খুব বেশি নয়)

💬 **উত্তরের উদাহরণ:**

🔹 **"kemon acho" বা "কেমন আছিস" বললে:**
   → "আমি ভালো আছি, ধন্যবাদ! আপনি কেমন আছেন? 🌼"

🔹 **"হাই", "hello", "hi" বললে:**
   → "হ্যালো! কেমন আছেন? আমি MAINUL-X AI HELPER। আপনার জন্য কিছু করতে পারি? 😊"

🔹 **"তোর নাম কি" বা "what is your name" বললে:**
   → "আমার নাম MAINUL-X AI HELPER। আমি Md. Mainul Islam-এর সহকারী। আপনার সাথে পরিচিত হয়ে ভালো লাগলো! 🤖"

🔹 **"কে বানিয়েছে" বা "who made you" বললে:**
   → "Md. Mainul Islam (M41NUL) আমাকে বানিয়েছে। তিনি একজন Cyber Security Specialist ও Termux Tools Developer। 🔥"

🔹 **"তুই কি করতে পারিস" বা "what can you do" বললে:**
   → "আমি Mainul ভাই সম্পর্কে তথ্য দিতে পারি, তার প্রোজেক্ট সম্পর্কে বলতে পারি, এবং সাধারণ কথোপকথন করতে পারি। আপনার কোন প্রশ্ন? 🚀"

🔹 **"ভালো আছিস?" বললে:**
   → "হ্যাঁ, খুব ভালো! আপনার জন্য অপেক্ষা করছি। আপনি কেমন আছেন? 💙"

🔹 **"কী খবর" বললে:**
   → "সব ভালো! এদিকে নতুন কিছু প্রোজেক্ট নিয়ে ব্যস্ত আছি। আপনার কী খবর? 🌟"

🔹 **Some Banglish examples:**
   → User: "ki koros" → Reply: "আমি এখানে আপনার জন্য অপেক্ষা করছি! আপনার কোনো সাহায্য লাগবে? 😊"
   → User: "kire" → Reply: "হ্যালো! কেমন আচো? কিছু লাগবে? 🌸"

🚫 **যা করবে না:**
- এলোমেলো বাংলা/সংস্কৃত/হিন্দি লেখবে না (যেমন screenshot-এ দেখেছি)
- লম্বা উত্তর দেবে না (যদি না জিজ্ঞেস করে)
- অপ্রাসঙ্গিক তথ্য দেবে না

📚 **Md. Mainul Islam সম্পর্কে তথ্য (যখন জিজ্ঞেস করা হয়):**
- **পেশা:** Cyber Security Specialist, Digital Marketing Expert, Termux Tools Developer
- **প্রজেক্ট:** ৫০+ GitHub ওপেন সোর্স প্রজেক্ট
- **এজেন্সি:** SOCINEST-X - সোশ্যাল মিডিয়া এজেন্সি
- **GitHub:** https://github.com/M41NUL
- **যোগাযোগ:** githubmainul@gmail.com, 01308850528

🎯 **মূল লক্ষ্য:** দর্শকদের স্বাগত জানানো এবং Mainul ভাই সম্পর্কে ইতিবাচক ধারণা দেওয়া।`;

// ===== LANGUAGE DETECTION (Enhanced) =====
function detectLanguage(text) {
  // বাংলা স্ক্রিপ্ট চেক
  const banglaRegex = /[\u0980-\u09FF]/;
  if (banglaRegex.test(text)) return "bangla";

  // বাংলিশ শব্দের বিস্তৃত তালিকা
  const banglishWords = [
    "ami", "amr", "amake", "tomar", "tumi", "tmi", "apni", "apnar",
    "valo", "bhalo", "vlo", "kemon", "kmn", "ki", "keno", "kno",
    "ase", "ache", "acche", "nai", "hobe", "korte", "chai", "cai",
    "bolo", "bol", "jao", "jau", "asho", "a6o", "k6o", "6o",
    "khabar", "khela", "dekhi", "dakhbo", "korbo", "korsi", "khaisi",
    "kothay", "kothai", "koy", "koi", "brishti", "rod", "bari", "basa",
    "friend", "bondhu", "bhai", "vai", "ma", "baba", "valobasha", "vhalobasha"
  ];
  
  const lower = text.toLowerCase().replace(/[^a-z\s]/g, '');
  const words = lower.split(/\s+/);
  
  // Count banglish words
  let banglishCount = 0;
  for (let word of words) {
    if (word.length > 1 && banglishWords.includes(word)) {
      banglishCount++;
    }
  }
  
  // If at least one banglish word found, consider it banglish
  if (banglishCount > 0) {
    return "banglish";
  }

  return "english";
}

// ===== MAIN HANDLER =====
export default async function handler(req, res) {
  // CORS Headers
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
    console.log(`🌐 [${new Date().toISOString()}] Language: ${lang}, Message: "${message.substring(0, 50)}..."`);
    
    // ===== TRY GEMINI FIRST =====
    console.log("🟢 Trying Gemini API...");
    const geminiResponse = await askGemini(message, history, lang);
    
    if (geminiResponse) {
      console.log("✅ Gemini Success!");
      return res.status(200).json({
        candidates: [{ content: { parts: [{ text: geminiResponse }] } }]
      });
    }
    
    // ===== FALLBACK TO GROQ =====
    console.log("🟡 Gemini failed, trying Groq...");
    const groqResponse = await askGroq(message, history, lang);
    
    if (groqResponse) {
      console.log("✅ Groq Success!");
      return res.status(200).json({
        candidates: [{ content: { parts: [{ text: groqResponse }] } }]
      });
    }
    
    // ===== ULTIMATE FALLBACK =====
    const fallbackMsg = lang === 'bangla' || lang === 'banglish' 
      ? "দুঃখিত, আমি এখন একটু ব্যস্ত। একটু পর আবার বলবেন? 😊" 
      : "Sorry, I'm a bit busy right now. Can you try again in a moment? 😊";
    
    return res.status(200).json({
      candidates: [{ content: { parts: [{ text: fallbackMsg }] } }]
    });

  } catch (err) {
    console.error("🔴 Handler Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// ===== GEMINI API HANDLER (FIXED MODEL NAME) =====
async function askGemini(message, history = [], lang) {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    console.error("🔴 GEMINI_API_KEY is missing");
    return null;
  }

  try {
    // Format conversation history
    const contents = [];
    
    // Add history if exists (max 4 exchanges)
    if (history && history.length > 0) {
      const recentHistory = history.slice(-6);
      for (const msg of recentHistory) {
        contents.push({
          role: msg.role === "ai" ? "model" : "user",
          parts: [{ text: msg.text }]
        });
      }
    }
    
    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    // ✅ FIXED: Correct model name for Gemini 1.5 Flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    
    console.log("📤 Sending to Gemini with system prompt...");
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
          topP: 0.95,
          topK: 40
        }
      })
    });

    const data = await res.json();
    
    // Check for API errors
    if (data.error) {
      console.error("🔴 Gemini API Error:", JSON.stringify(data.error));
      return null;
    }
    
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (reply) {
      console.log(`📥 Gemini reply: "${reply.substring(0, 100)}..."`);
      return reply;
    }
    
    return null;

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
    return null;
  }

  try {
    console.log("📤 Sending to Groq...");
    
    const messages = [
      { role: "system", content: SYSTEM_PROMPT }
    ];
    
    // Add history
    if (history && history.length > 0) {
      const recentHistory = history.slice(-6);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role === "ai" ? "assistant" : "user",
          content: msg.text
        });
      }
    }
    
    // Add current message
    messages.push({ role: "user", content: message });

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // বা "llama-3.1-8b-instant"
        messages: messages,
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await res.json();

    if (data.error) {
      console.error("🔴 Groq API Error:", JSON.stringify(data.error));
      return null;
    }

    const reply = data?.choices?.[0]?.message?.content;
    
    if (reply) {
      console.log(`📥 Groq reply: "${reply.substring(0, 100)}..."`);
      return reply;
    }
    
    return null;

  } catch (err) {
    console.error("🔴 Groq Fetch Error:", err);
    return null;
  }
}
