// chatbot/chatbot.js - Main chatbot file
// Author: Md. Mainul Islam
// GitHub: https://github.com/M41NUL

// Vercel API URL (GitHub Pages থেকে কল করবে)
const API_URL = "https://mainul-x-portfolio.vercel.app/api/chat";

// Initialize chatbot
document.addEventListener('DOMContentLoaded', function() {
  console.log('🤖 Chatbot initialized');
  
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Make functions globally available
    window.processMessage = processMessage;
    window.sendTelegramNotification = sendTelegramNotification;
    window.askGemini = askGemini;
  }
});

// Main function to process user messages
async function processMessage(message) {
  if (!message || message.trim() === '') {
    return "Please type a message.";
  }
  
  const trimmedMessage = message.trim();
  const lowerMsg = trimmedMessage.toLowerCase();
  
  // Quick replies (no API call needed)
  if (lowerMsg.includes('payment') || lowerMsg.includes('পেমেন্ট') || 
      lowerMsg.includes('টাকা') || lowerMsg.includes('bkash')) {
    return paymentReply();
  }
  
  if (lowerMsg.includes('contact') || lowerMsg.includes('যোগাযোগ') || 
      lowerMsg.includes('ফোন') || lowerMsg.includes('whatsapp')) {
    return contactReply();
  }
  
  if (lowerMsg.includes('github') || lowerMsg.includes('গিটহাব') || 
      lowerMsg.includes('project') || lowerMsg.includes('প্রজেক্ট')) {
    return githubReply();
  }
  
  if (lowerMsg.includes('service') || lowerMsg.includes('সার্ভিস') || 
      lowerMsg.includes('what do you do') || lowerMsg.includes('কি কি')) {
    return servicesReply();
  }
  
  if (lowerMsg.includes('about') || lowerMsg.includes('সম্পর্কে') || 
      lowerMsg.includes('who are you') || lowerMsg.includes('তুমি কে')) {
    return aboutReply();
  }
  
  if (lowerMsg.includes('termux') || lowerMsg.includes('টার্মাক্স') || 
      lowerMsg.includes('tool') || lowerMsg.includes('টুল')) {
    return termuxReply();
  }
  
  if (lowerMsg.includes('socinest') || lowerMsg.includes('সোসিনেস্ট') || 
      lowerMsg.includes('agency') || lowerMsg.includes('এজেন্সি')) {
    return socinestReply();
  }
  
  if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || 
      lowerMsg.includes('হাই') || lowerMsg.includes('ওহে')) {
    return "👋 Hello! How can I help you today?";
  }
  
  // Default to Gemini AI
  return await askGemini(trimmedMessage);
}

// Ask Gemini AI via Vercel API
async function askGemini(message) {
  try {
    console.log('🤖 Asking Gemini:', message);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: message,
        type: 'gemini'
      })
    });

    const data = await response.json();
    console.log('✅ Gemini response received');

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }

    if (data.error) {
      console.error('API Error:', data.error);
      return "😔 Sorry, I'm having trouble connecting. Please try again.";
    }

    return "⚠️ No response from AI.";

  } catch (error) {
    console.error('Error calling Gemini:', error);
    return "😔 Network error. Please check your connection.";
  }
}

// Send Telegram notification
async function sendTelegramNotification(text) {
  try {
    console.log('📤 Sending Telegram notification');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: text,
        type: 'telegram'
      })
    });

    const data = await response.json();
    console.log('✅ Telegram response:', data);
    
    return data;

  } catch (error) {
    console.error('Telegram Error:', error);
    return { ok: false, error: error.message };
  }
}

// Quick reply functions
function paymentReply() {
  return `💰 **Payment Options**
  
📱 **Nagad:** 01308850528
📱 **bKash:** 01308850528
🏦 **BRAC Bank:** 1073831440001
👤 **Holder:** MD. MAINUL ISLAM

Click any number to copy!`;
}

function contactReply() {
  return `📞 **Contact Information**
  
📧 **Email:** githubmainul@gmail.com
📱 **WhatsApp:** 01308850528
✈️ **Telegram:** @mdmainulislaminfo
👤 **Facebook:** /mainulxhy
📸 **Instagram:** @mainul_xhy
🐙 **GitHub:** @M41NUL

I usually reply within a few hours!`;
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
   • Brand promotion

Need details about any service? Just ask!`;
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
I work professionally in Cyber Security and Digital Marketing. I create tools, websites, and applications for Termux. All my GitHub projects are open source.

My journey started with Termux Tools Development. Now I work on security, automation, and digital growth.

I run SOCINEST-X, a social media agency helping businesses grow online.`;
}

function termuxReply() {
  return `🧰 **Termux Tools**
  
আমি Termux-এর জন্য বিভিন্ন টুলস বানাই:

🔹 **system-monitor** - System monitoring
🔹 **port-scanner** - Network scanner
🔹 **speedtest-tool** - Internet speed test
🔹 **termux-theme-changer** - Theme changer
🔹 **bd-sms-blitz** - SMS tool
🔹 **M41NUL-Bot** - Telegram bot

এবং আরও ৪৫+ টুলস!

👉 সবগুলো ওপেন সোর্স এবং ফ্রি
👉 GitHub-এ পাবেন: https://github.com/M41NUL

কোন টুল সম্পর্কে জানতে চান?`;
}

function socinestReply() {
  return `📱 **SOCINEST-X Agency**
  
🚀 Social media agency founded by Md. Mainul Islam

**Services:**
• Online promotion
• Content management
• Social media strategy
• Brand growth
• Business page management

**Contact:**
👤 Facebook: /socinestx
📸 Instagram: @socinestx

We help businesses grow their online presence!`;
}

// Export functions for browser
if (typeof window !== 'undefined') {
  window.processMessage = processMessage;
  window.sendTelegramNotification = sendTelegramNotification;
  window.askGemini = askGemini;
  window.paymentReply = paymentReply;
  window.contactReply = contactReply;
  window.githubReply = githubReply;
  window.servicesReply = servicesReply;
  window.aboutReply = aboutReply;
  window.termuxReply = termuxReply;
  window.socinestReply = socinestReply;
}

console.log('✅ chatbot.js loaded');
