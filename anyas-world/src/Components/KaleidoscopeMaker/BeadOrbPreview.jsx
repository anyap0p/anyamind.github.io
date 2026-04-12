import React from 'react';
import { beadSizeToScale } from './beadModel';
import { BeadVisual } from './BeadVisual';

/** Tray pile orb: position from physics (`x`,`y`) or rest (`layout`). */
export function BeadOrbPreview({ bead, layout, x, y }) {
    const scale = beadSizeToScale(bead.size);
    const px = x ?? layout.x;
    const py = y ?? layout.y;

    return (
        <span
            className={`kaleidoscope-maker__slot-bead kaleidoscope-maker__slot-bead--${bead.shape}`}
            style={{
                left: `${px}%`,
                top: `${py}%`,
                transform: `translate(-50%, -50%) rotate(${layout.rot}deg) scale(${scale})`,
            }}
            aria-hidden
        >
            <BeadVisual
                shape={bead.shape}
                fill={bead.fill}
                accent={bead.accent}
                lightDeg={layout.rot}
            />
        </span>
    );
}
