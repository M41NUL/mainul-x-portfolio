// Chatbot database - questions & answers

const chatbotData = {
    // Language selection
    languagePrompt: {
        bn: "আপনি কোন ভাষায় কথা বলতে চান? নিচের বাটন থেকে সিলেক্ট করুন:",
        en: "Which language do you prefer? Please select below:"
    },

    // Bengali data
    bn: {
        welcome: "👋 হাই! আমি MAINUL-X এর হেল্পবট। আপনার নাম কী?",
        greetings: [
            "👋 হাই! কেমন আছেন?",
            "😊 আপনার নাম কী?",
            "🤖 কিভাবে সাহায্য করতে পারি?"
        ],
        responses: [
            {
                keywords: ["service", "সার্ভিস", "কী কী", "কি কি"],
                answer: `আমাদের সার্ভিস:\n🔹 Digital Marketing\n🔹 Cyber Security\n🔹 Programming\n🔹 Termux Tools\n🔹 App Subscriptions\n🔹 SOCINEST-X`
            },
            {
                keywords: ["payment", "পেমেন্ট", "টাকা"],
                answer: `পেমেন্ট অপশন:\n🔸 Nagad: 01308850528\n🔸 bKash: 01308850528\n🔸 Merchant: 01858845308\n🔸 BRAC Bank: 1073831 440001`
            },
            {
                keywords: ["contact", "কন্টাক্ট", "যোগাযোগ", "ফোন"],
                answer: `যোগাযোগ:\n📞 WhatsApp: 01308850528\n📱 Telegram: @mdmainulislaminfo\n📧 Email: githubmainul@gmail.com`
            },
            {
                keywords: ["github", "গিটহাব", "project", "প্রজেক্ট"],
                answer: `GitHub: /M41NUL\n৫০+ প্রজেক্ট। সব ওপেন সোর্স।`
            },
            {
                keywords: ["socinest", "এজেন্সি", "agency"],
                answer: `SOCINEST-X - সোশ্যাল মিডিয়া এজেন্সি। FB: /socinestx, IG: @socinestx`
            }
        ],
        fallback: "দুঃখিত, বুঝতে পারিনি। নিচের বাটন থেকে সিলেক্ট করুন।"
    },

    // English data
    en: {
        welcome: "👋 Hi! I'm MAINUL-X Helpbot. What's your name?",
        greetings: [
            "👋 Hi! How are you?",
            "😊 What's your name?",
            "🤖 How can I help you?"
        ],
        responses: [
            {
                keywords: ["service", "services", "what do you do"],
                answer: `Our Services:\n🔹 Digital Marketing\n🔹 Cyber Security\n🔹 Programming\n🔹 Termux Tools\n🔹 App Subscriptions\n🔹 SOCINEST-X`
            },
            {
                keywords: ["payment", "pay", "money"],
                answer: `Payment Options:\n🔸 Nagad: 01308850528\n🔸 bKash: 01308850528\n🔸 Merchant: 01858845308\n🔸 BRAC Bank: 1073831 440001`
            },
            {
                keywords: ["contact", "phone", "email"],
                answer: `Contact:\n📞 WhatsApp: 01308850528\n📱 Telegram: @mdmainulislaminfo\n📧 Email: githubmainul@gmail.com`
            },
            {
                keywords: ["github", "project", "projects"],
                answer: `GitHub: /M41NUL\n50+ open source projects.`
            },
            {
                keywords: ["socinest", "agency"],
                answer: `SOCINEST-X - Social Media Agency. FB: /socinestx, IG: @socinestx`
            }
        ],
        fallback: "Sorry, I didn't understand. Please select from buttons below."
    },

    // Quick buttons
    quickButtons: [
        { text: "📋 Services", query: "services", lang: "en" },
        { text: "💰 Payment", query: "payment", lang: "en" },
        { text: "📞 Contact", query: "contact", lang: "en" },
        { text: "📦 GitHub", query: "github", lang: "en" },
        { text: "সার্ভিস", query: "সার্ভিস", lang: "bn" },
        { text: "পেমেন্ট", query: "পেমেন্ট", lang: "bn" },
        { text: "যোগাযোগ", query: "যোগাযোগ", lang: "bn" }
    ]
};
