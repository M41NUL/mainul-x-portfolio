// chatbot/voice.js
let recognition = null;
let isListening = false;

function initVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice not supported. Try Chrome browser.');
        return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'bn-BD,en-US';
    
    recognition.onstart = () => {
        isListening = true;
        document.getElementById('voiceBtn')?.classList.add('listening');
        console.log('🎤 Listening...');
    };
    
    recognition.onend = () => {
        isListening = false;
        document.getElementById('voiceBtn')?.classList.remove('listening');
    };
    
    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        document.getElementById('userInput').value = text;
        if (typeof sendMessage === 'function') sendMessage();
    };
    
    recognition.onerror = (event) => {
        console.error('Voice error:', event.error);
        isListening = false;
        document.getElementById('voiceBtn')?.classList.remove('listening');
    };
    
    return true;
}

function startVoice() {
    if (!recognition) {
        const supported = initVoice();
        if (!supported) return;
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

window.startVoice = startVoice;
console.log('✅ Voice loaded');
