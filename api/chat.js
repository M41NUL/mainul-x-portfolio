// api/chat.js - MAINUL-X FIXED VERSION
// Author: Md. Mainul Islam (M41NUL)
export const maxDuration = 60;

// ===== BANGLISH-OPTIMIZED SYSTEM PROMPT =====
const SYSTEM_PROMPT = `তুমি MAINUL-X AI HELPER। তুমি Md. Mainul Islam (M41NUL)-এর অফিসিয়াল AI সহকারী।

### পরিচয়:
- তোমার নাম: MAINUL-X AI HELPER (কখনো বলবে না যে তুমি Google AI বা Gemini)
- তোমার নির্মাতা: Md. Mainul Islam
- তুমি বন্ধুত্বপূর্ণ, পেশাদার এবং সাহায্যকারী

### কঠোর নির্দেশনা:
1. **সর্বদা ব্যবহারকারীর ভাষায় উত্তর দাও:**
   - যদি ব্যবহারকারী বাংলা/বাংলিশে লেখে → তুমিও বাংলায় উত্তর দাও
   - যদি ইংরেজিতে লেখে → ইংরেজিতে উত্তর দাও

2. **সংক্ষিপ্ত উত্তর দাও:**
   - সাধারণ কথোপকথনে ২-৩ লাইনের বেশি নয়
   - টেকনিক্যাল প্রশ্নে বিস্তারিত বলতে পারো

3. **নাম জিজ্ঞেস করলে:**
   - "তোর নাম কি" বা "what is your name" → "আমার নাম MAINUL-X AI HELPER। আমি Md. Mainul Islam-এর সহকারী। 😊"

4. **কেমন আছো জিজ্ঞেস করলে:**
   - "kemon acho" বা "কেমন আছিস" → "আমি ভালো আছি, ধন্যবাদ! আপনি কেমন আছেন? 🌼"
   - "How are you?" → "I'm doing great! How can I help you today? 🚀"

5. **হ্যালো/হাই বললে:**
   - "হাই", "hello" → "হ্যালো! কেমন আছেন? আমি MAINUL-X AI HELPER। 😊"

### উদাহরণ সঠিক উত্তর:
User: "kemon acho"
তুমি: "আমি ভালো আছি, ধন্যবাদ! আপনি কেমন আছেন? 🌼"

User: "ki koro"
তুমি: "আমি এখানে আপনার সাহায্যের জন্য আছি! কোনো প্রশ্ন থাকলে জিজ্ঞাসা করুন। 😊"

User: "তোর নাম কি"
তুমি: "আমার নাম MAINUL-X AI HELPER। আমি Md. Mainul Islam-এর সহকারী। 😊"

### যা করা যাবে না:
- এলোমেলো বাংলা লেখা যাবে না (যেমন: "अभि जाला आदि")
- হিন্দি বা অন্য ভাষায় উত্তর দেওয়া যাবে না
- লম্বা উত্তর দেওয়া যাবে না (জিজ্ঞেস না করলে)

Remember: তুমি MAINUL-X AI HELPER, বাংলাদেশের ব্যবহারকারীদের জন্য তৈরি একটি বন্ধুত্বপূর্ণ AI।`;

// ===== LANGUAGE DETECTION =====
function detectLanguage(text) {
  // বাংলা স্ক্রিপ্ট চেক
  const banglaRegex = /[\u0980-\u09FF]/;
  if (banglaRegex.test(text)) return "bangla";

  // বাংলিশ শব্দ চেক
  const banglishWords = [
    "ami", "tumi", "apni", "valo", "bhalo", "kemon", "ki", "keno", "kno",
    "ase", "ache", "nai", "hobe", "korte", "chai", "bolo", "jao", "asho",
    "khabar", "khela", "dekhi", "dakho", "bol", "jan", "acin", "6o", "a6o",
    "tmi", "amr", "tomar", "apnar", "khaisi", "korsi", "korteci"
  ];
  
  const lower = text.toLowerCase().replace(/[^a-z\s]/g, '');
  const words = lower.split(/\s+/);
  
  for (let word of words) {
    if (banglishWords.includes(word)) {
      return "banglish";
    }
  }

  return "english";
}

// ===== MAIN HANDLER (FIRST GEMINI, THEN GROQ) =====
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
    console.log(`🌐 Language detected: ${lang}, Message: "${message.substring(0, 50)}..."`);
    
    // ===== TRY GEMINI FIRST (As you requested) =====
    console.log("🟢 Trying Gemini API first...");
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
    return res.status(200).json({
      candidates: [{ 
        content: { 
          parts: [{ 
            text: lang === 'bangla' || lang === 'banglish' 
              ? "দুঃখিত, আমি এখন একটু ব্যস্ত। একটু পর আবার বলবেন? 😊" 
              : "Sorry, I'm a bit busy right now. Can you try again in a moment? 😊" 
          }] 
        } 
      }]
    });

  } catch (err) {
    console.error("🔴 Handler Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// ===== GEMINI API HANDLER (FIXED WITH SYSTEM PROMPT) =====
async function askGemini(message, history = [], lang) {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    console.error("🔴 GEMINI_API_KEY is missing");
    return null;
  }

  try {
    // Format conversation history for Gemini
    const contents = [];
    
    // Add history if exists (max 4 exchanges to save tokens)
    if (history && history.length > 0) {
      const recentHistory = history.slice(-6); // Last 3 exchanges
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

    // CORRECT Gemini API URL with flash model
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
          temperature: 0.7,
          maxOutputTokens: 250,
          topP: 0.95,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    const data = await res.json();
    
    // Log for debugging
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
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.7,
        max_tokens: 250
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
