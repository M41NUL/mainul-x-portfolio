// MAINUL-X Emoji Picker - Md. Mainul Islam (M41NUL)

const emojiList = ['😊', '😂', '❤️', '👍', '🔥', '🎉', '💯', '✅', '⚠️', '🔐', '💻', '📱', '💰', '📞', '✈️', '👤'];

function showEmojiPicker() {
    const picker = document.createElement('div');
    picker.className = 'emoji-picker';
    picker.innerHTML = emojiList.map(e => `<span onclick="insertEmoji('${e}')">${e}</span>`).join('');
    
    const input = document.getElementById('userInput');
    input.parentNode.insertBefore(picker, input.nextSibling);
    
    setTimeout(() => picker.remove(), 5000);
}

function insertEmoji(emoji) {
    const input = document.getElementById('userInput');
    input.value += emoji;
    input.focus();
}

window.showEmojiPicker = showEmojiPicker;
window.insertEmoji = insertEmoji;
console.log('✅ Emoji picker loaded');
