// MAINUL-X API - TEST VERSION
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  try {
    const { message } = req.body;
    
    // সবসময় এই উত্তর দেবে
    return res.status(200).json({
      candidates: [{
        content: {
          parts: [{
            text: `✅ TEST RESPONSE: You said "${message}"`
          }]
        }
      }]
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
