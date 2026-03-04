/*
============================================
MAINUL-X Portfolio - Telegram Reports System
============================================
Author  : Md. Mainul Islam (MAINUL-X)
GitHub  : https://github.com/M41NUL
Telegram: @mdmainulislaminfo
WhatsApp: +8801308850528
Email   : githubmainul@gmail.com
============================================
This file handles report submissions and
sends them directly to Telegram bot.
Created : March 2026
Version : 1.0
============================================
*/

const BOT_TOKEN = '8213501580:AAEg5hiXlVkeaHarTgVNWTKBytJnOP6hNEw';
const YOUR_CHAT_ID = '8279574441';

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

document.getElementById('reportForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    sendReportWithFile(name, email, message, file);
});
