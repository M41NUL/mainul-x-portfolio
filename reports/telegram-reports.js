/*
MAINUL-X Portfolio - Telegram Reports
Author: Md. Mainul Islam
*/

const CONFIG = typeof CONFIG !== 'undefined' ? CONFIG : {
    BOT_TOKEN: 'YOUR_TOKEN_HERE',
    CHAT_ID: '8279574441'
};

const BOT_TOKEN = CONFIG.BOT_TOKEN;
const YOUR_CHAT_ID = CONFIG.CHAT_ID;

async function sendReportWithFile(name, email, message, file) {
    try {
        const formData = new FormData();
        const caption = `📢 *New Report Received!*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n💬 *Message:* ${message}\n🕐 *Time:* ${new Date().toLocaleString()}`;
        
        if (file) {
            formData.append('chat_id', YOUR_CHAT_ID);
            formData.append('caption', caption);
            formData.append('parse_mode', 'Markdown');
            
            if (file.type.startsWith('image/')) {
                formData.append('photo', file);
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                });
            } else {
                formData.append('document', file);
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
                    method: 'POST',
                    body: formData
                });
            }
        } else {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: YOUR_CHAT_ID,
                    text: caption,
                    parse_mode: 'Markdown'
                })
            });
        }
        
        alert('✅ Report sent to Telegram!');
        document.getElementById('reportForm').reset();
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Failed to send report');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reportForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];
            
            sendReportWithFile(name, email, message, file);
        });
    }
});
