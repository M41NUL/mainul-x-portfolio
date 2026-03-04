/*
MAINUL-X Portfolio - Main Script
Author: Md. Mainul Islam
GitHub: https://github.com/M41NUL
*/

// ========== Projects Data ==========
const projects = [
    { name: "system-monitor", url: "https://github.com/M41NUL/system-monitor", desc: "System monitoring tool" },
    { name: "speedtest-tool", url: "https://github.com/M41NUL/speedtest-tool", desc: "Internet speed test" },
    { name: "port-scanner", url: "https://github.com/M41NUL/port-scanner", desc: "Network port scanner" },
    { name: "website-checker", url: "https://github.com/M41NUL/website-checker", desc: "Website uptime checker" },
    { name: "ip-info-tool", url: "https://github.com/M41NUL/ip-info-tool", desc: "IP information tool" },
    { name: "v-calculator-web", url: "https://github.com/M41NUL/v-calculator-web", desc: "Web calculator" },
    { name: "V-Calculator", url: "https://github.com/M41NUL/V-Calculator", desc: "Advanced calculator" },
    { name: "termux-theme-changer", url: "https://github.com/M41NUL/termux-theme-changer", desc: "Termux theme tool" },
    { name: "birthday-wish-generator", url: "https://github.com/M41NUL/birthday-wish-generator", desc: "Birthday wishes" },
    { name: "YTP", url: "https://github.com/M41NUL/YTP", desc: "YouTube tool" },
    { name: "M41NUL-Bot", url: "https://github.com/M41NUL/M41NUL-Bot", desc: "Telegram bot" },
    { name: "titan-x-bomber", url: "https://github.com/M41NUL/titan-x-bomber", desc: "SMS bomber" },
    { name: "ramadan-tool", url: "https://github.com/M41NUL/ramadan-tool", desc: "Ramadan helper" },
    { name: "QR-CODE-GENERATOR", url: "https://github.com/M41NUL/QR-CODE-GENERATOR", desc: "QR code maker" },
    { name: "telegram_sms_bomber_bot", url: "https://github.com/M41NUL/telegram_sms_bomber_bot", desc: "Telegram SMS bot" },
    { name: "mainul-x-uploader", url: "https://github.com/M41NUL/mainul-x-uploader", desc: "File uploader" },
    { name: "social-server-bd", url: "https://github.com/M41NUL/social-server-bd", desc: "Social media tool" },
    { name: "bd-sms-blitz", url: "https://github.com/M41NUL/bd-sms-blitz", desc: "SMS tool" },
    { name: "internet-speed-meter", url: "https://github.com/M41NUL/internet-speed-meter", desc: "Speed meter" },
    { name: "mainul-x-toolkit", url: "https://github.com/M41NUL/mainul-x-toolkit", desc: "Toolkit collection" },
    { name: "ENCODER_TOOL", url: "https://github.com/M41NUL/ENCODER_TOOL", desc: "Encoder/decoder" },
    { name: "mainul-x-encoder", url: "https://github.com/M41NUL/mainul-x-encoder", desc: "Text encoder" },
    { name: "mainul.9-10.id-cloner", url: "https://github.com/M41NUL/mainul.9-10.id-cloner", desc: "ID cloner" }
];

// ========== Contact Data ==========
const contacts = [
    { icon: 'fab fa-github', name: 'GitHub', value: '@M41NUL', url: 'https://github.com/m41nul', color: 'github' },
    { icon: 'fab fa-facebook-f', name: 'Facebook', value: 'MAINUL ISLAM', url: 'https://facebook.com/mainulxhy', color: 'facebook' },
    { icon: 'fab fa-facebook', name: 'FB Page', value: 'SOCINEST - X', url: 'https://facebook.com/socinestx', color: 'facebook' },
    { icon: 'fab fa-facebook-messenger', name: 'Messenger', value: 'MD. MAINUL ISLAM', url: 'https://m.me/mdmainulislaminfo', color: 'messenger' },
    { icon: 'fab fa-instagram', name: 'Instagram', value: 'MAINUL ISLAM', url: 'https://instagram.com/mainul_xhy', color: 'instagram' },
    { icon: 'fab fa-instagram', name: 'IG Business', value: 'SOCINEST - X', url: 'https://instagram.com/socinestx', color: 'instagram' },
    { icon: 'fab fa-telegram', name: 'Telegram', value: 'MD. MAINUL ISLAM', url: 'https://t.me/mdmainulislaminfo', color: 'telegram' },
    { icon: 'fab fa-whatsapp', name: 'WhatsApp', value: '01308850528', url: 'https://wa.me/8801308850528', color: 'whatsapp' },
    { icon: 'fab fa-whatsapp', name: 'WhatsApp Business', value: '01571586157', url: 'https://wa.me/8801571586157', color: 'whatsapp' },
    { icon: 'fas fa-envelope', name: 'Email', value: 'githubmainul@gmail.com', url: 'mailto:githubmainul@gmail.com', color: 'email' },
    { icon: 'fas fa-envelope', name: 'Email 2', value: 'devmainulislam@gmail.com', url: 'mailto:devmainulislam@gmail.com', color: 'email' }
];

// ========== DOM Content Loaded ==========
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    loadContactGrid();
    setupTypingEffect();
    setupTestimonialSlider();
    setupCopyFeature();
    setupTabScroll();
    setupSettingsDropdown();
    setupFileInput();
    setupChatbot();
    setupChatFunctions(); // New function added
});

// ========== Load Projects ==========
function loadProjects() {
    const container = document.getElementById('projectsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    projects.slice(0, 12).forEach(project => {
        const displayName = project.name.replace(/-/g, ' ');
        const projectCard = document.createElement('a');
        projectCard.href = project.url;
        projectCard.target = '_blank';
        projectCard.className = 'project-item';
        projectCard.innerHTML = `
            <i class="fab fa-github"></i>
            <div class="project-info">
                <h4>${displayName}</h4>
                <p>${project.desc}</p>
            </div>
            <i class="fas fa-external-link-alt"></i>
        `;
        container.appendChild(projectCard);
    });
}

// ========== Load Contact Grid ==========
function loadContactGrid() {
    const container = document.getElementById('contactGrid');
    if (!container) return;
    
    container.innerHTML = '';
    contacts.forEach(contact => {
        const card = document.createElement('a');
        card.href = contact.url;
        card.target = '_blank';
        card.className = 'contact-card-modern';
        card.innerHTML = `
            <div class="contact-icon-modern ${contact.color}">
                <i class="${contact.icon}"></i>
            </div>
            <div class="contact-info-modern">
                <h4>${contact.name}</h4>
                <p>${contact.value}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// ========== Typing Effect ==========
function setupTypingEffect() {
    const typingElement = document.getElementById('typingEffect');
    if (!typingElement) return;
    
    const professions = [
        'Cyber Security Specialist',
        'Digital Marketing Expert',
        'Termux Tools Developer',
        'Social Media Agency Owner',
        'Programmer'
    ];
    
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentProfession = professions[professionIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentProfession.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentProfession.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentProfession.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
            setTimeout(typeEffect, 500);
        } else {
            setTimeout(typeEffect, isDeleting ? 50 : 100);
        }
    }
    
    setTimeout(typeEffect, 500);
}

// ========== Testimonial Slider ==========
function setupTestimonialSlider() {
    const dots = document.querySelectorAll('.slider-dots .dot');
    const cards = document.querySelectorAll('.testimonial-card');
    if (!dots.length || !cards.length) return;
    
    let currentSlide = 0;
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            cards[i].classList.add('active');
            dot.classList.add('active');
            currentSlide = i;
        });
    });
    
    setInterval(() => {
        currentSlide = (currentSlide + 1) % cards.length;
        cards.forEach(c => c.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        cards[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }, 5000);
}

// ========== Copy Feature ==========
function setupCopyFeature() {
    document.querySelectorAll('.copy-text').forEach(el => {
        el.addEventListener('click', () => {
            const text = el.dataset.copy;
            navigator.clipboard.writeText(text);
            
            const original = el.innerHTML;
            el.innerHTML = '✓ Copied!';
            
            setTimeout(() => {
                el.innerHTML = original;
            }, 1500);
        });
    });
}

// ========== Tab Scroll Active ==========
function setupTabScroll() {
    const sections = document.querySelectorAll('section');
    const tabItems = document.querySelectorAll('.tab-item');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        tabItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
    
    tabItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ========== Settings Dropdown with Rotate ==========
function setupSettingsDropdown() {
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsMenu = document.getElementById('settingsMenu');
    
    if (!settingsToggle || !settingsMenu) return;
    
    settingsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        
        settingsToggle.classList.add('rotate');
        setTimeout(() => {
            settingsToggle.classList.remove('rotate');
        }, 500);
        
        settingsMenu.classList.toggle('show');
    });
    
    document.addEventListener('click', (e) => {
        if (!settingsToggle.contains(e.target) && !settingsMenu.contains(e.target)) {
            settingsMenu.classList.remove('show');
        }
    });
    
    document.getElementById('darkModeToggle')?.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const icon = document.querySelector('#darkModeToggle i');
        icon.className = document.body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
        settingsMenu.classList.remove('show');
    });
    
    document.getElementById('languageToggle')?.addEventListener('click', () => {
        alert('Language feature coming soon!');
        settingsMenu.classList.remove('show');
    });
    
    document.getElementById('profileBtn')?.addEventListener('click', () => {
        alert('Profile section coming soon!');
        settingsMenu.classList.remove('show');
    });
    
    document.getElementById('themeDropdown')?.addEventListener('click', () => {
        alert('Theme options coming soon!');
        settingsMenu.classList.remove('show');
    });
    
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        alert('Logged out (Demo)');
        settingsMenu.classList.remove('show');
    });
}

// ========== File Input - Show Selected File Name ==========
function setupFileInput() {
    const fileInput = document.getElementById('fileInput');
    const fileNameSpan = document.querySelector('.file-name');
    
    if (fileInput && fileNameSpan) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileNameSpan.textContent = this.files[0].name;
            } else {
                fileNameSpan.textContent = 'No file chosen';
            }
        });
    }
}

// ========== Chatbot Toggle Function ==========
function setupChatbot() {
    const toggle = document.getElementById('chatbotToggle');
    const container = document.getElementById('chatbotContainer');
    const closeBtn = document.getElementById('closeChat');
    
    if (!toggle || !container) {
        console.error('Chatbot elements not found!');
        return;
    }
    
    console.log('✅ Chatbot initialized');
    
    toggle.addEventListener('click', function() {
        console.log('Chatbot clicked');
        container.classList.toggle('open');
        
        // Show welcome message if first time
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages && chatMessages.children.length === 0) {
            showWelcomeMessage();
        }
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            container.classList.remove('open');
        });
    }
    
    document.addEventListener('click', function(e) {
        if (container.classList.contains('open') && 
            !container.contains(e.target) && 
            !toggle.contains(e.target)) {
            container.classList.remove('open');
        }
    });
}

// ========== Chat Functions ==========
function setupChatFunctions() {
    const sendBtn = document.getElementById('sendMessage');
    const userInput = document.getElementById('userInput');
    
    if (sendBtn && userInput) {
        sendBtn.addEventListener('click', sendUserMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendUserMessage();
        });
    }
}

function showWelcomeMessage() {
    addMessage('bot', '👋 Hi! I\'m MAINUL-X Helper. How can I help you today?');
}

async function sendUserMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage('user', message);
    input.value = '';
    
    showTypingIndicator();
    
    try {
        // Call chatbot.js processMessage function
        if (typeof processMessage === 'function') {
            const reply = await processMessage(message);
            removeTypingIndicator();
            addMessage('bot', reply);
        } else {
            removeTypingIndicator();
            addMessage('bot', '⚠️ Chatbot not loaded properly.');
        }
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        addMessage('bot', '😔 Sorry, something went wrong.');
    }
}

function addMessage(sender, text) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingDiv = document.getElementById('typingIndicator');
    if (typingDiv) typingDiv.remove();
}

// ========== Home Icon Click ==========
document.querySelector('.home-icon')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
