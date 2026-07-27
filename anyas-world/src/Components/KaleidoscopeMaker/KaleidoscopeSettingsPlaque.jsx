import React from 'react';
import { resumeKaleidoscopeAudio } from './kaleidoscopeAudioContext';
import { ScallopedPlaque } from './ScallopedPlaque';
import {
    TIGHTNESS_MAX,
    TIGHTNESS_MIN,
    useKaleidoscopeViewControls,
    ZOOM_MAX,
    ZOOM_MIN,
} from './KaleidoscopeViewControlsContext';

export function KaleidoscopeSettingsPlaque() {
    const ctrl = useKaleidoscopeViewControls();
    if (!ctrl) return null;

    const { zoom, setZoom, tightness, setTightness, tracers, setTracers, shake } = ctrl;

    return (
        <ScallopedPlaque
            allowOverflow
            scallopRadius={9}
            className="kaleidoscope-maker__view-plaque kaleidoscope-maker__view-plaque--settings"
        >
            <h2 className="kaleidoscope-maker__view-plaque-title">settings</h2>
            <label className="kaleidoscope-maker__view-setting">
                <span className="kaleidoscope-maker__view-setting-label">zoom</span>
                <input
                    type="range"
                    className="kaleidoscope-maker__view-setting-range"
                    min={ZOOM_MIN}
                    max={ZOOM_MAX}
                    step={0.01}
                    value={zoom}
                    aria-label="Kaleidoscope zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                />
            </label>
            <label className="kaleidoscope-maker__view-setting">
                <span className="kaleidoscope-maker__view-setting-label">tightness</span>
                <input
                    type="range"
                    className="kaleidoscope-maker__view-setting-range"
                    min={TIGHTNESS_MIN}
                    max={TIGHTNESS_MAX}
                    step={0.01}
                    value={tightness}
                    aria-label="Fractal tightness"
                    onChange={(e) => setTightness(Number(e.target.value))}
                />
            </label>
            <div className="kaleidoscope-maker__view-setting">
                <label className="kaleidoscope-maker__view-toggle">
                    <input
                        type="checkbox"
                        checked={tracers}
                        onChange={(e) => setTracers(e.target.checked)}
                    />
                    <span className="kaleidoscope-maker__view-setting-label">tracers</span>
                </label>
                <button
                    type="button"
                    className="kaleidoscope-maker__view-action kaleidoscope-maker__view-action--stacked"
                    onClick={() => {
                        resumeKaleidoscopeAudio();
                        shake();
                    }}
                >
                    shake it
                </button>
            </div>
        </ScallopedPlaque>
    );
}
