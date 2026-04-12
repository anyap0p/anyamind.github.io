import React, { useEffect, useState } from 'react';
import { CustomizeBeadsPanel } from './CustomizeBeadsPanel';
import { KaleidoscopeMakerCanvas } from './KaleidoscopeMakerCanvas';
import { STORAGE_COMPLETED } from './constants';
import './KaleidoscopeMaker.css';

function KaleidoscopeMaker() {
    const [screen, setScreen] = useState('home');
    const [showCompleteGallery, setShowCompleteGallery] = useState(false);
    const hubCustomize = screen === 'customize';
    const hubHome = screen === 'home' || screen === 'customize';

    useEffect(() => {
        try {
            setShowCompleteGallery(localStorage.getItem(STORAGE_COMPLETED) === 'true');
        } catch {
            setShowCompleteGallery(false);
        }
    }, []);

    if (hubHome) {
        return (
            <div className="kaleidoscope-maker kaleidoscope-maker--hub">
                <div
                    className={`kaleidoscope-maker__home-actions${hubCustomize ? ' kaleidoscope-maker__home-actions--fading' : ''}`}
                >
                    <button type="button" onClick={() => setScreen('customize')} disabled={hubCustomize}>
                        customize beads
                    </button>
                    <button type="button" onClick={() => setScreen('build')} disabled={hubCustomize}>
                        build your kaleidoscope
                    </button>
                    {showCompleteGallery ? (
                        <button type="button" onClick={() => setScreen('gallery')} disabled={hubCustomize}>
                            view complete kaleidoscopes
                        </button>
                    ) : null}
                </div>
                {hubCustomize ? <CustomizeBeadsPanel onBack={() => setScreen('home')} /> : null}
            </div>
        );
    }

    if (screen === 'gallery') {
        return (
            <div className="kaleidoscope-maker kaleidoscope-maker--home">
                <button type="button" onClick={() => setScreen('home')}>
                    back
                </button>
            </div>
        );
    }

    return (
        <div className="kaleidoscope-maker kaleidoscope-maker--stage-wrap">
            <button type="button" onClick={() => setScreen('home')}>
                back
            </button>
            <KaleidoscopeMakerCanvas />
        </div>
    );
}

export default KaleidoscopeMaker;
