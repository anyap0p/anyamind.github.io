export const BEAD_SHAPES = ['heart', 'circle', 'oval', 'flower'];

/** Only beads with an uploaded picture can use the 'image' shape. */
export function beadShapeOptions(bead) {
    return bead?.image ? [...BEAD_SHAPES, 'image'] : BEAD_SHAPES;
}

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

    const image =
        typeof raw.image === 'string' && raw.image.startsWith('data:image/') ? raw.image : null;
    const holo = raw.holo === true;

    let shape = raw.shape;
    if (shape === 'image') {
        if (!image) shape = 'circle';
    } else if (shape !== 'glitter' && !BEAD_SHAPES.includes(shape)) {
        shape = 'circle';
    }

    let size = Number(raw.size);
    if (!Number.isFinite(size)) size = 50;
    size = Math.min(100, Math.max(0, Math.round(size)));

    const bead = { fill, accent, shape, size };
    if (image) bead.image = image;
    if (shape === 'glitter') {
        if (holo) bead.holo = true;
        /* Glitter renders on its own plane: in front of the beads or behind them. */
        if (raw.zFront === true) bead.zFront = true;
    }
    return bead;
}

/**
 * One glitter speck: sand-grain dot for the petri dish. Random size for a
 * natural pinch; `holo` specks ignore fill and glint through spectral colors.
 * Each speck randomly lands on the plane in front of or behind the beads.
 * @param {{ fill?: string, holo?: boolean }} opts
 */
export function makeGlitterBead({ fill = '#ffffff', holo = false } = {}) {
    return normalizeBead({
        shape: 'glitter',
        fill,
        accent: fill,
        size: Math.floor(Math.random() * 101),
        holo,
        zFront: Math.random() < 0.5,
    });
}

/** Maps 0–100 to scale in the tray (all orbs in a slot share this; small/large both bumped up). */
export function beadSizeToScale(size) {
    const s = Number(size);
    const t = Number.isFinite(s) ? Math.min(100, Math.max(0, s)) : 50;
    return 0.52 + (t / 100) * 1.02;
}

/** Tray pile: smaller beads → slightly more orbs (capped low for performance vs full SVG per orb). */
export function beadTrayOrbCount(size) {
    const s = Number(size);
    const t = Number.isFinite(s) ? Math.min(100, Math.max(0, s)) : 50;
    return Math.round(6 + ((100 - t) / 100) * 10);
}

/**
 * Factory preview size as % of the preview stage (layout-sized, not CSS transform).
 * Kept under ~90% so circle/oval beads never overflow/clip the stage.
 */
export function beadFactoryDisplayPercent(size) {
    const s = Number(size);
    const t = Number.isFinite(s) ? Math.min(100, Math.max(0, s)) : 50;
    return 38 + (t / 100) * 50;
}
