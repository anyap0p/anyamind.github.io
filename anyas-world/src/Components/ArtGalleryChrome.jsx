import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resolveGalleryNeighbors } from '../config/artPieces';
import './ArtGalleryChrome.css';

function ArtGalleryChrome({ children, title }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { prev, next } = resolveGalleryNeighbors(pathname);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowLeft' && prev) {
                e.preventDefault();
                navigate(prev);
            }
            if (e.key === 'ArrowRight' && next) {
                e.preventDefault();
                navigate(next);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [navigate, prev, next]);

    return (
        <div className="art-gallery-chrome page">
            <div className="art-gallery-chrome-grid">
                {prev ? (
                    <button
                        type="button"
                        className="art-gallery-chrome-control art-gallery-chrome-arrow art-gallery-chrome-arrow--prev"
                        onClick={() => navigate(prev)}
                        aria-label="Previous piece"
                    >
                        ←
                    </button>
                ) : (
                    <span
                        className="art-gallery-chrome-arrow-spacer art-gallery-chrome-arrow-spacer--start"
                        aria-hidden
                    />
                )}
                <div className="art-gallery-chrome-body">
                    {title ? (
                        <h1 className="art-gallery-chrome-title">{title}</h1>
                    ) : null}
                    <div className="art-gallery-chrome-preview">{children}</div>
                </div>
                {next ? (
                    <button
                        type="button"
                        className="art-gallery-chrome-control art-gallery-chrome-arrow art-gallery-chrome-arrow--next"
                        onClick={() => navigate(next)}
                        aria-label="Next piece"
                    >
                        →
                    </button>
                ) : (
                    <span
                        className="art-gallery-chrome-arrow-spacer art-gallery-chrome-arrow-spacer--end"
                        aria-hidden
                    />
                )}
            </div>
            <button
                type="button"
                className="art-gallery-chrome-control art-gallery-chrome-home"
                onClick={() => navigate('/art')}
                aria-label="Back to art"
            >
                home
            </button>
        </div>
    );
}

export default ArtGalleryChrome;
