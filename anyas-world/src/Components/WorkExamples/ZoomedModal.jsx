import React, { useState } from 'react';
import './ZoomedModal.css';

const ZoomedModal = ({ images, textContent, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="zoomed-modal-container">
            <div className="zoomed-modal-overlay" onClick={onClose}></div>
            <div className="zoomed-modal-content">
                <div className="text-section">
                    <div className="text-content">{textContent}</div>
                </div>
                <div className="carousel-section">
                    <button className="carousel-control prev" onClick={prevImage}>
                        &lt;
                    </button>
                    <img
                        src={images[currentIndex]}
                        alt={`Slide ${currentIndex + 1}`}
                        className="carousel-image-modal"
                    />
                    <button className="carousel-control next" onClick={nextImage}>
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ZoomedModal;
