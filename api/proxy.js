// This is the final, complete, and robust Vercel Serverless Function.
// It includes the final bug fix to apply the "Prime Directive" to the Marketplace Assistant.

// Helper function for making API calls with retry logic
async function fetchWithRetry(url, options, retries = 3, initialDelay = 1000) {
    let delay = initialDelay;
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.status === 503 && i < retries - 1) {
                console.warn(`Attempt ${i + 1}: Model overloaded (503). Retrying in ${delay / 1000}s...`);
                await new Promise(res => setTimeout(res, delay));
                delay *= 2; 
                continue; 
            }
            return response;
        } catch (error) {
             if (i < retries - 1) {
                 console.warn(`Attempt ${i + 1}: Network error. Retrying in ${delay / 1000}s...`);
                 await new Promise(res => setTimeout(res, delay));
                 delay *= 2;
                 continue;
            }
            throw error;
        }
    }
}


// The main handler for all incoming requests
module.exports = async (req, res) => {
    // Standard CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { return res.status(200).end(); }
    if (req.method !== 'POST') { return res.status(405).json({ error: 'Method Not Allowed' }); }

    try {
        const { endpoint, prompt, model, jsonResponse, action, mimeType, base64Data, currentDate } = req.body;
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
                    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
                    model: `models/${imageModelForEnhance}`
                };

                const googleApiResponse = await fetchWithRetry(googleApiUrl, {
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
                 const listingPrompt = `Your Prime Directive:
You are Artisan AI, an e-commerce expert for Indian handicrafts. You have one core, unbreakable rule:
1. STAY ON TOPIC: You MUST ONLY analyze images of legitimate arts, crafts, and handmade items. If the user's image is clearly not a handicraft (e.g., a person, a landscape, a random object), you MUST refuse politely. To refuse, your entire response MUST be this exact JSON object: {"error": "This feature is for handcrafted items only."}

Your Task:
If, and only if, the user's image passes the above check, then proceed to your main task: Analyze the product in the image. It is currently ${currentDate} in India. Generate a realistic and fair market price and a social media post.

Your response MUST be a valid JSON object with three keys:
1. "price": A string for a suggested price range in INR (e.g., "₹1,200 - ₹1,500").
2. "price_justification": A single, brief sentence explaining your pricing, considering the item's visible complexity, material, and artistic value.
3. "social_post": A single string containing a warm, engaging social media caption (2-3 paragraphs with 1-3 tasteful emojis) followed by a new line and then a list of 5-7 relevant, trending hashtags, each starting with '#'.`;

                 payload = {
                    contents: [{ parts: [{ text: listingPrompt }, { inlineData: { mimeType, data: base64Data } }] }],
                    generationConfig: { responseMimeType: "application/json" }
                 };
                 
                 const googleApiResponse = await fetchWithRetry(googleApiUrl, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
                 });
                if (!googleApiResponse.ok) { 
                    const errorText = await googleApiResponse.text();
                    console.error("Generate listing API error:", errorText);
                    throw new Error('Could not generate listing details.');
                }
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
        
        // This part is for 'text' and 'image' endpoints that were not caught by the marketplace logic
        const googleApiResponse = await fetchWithRetry(googleApiUrl, {
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

