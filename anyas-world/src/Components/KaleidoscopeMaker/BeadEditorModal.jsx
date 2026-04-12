import React, { useEffect, useState } from 'react';
import { BEAD_SHAPES, beadSizeToScale, normalizeBead, randomHex } from './beadModel';
import { BeadVisual } from './BeadVisual';

export function BeadEditorModal({ initial, title, onSave, onCancel, onRemove }) {
    const [bead, setBead] = useState(() => normalizeBead(initial));

    useEffect(() => {
        setBead(normalizeBead(initial));
    }, [initial]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onCancel();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onCancel]);

    if (!bead) return null;

    const cycleShape = () => {
        setBead((b) => {
            const i = BEAD_SHAPES.indexOf(b.shape);
            return { ...b, shape: BEAD_SHAPES[(i + 1) % BEAD_SHAPES.length] };
        });
    };

    const bumpSize = () => setBead((b) => ({ ...b, size: (b.size + 5) % 101 }));
    const randomColors = () => setBead((b) => ({ ...b, fill: randomHex(), accent: randomHex() }));

    const previewScale = beadSizeToScale(bead.size);

    return (
        <div className="kaleidoscope-maker__bead-editor-backdrop" onClick={onCancel} role="presentation">
            <div
                className="kaleidoscope-maker__bead-editor"
                role="dialog"
                aria-labelledby="km-bead-editor-title"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="km-bead-editor-title" className="kaleidoscope-maker__bead-editor-title">
                    {title}
                </h2>
                <div
                    className="kaleidoscope-maker__bead-editor-preview"
                    style={{ transform: `scale(${previewScale})` }}
                >
                    <BeadVisual shape={bead.shape} fill={bead.fill} accent={bead.accent} />
                </div>
                <label className="kaleidoscope-maker__bead-editor-field">
                    <span>color 1</span>
                    <input
                        type="color"
                        value={bead.fill}
                        onChange={(e) => setBead((b) => ({ ...b, fill: e.target.value }))}
                    />
                </label>
                <label className="kaleidoscope-maker__bead-editor-field">
                    <span>color 2</span>
                    <input
                        type="color"
                        value={bead.accent}
                        onChange={(e) => setBead((b) => ({ ...b, accent: e.target.value }))}
                    />
                </label>
                <div className="kaleidoscope-maker__bead-factory-controls kaleidoscope-maker__bead-editor-factory-controls">
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
                <div className="kaleidoscope-maker__bead-editor-actions">
                    <button type="button" onClick={() => onSave(normalizeBead(bead))}>
                        save
                    </button>
                    {onRemove ? (
                        <button type="button" className="kaleidoscope-maker__bead-editor-remove" onClick={onRemove}>
                            remove bead
                        </button>
                    ) : null}
                    <button type="button" onClick={onCancel}>
                        cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
