// MAINUL-X Chatbot - Main File
// Author: Md. Mainul Islam
// GitHub: https://github.com/M41NUL

const API_URL = "https://mainul-x-portfolio.vercel.app/api/chat";
let messageId = 0;
let userName = null;
let chatHistory = [];

function addMessage(text, sender = "bot") {
    const chatMessages = document.getElementById("chatMessages");
    if (!chatMessages) return;

    const msgId = ++messageId;
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    messageDiv.dataset.id = msgId;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.innerHTML = sender === "bot" ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

    const wrapper = document.createElement("div");
    wrapper.className = "message-wrapper";

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = text;

    const footer = document.createElement("div");
    footer.className = "message-footer";

    const time = document.createElement("div");
    time.className = "message-time";
    const now = new Date();
    time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sender === "user") {
        const receipt = document.createElement("div");
        receipt.className = "read-receipt";
        receipt.textContent = "✓✓";
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
}

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
                    <span></span><span></span><span></span>
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

async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    showTypingIndicator();

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: message,
                history: chatHistory.slice(-5)
            })
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                     "I'm here to help! What would you like to know?";

        removeTypingIndicator();
        addMessage(reply, "bot");

        chatHistory.push({ role: 'user', text: message });
        chatHistory.push({ role: 'ai', text: reply });

    } catch (error) {
        console.error("API Error:", error);
        removeTypingIndicator();
        addMessage("Sorry, I'm having trouble connecting.", "bot");
    }
}

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

window.addMessage = addMessage;
window.sendMessage = sendMessage;
