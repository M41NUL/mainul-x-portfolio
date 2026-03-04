/*
MAINUL-X Portfolio - Chatbot Configuration
Author: Md. Mainul Islam
GitHub: https://github.com/M41NUL
*/

const CONFIG = {
    // Google Gemini API - GitHub Secrets থেকে আসবে
    GEMINI_API_KEY: 'AIzaSyAIx87fQKgtqoINhpz50BUfEF8WuqQ0_t8',
    
    // GitHub
    GITHUB_USERNAME: 'M41NUL',
    
    // Chatbot settings
    MAX_MEMORY: 10,
    TYPING_SPEED: 15,
    VOICE_LANG: 'bn-BD',
    
    // Contact info
    WHATSAPP: '01308850528',
    BKASH: '01308850528',
    NAGAD: '01308850528',
    BANK_ACCOUNT: '1073831440001',
    
    // Social links
    GITHUB_URL: 'https://github.com/m41nul',
    FACEBOOK: 'https://facebook.com/mainulxhy',
    INSTAGRAM: 'https://instagram.com/mainul_xhy',
    TELEGRAM: 'https://t.me/mdmainulislaminfo'
};

console.log('✅ Config loaded');

// For Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
