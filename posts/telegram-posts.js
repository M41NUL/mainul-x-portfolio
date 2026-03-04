/*
MAINUL-X Portfolio - Telegram Posts
Author: Md. Mainul Islam
*/

const CONFIG = typeof CONFIG !== 'undefined' ? CONFIG : {
    BOT_TOKEN: 'YOUR_TOKEN_HERE',
    CHANNEL_ID: '@mainulx_updates'
};

const BOT_TOKEN = CONFIG.BOT_TOKEN;
const CHANNEL_USERNAME = CONFIG.CHANNEL_ID;

async function loadTelegramPosts() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
        const data = await response.json();
        
        const container = document.getElementById('postsContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="posts-header">
                <h2><i class="fab fa-telegram"></i> Latest Updates</h2>
                <span class="update-time">🔄 ${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="posts-grid"></div>
        `;
        
        const postsGrid = container.querySelector('.posts-grid');
        const messages = data.result || [];
        const posts = [];
        
        for (let msg of messages) {
            if (msg.channel_post && msg.channel_post.chat.username === CHANNEL_USERNAME.replace('@', '')) {
                const post = {
                    text: msg.channel_post.text || msg.channel_post.caption || '',
                    date: new Date(msg.channel_post.date * 1000),
                    message_id: msg.channel_post.message_id,
                    hasPhoto: !!msg.channel_post.photo,
                    hasDocument: !!msg.channel_post.document
                };
                
                if (post.hasPhoto && msg.channel_post.photo) {
                    const photos = msg.channel_post.photo;
                    post.photoFileId = photos[photos.length - 1].file_id;
                }
                
                posts.push(post);
            }
        }
        
        const recentPosts = posts.slice(-6).reverse();
        
        if (recentPosts.length === 0) {
            showJoinButton();
            return;
        }
        
        for (let post of recentPosts) {
            await displayPost(post, postsGrid);
        }
        
    } catch (error) {
        console.error('Error:', error);
        showJoinButton();
    }
}

async function displayPost(post, container) {
    const lines = post.text.split('\n');
    const title = lines[0].replace('📢', '').trim() || 'New Update';
    const content = lines.slice(1).join('\n').substring(0, 150);
    const postUrl = `https://t.me/${CHANNEL_USERNAME.replace('@', '')}/${post.message_id}`;
    
    const postCard = document.createElement('a');
    postCard.href = postUrl;
    postCard.target = '_blank';
    postCard.className = 'post-card';
    
    let mediaHtml = '';
    let mediaType = '';
    
    if (post.hasPhoto && post.photoFileId) {
        try {
            const fileResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${post.photoFileId}`);
            const fileData = await fileResponse.json();
            
            if (fileData.ok) {
                const photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;
                mediaHtml = `<div class="post-media"><img src="${photoUrl}" alt="Post image" loading="lazy"></div>`;
                mediaType = '📷 Photo';
            }
        } catch (error) {
            console.log('Photo load error:', error);
        }
    }
    
    if (post.hasDocument) {
        mediaHtml = '<div class="post-media file"><i class="fas fa-file"></i> <span>Attached File</span></div>';
        mediaType = '📎 File';
    }
    
    const hasGitHub = post.text.includes('github.com');
    
    postCard.innerHTML = `
        ${mediaHtml}
        <div class="post-header">
            <i class="fab fa-telegram"></i>
            <span class="post-date">${post.date.toLocaleDateString()}</span>
        </div>
        <h3 class="post-title">${title}</h3>
        <p class="post-content">${content}...</p>
        <div class="post-badges">
            ${mediaType ? `<span class="media-badge">${mediaType}</span>` : ''}
            ${hasGitHub ? '<span class="github-badge"><i class="fab fa-github"></i> GitHub</span>' : ''}
        </div>
        <div class="post-footer">
            <span class="read-more">Read more <i class="fas fa-arrow-right"></i></span>
        </div>
    `;
    
    container.appendChild(postCard);
}

function showJoinButton() {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="posts-header">
            <h2><i class="fab fa-telegram"></i> Latest Updates</h2>
        </div>
        <div class="join-channel">
            <i class="fab fa-telegram"></i>
            <h3>Join our Telegram Channel</h3>
            <p>Get latest updates with photos and files</p>
            <a href="https://t.me/${CHANNEL_USERNAME.replace('@', '')}" target="_blank" class="telegram-join-btn">
                <i class="fab fa-telegram"></i> Join @${CHANNEL_USERNAME.replace('@', '')}
            </a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadTelegramPosts);
setInterval(loadTelegramPosts, 4 * 60 * 60 * 1000);

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        loadTelegramPosts();
    }
});
