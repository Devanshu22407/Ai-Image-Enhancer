import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Magnifier from "../components/Magnifier.jsx";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [settings, setSettings] = useState({
    scale: 4,
    format: 'png'
  });
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const extractImageInfo = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          name: file.name,
          size: file.size,
          format: file.type,
          width: img.width,
          height: img.height
        });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const onPickFile = () => fileInputRef.current?.click();

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setOriginalImage(URL.createObjectURL(file));
    setEnhancedImage(null);
    
    // Extract image info
    const info = await extractImageInfo(file);
    setImageInfo(info);
  };

  const onDragOver = (e) => e.preventDefault();
  const onDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setOriginalImage(URL.createObjectURL(file));
    setEnhancedImage(null);
    
    // Extract image info
    const info = await extractImageInfo(file);
    setImageInfo(info);
  };

  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
    }
  };

  const startTimer = () => {
    const startTime = Date.now();
    startTimeRef.current = startTime;
    setElapsedTime(0);
    setTotalTime(null);
    
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setElapsedTime(elapsed);
    }, 100); // Update every 100ms for smooth display
  };

  const stopTimer = () => {
    if (timerRef.current && startTimeRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      
      // Calculate final elapsed time
      const finalElapsed = (Date.now() - startTimeRef.current) / 1000;
      setTotalTime(finalElapsed);
      startTimeRef.current = null;
    }
  };
  const enhance = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setProgress(0);
    
    // Start the timer
    startTimer();
    
    let progressInterval;
    
    // Simple progress simulation
    const updateProgress = () => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 2, 95);
        if (newProgress < 95) {
          progressInterval = setTimeout(updateProgress, 500 + Math.random() * 1000);
        }
        return newProgress;
      });
    };
    
    // Start progress tracking
    updateProgress();

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("scale", settings.scale);
    formData.append("format", settings.format);

    try {
      const res = await axios.post("http://127.0.0.1:5000/enhance", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      clearTimeout(progressInterval);
      setProgress(100);
      
      // Stop the timer
      stopTimer();
      
      // Handle different formats for display and download
      if (settings.format === 'pdf') {
        setEnhancedImage("data:application/pdf;base64," + res.data.image);
      } else {
        setEnhancedImage("data:image/png;base64," + res.data.image);
      }
    } catch (err) {
      console.error(err);
      clearTimeout(progressInterval);
      stopTimer();
      alert("Enhancement failed. Please check the server and try again.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setProgress(0);
      }, 2000);
    }
  };

  const downloadEnhanced = () => {
    if (!enhancedImage) return;
    
    // Determine file extension based on selected format
    const fileExtension = {
      'png': 'png',
      'jpeg': 'jpg',
      'pdf': 'pdf'
    }[settings.format] || 'png';
    
    const a = document.createElement("a");
    a.href = enhancedImage;
    a.download = `enhanced_image.${fileExtension}`;
    a.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetAll = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setEnhancedImage(null);
    setImageInfo(null);
    setProgress(0);
    setElapsedTime(0);
    setTotalTime(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 relative text-gray-800">
      {/* Enhanced Zigzag Lightning Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(102, 126, 234, 0.02) 60px, rgba(102, 126, 234, 0.02) 61px),
            repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(118, 75, 162, 0.015) 80px, rgba(118, 75, 162, 0.015) 81px),
            repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(244, 147, 251, 0.01) 100px, rgba(244, 147, 251, 0.01) 101px),
            repeating-linear-gradient(135deg, transparent, transparent 120px, rgba(102, 126, 234, 0.008) 120px, rgba(102, 126, 234, 0.008) 121px)
          `,
          opacity: 0.6,
        }}
      />
      {/* Subtle Gradient Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(244, 147, 251, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(118, 75, 162, 0.015) 0%, transparent 50%)
          `,
        }}
      />
      {/* Content */}
      <div className="container fade-in relative z-10">
        <section className="hero">
          <h1>Enhance Images with AI</h1>
          <p>Sharper details, reduced noise, and better clarity — instantly.</p>
        </section>

      <section className="upload-section">
        <div
          className={`dropzone ${selectedFile ? "has-file" : ""}`}
          onClick={onPickFile}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            hidden
          />
          {!selectedFile ? (
            <div className="dropzone-inner">
              <div className="drop-title">Drag & drop an image here</div>
              <div className="drop-subtitle">or click to browse</div>
            </div>
          ) : (
            <div className="dropzone-file">
              <div className="file-name">{selectedFile.name}</div>
              <div className="file-hint">Click to choose another image</div>
            </div>
          )}
        </div>

        {/* Image Info and Settings Side by Side */}
        {(imageInfo || selectedFile) && (
          <div className="info-settings-container">
            {/* Image Info Display */}
            {imageInfo && (
              <div className="image-info panel">
                <h3>Image Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Dimensions:</span>
                    <span className="info-value">{imageInfo.width} × {imageInfo.height} px</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">File Size:</span>
                    <span className="info-value">{formatFileSize(imageInfo.size)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Format:</span>
                    <span className="info-value">{imageInfo.format || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Enhancement Settings Panel */}
            {selectedFile && (
              <div className="settings-panel panel">
                <h3>Enhancement Settings</h3>
                <div className="settings-grid">
              <div className="setting-group">
                <label className="setting-label">Scale Factor:</label>
                <select 
                  value={settings.scale} 
                  onChange={(e) => setSettings({...settings, scale: parseInt(e.target.value)})}
                  className="setting-select"
                >
                  <option value={2}>2x (Faster)</option>
                  <option value={4}>4x (Balanced)</option>
                  <option value={8}>8x (Best Quality)</option>
                </select>
              </div>
              <div className="setting-group">
                <label className="setting-label">Output Format:</label>
                <select 
                  value={settings.format} 
                  onChange={(e) => setSettings({...settings, format: e.target.value})}
                  className="setting-select"
                >
                  <option value="png">PNG (Lossless)</option>
                  <option value="jpeg">JPEG (Smaller Size)</option>
                  <option value="pdf">PDF (Document)</option>
                </select>
              </div>
            </div>
          </div>
        )}
        </div>
        )}

        {/* Progress Bar */}
        {loading && (
          <div className="progress-section panel">
            <div className="progress-header">
              <h3>Enhancing Image...</h3>
              <span className="time-remaining">
                Processing: {formatTime(elapsedTime)}
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">{Math.round(progress)}% Complete</div>
          </div>
        )}

        <div className="actions">
          <button
            className="btn primary"
            onClick={enhance}
            disabled={!selectedFile || loading}
          >
            {loading ? "Enhancing…" : "Enhance Image"}
          </button>
          <button
            className="button"
            onClick={resetAll}
            disabled={loading && !enhancedImage}
            title="Reset"
          >
            <svg className="svgIcon" viewBox="0 0 448 512">
              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
            </svg>
          </button>
        </div>
      </section>

      {!originalImage && !enhancedImage && (
        <section className="steps-section fade-in">
          <div className="steps-container">
            <h2>How to Use</h2>
            <div className="steps-grid">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Upload Image</h3>
                  <p>Drag & drop your image or click to browse files</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Enhance</h3>
                  <p>Click "Enhance Image" and wait for AI processing</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Compare</h3>
                  <p>View original vs enhanced with zoom feature</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Download</h3>
                  <p>Save your enhanced image in high quality</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {(originalImage || enhancedImage) && (
        <section className="comparison-panel fade-in">
          <div className="comparison-body panel">
            {originalImage && (
              <div className="compare-half">
                <div className="compare-label">Original</div>
                <Magnifier src={originalImage} zoom={2.5} width={250} height={250} />
              </div>
            )}
            {enhancedImage && (
              <div className="compare-half">
                <div className="compare-label">Enhanced</div>
                {settings.format === 'pdf' ? (
                  <div className="pdf-preview">
                    <div className="pdf-icon">📄</div>
                    <div className="pdf-text">PDF Document Ready</div>
                    <div className="pdf-note">Click download to view PDF</div>
                  </div>
                ) : (
                  <Magnifier src={enhancedImage} zoom={2.5} width={250} height={250} />
                )}
              </div>
            )}
          </div>

          {/* Show total time when enhancement is complete */}
          {!loading && totalTime !== null && enhancedImage && (
            <div className="completion-info">
              <div className="completion-badge">
                <svg className="check-icon" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Enhancement Complete!
              </div>
              <div className="total-time">
                Total time: {formatTime(totalTime)}
              </div>
            </div>
          )}

          {enhancedImage && (
            <div className="download-area">
              <button className="download-btn" onClick={downloadEnhanced}>
                <svg className="download-icon" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Enhanced
              </button>
            </div>
          )}
        </section>
      )}
      </div>
    </div>
  );
}
