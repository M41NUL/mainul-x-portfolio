// chatbot/nlp.js - Bangla/English intent detection
// Author: Md. Mainul Islam
// GitHub: https://github.com/M41NUL

// Detect user intent from message
function detectIntent(message) {
    const msg = message.toLowerCase();
    
    // Payment intent
    if (msg.includes("payment") || msg.includes("পেমেন্ট") || 
        msg.includes("টাকা") || msg.includes("bkash") || 
        msg.includes("nagad") || msg.includes("বিকাশ") || 
        msg.includes("নগদ") || msg.includes("ব্যাংক")) {
        return "payment";
    }
    
    // Contact intent
    if (msg.includes("contact") || msg.includes("যোগাযোগ") || 
        msg.includes("phone") || msg.includes("ফোন") || 
        msg.includes("email") || msg.includes("ইমেইল") || 
        msg.includes("whatsapp") || msg.includes("হোয়াটসঅ্যাপ") ||
        msg.includes("telegram") || msg.includes("টেলিগ্রাম")) {
        return "contact";
    }
    
    // GitHub intent
    if (msg.includes("github") || msg.includes("গিটহাব") || 
        msg.includes("project") || msg.includes("প্রজেক্ট") || 
        msg.includes("repo") || msg.includes("কোড") || 
        msg.includes("code")) {
        return "github";
    }
    
    // Services intent
    if (msg.includes("service") || msg.includes("সার্ভিস") || 
        msg.includes("what do you do") || msg.includes("কি কি") || 
        msg.includes("help") || msg.includes("সাহায্য")) {
        return "services";
    }
    
    // About intent
    if (msg.includes("about") || msg.includes("সম্পর্কে") || 
        msg.includes("who") || msg.includes("কে") || 
        msg.includes("name") || msg.includes("নাম") || 
        msg.includes("mainul") || msg.includes("মাইনুল")) {
        return "about";
    }
    
    // Termux intent
    if (msg.includes("termux") || msg.includes("টার্মাক্স") || 
        msg.includes("tool") || msg.includes("টুল")) {
        return "termux";
    }
    
    // SOCINEST intent
    if (msg.includes("socinest") || msg.includes("সোসিনেস্ট") || 
        msg.includes("agency") || msg.includes("এজেন্সি")) {
        return "socinest";
    }
    
    // Default - use AI
    return "ai";
}

// Detect language (Bangla or English)
function detectLanguage(message) {
    // Check for Bangla Unicode characters
    const banglaPattern = /[\u0980-\u09FF]/;
    return banglaPattern.test(message) ? 'bn' : 'en';
}

// Export functions
if (typeof window !== 'undefined') {
    window.detectIntent = detectIntent;
    window.detectLanguage = detectLanguage;
}

console.log('✅ nlp.js loaded');
