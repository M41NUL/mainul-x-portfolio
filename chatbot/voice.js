// ===== VOICE TO VOICE CHATBOT =====
// Author: Md. Mainul Islam
// GitHub: https://github.com/M41NUL
// Contact: +8801308850528
// Version: 1.0.0

class VoiceChatbot {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        this.selectedVoice = null;
        this.init();
    }
    
    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice not supported in this browser. Please use Chrome, Edge, or Safari.");
            return;
        }
        
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = "bn-BD";
        
        this.loadVoices();
        
        this.recognition.onresult = (e) => this.onVoiceInput(e);
        this.recognition.onerror = (e) => this.onVoiceError(e);
        this.recognition.onend = () => this.onVoiceEnd();
    }
    
    loadVoices() {
        this.voices = this.synthesis.getVoices();
        this.selectedVoice = this.voices.find(v => v.lang.includes('bn') || v.lang.includes('hi') || v.name.includes('Google'));
        if (!this.selectedVoice && this.voices.length > 0) this.selectedVoice = this.voices[0];
    }
    
    startListening() {
        if (!this.recognition) return;
        this.isListening = true;
        this.updateButtonState(true);
        this.recognition.start();
    }
    
    onVoiceInput(e) {
        const userText = e.results[0][0].transcript;
        console.log("User said:", userText);
        this.showMessage(userText, "user");
        this.getBotResponse(userText);
    }
    
    async getBotResponse(userText) {
        try {
            const res = await fetch('https://mainul-x-portfolio.vercel.app/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            });
            const data = await res.json();
            const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand.";
            this.showMessage(botText, "bot");
            this.speak(botText);
        } catch (error) {
            console.error("API Error:", error);
            const errorMsg = "Connection error. Please try again.";
            this.showMessage(errorMsg, "bot");
            this.speak(errorMsg);
        }
    }
    
    speak(text) {
        if (!this.synthesis) return;
        this.synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.selectedVoice;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.onstart = () => console.log("Speaking...");
        utterance.onend = () => console.log("Speaking complete");
        utterance.onerror = (e) => console.error("Speech error:", e);
        this.synthesis.speak(utterance);
    }
    
    showMessage(text, sender) {
        if (typeof window.addMessage === 'function') window.addMessage(text, sender);
        else console.log(sender + ": " + text);
    }
    
    onVoiceError(e) {
        console.error("Voice error:", e.error);
        this.isListening = false;
        this.updateButtonState(false);
    }
    
    onVoiceEnd() {
        this.isListening = false;
        this.updateButtonState(false);
    }
    
    updateButtonState(isListening) {
        const voiceBtn = document.getElementById("voiceBtn");
        if (!voiceBtn) return;
        if (isListening) {
            voiceBtn.style.background = "#ff4444";
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        } else {
            voiceBtn.style.background = "var(--gradient)";
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
    }
}

let voiceChatbot;
document.addEventListener("DOMContentLoaded", () => {
    voiceChatbot = new VoiceChatbot();
    const voiceBtn = document.getElementById("voiceBtn");
    if (voiceBtn) {
        voiceBtn.addEventListener("click", () => {
            if (voiceChatbot.isListening) voiceChatbot.recognition?.stop();
            else voiceChatbot.startListening();
        });
    }
});
