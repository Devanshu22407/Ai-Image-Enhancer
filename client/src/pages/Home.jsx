import React, { useRef, useState } from "react";
import axios from "axios";
import Magnifier from "../components/Magnifier.jsx";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const onPickFile = () => fileInputRef.current?.click();

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setOriginalImage(URL.createObjectURL(file));
    setEnhancedImage(null);
  };

  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setOriginalImage(URL.createObjectURL(file));
    setEnhancedImage(null);
  };

  const enhance = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://127.0.0.1:5000/enhance", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEnhancedImage("data:image/png;base64," + res.data.image);
    } catch (err) {
      console.error(err);
      alert("Enhancement failed. Please check the server and try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadEnhanced = () => {
    if (!enhancedImage) return;
    const a = document.createElement("a");
    a.href = enhancedImage;
    a.download = "enhanced_image.png";
    a.click();
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
            onClick={() => {
              setSelectedFile(null);
              setOriginalImage(null);
              setEnhancedImage(null);
            }}
            disabled={loading && !enhancedImage}
          >
            Reset
          </button>
        </div>
      </section>

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
                <Magnifier src={enhancedImage} zoom={2.5} width={250} height={250} />
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
