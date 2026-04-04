🎨 Digital Color Analyst (Human Skin Tone Analyzer)

📌 Project Overview
This open-source project is a full-stack, "headless" application built entirely within GitHub Codespaces. It functions as a Digital Color Analyst, replicating the logic used by professional fashion designers.

By analyzing a user's face via an uploaded photo or a live webcam feed, the application detects the primary skin tone, calculates the undertone (Warm, Cool, or Neutral), and recommends a curated clothing color palette that flatters the user's natural complexion.

✨ Core Features (MVP)
Dual Input Modes: Users can upload a photo taken in natural sunlight or use their device's live web camera.

Intelligent Skin Tone Detection: Utilizes Python-based image processing to extract the dominant hex color code of the user's skin (currently mapping face color as the primary body tone).

Undertone Classification: Mathematical logic determines if the extracted hex code falls into a Warm, Cool, or Neutral spectrum based on RGB values.

Designer Recommendations: Generates a visually appealing UI of clothing color swatches (e.g., Jewel Tones, Earth Tones) customized to the user's specific complexion.

🛠️ Technology Stack
Frontend: React (Vite), Tailwind CSS, react-webcam, Axios.

Backend: FastAPI, Python, ColorThief, Hugging Face transformers (ViT Image Classification).

Infrastructure: GitHub Codespaces (fully cloud-native development).

🚀 Current Progress & Developer Notes
Backend: The FastAPI engine is fully operational. The /analyze endpoint successfully ingests image bytes, runs them through the google/vit-base-patch16-224 model, extracts dominant hex codes via ColorThief, and returns a structured JSON payload.

Frontend: The React UI is scaffolded with Tailwind styling. The live camera component is integrated and successfully captures base64 images. Designer logic (hex-to-undertone mapping) is drafted.

Current Blocker (Next Action): Debugging a 422 Unprocessable Entity error during the Frontend-to-Backend handoff. The base64 webcam capture needs to be correctly converted to a JavaScript File object and perfectly matched to FastAPI's expected FormData key before the Axios POST request succeeds.

🔮 Future Scope
Implement a Python-based Face Detection library to auto-crop the image, preventing background colors (like a green wall) from skewing the skin tone analysis.

Expand the MVP to detect and analyze full-body lighting and complexions.

Integrate a Multimodal LLM API (like Google Gemini) for deeper, AI-driven fashion descriptions.