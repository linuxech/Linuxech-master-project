# Backend API

This is a FastAPI backend that accepts image uploads and analyzes them using open-source vision models.

## Features

- Accepts image uploads
- Extracts primary HEX color codes
- Detects skin complexion tones
- Identifies graphic structures/shapes

## Installation

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the Server

Run the server with:
```
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoint

### POST /analyze

Upload an image file to analyze.

**Request:**
- `file`: Image file (multipart/form-data)

**Response:**
```json
{
  "primary_hex_colors": ["#ff0000", "#00ff00", ...],
  "skin_complexion_tones": ["fair", "medium", ...],
  "graphic_structures": ["person", "car", ...]
}
```