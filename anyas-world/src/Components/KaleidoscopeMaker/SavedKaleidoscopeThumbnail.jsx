import React, { useMemo } from 'react';
import { BeadVisual } from './BeadVisual';
import { petriBeadRadiusPx } from './petriDishPhysics';

const THUMB_PX = 118;

function hashStringToSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(seed) {
    let a = seed >>> 0;
    return function next() {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function layoutThumbBeads(saveId, beads, sizePx) {
    const cx = sizePx / 2;
    const cy = sizePx / 2;
    const R = sizePx * 0.43;
    const rng = mulberry32(hashStringToSeed(saveId) ^ 0x9e3779b9);
    return beads.map((bead, i) => {
        const r = petriBeadRadiusPx(bead.size, R);
        const u = rng();
        const v = rng();
        const dist = Math.max(0, R - r - 5) * Math.sqrt(u);
        const theta = v * Math.PI * 2;
        const x = cx + dist * Math.cos(theta);
        const y = cy + dist * Math.sin(theta);
        const spin = rng() * 360;
        return { bead, x, y, r, spin, key: `${saveId}-${i}` };
    });
}

/**
 * Static mini petri dish preview; bead positions are deterministic from save id (random-looking layout).
 */
export function SavedKaleidoscopeThumbnail({ item, onOpen }) {
    const placements = useMemo(
        () => layoutThumbBeads(item.id, item.beads, THUMB_PX),
        [item.id, item.beads],
    );

    return (
        <button
            type="button"
            className="kaleidoscope-maker__saved-thumb"
            onClick={onOpen}
            aria-label="Open saved kaleidoscope"
        >
            <div className="kaleidoscope-maker__petri-wrap kaleidoscope-maker__petri-wrap--thumb">
                <div className="kaleidoscope-maker__petri-sizer">
                    <div className="kaleidoscope-maker__petri-rotate" style={{ transform: 'none' }}>
                        <div className="kaleidoscope-maker__petri-rim" aria-hidden />
                        <div className="kaleidoscope-maker__petri-inner">
                            {placements.map((p) => (
                                <div
                                    key={p.key}
                                    className="kaleidoscope-maker__petri-bead"
                                    data-shape={p.bead.shape}
                                    style={{
                                        left: `${p.x - p.r}px`,
                                        top: `${p.y - p.r}px`,
                                        width: `${p.r * 2}px`,
                                        height: `${p.r * 2}px`,
                                    }}
                                >
                                    <BeadVisual
                                        shape={p.bead.shape}
                                        fill={p.bead.fill}
                                        accent={p.bead.accent}
                                        lightDeg={p.spin}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}
