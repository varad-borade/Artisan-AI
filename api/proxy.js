// This is a Vercel Serverless Function, which acts as our secure proxy.

// The main handler for all incoming requests
module.exports = async (req, res) => {
    // Set CORS headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight requests for CORS
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
        
        // For JSON responses from text models, we need to parse the text part
        if (jsonResponse && responseData.candidates && responseData.candidates[0].content.parts[0].text) {
             try {
                const parsedJson = JSON.parse(responseData.candidates[0].content.parts[0].text);
                return res.status(200).json(parsedJson);
            } catch(e) {
                console.error("Failed to parse JSON from AI response:", responseData.candidates[0].content.parts[0].text, e);
                // Return the raw text if it's not valid JSON, to help with debugging.
                return res.status(200).json({ error: "AI returned invalid JSON", rawText: responseData.candidates[0].content.parts[0].text });
            }
        }

        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error in Vercel function:', error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

