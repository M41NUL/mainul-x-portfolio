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
    { icon: 'fab fa-facebook-messenger', name: 'Messenger', value: 'MD. MAINUL ISLAM', url: 'https://m.me/mainulxhy', color: 'messenger' },
    { icon: 'fab fa-instagram', name: 'Instagram', value: 'MAINUL ISLAM', url: 'https://instagram.com/mainul_xhy', color: 'instagram' },
    { icon: 'fab fa-instagram', name: 'IG Business', value: 'SOCINEST - X', url: 'https://instagram.com/socinestx', color: 'instagram' },
    { icon: 'fab fa-telegram', name: 'Telegram', value: 'MD. MAINUL ISLAM', url: 'https://t.me/mdmainulislaminfo', color: 'telegram' },
    { icon: 'fab fa-whatsapp', name: 'WhatsApp', value: '01308850528', url: 'https://wa.me/8801308850528', color: 'whatsapp' },
    { icon: 'fab fa-whatsapp', name: 'WhatsApp Business', value: '01571586157', url: 'https://wa.me/8801571586157', color: 'whatsapp' },
    { icon: 'fas fa-envelope', name: 'Email', value: 'githubmainul@gmail.com', url: 'mailto:githubmainul@gmail.com', color: 'email' },
    { icon: 'fas fa-envelope', name: 'Email 2', value: 'devmainulislam@gmail.com', url: 'mailto:devmainulislam@gmail.com', color: 'email' }
];

// ========== Posts Data ==========
const posts = [
    {
        title: "YTP",
        content: "YTP - YouTube Video & Audio Downloader.",
        image: "https://raw.githubusercontent.com/M41NUL/YTP/main/screenshots/ytp-main-menu.png",
        url: "https://github.com/M41NUL/YTP"
    },
    {
        title: "TITAN-X BOMBER",
        content: "SMS bomber tool for Termux & Linux.",
        image: "https://github.com/M41NUL/titan-x-bomber/blob/main/screenshots/attack_result.jpg?raw=true",
        url: "https://github.com/M41NUL/titan-x-bomber"
    },
    {
        title: "QR Code Generator",
        content: "Generate QR codes for text, URLs, and numbers.",
        image: "https://github.com/M41NUL/QR-CODE-GENERATOR/blob/main/screenshots/Screenshot_20260213-110231.jpg?raw=true",
        url: "https://m41nul.github.io/QR-CODE-GENERATOR/"
    },
    {
        title: "Social Downloader Pro",
        content: "Download videos from TikTok, Facebook, and Instagram.",
        image: "https://raw.githubusercontent.com/M41NUL/social-server-bd/main/assets/Screenshot_20260212-021151.jpg",
        url: "https://m41nul.github.io/social-server-bd/"
    },
    {
        title: "Internet Speed Meter",
        content: "Check your internet speed with live stats.",
        image: "https://github.com/M41NUL/internet-speed-meter/blob/main/1st%20ss.jpg?raw=true",
        url: "https://github.com/M41NUL/internet-speed-meter"
    },
    {
        title: "MAINUL-X Encoder",
        content: "Encode and decode text with multiple formats.",
        image: "https://raw.githubusercontent.com/M41NUL/mainul-x-encoder/main/Screenshot_2025-05-07-02-40-06-522_com.termux.jpg",
        url: "https://github.com/M41NUL/mainul-x-encoder"
    },
    {
        title: "Live Code Runner",
        content: "Write and test HTML, CSS, and JavaScript in real-time.",
        image: "https://raw.githubusercontent.com/M41NUL/live-code-runner/main/image/HTML.jpg",
        url: "https://m41nul.github.io/live-code-runner/"
    }
];

// ========== Load Posts Function ==========
function loadPosts() {
    const postsGrid = document.getElementById('postsGrid');
    if (!postsGrid) return;
    
    postsGrid.innerHTML = '';
    
    posts.forEach(post => {
        const postCard = document.createElement('article');
        postCard.className = 'post-card';
        
        postCard.innerHTML = `
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=' + encodeURIComponent('${post.title}')">
            </div>
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-description">${post.content}</p>
                <a href="${post.url}" target="_blank" class="post-link">
                    View Project <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        postsGrid.appendChild(postCard);
    });
}


// ========== DOM Content Loaded ==========
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    loadContactGrid();
    loadPosts();
    setupTypingEffect();
    setupTestimonialSlider();
    setupCopyFeature();
    setupTabScroll();
    setupSettingsDropdown();
    setupFileInput();

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

// ========== Home Icon Click ==========
document.querySelector('.home-icon')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
