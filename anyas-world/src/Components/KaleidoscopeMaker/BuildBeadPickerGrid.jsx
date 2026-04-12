import React from 'react';
import { BEAD_GRID_COLS, BEAD_GRID_ROWS, BEAD_HALVES, PETRI_MAX_BEADS } from './constants';
import { BeadVisual } from './BeadVisual';

function BuildPickerCell({ bead, dishFull, onPick }) {
    if (!bead) {
        return <div className="kaleidoscope-maker__build-picker-cell kaleidoscope-maker__build-picker-cell--empty" aria-hidden />;
    }
    const disabled = dishFull;
    return (
        <button
            type="button"
            className="kaleidoscope-maker__build-picker-cell"
            disabled={disabled}
            onClick={() => !disabled && onPick(bead)}
            aria-label={dishFull ? 'Petri dish is full' : `Add ${bead.shape} bead to dish`}
        >
            <span className="kaleidoscope-maker__build-picker-bead">
                <BeadVisual shape={bead.shape} fill={bead.fill} accent={bead.accent} lightDeg={18} />
            </span>
        </button>
    );
}

export function BuildBeadPickerGrid({ beads, dishCount, onPickBead }) {
    const dishFull = dishCount >= PETRI_MAX_BEADS;

    return (
        <div className="kaleidoscope-maker__bead-slot-grid kaleidoscope-maker__bead-slot-grid--visible kaleidoscope-maker__bead-slot-grid--interactive kaleidoscope-maker__build-picker-grid">
            {Array.from({ length: BEAD_GRID_ROWS }, (_, row) => (
                <div key={row} className="kaleidoscope-maker__bead-slot-row">
                    <div className="kaleidoscope-maker__bead-slot-half">
                        {Array.from({ length: BEAD_HALVES }, (_, j) => {
                            const i = row * BEAD_GRID_COLS + j;
                            return (
                                <div key={i} className="kaleidoscope-maker__slot-cell">
                                    <BuildPickerCell bead={beads[i]} dishFull={dishFull} onPick={onPickBead} />
                                </div>
                            );
                        })}
                    </div>
                    <div className="kaleidoscope-maker__bead-slot-half">
                        {Array.from({ length: BEAD_HALVES }, (_, j) => {
                            const i = row * BEAD_GRID_COLS + BEAD_HALVES + j;
                            return (
                                <div key={i} className="kaleidoscope-maker__slot-cell">
                                    <BuildPickerCell bead={beads[i]} dishFull={dishFull} onPick={onPickBead} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
