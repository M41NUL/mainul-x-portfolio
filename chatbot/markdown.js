// MAINUL-X Markdown Parser - Md. Mainul Islam (M41NUL)

function parseMarkdown(text) {
    if (!text) return '';
    
    // Bold: **text** or __text__
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic: *text* or _text_
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Inline code: `text`
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Lists: - item or * item
    text = text.replace(/^- (.*)/gm, '• $1');
    text = text.replace(/^\* (.*)/gm, '• $1');
    
    // Numbered lists: 1. item
    text = text.replace(/^\d+\. (.*)/gm, '<span class="list-number">$1</span>');
    
    // Links: [text](url)
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Headers: # H1, ## H2, ### H3
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Blockquotes: > text
    text = text.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // Line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

window.parseMarkdown = parseMarkdown;

console.log('✅ Markdown parser loaded');
