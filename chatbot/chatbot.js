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
  if (text.includes("hi") || text.includes("hello") || text.includes("হাই")) {
    return "👋 Hello! How can I help you today?";
  }

  if (text.includes("payment") || text.includes("পেমেন্ট") || text.includes("টাকা")) {
    return "💰 **Payment Options**\n\n📱 Nagad: 01308850528\n📱 bKash: 01308850528\n🏦 BRAC Bank: 1073831440001";
  }

  if (text.includes("github") || text.includes("গিটহাব")) {
    return "🐙 **GitHub:** https://github.com/M41NUL\n📦 50+ open source projects";
  }

  if (text.includes("contact") || text.includes("যোগাযোগ")) {
    return "📞 **Contact:**\n📧 githubmainul@gmail.com\n📱 WhatsApp: 01308850528\n✈️ Telegram: @mdmainulislaminfo";
  }

  if (text.includes("service") || text.includes("সার্ভিস")) {
    return "📋 **Services:**\n🔹 Digital Marketing\n🔹 Cyber Security\n🔹 Programming\n🔹 Termux Tools\n🔹 App Subscriptions\n🔹 SOCINEST-X Agency";
  }

  if (text.includes("about") || text.includes("সম্পর্কে") || text.includes("কে")) {
    return "👤 **Md. Mainul Islam**\n🔐 Cyber Security Specialist\n📈 Digital Marketing Expert\n🧰 Termux Tools Developer\n📦 50+ GitHub Projects\n🚀 Founder of SOCINEST-X";
  }

  // Default → AI (Gemini first, then Groq if needed)
  return await askAI(message);
}

// ===== AI REQUEST =====
async function askAI(message) {
  try {
    // Try Gemini first
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: message,
        type: 'gemini' 
      })
    });

    const data = await response.json();

    // Check Gemini response
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    // If Gemini fails, try Groq
    const groqResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: message,
        type: 'groq' 
      })
    });

    const groqData = await groqResponse.json();

    if (groqData.candidates && groqData.candidates[0]?.content?.parts?.[0]?.text) {
      return groqData.candidates[0].content.parts[0].text;
    }

    return "⚠️ AI returned empty response.";

  } catch (error) {
    console.error('AI Error:', error);
    return "😔 AI connection error. Please try again.";
  }
}

// ===== UI FUNCTIONS =====
function addMessage(text, sender = "bot") {
  const chatMessages = document.getElementById("chatMessages");
  if (!chatMessages) return;

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

  // Show typing indicator
  showTypingIndicator();

  const reply = await processMessage(message);
  
  // Remove typing indicator
  removeTypingIndicator();
  
  addMessage(reply, "bot");
}

// ===== TYPING INDICATOR =====
function showTypingIndicator() {
  const chatMessages = document.getElementById("chatMessages");
  if (!chatMessages) return;
  
  const typingDiv = document.createElement("div");
  typingDiv.className = "bot-message typing";
  typingDiv.id = "typingIndicator";
  typingDiv.innerHTML = "Typing...";
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const typingDiv = document.getElementById("typingIndicator");
  if (typingDiv) typingDiv.remove();
}

// ===== CHAT UI CONTROL =====
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("chatbotToggle");
  const chatbox = document.getElementById("chatbotContainer");
  const closeBtn = document.getElementById("closeChat");
  const sendBtn = document.getElementById("sendMessage");
  const input = document.getElementById("userInput");

  if (toggle) {
    toggle.addEventListener("click", () => {
      chatbox.classList.toggle("open");
      
      // Show welcome message if first time
      const chatMessages = document.getElementById("chatMessages");
      if (chatMessages && chatMessages.children.length === 0) {
        addMessage("👋 Hi! I'm MAINUL-X Helper. How can I help you today?", "bot");
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      chatbox.classList.remove("open");
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }
});

// ===== Export for UI =====
window.processMessage = processMessage;
window.sendMessage = sendMessage;

console.log("✅ MAINUL-X chatbot loaded (Gemini + Groq)");
