// chatbot/payment.js - Payment related replies
// Author: Md. Mainul Islam
// GitHub: https://github.com/M41NUL

function paymentReply() {
    return `💰 **Payment Options**
    
📱 **Nagad (Personal)**
\`01308850528\` (click to copy)

📱 **bKash (Personal)**
\`01308850528\` (click to copy)

🏪 **bKash (Merchant)**
\`01858845308\` (click to copy)

🏦 **BRAC BANK**
• Account: \`1073831440001\`
• Routing: \`060270609\`
• SWIFT: \`BRAKBDDH\`
• Branch: Agent Banking

👤 **Account Holder:** MD. MAINUL ISLAM`;
}

function contactReply() {
    return `📞 **Contact Information**
    
📧 **Email:** githubmainul@gmail.com
📧 **Email 2:** devmainulislam@gmail.com

📱 **WhatsApp Personal:** 01308850528
📱 **WhatsApp Business:** 01571586157

✈️ **Telegram:** @mdmainulislaminfo

👤 **Facebook:** /mainulxhy
📱 **Facebook Page:** /socinestx

📸 **Instagram:** @mainul_xhy
📸 **IG Business:** @socinestx

🐙 **GitHub:** @M41NUL`;
}

function servicesReply() {
    return `📋 **My Services**
    
🔹 **Digital Marketing**
   • Social media management
   • Growth hacking
   • Content strategy

🔹 **Cyber Security**
   • Penetration testing
   • Security auditing
   • Ethical hacking

🔹 **Programming**
   • Custom software
   • Automation scripts
   • Web development

🔹 **Termux Tools**
   • Custom scripts
   • Hacking tools
   • Automation solutions

🔹 **App Subscriptions**
   • Subscription management
   • Boosting services

🔹 **SOCINEST-X Agency**
   • Complete social media management
   • Brand promotion`;
}

function aboutReply() {
    return `👤 **Md. Mainul Islam (MAINUL-X)**

🔐 **Cyber Security Specialist**
📈 **Digital Marketing Expert**
🧰 **Termux Tools Developer**
📦 **50+ GitHub Projects** (Open Source)
🚀 **Founder of SOCINEST-X**

🎯 **Expertise:**
• Cyber Security: 95%
• Digital Marketing: 90%
• Programming: 88%
• Termux Tools: 85%
• Social Media: 92%

📝 **Bio:**
I work professionally in Cyber Security and Digital Marketing. I create tools, websites, and applications for Termux. All my GitHub projects are open source.`;
}

function termuxReply() {
    return `🧰 **Termux Tools**
    
🔹 **system-monitor** - System monitoring
🔹 **port-scanner** - Network scanner
🔹 **speedtest-tool** - Internet speed test
🔹 **termux-theme-changer** - Theme changer
🔹 **bd-sms-blitz** - SMS tool
🔹 **M41NUL-Bot** - Telegram bot

👉 সবগুলো ওপেন সোর্স এবং ফ্রি
👉 GitHub-এ পাবেন: https://github.com/M41NUL`;
}

function socinestReply() {
    return `📱 **SOCINEST-X Agency**
    
🚀 Social media agency founded by Md. Mainul Islam

**Services:**
• Online promotion
• Content management
• Social media strategy
• Brand growth

**Contact:**
👤 Facebook: /socinestx
📸 Instagram: @socinestx`;
}

function githubReply() {
    return `📦 **GitHub Projects (50+)**
    
🔗 https://github.com/M41NUL

**Popular repos:**
• system-monitor
• port-scanner
• speedtest-tool
• termux-theme-changer
• M41NUL-Bot

All projects are open source!`;
}

// Export functions
if (typeof window !== 'undefined') {
    window.paymentReply = paymentReply;
    window.contactReply = contactReply;
    window.servicesReply = servicesReply;
    window.aboutReply = aboutReply;
    window.termuxReply = termuxReply;
    window.socinestReply = socinestReply;
    window.githubReply = githubReply;
}

console.log('✅ payment.js loaded');
