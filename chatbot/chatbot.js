async function askGemini(message) {

  try {

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message
      })
    });

    const data = await response.json();

    console.log("AI Response:", data);

    if (data.candidates && data.candidates.length > 0) {

      const text = data.candidates[0]?.content?.parts?.[0]?.text;

      if (text) return text;

    }

    return "⚠️ AI returned empty response.";

  } catch (error) {

    console.error("Chatbot Error:", error);

    return "😔 AI connection error.";

  }

}
