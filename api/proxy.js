// This is the final, simplified Vercel Serverless Function.
// Its only job is to securely pass requests from the frontend to the Google AI.
// All intelligence (security, topic focus) is now handled by the prompt in index.html.

module.exports = async (req, res) => {
    // Standard CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { endpoint, prompt, model, jsonResponse } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API key is not configured on the server.' });
        }
        
        let googleApiUrl;
        let payload;
        
        if (endpoint === 'text') {
            googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            payload = { contents: [{ parts: [{ text: prompt }] }] };
            if (jsonResponse) {
                payload.generationConfig = { responseMimeType: "application/json" };
            }
        } else if (endpoint === 'image') {
            const imageModel = 'gemini-2.0-flash-preview-image-generation';
            googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${imageModel}:generateContent?key=${apiKey}`;
            payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
                model: `models/${imageModel}`
            };
        } else {
            return res.status(400).json({ error: 'Invalid endpoint specified.' });
        }
        
        const googleApiResponse = await fetch(googleApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!googleApiResponse.ok) {
            const errorBody = await googleApiResponse.text();
            console.error('Google AI API Error:', errorBody);
            return res.status(googleApiResponse.status).json({ error: `Google AI API request failed: ${errorBody}` });
        }

        const responseData = await googleApiResponse.json();
        
        if (jsonResponse && responseData.candidates && responseData.candidates[0].content.parts[0].text) {
             try {
                const rawText = responseData.candidates[0].content.parts[0].text;
                const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsedJson = JSON.parse(jsonText);
                return res.status(200).json(parsedJson);
            } catch(e) {
                console.error("Failed to parse JSON from AI response:", responseData.candidates[0].content.parts[0].text, e);
                return res.status(500).json({ error: "AI returned invalid JSON."});
            }
        }

        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error in Vercel function:', error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

