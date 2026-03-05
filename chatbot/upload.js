// MAINUL-X Image Upload Handler
// Author: Md. Mainul Islam

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileUpload');
    if (!fileInput) return;
    
    fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        
        // Show preview
        const reader = new FileReader();
        reader.onload = async function(ev) {
            // Display image in chat
            addImageMessage(ev.target.result, 'user');
            
            // Show typing indicator
            showTypingIndicator();
            
            // Analyze with AI
            const reply = await analyzeImage(ev.target.result.split(',')[1]);
            
            removeTypingIndicator();
            addMessage(reply, 'bot');
        };
        reader.readAsDataURL(file);
        
        // Clear input
        fileInput.value = '';
    });
});

// Add image message to chat
function addImageMessage(imageData, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const msgId = ++window.messageId || 1;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.dataset.id = msgId;
    
    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    // Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper';
    
    // Image content
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<img src="${imageData}" alt="Uploaded image" style="max-width:200px; border-radius:10px;">`;
    
    // Time
    const time = document.createElement('div');
    time.className = 'message-time';
    const now = new Date();
    time.innerHTML = `<i class="fas fa-clock"></i> ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    wrapper.appendChild(content);
    wrapper.appendChild(time);
    
    if (sender === 'bot') {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(wrapper);
    } else {
        messageDiv.appendChild(wrapper);
        messageDiv.appendChild(avatar);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Analyze image with Gemini Vision API
async function analyzeImage(base64Image) {
    try {
        const response = await fetch('/api/vision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image })
        });
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }
        
        return "📸 Image received! But I couldn't analyze it.";
        
    } catch (error) {
        console.error('Vision API error:', error);
        return "😔 Sorry, couldn't analyze the image.";
    }
}

// Make functions global
window.addImageMessage = addImageMessage;
window.analyzeImage = analyzeImage;

console.log('✅ Image upload handler loaded');
