// MAINUL-X Telegram Reports - Md. Mainul Islam (M41NUL)

const REPORT_API_URL = "https://mainul-x-portfolio.vercel.app/api/report"; // নতুন API

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reportForm');
    const fileInput = document.getElementById('fileInput');
    const fileNameSpan = document.querySelector('.file-name');
    
    if (fileInput && fileNameSpan) {
        fileInput.addEventListener('change', function() {
            fileNameSpan.textContent = this.files[0]?.name || 'No file chosen';
        });
    }
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !message) {
                alert('Please fill all fields');
                return;
            }
            
            const text = `📢 *New Report*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n💬 *Message:* ${message}\n🕐 *Time:* ${new Date().toLocaleString()}`;
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '⏳ Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(REPORT_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                
                const data = await response.json();
                
                if (data.ok) {
                    alert('✅ Report sent to Telegram!');
                    form.reset();
                    if (fileNameSpan) fileNameSpan.textContent = 'No file chosen';
                } else {
                    alert('❌ Failed to send report');
                }
                
            } catch (error) {
                console.error('Report Error:', error);
                alert('❌ Network error');
                
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

console.log("✅ Telegram reports loaded");
