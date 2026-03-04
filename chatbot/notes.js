// MAINUL-X Notes - Md. Mainul Islam (M41NUL)

let notes = JSON.parse(localStorage.getItem('chatNotes') || '[]');

function saveNote(title, content) {
    notes.push({
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleString()
    });
    localStorage.setItem('chatNotes', JSON.stringify(notes));
    return '✅ Note saved!';
}

function getNotes() {
    if (notes.length === 0) return '📝 No notes yet';
    
    let output = '📝 **Your Notes:**\n\n';
    notes.slice(-5).forEach(n => {
        output += `📌 **${n.title}**\n${n.content.substring(0, 50)}...\n\n`;
    });
    return output;
}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem('chatNotes', JSON.stringify(notes));
}

window.saveNote = saveNote;
window.getNotes = getNotes;
console.log('✅ Notes loaded');
