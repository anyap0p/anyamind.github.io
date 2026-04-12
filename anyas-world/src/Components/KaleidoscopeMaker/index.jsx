import React, { useCallback, useEffect, useState } from 'react';
import { BuildKaleidoscopeView } from './BuildKaleidoscopeView';
import { CustomizeBeadsPanel } from './CustomizeBeadsPanel';
import { KaleidoscopeHexView } from './KaleidoscopeHexView';
import { SavedKaleidoscopesGallery } from './SavedKaleidoscopesGallery';
import { loadSavedKaleidoscopeList } from './buildKaleidoscopeStorage';
import './KaleidoscopeMaker.css';

function KaleidoscopeMaker() {
    const [screen, setScreen] = useState('home');
    const [savedList, setSavedList] = useState(() => loadSavedKaleidoscopeList());
    /** When set, hex view uses this snapshot; when null, it loads the latest from localStorage. */
    const [activeKaleidoscope, setActiveKaleidoscope] = useState(null);
    const hubCustomize = screen === 'customize';
    const hubHome = screen === 'home' || screen === 'customize';

    const refreshSavedList = useCallback(() => {
        setSavedList(loadSavedKaleidoscopeList());
    }, []);

    useEffect(() => {
        if (screen === 'home' || screen === 'gallery' || screen === 'build') {
            refreshSavedList();
        }
    }, [screen, refreshSavedList]);

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
                    {savedList.length > 0 ? (
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
            <SavedKaleidoscopesGallery
                items={savedList}
                onBack={() => setScreen('home')}
                onOpen={(item) => {
                    setActiveKaleidoscope(item);
                    setScreen('kaleidoscope');
                }}
            />
        );
    }

    if (screen === 'kaleidoscope') {
        return (
            <div className="kaleidoscope-maker kaleidoscope-maker--hub kaleidoscope-maker--kaleidoscope-layout">
                <KaleidoscopeHexView
                    activeSnapshot={activeKaleidoscope}
                    onBack={() => {
                        setActiveKaleidoscope(null);
                        setScreen('home');
                    }}
                />
            </div>
        );
    }

    return (
        <div className="kaleidoscope-maker kaleidoscope-maker--hub kaleidoscope-maker--build-layout">
            <BuildKaleidoscopeView
                onBack={() => setScreen('home')}
                onDone={(saved) => {
                    refreshSavedList();
                    setActiveKaleidoscope(saved);
                    setScreen('kaleidoscope');
                }}
            />
        </div>
    );
}

export default KaleidoscopeMaker;
