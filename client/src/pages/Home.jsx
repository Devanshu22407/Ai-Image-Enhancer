import React, { useRef, useState } from "react";
import axios from "axios";
import Magnifier from "../components/Magnifier.jsx";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [settings, setSettings] = useState({
    scale: 4,
    format: 'png'
  });
  // Learning component for time estimation
  const [timeEstimateHistory, setTimeEstimateHistory] = useState(() => {
    const saved = localStorage.getItem('enhanceTimeHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const fileInputRef = useRef(null);

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

  const updateTimeEstimateHistory = (imageInfo, scaleFactor, actualTime) => {
    const newEntry = {
      pixels: imageInfo.width * imageInfo.height,
      scaleFactor,
      actualTime,
      format: imageInfo.format,
      timestamp: Date.now()
    };
    
    const updatedHistory = [...timeEstimateHistory, newEntry];
    // Keep only last 50 entries to avoid storage bloat
    const trimmedHistory = updatedHistory.slice(-50);
    
    setTimeEstimateHistory(trimmedHistory);
    localStorage.setItem('enhanceTimeHistory', JSON.stringify(trimmedHistory));
  };

  const getLearningAdjustment = (imageInfo, scaleFactor) => {
    if (timeEstimateHistory.length < 3) return 1.0; // Not enough data
    
    // Find similar images in history
    const pixels = imageInfo.width * imageInfo.height;
    const similarImages = timeEstimateHistory.filter(entry => {
      const pixelDiff = Math.abs(entry.pixels - pixels) / pixels;
      return pixelDiff < 0.5 && entry.scaleFactor === scaleFactor; // Within 50% pixel count and same scale
    });
    
    if (similarImages.length === 0) return 1.0;
    
    // Calculate average actual vs estimated ratio
    const adjustments = similarImages.map(entry => {
      const estimatedForEntry = (entry.pixels / 1000000) * 15; // Basic estimate
      return entry.actualTime / estimatedForEntry;
    });
    
    const avgAdjustment = adjustments.reduce((sum, adj) => sum + adj, 0) / adjustments.length;
    return Math.max(0.3, Math.min(3.0, avgAdjustment)); // Clamp between 0.3x and 3x
  };

  const detectHardwareCapability = () => {
    // Simple hardware detection based on available browser APIs
    const hardwareInfo = {
      cores: navigator.hardwareConcurrency || 4,
      memory: navigator.deviceMemory || 4, // GB
      connection: navigator.connection?.effectiveType || '4g'
    };
    
    // Estimate hardware multiplier
    let hardwareMultiplier = 1.0;
    
    // CPU cores factor
    if (hardwareInfo.cores >= 8) hardwareMultiplier *= 0.7; // High-end CPU
    else if (hardwareInfo.cores >= 4) hardwareMultiplier *= 0.85; // Mid-range CPU
    else hardwareMultiplier *= 1.3; // Low-end CPU
    
    // Memory factor
    if (hardwareInfo.memory >= 16) hardwareMultiplier *= 0.8; // High memory
    else if (hardwareInfo.memory >= 8) hardwareMultiplier *= 0.9; // Good memory
    else hardwareMultiplier *= 1.2; // Limited memory
    
    return hardwareMultiplier;
  };

  const calculateRealTimeEstimate = (imageInfo, scaleFactor) => {
    const pixels = imageInfo.width * imageInfo.height;
    const scaledPixels = pixels * (scaleFactor ** 2); // After scaling
    
    // Base processing time per million pixels (in seconds)
    // These are realistic estimates based on RealESRGAN performance
    const baseTimePerMegapixel = 15; // 15 seconds per million pixels on average CPU
    
    // Hardware capability factor
    const hardwareMultiplier = detectHardwareCapability();
    
    // Learning adjustment based on historical data
    const learningAdjustment = getLearningAdjustment(imageInfo, scaleFactor);
    
    // Complexity factors
    let complexityMultiplier = 1.0;
    
    // Image size factor (larger images take disproportionately longer)
    if (pixels > 2000000) complexityMultiplier *= 1.5; // 2MP+
    if (pixels > 8000000) complexityMultiplier *= 2.0; // 8MP+
    
    // Scale factor impact (higher scales take longer)
    const scaleMultiplier = {
      2: 0.6,  // 2x is faster
      4: 1.0,  // 4x is baseline
      8: 2.5   // 8x takes much longer
    }[scaleFactor] || 1.0;
    
    // File format complexity (JPEG compressed files might take longer to process)
    const formatMultiplier = imageInfo.format?.includes('jpeg') ? 1.2 : 1.0;
    
    // Calculate estimate
    const megapixels = scaledPixels / 1000000;
    const estimatedTime = megapixels * baseTimePerMegapixel * complexityMultiplier * scaleMultiplier * formatMultiplier * hardwareMultiplier * learningAdjustment;
    
    // Clamp between reasonable bounds (10 seconds to 10 minutes)
    return Math.max(10, Math.min(600, Math.round(estimatedTime)));
  };

  const enhance = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setProgress(0);
    
    // Calculate realistic time estimate
    const estimatedTimeSeconds = calculateRealTimeEstimate(imageInfo, settings.scale);
    setTimeRemaining(estimatedTimeSeconds);
    
    const startTime = Date.now();
    let progressInterval;
    
    // More realistic progress tracking
    const updateProgress = () => {
      const elapsed = (Date.now() - startTime) / 1000; // seconds elapsed
      const progressPercentage = Math.min(95, (elapsed / estimatedTimeSeconds) * 100);
      
      setProgress(progressPercentage);
      
      // Update remaining time based on actual progress
      const remainingTime = Math.max(0, estimatedTimeSeconds - elapsed);
      setTimeRemaining(remainingTime);
      
      // Continue updating until we reach 95% or the request completes
      if (progressPercentage < 95) {
        progressInterval = setTimeout(updateProgress, 1000);
      }
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
      setTimeRemaining(0);
      
      // Handle different formats for display and download
      if (settings.format === 'pdf') {
        setEnhancedImage("data:application/pdf;base64," + res.data.image);
      } else {
        setEnhancedImage("data:image/png;base64," + res.data.image);
      }
      
      // Learn from actual processing time if metadata is available
      if (res.data.metadata && res.data.metadata.processing_time) {
        const actualTime = res.data.metadata.processing_time.total_time;
        updateTimeEstimateHistory(imageInfo, settings.scale, actualTime);
        console.log(`Actual processing time: ${actualTime}s vs estimated: ${estimatedTimeSeconds}s`);
      }
    } catch (err) {
      console.error(err);
      clearTimeout(progressInterval);
      alert("Enhancement failed. Please check the server and try again.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setProgress(0);
        setTimeRemaining(null);
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

  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const resetAll = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setEnhancedImage(null);
    setImageInfo(null);
    setProgress(0);
    setTimeRemaining(null);
  };

  return (
    <div className="container fade-in">
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
              {timeRemaining !== null && (
                <span className="time-remaining">
                  Est. time remaining: {formatTime(timeRemaining)}
                </span>
              )}
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
            className="btn secondary"
            onClick={resetAll}
            disabled={loading && !enhancedImage}
          >
            Reset
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

          {enhancedImage && (
            <div className="download-area">
              <button className="btn success" onClick={downloadEnhanced}>
                Download Enhanced
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
