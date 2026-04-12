export const BEAD_SHAPES = ['heart', 'circle', 'oval', 'flower'];

export function randomHex() {
    return `#${Math.floor(Math.random() * 0x1000000)
        .toString(16)
        .padStart(6, '0')}`;
}

export function randomBead() {
    return {
        shape: BEAD_SHAPES[Math.floor(Math.random() * BEAD_SHAPES.length)],
        size: Math.floor(Math.random() * 101),
        fill: randomHex(),
        accent: randomHex(),
    };
}

function expandHex(s) {
    if (!s || typeof s !== 'string' || !s.startsWith('#')) return null;
    let h = s.slice(1);
    if (h.length === 3) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6 || !/^[0-9a-fA-F]+$/.test(h)) return null;
    return `#${h.toLowerCase()}`;
}

export function normalizeBead(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const fill = expandHex(raw.fill) || '#888888';
    let accent = expandHex(raw.accent) || fill;

    let shape = raw.shape;
    if (!BEAD_SHAPES.includes(shape)) shape = 'circle';

    let size = Number(raw.size);
    if (!Number.isFinite(size)) size = 50;
    size = Math.min(100, Math.max(0, Math.round(size)));

    return { fill, accent, shape, size };
}

/** Maps 0–100 to scale in the tray (all orbs in a slot share this; small/large both bumped up). */
export function beadSizeToScale(size) {
    const s = Number(size);
    const t = Number.isFinite(s) ? Math.min(100, Math.max(0, s)) : 50;
    return 0.52 + (t / 100) * 1.02;
}

/** Tray pile: smaller beads → more orbs (large beads still show a dense pile). */
export function beadTrayOrbCount(size) {
    const s = Number(size);
    const t = Number.isFinite(s) ? Math.min(100, Math.max(0, s)) : 50;
    return Math.round(20 + ((100 - t) / 100) * 24);
}

/** Scale for the bead factory preview (same 0–100 range, larger min/max than before). */
export function beadFactoryDisplayScale(size) {
    const s = Number(size);
    const t = Number.isFinite(s) ? Math.min(100, Math.max(0, s)) : 50;
    return 0.58 + (t / 100) * 1.12;
}
