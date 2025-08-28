import React from "react";

export default function About() {
  return (
    <div className="container about fade-in">
      <h1>About This Project</h1>
      <p>
        The AI Image Enhancer transforms visuals into sharper, cleaner, and more refined images. 
        Powered by deep learning, it restores clarity, reduces distortion, and enhances details — all locally.
      </p>

      <ul className="about-list">
        <li>Super-resolution for restoring fine details</li>
        <li>Noise reduction for smooth, professional results</li>
        <li>Balanced contrast for natural-looking improvements</li>
        <li>Private and secure — your images never leave your device</li>
      </ul>

      <p className="note">
        Go to Home, upload or drag & drop an image, and let AI handle the rest.
      </p>
    </div>
  );
}
