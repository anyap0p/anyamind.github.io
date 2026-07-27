import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BuildKaleidoscopeView } from './BuildKaleidoscopeView';
import { CustomizeBeadsPanel } from './CustomizeBeadsPanel';
import { KaleidoscopeHexView } from './KaleidoscopeHexView';
import { SavedKaleidoscopesGallery } from './SavedKaleidoscopesGallery';
import { ScallopedPlaque } from './ScallopedPlaque';
import { countFilledBeads, loadBeadsFromStorage } from './beadStorage';
import { deleteSavedKaleidoscope, loadSavedKaleidoscopeList } from './buildKaleidoscopeStorage';
import { resumeKaleidoscopeAudio } from './kaleidoscopeAudioContext';
import { pickHomeBackdropSnapshot } from './pickHomeBackdropSnapshot';
import './KaleidoscopeMaker.css';

function waveLabel(text) {
    return text.split('').map((letter, index) => (
        <span
            key={`${letter}-${index}`}
            className="kaleidoscope-maker__home-letter"
            style={{ '--letter-i': index }}
        >
            {letter === ' ' ? '\u00a0' : letter}
        </span>
    ));
}

function KaleidoscopeMaker({
    fullscreen = false,
    onScreenChange,
    onMakerScreenChange,
    onChromeBackChange,
    onChromeForwardChange,
    onChromeTitleChange,
    chromeVisible = true,
    onChromeEnter,
    onChromeLeave,
} = {}) {
    const [screen, setScreen] = useState('home');
    const [savedList, setSavedList] = useState(() => loadSavedKaleidoscopeList());
    const [filledBeadCount, setFilledBeadCount] = useState(() => countFilledBeads());
    /** Open customize already in the bead factory (first empty slot). */
    const [customizeStartInFactory, setCustomizeStartInFactory] = useState(false);
    /** When set, hex view uses this snapshot; when null, it loads the latest from localStorage. */
    const [activeKaleidoscope, setActiveKaleidoscope] = useState(null);
    const homeBackdrop = useMemo(() => pickHomeBackdropSnapshot(), []);
    const hubCustomize = screen === 'customize';
    const backInChrome = typeof onChromeBackChange === 'function';
    const homeIntroDoneRef = useRef(false);
    const homeFontsReadyRef = useRef(false);
    const homeBackdropReadyRef = useRef(false);
    const [homeIntroReady, setHomeIntroReady] = useState(() => homeIntroDoneRef.current);

    const completeHomeIntro = useCallback(() => {
        if (homeIntroDoneRef.current) return;
        homeIntroDoneRef.current = true;
        setHomeIntroReady(true);
    }, []);

    const tryCompleteHomeIntro = useCallback(() => {
        if (homeIntroDoneRef.current) return;
        if (homeFontsReadyRef.current && homeBackdropReadyRef.current) {
            completeHomeIntro();
        }
    }, [completeHomeIntro]);

    const onHomeBackdropReady = useCallback(() => {
        homeBackdropReadyRef.current = true;
        tryCompleteHomeIntro();
    }, [tryCompleteHomeIntro]);

    useEffect(() => {
        if (homeIntroDoneRef.current) return undefined;
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            homeFontsReadyRef.current = true;
            homeBackdropReadyRef.current = true;
            completeHomeIntro();
            return undefined;
        }
        const fontsReady = document.fonts?.ready ?? Promise.resolve();
        let cancelled = false;
        fontsReady.then(() => {
            if (cancelled) return;
            homeFontsReadyRef.current = true;
            tryCompleteHomeIntro();
        });
        return () => {
            cancelled = true;
        };
    }, [completeHomeIntro, tryCompleteHomeIntro]);

    useEffect(() => {
        if (screen !== 'home' || homeIntroDoneRef.current || homeBackdrop) return undefined;
        homeBackdropReadyRef.current = true;
        tryCompleteHomeIntro();
        return undefined;
    }, [screen, homeBackdrop, tryCompleteHomeIntro]);

    const refreshSavedList = useCallback(() => {
        setSavedList(loadSavedKaleidoscopeList());
    }, []);

    const refreshBeadCount = useCallback(() => {
        setFilledBeadCount(countFilledBeads(loadBeadsFromStorage()));
    }, []);

    const goHome = useCallback(() => {
        setCustomizeStartInFactory(false);
        setScreen('home');
        refreshBeadCount();
    }, [refreshBeadCount]);

    const openViewBeads = useCallback(() => {
        setCustomizeStartInFactory(false);
        setScreen('customize');
    }, []);

    const openBeadFactory = useCallback(() => {
        setCustomizeStartInFactory(true);
        setScreen('customize');
    }, []);

    useEffect(() => {
        onScreenChange?.(screen === 'kaleidoscope');
    }, [screen, onScreenChange]);

    useEffect(() => {
        onMakerScreenChange?.(screen);
    }, [screen, onMakerScreenChange]);

    /* Section titles in page chrome; home + kaleidoscope keep the shop name.
       Customize / factory titles are owned by those panels. */
    useEffect(() => {
        if (!onChromeTitleChange) return undefined;
        if (screen === 'build') {
            onChromeTitleChange('build your kaleidoscope');
            return () => onChromeTitleChange(null);
        }
        if (screen === 'gallery') {
            onChromeTitleChange('your kaleidoscope collection');
            return () => onChromeTitleChange(null);
        }
        if (screen === 'home' || screen === 'kaleidoscope') {
            onChromeTitleChange(null);
        }
        return undefined;
    }, [screen, onChromeTitleChange]);

    useEffect(() => {
        if (!backInChrome) return undefined;
        if (screen === 'build' || screen === 'gallery') {
            onChromeBackChange(goHome, 'home');
            return () => onChromeBackChange(null);
        }
        if (screen === 'kaleidoscope') {
            onChromeBackChange(() => {
                setActiveKaleidoscope(null);
                setScreen('home');
            }, 'home');
            return () => onChromeBackChange(null);
        }
        if (screen === 'home') {
            onChromeBackChange(null);
        }
        return undefined;
    }, [backInChrome, screen, goHome, onChromeBackChange]);

    useEffect(() => {
        if (screen === 'home' || screen === 'gallery' || screen === 'build') {
            refreshSavedList();
            refreshBeadCount();
        }
    }, [screen, refreshSavedList, refreshBeadCount]);

    if (screen === 'gallery') {
        return (
            <SavedKaleidoscopesGallery
                items={savedList}
                onBack={goHome}
                backInChrome={backInChrome}
                onOpen={(item) => {
                    resumeKaleidoscopeAudio();
                    setActiveKaleidoscope(item);
                    setScreen('kaleidoscope');
                }}
                onDelete={(item) => {
                    const next = deleteSavedKaleidoscope(item.id);
                    setSavedList(next);
                    if (activeKaleidoscope?.id === item.id) {
                        setActiveKaleidoscope(null);
                    }
                    if (next.length === 0) {
                        setScreen('home');
                    }
                }}
            />
        );
    }

    if (screen === 'build') {
        return (
            <div className="kaleidoscope-maker kaleidoscope-maker--hub kaleidoscope-maker--build-layout">
                <BuildKaleidoscopeView
                    onBack={goHome}
                    backInChrome={backInChrome}
                    onChromeForwardChange={onChromeForwardChange}
                    onDone={(saved) => {
                        refreshSavedList();
                        resumeKaleidoscopeAudio();
                        setActiveKaleidoscope(saved);
                        setScreen('kaleidoscope');
                        if (saved && saved.persisted === false) {
                            window.alert(
                                'Browser storage is full, so this kaleidoscope could not be added to your gallery. Your existing saved kaleidoscopes were left alone.',
                            );
                        }
                    }}
                />
            </div>
        );
    }

    const hubKaleidoscope = screen === 'kaleidoscope';
    const homeIntroPending = screen === 'home' && !homeIntroDoneRef.current && !homeIntroReady;
    const homeIntroVisible = screen === 'home' && (homeIntroDoneRef.current || homeIntroReady);
    const hubClass = [
        'kaleidoscope-maker',
        'kaleidoscope-maker--hub',
        screen === 'home' ? 'kaleidoscope-maker--home-screen' : '',
        homeIntroPending ? 'kaleidoscope-maker--home-intro-pending' : '',
        homeIntroVisible ? 'kaleidoscope-maker--home-intro-ready' : '',
        hubCustomize ? 'kaleidoscope-maker--customize-screen' : '',
        hubKaleidoscope
            ? `kaleidoscope-maker--kaleidoscope-layout${fullscreen ? ' kaleidoscope-maker--fullscreen-immersive' : ''}`
            : '',
    ]
        .filter(Boolean)
        .join(' ');

    const homeActionsClass = [
        'kaleidoscope-maker__home-actions',
        hubKaleidoscope ? 'kaleidoscope-maker__home-actions--hidden' : '',
        hubCustomize ? 'kaleidoscope-maker__home-actions--fading' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={hubClass}>
            {screen === 'home' && homeBackdrop ? (
                <div className="kaleidoscope-maker__home-backdrop" aria-hidden="true">
                    <KaleidoscopeHexView
                        key={homeBackdrop.id}
                        ambient
                        initialZoom={0.8}
                        ambientRotateRate={0.045}
                        activeSnapshot={homeBackdrop}
                        onReady={onHomeBackdropReady}
                    />
                </div>
            ) : null}
            <ScallopedPlaque scallopRadius={9} className={homeActionsClass}>
                <button
                    type="button"
                    className="kaleidoscope-maker__home-option"
                    onClick={openBeadFactory}
                    disabled={hubCustomize || hubKaleidoscope}
                >
                    {waveLabel('the bead factory')}
                </button>
                <button
                    type="button"
                    className="kaleidoscope-maker__home-option"
                    onClick={() => setScreen('build')}
                    disabled={hubCustomize || hubKaleidoscope}
                >
                    {waveLabel('kaleidoscope assembly')}
                </button>
                {filledBeadCount > 0 ? (
                    <button
                        type="button"
                        className="kaleidoscope-maker__home-option"
                        onClick={openViewBeads}
                        disabled={hubCustomize || hubKaleidoscope}
                    >
                        {waveLabel('your bead stash')}
                    </button>
                ) : null}
                {savedList.length > 0 ? (
                    <button
                        type="button"
                        className="kaleidoscope-maker__home-option"
                        onClick={() => setScreen('gallery')}
                        disabled={hubCustomize || hubKaleidoscope}
                    >
                        {waveLabel('your kaleidoscope collection')}
                    </button>
                ) : null}
            </ScallopedPlaque>
            {hubCustomize ? (
                <CustomizeBeadsPanel
                    key={customizeStartInFactory ? 'factory' : 'tray'}
                    startInFactory={customizeStartInFactory}
                    onBack={goHome}
                    backInChrome={backInChrome}
                    onChromeBackChange={onChromeBackChange}
                    onChromeForwardChange={onChromeForwardChange}
                    onChromeTitleChange={onChromeTitleChange}
                />
            ) : null}
            {hubKaleidoscope ? (
                <div className="kaleidoscope-maker__hex-shell">
                    <KaleidoscopeHexView
                        key={activeKaleidoscope?.id ?? 'latest'}
                        activeSnapshot={activeKaleidoscope}
                        immersiveChrome={fullscreen}
                        chromeVisible={chromeVisible}
                        onChromeEnter={onChromeEnter}
                        onChromeLeave={onChromeLeave}
                        chromeControlsInTitle={backInChrome}
                        onBack={() => {
                            setActiveKaleidoscope(null);
                            setScreen('home');
                        }}
                    />
                </div>
            ) : null}
        </div>
    );
}

export default KaleidoscopeMaker;
