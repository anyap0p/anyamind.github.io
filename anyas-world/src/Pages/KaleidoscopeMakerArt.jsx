import React from 'react';
import ArtGalleryChrome from '../Components/ArtGalleryChrome';
import KaleidoscopeMaker from '../Components/KaleidoscopeMaker';
import './ArtWorkPiece.css';

function KaleidoscopeMakerArt() {
    return (
        <ArtGalleryChrome>
            <div className="art-work-piece-media-wrap">
                <div className="art-work-piece-media-frame">
                    <h1 className="art-work-piece-title">kaleidoscope maker</h1>
                    <KaleidoscopeMaker />
                </div>
            </div>
        </ArtGalleryChrome>
    );
}

export default KaleidoscopeMakerArt;
