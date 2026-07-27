import React from 'react';
import { ScallopedPlaque } from './ScallopedPlaque';

const SHORTCUTS = [
    { keys: ',  .', label: 'tightness' },
    { keys: '←  →', label: 'tilt' },
    { keys: '↑  ↓', label: 'zoom' },
    { keys: 'q', label: 'shake' },
];

export function KaleidoscopeShortcutsPlaque() {
    return (
        <ScallopedPlaque
            allowOverflow
            scallopRadius={9}
            className="kaleidoscope-maker__view-plaque kaleidoscope-maker__view-plaque--shortcuts"
        >
            <h2 className="kaleidoscope-maker__view-plaque-title">shortcuts</h2>
            <ul className="kaleidoscope-maker__view-shortcuts">
                {SHORTCUTS.map(({ keys, label }) => (
                    <li key={label} className="kaleidoscope-maker__view-shortcut">
                        <span className="kaleidoscope-maker__view-shortcut-keys">{keys}</span>
                        <span className="kaleidoscope-maker__view-shortcut-label">{label}</span>
                    </li>
                ))}
            </ul>
        </ScallopedPlaque>
    );
}
