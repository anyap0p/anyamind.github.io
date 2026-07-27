import React from 'react';
import { BEAD_BOX_COUNT } from './constants';

/** Switch between bead boxes (1-based labels). */
export function BeadBoxPager({ boxIndex, onChange, disabled = false }) {
    if (BEAD_BOX_COUNT <= 1) return null;
    return (
        <div className="kaleidoscope-maker__beadbox-pager" role="group" aria-label="Bead box">
            <button
                type="button"
                className="kaleidoscope-maker__beadbox-pager-btn"
                disabled={disabled || boxIndex <= 0}
                onClick={() => onChange(boxIndex - 1)}
                aria-label="Previous bead box"
            >
                ◀
            </button>
            <span className="kaleidoscope-maker__beadbox-pager-label">
                box {boxIndex + 1} / {BEAD_BOX_COUNT}
            </span>
            <button
                type="button"
                className="kaleidoscope-maker__beadbox-pager-btn"
                disabled={disabled || boxIndex >= BEAD_BOX_COUNT - 1}
                onClick={() => onChange(boxIndex + 1)}
                aria-label="Next bead box"
            >
                ▶
            </button>
        </div>
    );
}
