// MAINUL-X Voice Input - Md. Mainul Islam (M41NUL)

let recognition = null;
let isListening = false;

function initVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Voice recognition not supported');
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
        const input = document.getElementById('userInput');
        if (input) {
            input.value = text;
            if (typeof window.sendMessage === 'function') {
                window.sendMessage();
            }
        }
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
        if (!supported) {
            alert('Voice not supported. Try Chrome browser.');
            return;
        }
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

window.startVoice = startVoice;

console.log('✅ Voice input loaded');
