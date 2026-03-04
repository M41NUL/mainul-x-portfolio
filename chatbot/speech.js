// MAINUL-X Text-to-Speech - Md. Mainul Islam (M41NUL)

let speechEnabled = true;
let currentUtterance = null;

function initSpeech() {
    if (!('speechSynthesis' in window)) {
        console.warn('Text-to-speech not supported');
        return false;
    }
    return true;
}

function speakText(text, lang = 'bn-BD') {
    if (!speechEnabled || !text) return;
    
    // Cancel any ongoing speech
    stopSpeaking();
    
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;
    
    // Set language
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    const bengaliVoice = voices.find(v => v.lang.includes('bn'));
    if (bengaliVoice) utterance.voice = bengaliVoice;
    
    utterance.onstart = () => {
        document.getElementById('speakerBtn')?.classList.add('speaking');
    };
    
    utterance.onend = () => {
        document.getElementById('speakerBtn')?.classList.remove('speaking');
        currentUtterance = null;
    };
    
    utterance.onerror = () => {
        document.getElementById('speakerBtn')?.classList.remove('speaking');
        currentUtterance = null;
    };
    
    window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    currentUtterance = null;
    document.getElementById('speakerBtn')?.classList.remove('speaking');
}

function toggleSpeech() {
    speechEnabled = !speechEnabled;
    const btn = document.getElementById('speakerBtn');
    if (btn) {
        btn.classList.toggle('disabled', !speechEnabled);
        btn.title = speechEnabled ? 'Mute' : 'Unmute';
    }
    if (!speechEnabled) stopSpeaking();
}

function speakLastMessage(text) {
    if (!text) return;
    const lang = /[\u0980-\u09FF]/.test(text) ? 'bn-BD' : 'en-US';
    speakText(text, lang);
}

window.speakText = speakText;
window.stopSpeaking = stopSpeaking;
window.toggleSpeech = toggleSpeech;
window.speakLastMessage = speakLastMessage;

console.log('✅ Text-to-speech loaded');
