// MAINUL-X Language Detector - Md. Mainul Islam (M41NUL)

function detectLanguage(text) {
    if (!text) return 'en';
    
    // Check for Bengali characters (Unicode range)
    const bengaliPattern = /[\u0980-\u09FF]/;
    if (bengaliPattern.test(text)) return 'bn';
    
    // Check for Banglish (Bengali written in English)
    const banglishWords = [
        'ami', 'tumi', 'apni', 'kemon', 'acho', 'ase', 'ki',
        'na', 'hae', 'thik', 'bolo', 'dite', 'paro', 'chai'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    const banglishCount = words.filter(w => banglishWords.includes(w)).length;
    
    if (banglishCount > 1) return 'bn';
    
    // Default to English
    return 'en';
}

function getResponseLanguage(text) {
    return detectLanguage(text);
}

window.detectLanguage = detectLanguage;
window.getResponseLanguage = getResponseLanguage;

console.log('✅ Language detector loaded');
