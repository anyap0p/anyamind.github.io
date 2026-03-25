import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ArtGalleryChrome from '../Components/ArtGalleryChrome';
import Portrait from './Portrait';
import { ART_PIECE_BY_SLUG } from '../config/artPieces';
import './ArtWorkPiece.css';

function ArtWorkPiece() {
    const { slug } = useParams();
    const piece = slug ? ART_PIECE_BY_SLUG[slug] : undefined;

    if (!piece) {
        return <Navigate to="/art" replace />;
    }

    const isSelfPortrait = slug === 'self-portrait';

    return (
        <ArtGalleryChrome>
            <div className="art-work-piece-media-wrap">
                <div
                    className={
                        isSelfPortrait
                            ? 'art-work-piece-media-frame art-work-piece-media-frame--portrait'
                            : 'art-work-piece-media-frame'
                    }
                >
                    <h1 className="art-work-piece-title">{piece.title}</h1>
                    {isSelfPortrait ? (
                        <Portrait embedded />
                    ) : (
                        <img
                            src={piece.media}
                            alt={piece.alt}
                            className="art-work-piece-media"
                        />
                    )}
                </div>
            </div>
        </ArtGalleryChrome>
    );
}

export default ArtWorkPiece;
