// reports/telegram-reports.js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('reportForm');
  const fileInput = document.getElementById('fileInput');
  const fileNameSpan = document.querySelector('.file-name');
  
  // File name display
  if (fileInput && fileNameSpan) {
    fileInput.addEventListener('change', function() {
      fileNameSpan.textContent = this.files[0]?.name || 'No file chosen';
    });
  }
  
  // Form submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      const text = `📢 *New Report*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n💬 *Message:* ${message}`;
      
      const result = await sendTelegramNotification(text);
      
      if (result.ok) {
        alert('✅ Report sent!');
        form.reset();
        if (fileNameSpan) fileNameSpan.textContent = 'No file chosen';
      } else {
        alert('❌ Failed to send report');
      }
    });
  }
});
