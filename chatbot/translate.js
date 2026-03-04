// MAINUL-X Translator - Md. Mainul Islam (M41NUL)

async function translateText(text, targetLang = 'bn') {
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return text;
    }
}

function detectAndTranslate(message) {
    const lang = detectLanguage(message);
    if (lang === 'bn') {
        return translateText(message, 'en');
    }
    return translateText(message, 'bn');
}

window.translateText = translateText;
window.detectAndTranslate = detectAndTranslate;
console.log('✅ Translator loaded');
