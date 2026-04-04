from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import io
from PIL import Image
from colorthief import ColorThief
from transformers import pipeline

app = FastAPI()

# 1. ADDED CORS BACK: Crucial for your React frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows any frontend to connect while in development
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models (This is perfectly placed - loads once into memory at startup)
object_detector = pipeline("object-detection", model="facebook/detr-resnet-50")
# Swapped the restricted model for a standard Google ViT model
image_classifier = pipeline("image-classification", model="google/vit-base-patch16-224")

def get_dominant_colors(image_bytes, color_count=5):
    ct = ColorThief(io.BytesIO(image_bytes))
    palette = ct.get_palette(color_count=color_count)
    hex_colors = ['#{:02x}{:02x}{:02x}'.format(r, g, b) for r, g, b in palette]
    return hex_colors

# Renamed and updated to use the new classifier
def classify_image_content(image):
    results = image_classifier(image)
    # The ViT model returns slightly different labels, so we just grab the top 3
    classifications = [r['label'] for r in results[:3]] 
    return classifications

def detect_shapes(image):
    results = object_detector(image)
    shapes = [r['label'] for r in results if r['score'] > 0.5]  # Filter by confidence
    return shapes

@app.post("/analyze")
def analyze_image(file: UploadFile = File(...)):
    try:
        image_bytes = file.file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Get primary HEX colors
        primary_hex_colors = get_dominant_colors(image_bytes)
        
        # Get image classifications (replacing the restricted skin tone model)
        image_content = classify_image_content(image)
        
        # Get graphic structures/shapes
        graphic_structures = detect_shapes(image)
        
        response = {
            "primary_hex_colors": primary_hex_colors,
            "image_classifications": image_content,
            "graphic_structures": graphic_structures
        }
        
        return JSONResponse(content=response)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)