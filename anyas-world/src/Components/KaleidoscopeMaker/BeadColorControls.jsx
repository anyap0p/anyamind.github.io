import React, { useState } from 'react';
import diceImg from '../../Icons/dice.png';
import { randomHex } from './beadModel';

/** Side-by-side color 1 / color 2 + dice randomize (shakes on click). */
export function BeadColorControls({ bead, onChange, className = '' }) {
    const [shakeKey, setShakeKey] = useState(0);

    const randomize = () => {
        setShakeKey((k) => k + 1);
        onChange?.({ ...bead, fill: randomHex(), accent: randomHex() });
    };

    return (
        <div className={`kaleidoscope-maker__bead-color-controls ${className}`.trim()}>
            <p className="kaleidoscope-maker__bead-color-controls-title">pick a color</p>
            <div className="kaleidoscope-maker__bead-color-row">
                <label className="kaleidoscope-maker__bead-color-swatch">
                    <span className="kaleidoscope-maker__bead-color-swatch-label">color 1</span>
                    <input
                        type="color"
                        value={bead.fill}
                        onChange={(e) => onChange?.({ ...bead, fill: e.target.value })}
                        aria-label="color 1"
                    />
                </label>
                <label className="kaleidoscope-maker__bead-color-swatch">
                    <span className="kaleidoscope-maker__bead-color-swatch-label">color 2</span>
                    <input
                        type="color"
                        value={bead.accent}
                        onChange={(e) => onChange?.({ ...bead, accent: e.target.value })}
                        aria-label="color 2"
                    />
                </label>
                <div className="kaleidoscope-maker__bead-color-dice-wrap">
                    <span className="kaleidoscope-maker__bead-color-dice-label" aria-hidden>
                        randomize
                    </span>
                    <button
                        type="button"
                        key={shakeKey}
                        className={`kaleidoscope-maker__bead-color-dice${shakeKey > 0 ? ' kaleidoscope-maker__bead-color-dice--shake' : ''}`}
                        onClick={randomize}
                        aria-label="Randomize colors"
                        title="randomize colors"
                    >
                        <img src={diceImg} alt="" draggable={false} />
                    </button>
                </div>
            </div>
        </div>
    );
}
