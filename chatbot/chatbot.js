// MAINUL-X Chatbot - Complete with Memory & API Sync
// Author: Md. Mainul Islam

const API_URL = "https://mainul-x-portfolio.vercel.app/api/chat";
let messageId = 0;
let userName = null;

// ===== CHAT HISTORY (MEMORY) =====
let chatHistory = [];

// ===== LANGUAGE DETECTION with BANGLISH =====
function detectLanguage(message) {
    const banglaRegex = /[\u0980-\u09FF]/;
    if (banglaRegex.test(message)) return "bn";

    const banglishWords = [
        "ami", "tumi", "apni", "kemon", "bhalo", "kisu", "keno", 
        "ki", "valo", "acha", "ase", "ache", "hobe", "korte", 
        "chai", "bolo", "dite", "paro", "jao", "a6o", "k6o",
        "acche", "vlo", "kmn", "kn", "kno", "tmi", "apnar",
        "amr", "tomar", "ekhon", "kothay", "kichu", "bolo"
    ];

    const text = message.toLowerCase();
    for (let word of banglishWords) {
        if (text.includes(word)) return "bn";
    }
    return "en";
}

// ===== EMOJI DETECTION =====
function isOnlyEmojis(text) {
    const emojiRegex = /^[\p{Emoji}\s]+$/u;
    return emojiRegex.test(text.trim());
}

// ===== USER NAME DETECTION =====
function detectUserName(message) {
    const patterns = [
        /(?:my name is|i am|i'm)\s+(\w+)/i,
        /(?:আমার নাম|নাম)\s+([\u0980-\u09FF]+)/i,
        /(?:call me)\s+(\w+)/i
    ];
    
    for (let pattern of patterns) {
        const match = message.match(pattern);
        if (match) {
            userName = match[1];
            return `Nice to meet you, ${userName}! How can I help you today?`;
        }
    }
    return null;
}

// ===== MAIN CHATBOT FUNCTION =====
async function processMessage(message) {
    if (!message || message.trim() === "") {
        return "Please type a message.";
    }

    const text = message.toLowerCase();

    // Check for name first
    const nameReply = detectUserName(message);
    if (nameReply) return nameReply;

    // ===== QUICK REPLIES =====
    if (text.includes("payment") || text.includes("পেমেন্ট") || text.includes("টাকা")) {
        return "Payment Options\n\nNagad: 01308850528\nbKash: 01308850528\nBRAC Bank: 1073831440001\nAccount Holder: MD. MAINUL ISLAM";
    }

    if (text.includes("github") || text.includes("গিটহাব") || text.includes("project")) {
        return "GitHub Profile\n\nhttps://github.com/M41NUL\n\n50+ open source projects including Termux tools, automation scripts, and developer utilities.";
    }

    if (text.includes("contact") || text.includes("যোগাযোগ")) {
        return "Contact Information\n\nEmail: githubmainul@gmail.com\nWhatsApp: 01308850528\nTelegram: @mdmainulislaminfo\n\nYou will usually receive a response within a few hours.";
    }

    if (text.includes("service") || text.includes("সার্ভিস")) {
        return "Available Services\n\nCyber Security\nDigital Marketing\nProgramming & Automation\nTermux Tools Development\nSocial Media Growth\nSOCINEST-X Agency";
    }

    if (text.includes("about") || text.includes("সম্পর্কে") || text.includes("কে")) {
        return "Md. Mainul Islam (MAINUL-X)\n\nCyber Security Specialist\nDigital Marketing Expert\nTermux Tools Developer\n50+ GitHub Projects\nFounder of SOCINEST-X";
    }

    if (text.includes("hi") || text.includes("hello") || text.includes("হাই")) {
        return "Hello! How can I assist you today?";
    }

    // Default → AI
    return await askAI(message);
}

// ===== AI REQUEST with MEMORY =====
async function askAI(message) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: message,
                history: chatHistory.slice(-10),
                type: 'gemini' 
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const reply = data.candidates[0].content.parts[0].text;
            
            chatHistory.push({ role: 'user', text: message });
            chatHistory.push({ role: 'ai', text: reply });
            
            if (chatHistory.length > 20) {
                chatHistory = chatHistory.slice(-20);
            }
            
            return reply;
        }

        return "AI returned empty response.";

    } catch (error) {
        console.error('AI Error:', error);
        return "AI connection error. Please try again.";
    }
}

// ===== ADD MESSAGE WITH CORRECT ICON POSITION =====
function addMessage(text, sender = "bot") {
    const chatMessages = document.getElementById("chatMessages");
    if (!chatMessages) return;

    const msgId = ++messageId;
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    messageDiv.dataset.id = msgId;

    // Avatar তৈরি
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.innerHTML = sender === "bot" ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

    // Content Wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "message-wrapper";

    // Content
    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = text; 

    // Footer
    const footer = document.createElement("div");
    footer.className = "message-footer";

    // Time
    const time = document.createElement("div");
    time.className = "message-time";
    const now = new Date();
    time.innerHTML = `<i class="fas fa-clock"></i> ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Read receipt for user messages
    if (sender === "user") {
        const receipt = document.createElement("div");
        receipt.className = "read-receipt";
        receipt.innerHTML = '<i class="fas fa-check-double"></i> Read';
        footer.appendChild(receipt);
    }

    footer.appendChild(time);
    wrapper.appendChild(content);
    wrapper.appendChild(footer);

  
    if (sender === "bot") {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(wrapper);
    } else {
        messageDiv.appendChild(wrapper);
        messageDiv.appendChild(avatar);
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Mark as read after 1 second
    if (sender === "bot") {
        setTimeout(() => markAsRead(msgId), 1000);
    }
}

// ===== MARK AS READ =====
function markAsRead(msgId) {
    const msg = document.querySelector(`[data-id="${msgId}"]`);
    if (msg) {
        const receipt = msg.querySelector('.read-receipt');
        if (receipt) {
            receipt.innerHTML = '<i class="fas fa-check-double" style="color: var(--primary)"></i> Read';
        }
    }
}

// ===== TYPING INDICATOR - FIXED =====
function showTypingIndicator() {
    const chatMessages = document.getElementById("chatMessages");
    if (!chatMessages) return;
    
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot";
    typingDiv.id = "typingIndicator";
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-wrapper">
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
function removeTypingIndicator() {
    document.getElementById("typingIndicator")?.remove();
}

// ===== SEND MESSAGE =====
async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    showTypingIndicator();

    const reply = await processMessage(message);
    
    removeTypingIndicator();
    addMessage(reply, "bot");
}

// ===== COPY FUNCTIONALITY =====
function makeCopyable(element, text) {
    let pressTimer;
    element.addEventListener('touchstart', () => {
        pressTimer = setTimeout(() => copyText(text, element), 500);
    });
    element.addEventListener('touchend', () => clearTimeout(pressTimer));
    element.addEventListener('touchcancel', () => clearTimeout(pressTimer));
}

async function copyText(text, element) {
    try {
        await navigator.clipboard.writeText(text);
        element.classList.add('copied');
        setTimeout(() => element.classList.remove('copied'), 2000);
    } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        element.classList.add('copied');
        setTimeout(() => element.classList.remove('copied'), 2000);
    }
}

// ===== DOM CONTENT LOADED =====
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("chatbotToggle");
    const chatbox = document.getElementById("chatbotContainer");
    const closeBtn = document.getElementById("closeChat");
    const sendBtn = document.getElementById("sendMessage");
    const input = document.getElementById("userInput");

    if (toggle) {
        toggle.addEventListener("click", () => {
            chatbox.classList.toggle("open");
            if (chatbox.classList.contains("open") && chatbox.querySelectorAll('.message').length === 0) {
                addMessage("Welcome to MAINUL-X AI Assistant. How can I assist you today?", "bot");
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => chatbox.classList.remove("open"));
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

// ===== EXPOSE FUNCTIONS =====
window.processMessage = processMessage;
window.sendMessage = sendMessage;

console.log("✅ MAINUL-X chatbot loaded with Memory & Banglish");
