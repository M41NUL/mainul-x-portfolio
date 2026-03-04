async function askGemini(message) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();

    // Vercel থেকে আসা ডাটা চেক
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    return "⚠️ AI returned empty response.";
  } catch (error) {
    return "😔 AI connection error.";
  }
}
