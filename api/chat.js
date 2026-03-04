export default async function handler(req, res) {
  const { message } = req.body;
  
  // ১. প্রথমে Gemini AI চেষ্টা করবে
  try {
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
    });
    const geminiData = await geminiRes.json();
    if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ reply: geminiData.candidates[0].content.parts[0].text });
    }
  } catch (err) { console.log("Gemini failed, switching to Groq..."); }

  // ২. Gemini ফেইল করলে Groq AI চেষ্টা করবে
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [{ role: "user", content: message }]
      })
    });
    const groqData = await groqRes.json();
    if (groqData.choices?.[0]?.message?.content) {
      return res.status(200).json({ reply: groqData.choices[0].message.content });
    }
  } catch (err) { console.log("Both APIs failed."); }

  res.status(500).json({ error: "Both AI services are down." });
}
