Artisan AI 🎨
An AI-powered creative partner designed to empower local artisans in the digital marketplace. This project was built for the Google Gen AI Exchange Hackathon.

Live Demo: https://varad-borade.github.io/Artisan-AI/ (Replace 'your-username' with your actual GitHub username)

The Challenge
Indian artisans and craftspeople, rich in traditional skills, often face significant challenges in the modern digital marketplace. A lack of digital marketing skills, limited resources, and the difficulty of bridging traditional craftsmanship with contemporary consumer trends severely restrict their market reach and profitability. This creates a disconnect between valuable, traditional art forms and a wider, digitally-native audience, threatening the sustainability of these crafts.

Our Solution: Artisan AI
Artisan AI is an intuitive web-based toolkit that acts as a creative partner for local artisans. It leverages the power of Google's generative AI to handle the most challenging aspects of digital marketing, allowing artisans to focus on what they do best: creating beautiful art. Our application is designed to be simple, inspiring, and a true real-world utility.

✨ Core Features
Our prototype is built around three powerful, user-centric features:

1. 🔭 The Visual Muse (Visual Trend Spotter)
Provides artisans with actionable, visual inspiration. Instead of just describing trends, it generates concrete design ideas and example images, helping to bridge the gap between traditional techniques and modern aesthetics.

2. ✍️ The Storyteller
Helps artisans craft compelling narratives. By providing a few simple details about their craft and inspiration, it generates beautiful product descriptions and brand stories, giving their work a professional and authentic voice.

3. 📱 The Social Media Guru
Simplifies the most time-consuming part of digital marketing. Artisans can upload a photo of their product, select a social media platform (like Instagram or Facebook), and instantly get a tailored, engaging post complete with an evocative caption, emojis, and relevant, trending hashtags.

🛠️ Technology Stack
This project was built using a modern, scalable, and accessible technology stack:

Frontend: HTML, Tailwind CSS, JavaScript

Generative AI Backend:

Google Gemini 2.5 Flash: For all text generation, multimodal analysis, and structured JSON output.

Google Gemini 2.0 Flash (Image Generation): For creating the inspirational images in the Visual Muse feature.

Deployment: GitHub Pages

🚀 Getting Started (Running Locally)
To run this project on your local machine, follow these steps:

Clone the repository:

git clone https://github.com/your-username/Artisan-AI.git

Get a Google AI API Key:

Visit Google AI Studio and create a free API key.

Important: For the image generation feature to work, you must enable a billing account on your Google Cloud project. You will not be charged, as the usage falls within the free tier, but this is required by Google to enable the image generation APIs.

Add the API Key to the Code:

Open the index.html file in a code editor.

Find the line const API_KEY = ""; at the top of the <script> section.

Paste your API key between the quotation marks.

Run a Local Server:

Navigate to the project folder in your terminal.

Run the following command (requires Python 3):

python -m http.server

Open your browser and go to http://localhost:8000.

🛡️ AI Safety and Responsibility
We built this application with a strong focus on responsible AI principles:

AI Grounding: All AI prompts are heavily "grounded" with specific context, instructions, and user-provided data to ensure outputs are relevant, accurate, and to prevent hallucinations.

Security: The application uses input sanitization to protect against basic prompt injection attacks, and the AI's instructions are designed to reject attempts to misuse it.

Creative Assistance, Not Replacement: We believe AI should be a muse, not a master. Our tool is designed to solve the "blank page" problem and provide a spark of inspiration, while always leaving the true artistry, skill, and soul of the work in the hands of the artisan.
