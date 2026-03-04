// chatbot/memory.js - Conversation memory
// Author: Md. Mainul Islam
// GitHub: https://github.com/M41NUL

let chatMemory = [];

// Save message to memory
function saveMessage(role, content) {
    chatMemory.push({
        role: role,
        content: content,
        timestamp: new Date().toISOString()
    });
    
    // Keep last 10 messages only
    const MAX_MEMORY = 10;
    if (chatMemory.length > MAX_MEMORY) {
        chatMemory.shift();
    }
    
    console.log(`💾 Saved ${role} message`);
}

// Get all memory
function getMemory() {
    return chatMemory;
}

// Get conversation history as text
function getConversationHistory() {
    return chatMemory.map(m => `${m.role}: ${m.content}`).join('\n');
}

// Clear memory
function clearMemory() {
    chatMemory = [];
    console.log('🧹 Memory cleared');
}

// Get context for AI (last 3 exchanges)
function getContextForAI() {
    const recent = chatMemory.slice(-6); // Last 3 exchanges (user+bot)
    return recent.map(m => `${m.role}: ${m.content}`).join('\n');
}

// Export functions
if (typeof window !== 'undefined') {
    window.saveMessage = saveMessage;
    window.getMemory = getMemory;
    window.getConversationHistory = getConversationHistory;
    window.clearMemory = clearMemory;
    window.getContextForAI = getContextForAI;
}

console.log('✅ memory.js loaded');
