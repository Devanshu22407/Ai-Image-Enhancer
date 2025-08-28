import numpy as np
import base64
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

import torch
from realesrgan import RealESRGANer
from basicsr.archs.rrdbnet_arch import RRDBNet

app = Flask(__name__)
CORS(app)  # allow requests from React frontend

# Load RealESRGAN model once when server starts
model_path = "C:\\Users\\DEVANSHU\\Downloads\\ai-image-enhancer\\server\\weights\\RealESRGAN_x4plus.pth"
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

@app.route("/enhance", methods=["POST"])
def enhance():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    img = Image.open(file.stream).convert("RGB")

    # Run enhancement
    output, _ = upsampler.enhance(np.array(img), outscale=4)

    # Convert back to image
    output_img = Image.fromarray(output)

    # Save to buffer
    buffered = io.BytesIO()
    output_img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return jsonify({"image": img_str})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


# import numpy as np
# from PIL import Image
# import torch
# import io
# import base64
# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from basicsr.archs.rrdbnet_arch import RRDBNet
# from realesrgan import RealESRGANer

# app = FastAPI()

# # Allow frontend requests
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load model once
# MODEL_PATH = "C:\\Users\\DEVANSHU\\Downloads\\ai-image-enhancer\\server\\weights\\RealESRGAN_x4plus.pth"
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64,
#                 num_block=23, num_grow_ch=32, scale=4)

# upsampler = RealESRGANer(
#     scale=4,
#     model_path=MODEL_PATH,
#     model=model,
#     tile=0,cd
#     tile_pad=10,
#     pre_pad=0,
#     half=torch.cuda.is_available(),
#     device=device
# )

# @app.post("/enhance")
# async def enhance(file: UploadFile = File(...)):
#     img = Image.open(io.BytesIO(await file.read())).convert("RGB")
#     img_np = np.array(img)
#     output, _ = upsampler.enhance(img_np, outscale=2)
#     buffer = io.BytesIO()
#     Image.fromarray(output).save(buffer, format="JPEG")
#     encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
#     return {"image": encoded}
