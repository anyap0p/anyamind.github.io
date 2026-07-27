import React, { useEffect, useState } from 'react';
import { beadFactoryDisplayPercent, normalizeBead } from './beadModel';
import { BeadColorControls } from './BeadColorControls';
import { BeadShapePicker } from './BeadShapePicker';
import { BeadVisual } from './BeadVisual';
import { ScallopedPlaque } from './ScallopedPlaque';

function TrashCanIcon() {
    return (
        <svg
            className="kaleidoscope-maker__bead-editor-delete-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden
            focusable="false"
        >
            <path
                fill="currentColor"
                d="M9 3h6a1 1 0 0 1 1 1v1h4v2H4V5h4V4a1 1 0 0 1 1-1zm1 2v0h4V5h-4zM6 9h12l-.8 11.1A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.9L6 9zm3 2v8h2v-8H9zm4 0v8h2v-8h-2z"
            />
        </svg>
    );
}

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

    const previewPct = beadFactoryDisplayPercent(bead.size);

    const handleSave = () => {
        onSave(normalizeBead(bead));
    };

    return (
        <div className="kaleidoscope-maker__bead-editor-backdrop" onClick={onCancel} role="presentation">
            <ScallopedPlaque
                allowOverflow
                scallopRadius={9}
                className="kaleidoscope-maker__bead-editor-plaque"
            >
                <div
                    className="kaleidoscope-maker__bead-editor"
                    role="dialog"
                    aria-labelledby="km-bead-editor-title"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="kaleidoscope-maker__bead-editor-content">
                        <header className="kaleidoscope-maker__bead-factory-header kaleidoscope-maker__bead-editor-header">
                            <button
                                type="button"
                                className="kaleidoscope-maker__bead-factory-nav kaleidoscope-maker__bead-factory-nav--cancel"
                                onClick={onCancel}
                                aria-label="Cancel"
                            >
                                <span aria-hidden="true">←</span>
                                <span className="kaleidoscope-maker__bead-factory-nav-tip" aria-hidden="true">
                                    cancel
                                </span>
                            </button>
                            <h2 id="km-bead-editor-title" className="kaleidoscope-maker__bead-factory-heading">
                                {title}
                            </h2>
                            <div className="kaleidoscope-maker__bead-editor-header-actions">
                                {onRemove ? (
                                    <button
                                        type="button"
                                        className="kaleidoscope-maker__bead-editor-delete"
                                        onClick={onRemove}
                                        aria-label="Delete this bead"
                                    >
                                        <TrashCanIcon />
                                        <span className="kaleidoscope-maker__bead-factory-nav-tip" aria-hidden="true">
                                            delete this bead
                                        </span>
                                    </button>
                                ) : null}
                                <button
                                    type="button"
                                    className="kaleidoscope-maker__bead-factory-nav kaleidoscope-maker__bead-factory-nav--save"
                                    onClick={handleSave}
                                    aria-label="Save bead"
                                >
                                    <span aria-hidden="true">→</span>
                                    <span className="kaleidoscope-maker__bead-factory-nav-tip" aria-hidden="true">
                                        save
                                    </span>
                                </button>
                            </div>
                        </header>

                        <div className="kaleidoscope-maker__bead-factory-stack kaleidoscope-maker__bead-editor-stack">
                            <div className="kaleidoscope-maker__bead-factory-tools">
                                <div className="kaleidoscope-maker__bead-editor-settings">
                                    <BeadColorControls bead={bead} onChange={setBead} />
                                    <BeadShapePicker bead={bead} onChange={setBead} />
                                    <label className="kaleidoscope-maker__view-setting kaleidoscope-maker__bead-size-slider">
                                        <span className="kaleidoscope-maker__view-setting-label">
                                            size{' '}
                                            <span className="kaleidoscope-maker__factory-setting-value" aria-hidden>
                                                {bead.size}
                                            </span>
                                        </span>
                                        <input
                                            type="range"
                                            className="kaleidoscope-maker__view-setting-range"
                                            min={0}
                                            max={100}
                                            step={1}
                                            value={bead.size}
                                            onChange={(e) =>
                                                setBead((b) => ({ ...b, size: Number(e.target.value) }))
                                            }
                                            aria-valuetext={`size ${bead.size}`}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="kaleidoscope-maker__bead-factory-stage" aria-hidden>
                                <div className="kaleidoscope-maker__bead-factory-preview">
                                    <div
                                        className="kaleidoscope-maker__bead-factory-preview-scaler"
                                        style={{ width: `${previewPct}%`, height: `${previewPct}%` }}
                                    >
                                        <BeadVisual
                                            shape={bead.shape}
                                            fill={bead.fill}
                                            accent={bead.accent}
                                            image={bead.image}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScallopedPlaque>
        </div>
    );
}
