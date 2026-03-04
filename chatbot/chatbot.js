// MAINUL-X Chatbot
// Author: Md. Mainul Islam

const API_URL = "https://mainul-x-portfolio.vercel.app/api/chat";

// ===== MAIN CHATBOT FUNCTION =====
async function processMessage(message) {

  if (!message || message.trim() === "") {
    return "Please type a message.";
  }

  const text = message.toLowerCase();

  // Quick replies
  if (text.includes("hi") || text.includes("hello")) {
    return "👋 Hello! How can I help you today?";
  }

  if (text.includes("payment")) {
    return "💰 Payment: bKash / Nagad 01308850528";
  }

  if (text.includes("github")) {
    return "🐙 GitHub: https://github.com/M41NUL";
  }

  if (text.includes("contact")) {
    return "📞 WhatsApp: 01308850528";
  }

  // Default → AI
  return await askGemini(message);
}


// ===== AI REQUEST =====
async function askGemini(message) {

  try {

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();

    // ===== Gemini response =====
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    // ===== Groq response =====
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    }

    return "⚠️ AI returned empty response.";

  } catch (error) {

    console.error(error);

    return "😔 AI connection error.";

  }
}


// ===== Export for UI =====
window.processMessage = processMessage;

console.log("✅ MAINUL-X chatbot loaded");
