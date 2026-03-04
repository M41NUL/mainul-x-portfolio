// Main chatbot logic

// DOM elements
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const minimizeBtn = document.getElementById('minimizeChat');
const closeBtn = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendMessage');
const quickQuestions = document.getElementById('quickQuestions');

// State variables
let isOpen = false;
let currentLanguage = null; // 'bn' or 'en'
let messageHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showLanguageSelection();
});

// Toggle button click
chatbotToggle.addEventListener('click', () => {
    if (!isOpen) {
        chatbotContainer.classList.add('open');
        isOpen = true;
    } else {
        chatbotContainer.classList.remove('open');
        isOpen = false;
    }
});

// Minimize button
minimizeBtn.addEventListener('click', () => {
    chatbotContainer.classList.remove('open');
    isOpen = false;
});

// Close button
closeBtn.addEventListener('click', () => {
    chatbotContainer.classList.remove('open');
    isOpen = false;
});

// Send message
sendButton.addEventListener('click', sendUserMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendUserMessage();
});

// Show language selection
function showLanguageSelection() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.innerHTML = `
        <div class="message-content">
            ${chatbotData.languagePrompt.en}<br><br>
            ${chatbotData.languagePrompt.bn}
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    
    // Language buttons
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'quick-questions';
    buttonDiv.innerHTML = `
        <button class="quick-btn" onclick="setLanguage('bn')">বাংলা</button>
        <button class="quick-btn" onclick="setLanguage('en')">English</button>
    `;
    chatMessages.appendChild(buttonDiv);
}

// Set language
function setLanguage(lang) {
    currentLanguage = lang;
    
    // Remove language selection
    const messages = chatMessages.children;
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].classList.contains('quick-questions') || 
            messages[i].querySelector('.message-content')?.innerText.includes('Which language')) {
            messages[i].remove();
        }
    }
    
    // Show welcome message
    const langData = lang === 'bn' ? chatbotData.bn : chatbotData.en;
    addMessage(langData.welcome, 'bot');
    loadQuickButtons(lang);
}

// Send user message
function sendUserMessage() {
    const message = userInput.value.trim();
    if (message === '' || !currentLanguage) return;
    
    addMessage(message, 'user');
    userInput.value = '';
    
    // Show typing indicator
    if (chatbotConfig.showTypingIndicator) {
        showTypingIndicator();
    }
    
    // Get reply
    setTimeout(() => {
        removeTypingIndicator();
        const reply = getBotReply(message);
        addMessage(reply, 'bot');
    }, 1000);
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const time = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-content">${text.replace(/\n/g, '<br>')}</div>
        ${chatbotConfig.showTime ? `<div class="message-time">${time}</div>` : ''}
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get bot reply
function getBotReply(userMessage) {
    if (!currentLanguage) return "Please select a language first.";
    
    const message = userMessage.toLowerCase();
    const langData = currentLanguage === 'bn' ? chatbotData.bn : chatbotData.en;
    
    // Check keywords
    for (let response of langData.responses) {
        for (let keyword of response.keywords) {
            if (message.includes(keyword.toLowerCase())) {
                return response.answer;
            }
        }
    }
    
    // Check greetings
    if (message.match(/(hi|hello|হাই|ওহে)/)) {
        return langData.greetings[Math.floor(Math.random() * langData.greetings.length)];
    }
    
    // Fallback
    return langData.fallback;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Load quick buttons
function loadQuickButtons(lang) {
    if (!chatbotConfig.showQuickButtons) return;
    
    quickQuestions.innerHTML = '';
    const buttons = chatbotData.quickButtons.filter(btn => btn.lang === lang);
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'quick-btn';
        button.textContent = btn.text;
        button.onclick = () => {
            userInput.value = btn.query;
            sendUserMessage();
        };
        quickQuestions.appendChild(button);
    });
}
