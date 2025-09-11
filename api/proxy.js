// This is a Vercel Serverless Function, which acts as our secure proxy.
// It is the final, corrected version that handles all features correctly.

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
        const { endpoint, prompt, model, base64Data, mimeType, jsonResponse } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API key is not configured on the server.' });
        }

        let googleApiUrl;
        let payload;

        // Route for Image Generation (Visual Muse)
        if (endpoint === 'text' && model === 'gemini-2.0-flash-preview-image-generation') {
             googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
             payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
                model: `models/${model}`
            };
        // Route for Text Generation (Storyteller and Visual Muse Text Prompt)
        } else if (endpoint === 'text') {
            googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            payload = { 
                contents: [{ parts: [{ text: prompt }] }]
            };
            // This 'if' block is the "training" for our barista.
            // If the frontend sends jsonResponse=true, we tell Google to respond in JSON format.
            if (jsonResponse) {
                payload.generationConfig = { responseMimeType: "application/json" };
            }
        // Route for Multimodal (Social Media Guru)
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

        // This block handles the special JSON response from the Visual Muse text prompt.
        // It parses the nested JSON and sends back the clean result.
        if (jsonResponse) {
            const parsedJson = JSON.parse(responseData.candidates[0].content.parts[0].text);
            return res.status(200).json(parsedJson);
        }

        // For all other requests, it sends the standard response.
        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error in Vercel function:', error.message);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

