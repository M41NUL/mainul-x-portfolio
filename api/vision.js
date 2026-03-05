// api/vision.js
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { image } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;  // একই API key
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: "Describe this image briefly" },
                            { inlineData: { mimeType: "image/jpeg", data: image } }
                        ]
                    }]
                })
            }
        );
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return res.status(200).json(data);
        }
        
        return res.status(200).json({ 
            candidates: [{ 
                content: { 
                    parts: [{ text: "📸 Image received! But couldn't analyze." }] 
                } 
            }] 
        });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
