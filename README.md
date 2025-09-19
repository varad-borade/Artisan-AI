# 🎨 Artisan AI – Your Intelligent Partner for Digital Craftsmanship

[![Made with HTML](https://img.shields.io/badge/Made%20with-HTML5-orange)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Powered by Google Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/models/gemini)
[![Deployed with Vercel](https://img.shields.io/badge/Deployed%20with-Vercel-black)](https://vercel.com/)

> ✨ Artisan AI is a comprehensive web platform designed as a digital partner for local artisans. Leveraging **Google's Generative AI**, it empowers creators to **overcome creative blocks**, **break language barriers**, and **effortlessly generate professional, market-ready online content.**

---

## 🚀 Live Demo

Experience Artisan AI in action:
🔗 [**https://artisan-ai-varad-borade.vercel.app/**](https://artisan-ai-five.vercel.app/)

---

## 💡 The Problem Artisan AI Solves

Artisans in India often struggle with:
-   **Creative Blocks:** Staying relevant with market trends.
-   **Language Barriers:** Reaching global audiences with compelling descriptions.
-   **Digital Marketing Complexity:** Creating professional product photos and social media content without technical skills.

Artisan AI provides an intuitive, AI-powered solution for these critical challenges.

---

## ✨ Core Features

Our solution offers three intuitive, AI-powered modules:

1.  🎨 **The Visual Muse:**
    * **What it does:** Generates novel, AI-powered visual concepts for new product designs based on current market trends.
    * **Impact:** Sparks creativity and connects traditional skills with modern aesthetics.

2.  ✍️ **The Storyteller:**
    * **What it does:** Crafts compelling, authentic product descriptions from simple user input, supporting **multilingual voice-to-text** (e.g., Hindi to English).
    * **Impact:** Breaks down language and literacy barriers, enabling broader market reach.

3.  📱 **The Marketplace Assistant:**
    * **What it does:** A seamless, one-click workflow that transforms a raw product photo into a complete, professional social media post.
    * **Key Capabilities:**
        * **AI-Enhanced Photo:** Transforms raw images into studio-quality visuals.
        * **Smart Price Suggestion:** Provides data-driven pricing with justification.
        * **Engaging Social Post:** Generates captivating captions with trending hashtags.
    * **Impact:** Automates digital marketing, saving time and increasing sales potential.

---

## 📸 Screenshots

To illustrate the user experience and feature outputs:

### **1. The Visual Muse - Creative Inspiration**
![Visual Muse Screenshot](https://raw.githubusercontent.com/varad-borade/Artisan-AI/main/assets/screenshots/visual-muse.png)
*A snapshot of the Visual Muse generating fresh design ideas for textiles.*

### **2. The Storyteller - Multilingual Content Generation**
![Storyteller Screenshot](https://raw.githubusercontent.com/varad-borade/Artisan-AI/main/assets/screenshots/storyteller.png)
*Demonstrates converting spoken Hindi input into a professional English product description.*

### **3. The Marketplace Assistant - One-Click Digital Marketing**
![Marketplace Assistant Screenshot - Upload & Enhance](https://raw.githubusercontent.com/varad-borade/Artisan-AI/main/assets/screenshots/marketplace-upload-enhance.png)
*Shows a raw product photo being uploaded and then transformed into an AI-enhanced, ready-for-market image.*

![Marketplace Assistant Screenshot - Price & Social Post](https://raw.githubusercontent.com/varad-borade/Artisan-AI/main/assets/screenshots/marketplace-post-output.png)
*Showcases the intelligent price suggestion with justification and the final, engaging social media post with hashtags.*

---

## 🛠️ Technical Architecture & Technologies Used

### **Architecture Diagram**
![Artisan AI Architecture Diagram](https://raw.githubusercontent.com/varad-borade/Artisan-AI/main/assets/screenshots/architecture-diagram.png)

### **Key Technologies:**

* **Frontend:**
    * **HTML5, Tailwind CSS, Vanilla JavaScript:** For a fast, responsive, and accessible user interface.
    * **Web Speech API:** Powers the critical multilingual voice-to-text functionality.
* **Backend & Deployment:**
    * **Vercel (Serverless Functions):** Secure and scalable hosting with global CDN.
    * **Node.js (`api/proxy.js`):** Acts as a secure intermediary, managing API keys and handling all AI interactions.
* **Core AI Engine (Google Cloud Generative AI):**
    * **Gemini 2.5 Flash:** Utilized for high-speed, multilingual text generation, advanced multimodal analysis, and robust AI safety guardrails.
    * **Gemini 2.0 Flash (Image Generation):** Powers the creation of new, professional, studio-quality product images for the Marketplace Assistant.

---

## ⚙️ How to Run & Deploy

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/varad-borade/Artisan-AI.git](https://github.com/varad-borade/Artisan-AI.git)
    cd Artisan-AI
    ```
2.  **Deploy to Vercel:**
    * Connect your GitHub repository to a new Vercel project.
    * **Crucially:** Add your Google AI Studio API Key as a Vercel Environment Variable named `GEMINI_API_KEY`.
        * *Note: For image generation, ensure your Google Cloud project has billing enabled and the necessary APIs activated.*
3.  **Access Live:** Vercel will automatically build and deploy your application. The live URL will be provided upon successful deployment.

---

## 🛡️ AI Safety and Responsible Development

* **"Prime Directive" Prompting:** The Gemini models are given a robust system prompt to ensure outputs are always on-topic (arts and crafts), helpful to artisans, and resilient against malicious or inappropriate prompt injections.
* **Data Minimization:** We only process the necessary input for AI generation and do not store sensitive user data.
* **Transparency:** The AI's role in content generation is clear to the user.

---

## 📂 Project Structure

ArtisanAI/
├── public/              # Static assets (images, favicon, etc.)
├── api/
│   └── proxy.js         # Secure Node.js serverless function (AI API proxy)
├── index.html           # Main application frontend
├── assets/
├── screenshots/         # Project screenshots for README
└── README.md            # Project documentation

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

## 🤝 Contributing

We welcome contributions! Please feel free to:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature-xyz`).
3.  Commit your changes (`git commit -m 'Add new feature'`).
4.  Push to the branch (`git push origin feature-xyz`).
5.  Submit a Pull Request.
