// This is a Vercel Serverless Function, which acts as our secure proxy.
const fetch = require('node-fetch');

// The main handler for all incoming requests
module.exports = async (req, res) => {
    // Set CORS headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight requests for CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { endpoint, prompt, model, base64Data, mimeType } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API key is not configured on the server.' });
        }

        let googleApiUrl;
        let payload;

        if (endpoint === 'text' && model === 'gemini-2.0-flash-preview-image-generation') {
             googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
             payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseModalities: ['IMAGE'] },
            };
        } else if (endpoint === 'text') {
            googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            payload = { 
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            };
        } else if (endpoint === 'multimodal') {
            googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            payload = {
                contents: [{
                    parts: [{ text: prompt }, { inlineData: { mimeType, data: base64Data } }]
                }]
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
        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error in Vercel function:', error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

