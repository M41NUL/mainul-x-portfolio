async function askGemini(message) {
  try {

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();

    // ===== Gemini response =====
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    // ===== Groq response =====
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    }

    return "⚠️ AI returned empty response.";

  } catch (error) {

    console.error(error);

    return "😔 AI connection error.";

  }
}
