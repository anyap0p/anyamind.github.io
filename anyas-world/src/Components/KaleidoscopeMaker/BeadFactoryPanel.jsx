import React, { useCallback, useEffect, useState } from 'react';
import { beadFactoryDisplayPercent, normalizeBead, randomBead } from './beadModel';
import { BeadColorControls } from './BeadColorControls';
import { BeadShapePicker } from './BeadShapePicker';
import { BeadVisual } from './BeadVisual';
import { ScallopedPlaque } from './ScallopedPlaque';

export function BeadFactoryPanel({
    onSave,
    onCancel,
    backInChrome = false,
    onChromeBackChange,
    onChromeForwardChange,
    onChromeTitleChange,
}) {
    const [bead, setBead] = useState(() => randomBead());
    const previewPct = beadFactoryDisplayPercent(bead.size);

    const handleSave = useCallback(() => {
        onSave(normalizeBead(bead));
    }, [onSave, bead]);

    useEffect(() => {
        onChromeTitleChange?.('the bead factory');
        return () => onChromeTitleChange?.(null);
    }, [onChromeTitleChange]);

    useEffect(() => {
        if (!backInChrome) return undefined;
        onChromeBackChange?.(onCancel, 'cancel');
        onChromeForwardChange?.(handleSave, 'save');
        return () => {
            onChromeBackChange?.(null);
            onChromeForwardChange?.(null);
        };
    }, [
        backInChrome,
        onCancel,
        handleSave,
        onChromeBackChange,
        onChromeForwardChange,
    ]);

    return (
        <div className="kaleidoscope-maker__bead-factory-content">
            {!backInChrome ? (
                <header className="kaleidoscope-maker__bead-factory-header">
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
                    <h1 className="kaleidoscope-maker__bead-factory-heading">the bead factory</h1>
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
                </header>
            ) : null}

            <div className="kaleidoscope-maker__bead-factory-stack">
                <div className="kaleidoscope-maker__bead-factory-tools">
                    <ScallopedPlaque allowOverflow scallopRadius={9} className="kaleidoscope-maker__factory-plaque">
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
                    </ScallopedPlaque>
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
    );
}
