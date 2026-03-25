import React from 'react';
import ArtGalleryChrome from '../Components/ArtGalleryChrome';
import './ArtWorkPiece.css';
import './MermaidMotel.css';

function MermaidMotel() {
    return (
        <ArtGalleryChrome>
            <div className="art-work-piece-media-wrap">
                <div className="art-work-piece-media-frame">
                    <h1 className="art-work-piece-title">mermaid motel</h1>
                    <iframe
                        className="mermaid-motel-iframe"
                        title="Mermaid Motel — Scratch project"
                        src="https://scratch.mit.edu/projects/872308511/embed"
                        allowTransparency
                        width={900}
                        height={600}
                        frameBorder={0}
                        scrolling="no"
                        allowFullScreen
                    />
                </div>
            </div>
        </ArtGalleryChrome>
    );
}

export default MermaidMotel;
