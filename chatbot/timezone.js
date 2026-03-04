// MAINUL-X Timezone - Md. Mainul Islam (M41NUL)

function getLocalTime() {
    const now = new Date();
    return `🕐 Local time: ${now.toLocaleTimeString()}, ${now.toLocaleDateString()}`;
}

function getTimeIn(city) {
    const timezones = {
        'dhaka': 'Asia/Dhaka',
        'london': 'Europe/London',
        'newyork': 'America/New_York',
        'tokyo': 'Asia/Tokyo',
        'dubai': 'Asia/Dubai'
    };
    
    const tz = timezones[city.toLowerCase()];
    if (!tz) return '❌ City not found';
    
    const time = new Date().toLocaleString('en-US', { timeZone: tz });
    return `🕐 ${city}: ${time}`;
}

window.getLocalTime = getLocalTime;
window.getTimeIn = getTimeIn;
console.log('✅ Timezone loaded');
