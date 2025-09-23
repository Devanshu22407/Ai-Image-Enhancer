import React, { useState } from "react";

export default function About() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "What image formats does the AI enhancer support?",
      answer: "Our advanced AI model supports all major image formats including PNG, JPEG, JPG, and WEBP. The system automatically detects the format and optimizes processing accordingly, ensuring consistent high-quality results across all supported file types."
    },
    {
      question: "How does the AI enhancement process work?",
      answer: "Our system utilizes the state-of-the-art RealESRGAN neural network, which employs deep learning algorithms for super-resolution image enhancement. The AI analyzes your image pixel by pixel, reconstructing fine details and improving clarity through advanced upscaling techniques."
    },
    {
      question: "What security measures protect my uploaded images?",
      answer: "Your privacy is our top priority. All image processing occurs entirely on your local device using client-side computation. No images are uploaded to external servers, stored in databases, or transmitted over the internet. Your data remains completely private and secure."
    },
    {
      question: "What quality improvements can I expect from the enhancement?",
      answer: "The AI delivers comprehensive improvements including up to 4x super-resolution upscaling, advanced noise reduction, enhanced detail reconstruction, improved sharpness and clarity, optimized contrast and color balance, and artifact removal for professional-grade results."
    },
    {
      question: "Are there any technical limitations or requirements?",
      answer: "The system works optimally with images up to 10MB in size. Processing time varies from 10-45 seconds depending on image complexity and resolution. Modern web browsers (Chrome, Firefox, Safari, Edge) are recommended for optimal performance and compatibility."
    },
    {
      question: "Can I process multiple images simultaneously?",
      answer: "Currently, our system processes images individually to ensure maximum quality and optimal resource allocation. This approach guarantees consistent, high-quality results for each enhancement. You can process multiple images sequentially through the interface."
    }
  ];

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

      {/* Technology Stack Section */}
      <section className="tech-stack-section">
        <h2>Technology Stack</h2>
        <div className="tech-grid">
          <div className="tech-card">
            <div className="tech-icon">⚛️</div>
            <h3>React</h3>
            <p>Modern UI library</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">⚡</div>
            <h3>Vite</h3>
            <p>Fast build tool</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">🐍</div>
            <h3>Python</h3>
            <p>Backend processing</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">🌶️</div>
            <h3>Flask</h3>
            <p>Web framework</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">🤖</div>
            <h3>RealESRGAN</h3>
            <p>AI enhancement model</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">💎</div>
            <h3>CSS3</h3>
            <p>Glassmorphism design</p>
          </div>
        </div>
      </section>

      {/* Developer Information Section */}
      <section className="developer-section">
        <h2>Meet the Team</h2>
        <div className="developer-grid">
          <div className="developer-card">
            <div className="developer-avatar">DS</div>
            <h3>Devanshu Sheladiya</h3>
            <p>Full-Stack Developer</p>
            <a href="mailto:devanshusheladiya407@gmail.com" className="developer-email">
              devanshusheladiya407@gmail.com
            </a>
            <div className="developer-contact">
              <a href="tel:+919313222407" className="developer-phone">
                +91 93132 22407
              </a>
            </div>
          </div>
          <div className="developer-card">
            <div className="developer-avatar">MS</div>
            <h3>Mitang Sheladiya</h3>
            <p>Full-Stack Developer</p>
            <a href="mailto:mitangsheladiya156@gmail.com" className="developer-email">
              mitangsheladiya156@gmail.com
            </a>
            <div className="developer-contact">
              <a href="tel:+916353602287" className="developer-phone">
                +91 63536 02287
              </a>
            </div>
          </div>
        </div>
        <div className="github-section">
          <a href="https://github.com/Devanshu22407/Ai-Image-Enhancer" className="github-link" target="_blank" rel="noopener noreferrer">
            <svg className="github-icon" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button 
                className="faq-question" 
                onClick={() => toggleFAQ(index)}
                aria-expanded={openFAQ === index}
              >
                <span>{faq.question}</span>
                <svg 
                  className={`faq-icon ${openFAQ === index ? 'rotated' : ''}`} 
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              <div className={`faq-answer ${openFAQ === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="note">
        Ready to experience professional-grade AI image enhancement? Navigate to the Home page, upload your image via drag-and-drop or file selection, and let our advanced neural network transform your visuals with cutting-edge super-resolution technology.
      </p>
    </div>
  );
}
