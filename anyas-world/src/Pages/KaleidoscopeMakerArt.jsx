import React from 'react';
import { Link } from 'react-router-dom';
import ArtGalleryChrome from '../Components/ArtGalleryChrome';
import KaleidoscopeMaker from '../Components/KaleidoscopeMaker';
import './ArtWorkPiece.css';

function KaleidoscopeMakerArt() {
    return (
        <ArtGalleryChrome>
            <div className="art-work-piece-media-wrap">
                <div className="art-work-piece-media-frame">
                    <div className="art-work-piece-km-heading">
                        <Link
                            to="/art/kaleidoscope-maker/full"
                            className="art-work-piece-title art-work-piece-title--link"
                        >
                            <h1 className="art-work-piece-title__inner">kaleidoscope maker</h1>
                        </Link>
                        <p className="art-work-piece-km-wip">work in progress</p>
                    </div>
                    <KaleidoscopeMaker />
                </div>
            </div>
        </ArtGalleryChrome>
    );
}

export default KaleidoscopeMakerArt;
