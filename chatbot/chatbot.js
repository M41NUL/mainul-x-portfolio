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


// ===== UI FUNCTIONS =====
function addMessage(text, sender = "bot") {

  const chatMessages = document.getElementById("chatMessages");

  const msg = document.createElement("div");
  msg.className = sender === "user" ? "user-message" : "bot-message";

  msg.innerText = text;

  chatMessages.appendChild(msg);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}


// ===== SEND MESSAGE =====
async function sendMessage() {

  const input = document.getElementById("userInput");

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";

  const reply = await processMessage(message);

  addMessage(reply, "bot");
}


// ===== CHAT UI CONTROL =====
document.addEventListener("DOMContentLoaded", () => {

  const toggle = document.getElementById("chatbotToggle");
  const chatbox = document.getElementById("chatbotContainer");
  const closeBtn = document.getElementById("closeChat");
  const sendBtn = document.getElementById("sendMessage");
  const input = document.getElementById("userInput");

  // Bubble click → open chat
  if (toggle) {
    toggle.addEventListener("click", () => {
      chatbox.classList.toggle("active");
    });
  }

  // Close chat
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      chatbox.classList.remove("active");
    });
  }

  // Send button
  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  // Enter key send
  if (input) {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

});


// ===== Export for UI =====
window.processMessage = processMessage;

console.log("✅ MAINUL-X chatbot loaded");
