// MAINUL-X Memory System - Md. Mainul Islam (M41NUL)

let chatMemory = [];
let userName = null;

function saveMessage(role, content) {
    chatMemory.push({ role, content, time: Date.now() });
    if (chatMemory.length > 20) chatMemory.shift();
    
    if (role === 'user' && !userName) {
        const match = content.match(/(?:my name is|i am|আমার নাম)\s+(\w+)/i);
        if (match) userName = match[1];
    }
}

function getContext() {
    return chatMemory.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
}

function getUserName() {
    return userName;
}

function clearMemory() {
    chatMemory = [];
    userName = null;
}

window.saveMessage = saveMessage;
window.getContext = getContext;
window.getUserName = getUserName;
window.clearMemory = clearMemory;

console.log('✅ Memory loaded');
