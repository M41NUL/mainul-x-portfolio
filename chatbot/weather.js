// MAINUL-X Weather - Md. Mainul Islam (M41NUL)

async function getWeather(city) {
    try {
        // Note: You need a free API key from OpenWeatherMap
        const API_KEY = 'YOUR_API_KEY'; // Get from https://openweathermap.org/api
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) throw new Error('City not found');
        
        const data = await response.json();
        return `🌤️ **${data.name} Weather**\n` +
               `🌡️ Temp: ${data.main.temp}°C\n` +
               `💧 Humidity: ${data.main.humidity}%\n` +
               `💨 Wind: ${data.wind.speed} m/s\n` +
               `☁️ ${data.weather[0].description}`;
               
    } catch (error) {
        return '❌ Weather service unavailable. Get API key from openweathermap.org';
    }
}

window.getWeather = getWeather;
console.log('✅ Weather loaded');
