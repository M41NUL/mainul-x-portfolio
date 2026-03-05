// MAINUL-X Chatbot - Complete
// Author: Md. Mainul Islam

const API_URL = "https://mainul-x-portfolio.vercel.app/api/chat";

let messageId = 0;

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

    // Default → AI
    return await askAI(message);
}

// ===== AI REQUEST =====
async function askAI(message) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: message,
                type: 'gemini' 
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        return "⚠️ AI returned empty response.";

    } catch (error) {
        console.error('AI Error:', error);
        return "😔 AI connection error.";
    }
}

// ===== ADD MESSAGE WITH AVATAR, TIME, COPY =====
function addMessage(text, sender = "bot") {
    const chatMessages = document.getElementById("chatMessages");
    if (!chatMessages) return;

    const msgId = ++messageId;
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    messageDiv.dataset.id = msgId;

    // Avatar
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.innerHTML = sender === "bot" ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

    // Message wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "message-wrapper";

    // Message content (copyable)
    const content = document.createElement("div");
    content.className = "message-content";
    content.innerHTML = formatMessage(text);
    
    // Make copyable
    makeCopyable(content, text);

    // Message footer
    const footer = document.createElement("div");
    footer.className = "message-footer";

    // Time
    const time = document.createElement("div");
    time.className = "message-time";
    const now = new Date();
    time.innerHTML = `<i class="fas fa-clock"></i> ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Read receipt (for user messages)
    if (sender === "user") {
        const receipt = document.createElement("div");
        receipt.className = "read-receipt";
        receipt.innerHTML = '<i class="fas fa-check-double"></i> Read';
        footer.appendChild(receipt);
    }

    footer.appendChild(time);
    wrapper.appendChild(content);
    wrapper.appendChild(footer);

    // Assemble message
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

// ===== MARK MESSAGE AS READ =====
function markAsRead(msgId) {
    const msg = document.querySelector(`[data-id="${msgId}"]`);
    if (msg) {
        const receipt = msg.querySelector('.read-receipt');
        if (receipt) {
            receipt.innerHTML = '<i class="fas fa-check-double" style="color: var(--primary)"></i> Read';
        }
    }
}

// ===== FORMAT MESSAGE =====
function formatMessage(text) {
    let formatted = text;
    
    if (typeof parseMarkdown === 'function') {
        formatted = parseMarkdown(formatted);
    }
    
    if (typeof highlightCode === 'function') {
        formatted = highlightCode(formatted);
    }
    
    return formatted;
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
    
    removeTypingIndicator();
    addMessage(reply, "bot");

    // Speak if enabled
    if (window.speechEnabled) {
        speakText(reply);
    }
}

// ===== TYPING INDICATOR =====
function showTypingIndicator() {
    const chatMessages = document.getElementById("chatMessages");
    if (!chatMessages) return;
    
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot";
    typingDiv.id = "typingIndicator";
    typingDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-wrapper">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    document.getElementById("typingIndicator")?.remove();
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
            
            if (chatbox.classList.contains("open") && chatbox.querySelectorAll('.message').length === 0) {
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

// ===== COPY TEXT ON LONG PRESS =====
function makeCopyable(element, text) {
    let pressTimer;
    
    // For mobile: touch and hold
    element.addEventListener('touchstart', (e) => {
        pressTimer = setTimeout(() => {
            copyText(text, element);
        }, 500);
    });
    
    element.addEventListener('touchend', () => {
        clearTimeout(pressTimer);
    });
    
    element.addEventListener('touchcancel', () => {
        clearTimeout(pressTimer);
    });
    
    // For desktop
    element.addEventListener('mousedown', (e) => {
        if (e.button === 2) return;
        pressTimer = setTimeout(() => {
            copyText(text, element);
        }, 500);
    });
    
    element.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
    });
    
    element.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
    });
}

// ===== COPY FUNCTION =====
async function copyText(text, element) {
    try {
        await navigator.clipboard.writeText(text);
        
        element.classList.add('copied');
        setTimeout(() => {
            element.classList.remove('copied');
        }, 2000);
        
    } catch (err) {
        console.error('Copy failed:', err);
        
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        element.classList.add('copied');
        setTimeout(() => {
            element.classList.remove('copied');
        }, 2000);
    }
}

// ===== EXPORTS =====
window.processMessage = processMessage;
window.sendMessage = sendMessage;

console.log("✅ MAINUL-X chatbot loaded (reactions removed)");
