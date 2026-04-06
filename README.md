🎨 ToneTailor (Digital Color Analyst)
📌 Project Overview
ToneTailor is an open-source, full-stack application built entirely within GitHub Codespaces via "Vibe Coding." It functions as a Digital Color Analyst, replicating the logic and terminology used by professional fashion designers and personal stylists.

By analyzing a user's face via an uploaded photo or a live webcam feed, the application extracts the dominant skin tone, translates it into a stylish, industry-standard name (e.g., "Warm Espresso", "Golden Honey"), calculates the undertone, and provides an interactive "Suit me up!" experience to reveal a curated, color-matched clothing palette.

✨ Core Features
Dual Input Modes: Users can upload a high-resolution photo taken in natural sunlight or use their device's live web camera.

Intelligent Skin Tone Detection: Utilizes Python-based image processing to extract the dominant hex color code of the user's skin.

The "Designer" Dictionary: Dynamically translates raw hex codes into stylish, human-readable color names for both skin tones and clothing recommendations.

Undertone Classification: Mathematical logic determines if the extracted hex code falls into a Warm, Cool, or Neutral spectrum based on RGB differentials.

Interactive "Suit Me Up" Experience: A gamified UI reveal that hides the final clothing palette until the user is ready to see their custom results.

🛠️ Technology Stack
Frontend: React (Vite), Tailwind CSS, react-webcam, Axios.

Backend: FastAPI, Python, ColorThief, Hugging Face transformers (ViT Image Classification).

Infrastructure: GitHub Codespaces (cloud-native development environment).

🚀 How It Works (The Pipeline)
Capture: The React frontend captures a base64 image via the webcam or file upload.

Convert: The image is mathematically converted into a standard binary File object to satisfy strict API requirements.

Analyze: FastAPI receives the payload, runs it through a Vision Transformer model (google/vit-base-patch16-224) to verify content, and uses ColorThief to extract the primary hex palette.

Style: The React UI ingests the primary hex, calculates the undertone, assigns a stylish fashion name, and maps it to a recommended clothing palette (e.g., Jewel Tones, Earth Tones).

🔮 Roadmap & Future Scope
Phase 2 (Smart Cropping): Implement a Python-based Face Detection library to auto-crop the image prior to analysis. This will prevent background colors (like a brightly painted wall) from skewing the ColorThief skin tone extraction.

Phase 3 (Fashion LLM): Integrate a Multimodal LLM API (like Google Gemini) to generate dynamic, paragraph-length style advice based on the detected palette.

Phase 4 (Deployment): Migrate the architecture from GitHub Codespaces to live production servers (e.g., Vercel for the React frontend, Render for the FastAPI backend).