import React from 'react';
import { Link } from 'react-router-dom';
import KaleidoscopeMaker from '../Components/KaleidoscopeMaker';

function KaleidoscopeMakerArtFullscreen() {
    return (
        <div className="km-art-fullscreen">
            <Link to="/art/kaleidoscope-maker" className="km-art-fullscreen__back">
                ← back to art view
            </Link>
            <div className="km-art-fullscreen__body">
                <KaleidoscopeMaker />
            </div>
        </div>
    );
}

export default KaleidoscopeMakerArtFullscreen;
