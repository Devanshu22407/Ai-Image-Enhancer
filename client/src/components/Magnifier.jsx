import React, { useRef, useState } from "react";
import "./Magnifier.css";

export default function Magnifier({ src, zoom = 2.5, width = 250, height = 250 }) {
  const imgRef = useRef(null);
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, imgX: 0, imgY: 0 });

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const imgX = e.clientX - rect.left;
    const imgY = e.clientY - rect.top;
    const x = imgX + 5;
    const y = imgY + 5;
    setPos({ x, y, imgX, imgY });
  };

  return (
    <div className="magnifier-container">
      <img
        ref={imgRef}
        src={src}
        alt="Zoom"
        className="magnifier-image"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onMouseMove={handleMouseMove}
      />
      {show && (
        <div
          className="magnifier-lens"
          style={{
            width: width + "px",
            height: height + "px",
            top: pos.y + "px",
            left: pos.x + "px",
            backgroundImage: `url(${src})`,
            backgroundSize: `${imgRef.current.offsetWidth * zoom}px ${
              imgRef.current.offsetHeight * zoom
            }px`,
            backgroundPosition: `-${pos.imgX * zoom - width / 2}px -${pos.imgY * zoom - height / 2}px`,
          }}
        />
      )}
    </div>
  );
}
