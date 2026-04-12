/** Map grayscale artwork (black→primary, white→accent) to bead colors. */

function expandHex(h) {
    let s = h.replace('#', '').trim();
    if (s.length === 3) s = [...s].map((c) => c + c).join('');
    if (s.length !== 6) return '#000000';
    return `#${s.toLowerCase()}`;
}

export function hexToRgb(hex) {
    const h = expandHex(hex || '#000');
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

function rgbToHex(r, g, b) {
    const c = (n) =>
        Math.max(0, Math.min(255, Math.round(n)))
            .toString(16)
            .padStart(2, '0');
    return `#${c(r)}${c(g)}${c(b)}`;
}

/**
 * Grayscale brightness 0 (black) → 1 (white), for #rrggbb with near-equal channels.
 */
export function grayscaleMixTFromHex(hex) {
    const [r, g, b] = hexToRgb(hex);
    const avg = (r + g + b) / (3 * 255);
    return Math.max(0, Math.min(1, avg));
}

export function extractFillHex(style, fillAttr) {
    if (style) {
        const m = style.match(/fill:\s*(#[0-9a-fA-F]{3,8})/i);
        if (m) return expandHex(m[1]);
    }
    if (fillAttr && fillAttr.startsWith('#')) return expandHex(fillAttr);
    return '#000000';
}

export function mixPrimaryAccent(primaryHex, accentHex, t) {
    const p = hexToRgb(primaryHex);
    const s = hexToRgb(accentHex || primaryHex);
    const u = Math.max(0, Math.min(1, t));
    return rgbToHex(
        p[0] + (s[0] - p[0]) * u,
        p[1] + (s[1] - p[1]) * u,
        p[2] + (s[2] - p[2]) * u,
    );
}

/** Nudge brightness from tray rotation (subtle). */
export function adjustBrightnessT(t, lightDeg) {
    if (!Number.isFinite(lightDeg)) return t;
    const bias = Math.sin((lightDeg * Math.PI) / 180) * 0.1;
    return Math.max(0, Math.min(1, t + bias));
}
