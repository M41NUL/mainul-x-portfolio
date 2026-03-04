// MAINUL-X Typing Animation - Md. Mainul Islam (M41NUL)

async function typeMessage(text, element, speed = 30) {
    element.innerHTML = '';
    for (let char of text) {
        element.innerHTML += char;
        await new Promise(r => setTimeout(r, speed));
        element.scrollTop = element.scrollHeight;
    }
}

function showTypingIndicator(container) {
    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.id = 'typingIndicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    document.getElementById('typingIndicator')?.remove();
}

window.typeMessage = typeMessage;
window.showTypingIndicator = showTypingIndicator;
window.removeTypingIndicator = removeTypingIndicator;

console.log('✅ Typing animation loaded');
