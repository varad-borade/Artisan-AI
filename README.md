🎨 Artisan AI
A web-based creative partner that empowers local artisans to thrive in the digital marketplace. This application uses Google's Generative AI to provide visual inspiration, content creation, and social media assistance.

Live Demo: https://varad-borade.github.io/Artisan-AI/

🚀 Core Features
Visual Muse: Generates unique, AI-powered images of product ideas based on current market trends.

Storyteller: Crafts compelling product descriptions and brand stories from simple user inputs.

Social Media Guru: Creates platform-specific (Instagram, Facebook) posts from a product photo, complete with engaging captions and trending hashtags.

Ease of Use: Features a simple, intuitive interface with one-click "Copy to Clipboard" functionality.

🛠️ Technologies Used
Frontend: HTML, Tailwind CSS, JavaScript

AI Models:

Google Gemini 2.5 Flash (Text, Analysis, JSON)

Google Gemini 2.0 Flash (Image Generation)

Deployment: GitHub Pages

📂 Project Structure
Artisan-AI/
└── index.html    # A single, self-contained file with all HTML, CSS, and JavaScript.

📌 How It Works
Visual Muse: The user selects a craft type (e.g., "Pottery"). The app calls the Gemini API to generate two trending design ideas in a structured JSON format. It then uses the image prompts from the JSON to call the image generation API, displaying the final visual concepts to the user.

Storyteller: The user enters their brand name, craft type, and inspiration. This information is sent to the Gemini API in a grounded prompt to generate a short, professional product description.

Social Media Guru: The user uploads a product photo and selects a social media platform. The app sends the image and a detailed prompt to the Gemini API's multimodal endpoint, which analyzes the image and generates a tailored post.

🧑‍💻 Example Interaction
Visual Muse in Action:
An artisan selects "Jewelry Making" and receives two visual concepts for trending necklace designs.

Social Media Guru Output:
An artisan uploads a photo of a ceramic vase and gets a ready-to-use Instagram post.

Bringing a touch of earthy elegance to your space. ✨ This handcrafted ceramic vase, with its beautiful matte finish and minimalist form, is a testament to the beauty of slow, intentional craftsmanship. Each piece is shaped and glazed by hand, making it truly one-of-a-kind.

Perfect for holding fresh blooms or as a standalone statement piece! DM us to make it yours. 💌

#CeramicArt #HandmadePottery #ArtisanMade #SupportLocalArtisans #HomeDecor #MadeInIndia

📄 License
This project is open-source and available under the MIT License.
