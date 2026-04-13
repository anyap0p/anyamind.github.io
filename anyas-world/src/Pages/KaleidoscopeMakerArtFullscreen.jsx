import React from 'react';
import KaleidoscopeMaker from '../Components/KaleidoscopeMaker';

function KaleidoscopeMakerArtFullscreen() {
    return (
        <div className="km-art-fullscreen">
            <header className="km-art-fullscreen__header">
                <h1 className="km-art-fullscreen__title">kaleidoscope maker</h1>
                <p className="km-art-fullscreen__wip">work in progress</p>
            </header>
            <div className="km-art-fullscreen__body">
                <KaleidoscopeMaker />
            </div>
        </div>
    );
}

export default KaleidoscopeMakerArtFullscreen;
