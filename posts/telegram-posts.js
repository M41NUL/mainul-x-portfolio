const BOT_TOKEN = '8213501580:AAEg5hiXlVkeaHarTgVNWTKBytJnOP6hNEw';
const CHANNEL_USERNAME = '@mainulx_updates';

async function loadTelegramPosts() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
        const data = await response.json();
        
        const container = document.getElementById('postsContainer');
        if (!container) return;
        
        container.innerHTML = `
            <h2 class="section-title" style="margin-bottom: 30px; color: var(--light);">
                <i class="fab fa-telegram" style="color: #0088cc; margin-right: 10px;"></i>
                Telegram Updates
            </h2>
            <div class="posts-grid"></div>
        `;
        
        const postsGrid = container.querySelector('.posts-grid');
        const messages = data.result || [];
        const posts = [];
        
        for (let msg of messages) {
            if (msg.channel_post && msg.channel_post.chat.username === CHANNEL_USERNAME.replace('@', '')) {
                posts.push({
                    text: msg.channel_post.text || msg.channel_post.caption || '',
                    date: new Date(msg.channel_post.date * 1000),
                    message_id: msg.channel_post.message_id,
                    hasPhoto: !!msg.channel_post.photo,
                    hasDocument: !!msg.channel_post.document
                });
            }
        }
        
        if (posts.length === 0) {
            showJoinButton(container);
            return;
        }
        
        const recentPosts = posts.slice(-6).reverse();
        
        for (let post of recentPosts) {
            const lines = post.text.split('\n');
            const title = lines[0].replace('📢', '').trim() || 'New Update';
            const content = lines.slice(1).join('\n').substring(0, 120);
            const postUrl = `https://t.me/${CHANNEL_USERNAME.replace('@', '')}/${post.message_id}`;
            
            const postCard = document.createElement('a');
            postCard.href = postUrl;
            postCard.target = '_blank';
            postCard.className = 'post-card';
            postCard.style.cssText = `
                background: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 15px;
                padding: 20px;
                text-decoration: none;
                color: var(--light);
                transition: all 0.3s ease;
                display: block;
                height: 100%;
            `;
            
            let mediaIcon = '';
            if (post.hasPhoto) {
                mediaIcon = '<span style="color: var(--primary); margin-left: 8px;">📷</span>';
            } else if (post.hasDocument) {
                mediaIcon = '<span style="color: var(--secondary); margin-left: 8px;">📎</span>';
            }
            
            postCard.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <i class="fab fa-telegram" style="color: #0088cc; font-size: 20px;"></i>
                    <span style="color: var(--gray); font-size: 12px;">${post.date.toLocaleDateString()}</span>
                </div>
                <h3 style="color: var(--light); font-size: 18px; margin-bottom: 10px; display: flex; align-items: center;">
                    ${title} ${mediaIcon}
                </h3>
                <p style="color: var(--gray); font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
                    ${content}...
                </p>
                <div style="color: var(--primary); font-size: 13px; display: flex; align-items: center; gap: 5px;">
                    Read more <i class="fas fa-arrow-right" style="font-size: 12px;"></i>
                </div>
            `;
            
            postCard.onmouseover = () => {
                postCard.style.transform = 'translateY(-5px)';
                postCard.style.borderColor = 'var(--primary)';
                postCard.style.boxShadow = 'var(--shadow)';
            };
            
            postCard.onmouseout = () => {
                postCard.style.transform = 'translateY(0)';
                postCard.style.borderColor = 'var(--border)';
                postCard.style.boxShadow = 'none';
            };
            
            postsGrid.appendChild(postCard);
        }
        
    } catch (error) {
        console.error('Error:', error);
        showJoinButton(document.getElementById('postsContainer'));
    }
}

function showJoinButton(container) {
    if (!container) return;
    
    container.innerHTML = `
        <h2 class="section-title" style="margin-bottom: 30px; color: var(--light);">
            <i class="fab fa-telegram" style="color: #0088cc; margin-right: 10px;"></i>
            Telegram Updates
        </h2>
        <div style="
            background: var(--card-bg);
            border: 2px dashed var(--border);
            border-radius: 20px;
            padding: 50px 30px;
            text-align: center;
        ">
            <i class="fab fa-telegram" style="font-size: 60px; color: #0088cc; margin-bottom: 20px;"></i>
            <h3 style="color: var(--light); font-size: 24px; margin-bottom: 10px;">Join Our Telegram Channel</h3>
            <p style="color: var(--gray); margin-bottom: 30px;">Get latest updates directly on Telegram</p>
            <a href="https://t.me/${CHANNEL_USERNAME.replace('@', '')}" target="_blank" style="
                display: inline-block;
                padding: 14px 35px;
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                color: white;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 600;
                transition: 0.3s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                <i class="fab fa-telegram"></i> Join @${CHANNEL_USERNAME.replace('@', '')}
            </a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadTelegramPosts);
