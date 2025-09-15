# AI Image Enhancer

A powerful web application that uses AI to enhance image quality with super-resolution technology. Built with React frontend and Flask backend, powered by RealESRGAN for state-of-the-art image enhancement.

![AI Image Enhancer Demo](https://img.shields.io/badge/AI-Image%20Enhancer-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

- **Super-Resolution Enhancement**: Upscale images by 4x while preserving and enhancing details
- **Real-time Preview**: Compare original and enhanced images side-by-side
- **Interactive Magnifier**: Zoom in to see detailed improvements
- **Drag & Drop Interface**: Easy file upload with intuitive UI
- **Download Enhanced Images**: Save your improved images directly
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **GPU Acceleration**: Automatic CUDA support for faster processing

## 🚀 Technology Stack

### Backend
- **Flask**: Lightweight web framework
- **RealESRGAN**: State-of-the-art super-resolution model
- **PyTorch**: Deep learning framework
- **PIL/Pillow**: Image processing library
- **NumPy**: Numerical computing

### Frontend
- **React 19**: Modern UI framework
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **CSS Transitions**: Smooth animations and page transitions

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **NVIDIA GPU** (optional, for faster processing)
- **CUDA Toolkit** (if using GPU)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Devanshu22407/ai-image-enhancer.git
cd ai-image-enhancer
```

### 2. Backend Setup

Navigate to the server directory:
```bash
cd server
```

Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

**Note**: The RealESRGAN model weights (`RealESRGAN_x4plus.pth`) should be placed in the `server/weights/` directory. The model will be automatically downloaded if not present.

### 3. Frontend Setup

Navigate to the client directory:
```bash
cd ../client
```

Install Node.js dependencies:
```bash
npm install
```

## 🚀 Running the Application

### 1. Start the Backend Server
```bash
cd server
python server.py
```
The Flask server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server
```bash
cd client
npm run dev
```
The React app will start on `http://localhost:5173`

### 3. Access the Application
Open your browser and navigate to `http://localhost:5173`

## 📱 Usage

1. **Upload an Image**: 
   - Drag and drop an image file onto the upload area
   - Or click to browse and select an image file

2. **Enhance the Image**:
   - Click the "Enhance Image" button
   - Wait for the AI processing to complete (typically 1-5 minutes depending on image size and hardware)

3. **Compare Results**:
   - View the original and enhanced images side-by-side
   - Use the interactive magnifier to zoom in and see detailed improvements

4. **Download Enhanced Image**:
   - Click the "Download Enhanced" button to save the improved image

## ⚙️ Configuration

### Server Configuration
- **Model Path**: Update the `model_path` in `server.py` if you place the weights file elsewhere
- **Port**: Change the port in `server.py` (default: 5000)
- **CORS**: Configure allowed origins in the CORS setup

### Frontend Configuration
- **API Endpoint**: Update the server URL in `Home.jsx` if running on different host/port
- **Build Settings**: Modify `vite.config.js` for production builds

## 🔧 API Endpoints

### POST `/enhance`
Enhances an uploaded image using RealESRGAN.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing the image

**Response:**
```json
{
  "image": "base64_encoded_enhanced_image"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## 📊 Performance

### Processing Times (Approximate)
- **Small images** (256×256): 1-5 seconds
- **Medium images** (512×512): 5-15 seconds  
- **Large images** (1024×1024+): 15-60+ seconds

### Hardware Recommendations
- **CPU**: Multi-core processor (Intel i5/AMD Ryzen 5 or better)
- **RAM**: 8GB+ (16GB recommended for large images)
- **GPU**: NVIDIA GTX 1060+ or RTX series for significant speed improvements
- **Storage**: SSD recommended for faster I/O

## 🐛 Troubleshooting

### Common Issues

1. **Long Processing Times**:
   - Ensure you have sufficient RAM
   - Consider using a GPU with CUDA support
   - Try resizing large images before enhancement

2. **CUDA Out of Memory**:
   - Reduce image size
   - Use CPU processing instead
   - Close other GPU-intensive applications

3. **Module Import Errors**:
   - Verify all dependencies are installed
   - Check Python version compatibility
   - Ensure virtual environment is activated

4. **Frontend Connection Issues**:
   - Verify backend server is running on port 5000
   - Check CORS configuration
   - Ensure firewall isn't blocking connections

## 📁 Project Structure

```
ai-image-enhancer/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Magnifier.jsx
│   │   │   └── Magnifier.css
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   └── About.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── App.css        # Global styles
│   │   └── main.jsx       # App entry point
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── server/                # Flask backend
│   ├── weights/          # Model weights directory
│   │   └── RealESRGAN_x4plus.pth
│   ├── server.py         # Flask server
│   └── requirements.txt  # Python dependencies
├── LICENSE               # License file
└── README.md            # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [RealESRGAN](https://github.com/xinntao/Real-ESRGAN) - For the excellent super-resolution model
- [BasicSR](https://github.com/XPixelGroup/BasicSR) - For the underlying architecture
- [React](https://reactjs.org/) - For the frontend framework
- [Flask](https://flask.palletsprojects.com/) - For the backend framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Devanshu22407/ai-image-enhancer/issues) page
2. Create a new issue with detailed information about your problem
3. Join our community discussions

---

**Made with ❤️ by [Devanshu22407](https://github.com/Devanshu22407)**