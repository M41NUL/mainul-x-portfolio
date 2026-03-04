// MAINUL-X Code Highlighter - Md. Mainul Islam (M41NUL)

function highlightCode(text) {
    // Find code blocks with ```language or just ```
    return text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const escaped = escapeHtml(code.trim());
        const language = lang || 'bash';
        return `<pre><code class="language-${language}">${escaped}</code></pre>`;
    });
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

window.highlightCode = highlightCode;

console.log('✅ Code highlighter loaded');
