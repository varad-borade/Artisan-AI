// This is the final, complete Vercel Serverless Function.
// It handles all three features: Visual Muse, Storyteller, and the multi-step Marketplace Assistant.

module.exports = async (req, res) => {
    // Standard CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { return res.status(200).end(); }
    if (req.method !== 'POST') { return res.status(405).json({ error: 'Method Not Allowed' }); }

    try {
        const { endpoint, prompt, model, jsonResponse, action, mimeType, base64Data } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) { return res.status(500).json({ error: 'API key is not configured.' }); }
        
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
        } else if (endpoint === 'marketplace') {
            const multiModalModel = 'gemini-2.5-flash-preview-05-20';
            const imageModelForEnhance = 'gemini-2.0-flash-preview-image-generation';

            if (action === 'enhancePhoto') {
                googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${imageModelForEnhance}:generateContent?key=${apiKey}`;
                const enhancePrompt = `Analyze the user-uploaded image of a handcrafted product. Your task is to generate a new, professional product photo of the item on a clean, minimalist, studio-lit white background. The new image should be photorealistic and appealing for an e-commerce marketplace.`;
                payload = {
                    contents: [{ parts: [{ text: enhancePrompt }, { inlineData: { mimeType, data: base64Data } }] }],
                    // Corrected based on the error message.
                    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
                    model: `models/${imageModelForEnhance}`
                };

                const googleApiResponse = await fetch(googleApiUrl, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
                });

                if (!googleApiResponse.ok) { 
                    const errorText = await googleApiResponse.text();
                    console.error("Enhance photo API error:", errorText);
                    throw new Error(`Photo enhancement failed.`); 
                }
                const responseData = await googleApiResponse.json();
                const enhancedImage = responseData?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
                
                if (enhancedImage) {
                    return res.status(200).json({ enhancedImage: `data:image/png;base64,${enhancedImage}` });
                } else {
                    if (responseData?.promptFeedback?.blockReason) {
                        console.error("Enhance photo blocked for safety reasons:", responseData.promptFeedback.blockReason);
                        throw new Error("The image could not be created due to safety policies.");
                    }
                    throw new Error("Image enhancement failed to produce an image.");
                }

            } else if (action === 'generateListing') {
                 googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${multiModalModel}:generateContent?key=${apiKey}`;
                 const listingPrompt = `Analyze the provided image of a handcrafted product. Your task is to generate a complete marketplace listing. The response must be a valid JSON object with the following keys: "title" (a short, catchy title), "description" (a warm, detailed 100-word description), "price" (a suggested price range in INR, e.g., "₹1,500 - ₹2,000"), and "tags" (a comma-separated string of 5-7 relevant keywords).`;
                 payload = {
                    contents: [{ parts: [{ text: listingPrompt }, { inlineData: { mimeType, data: base64Data } }] }],
                    generationConfig: { responseMimeType: "application/json" }
                 };
                 
                 const googleApiResponse = await fetch(googleApiUrl, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
                 });
                if (!googleApiResponse.ok) { throw new Error(await googleApiResponse.text()); }
                const responseData = await googleApiResponse.json();
                const listingJsonText = responseData.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
                const listing = JSON.parse(listingJsonText);
                return res.status(200).json({ listing });
            } else {
                 return res.status(400).json({ error: 'Invalid marketplace action specified.' });
            }
        } else {
            return res.status(400).json({ error: 'Invalid endpoint specified.' });
        }
        
        // This part is for 'text' and 'image' endpoints
        const googleApiResponse = await fetch(googleApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!googleApiResponse.ok) {
            const errorBody = await googleApiResponse.text();
            console.error('Google AI API Error:', errorBody);
            return res.status(googleApiResponse.status).json({ error: `Google AI API request failed.` });
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

