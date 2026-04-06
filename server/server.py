import numpy as np
import base64
import io
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.utils import ImageReader

import torch
from realesrgan import RealESRGANer
from basicsr.archs.rrdbnet_arch import RRDBNet

app = Flask(__name__)
CORS(app)  


model_path = "D:\\Sem_5\\Project_2\\ai-image-enhancer\\server\\weights\\RealESRGAN_x4plus.pth"
device = "cuda" if torch.cuda.is_available() else "cpu"

model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64,
                num_block=23, num_grow_ch=32, scale=4)

upsampler = RealESRGANer(
    scale=4,
    model_path=model_path,
    model=model,
    tile=0,
    tile_pad=10,
    pre_pad=0,
    half=True if device == "cuda" else False,
    device=device
)

def create_pdf_with_image(img, buffer):
    """Create a PDF document containing the enhanced image"""
    try:
        # Convert PIL image to RGB if it's not already
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Create a temporary image buffer for the PDF
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        # Create PDF canvas
        pdf_canvas = canvas.Canvas(buffer, pagesize=A4)
        
        # Get image dimensions and page dimensions
        img_width, img_height = img.size
        page_width, page_height = A4
        
        # Calculate scaling to fit image on page while maintaining aspect ratio
        scale_x = (page_width - 72) / img_width  # 72 points margin (1 inch)
        scale_y = (page_height - 72) / img_height
        scale = min(scale_x, scale_y, 1.0)  # Don't scale up, only down
        
        # Calculate centered position
        scaled_width = img_width * scale
        scaled_height = img_height * scale
        x = (page_width - scaled_width) / 2
        y = (page_height - scaled_height) / 2
        
        # Add image to PDF
        pdf_canvas.drawImage(ImageReader(img_buffer), x, y, scaled_width, scaled_height)
        
        # Add title
        pdf_canvas.setFont("Helvetica-Bold", 16)
        pdf_canvas.drawString(72, page_height - 50, "AI Enhanced Image")
        
        # Add metadata
        pdf_canvas.setFont("Helvetica", 10)
        pdf_canvas.drawString(72, 50, f"Original Size: {img_width} x {img_height} pixels")
        pdf_canvas.drawString(72, 35, f"Enhanced with AI Image Enhancer")
        
        # Save PDF
        pdf_canvas.save()
        
    except Exception as e:
        print(f"Error creating PDF: {e}")
        # Fallback to PNG if PDF creation fails
        img.save(buffer, format='PNG')

@app.route("/enhance", methods=["POST"])
def enhance():
    start_time = time.time()
    
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    
    # Get enhancement settings from form data
    scale = int(request.form.get("scale", 4))
    output_format = request.form.get("format", "png").upper()
    
    # Load and process image
    load_start = time.time()
    img = Image.open(file.stream).convert("RGB")
    original_size = img.size
    load_time = time.time() - load_start
    
    print(f"Image loaded: {original_size[0]}x{original_size[1]} pixels in {load_time:.2f}s")
    
    # Enhance image with specified scale
    enhance_start = time.time()
    output, _ = upsampler.enhance(np.array(img), outscale=scale)
    enhance_time = time.time() - enhance_start
    
    print(f"Enhancement completed in {enhance_time:.2f}s (scale {scale}x)")
    
    # Convert to PIL Image
    output_img = Image.fromarray(output)
    
    # Save with specified format
    save_start = time.time()
    buffered = io.BytesIO()
    if output_format == "JPEG":
        # Convert to RGB if saving as JPEG (no alpha channel)
        if output_img.mode == "RGBA":
            output_img = output_img.convert("RGB")
        output_img.save(buffered, format="JPEG", quality=95, optimize=True)
    elif output_format == "PDF":
        # Create PDF with the enhanced image
        create_pdf_with_image(output_img, buffered)
    else:  # PNG (default)
        output_img.save(buffered, format="PNG", optimize=True)
    
    save_time = time.time() - save_start
    total_time = time.time() - start_time
    
    print(f"Image saved in {save_time:.2f}s. Total processing time: {total_time:.2f}s")
    
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    # Return enhanced image with metadata
    return jsonify({
        "image": img_str,
        "metadata": {
            "original_size": original_size,
            "enhanced_size": output_img.size,
            "scale_factor": scale,
            "format": output_format,
            "processing_time": {
                "load_time": round(load_time, 2),
                "enhance_time": round(enhance_time, 2),
                "save_time": round(save_time, 2),
                "total_time": round(total_time, 2)
            }
        }
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

