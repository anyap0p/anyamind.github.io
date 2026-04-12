import React, { useState } from 'react';
import { BEAD_SHAPES, beadFactoryDisplayScale, normalizeBead, randomBead, randomHex } from './beadModel';
import { BeadVisual } from './BeadVisual';

export function BeadFactoryPanel({ onSave, onCancel }) {
    const [bead, setBead] = useState(() => randomBead());

    const cycleShape = () => {
        setBead((b) => {
            const i = BEAD_SHAPES.indexOf(b.shape);
            const nextShape = BEAD_SHAPES[(i + 1) % BEAD_SHAPES.length];
            return { ...b, shape: nextShape };
        });
    };

    const bumpSize = () => {
        setBead((b) => ({ ...b, size: (Number(b.size) + 5) % 101 }));
    };

    const randomColors = () => {
        setBead((b) => ({ ...b, fill: randomHex(), accent: randomHex() }));
    };

    return (
        <div className="kaleidoscope-maker__bead-factory-content">
            <div className="kaleidoscope-maker__bead-factory-stage" aria-hidden>
                <div className="kaleidoscope-maker__bead-factory-preview">
                    <div
                        className="kaleidoscope-maker__bead-factory-preview-scaler"
                        style={{ transform: `scale(${beadFactoryDisplayScale(bead.size)})` }}
                    >
                        <BeadVisual shape={bead.shape} fill={bead.fill} accent={bead.accent} />
                    </div>
                </div>
            </div>
            <div className="kaleidoscope-maker__bead-factory-settings">
                <h1 className="kaleidoscope-maker__bead-factory-heading">the bead factory</h1>
                <label>
                    color 1{' '}
                    <input
                        type="color"
                        value={bead.fill}
                        onChange={(e) => setBead((b) => ({ ...b, fill: e.target.value }))}
                    />
                </label>
                <label>
                    color 2{' '}
                    <input
                        type="color"
                        value={bead.accent}
                        onChange={(e) => setBead((b) => ({ ...b, accent: e.target.value }))}
                    />
                </label>
                <button type="button" onClick={() => onSave(normalizeBead(bead))}>
                    save
                </button>
                <button type="button" onClick={onCancel}>
                    cancel
                </button>
                <div className="kaleidoscope-maker__bead-factory-controls">
                    <button type="button" onClick={cycleShape}>
                        shape: {bead.shape}
                    </button>
                    <button type="button" onClick={bumpSize}>
                        size: {bead.size}
                    </button>
                    <button type="button" onClick={randomColors}>
                        color
                    </button>
                </div>
            </div>
        </div>
    );
}
