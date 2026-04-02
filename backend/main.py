from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import io
from PIL import Image
from colorthief import ColorThief
from transformers import pipeline

app = FastAPI()

# Load models
object_detector = pipeline("object-detection", model="facebook/detr-resnet-50")
skin_classifier = pipeline("image-classification", model="nateraw/vit-base-fitzpatrick")

def get_dominant_colors(image_bytes, color_count=5):
    ct = ColorThief(io.BytesIO(image_bytes))
    palette = ct.get_palette(color_count=color_count)
    hex_colors = ['#{:02x}{:02x}{:02x}'.format(r, g, b) for r, g, b in palette]
    return hex_colors

def detect_skin_tones(image):
    results = skin_classifier(image)
    tones = [r['label'] for r in results if r['score'] > 0.5]  # Filter by confidence
    return tones

def detect_shapes(image):
    results = object_detector(image)
    shapes = [r['label'] for r in results if r['score'] > 0.5]  # Filter by confidence
    return shapes

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Get primary HEX colors
        primary_hex_colors = get_dominant_colors(image_bytes)
        
        # Get skin complexion tones
        skin_complexion_tones = detect_skin_tones(image)
        
        # Get graphic structures/shapes
        graphic_structures = detect_shapes(image)
        
        response = {
            "primary_hex_colors": primary_hex_colors,
            "skin_complexion_tones": skin_complexion_tones,
            "graphic_structures": graphic_structures
        }
        
        return JSONResponse(content=response)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)