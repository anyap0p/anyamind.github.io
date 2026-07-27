/**
 * Outward scallops with a fixed pixel radius on every side.
 * Path stays inside the element box: peaks touch the outer edge, valleys sit inset by r.
 */
export function buildScallopPathPx(w, h, r) {
    const innerW = w - 2 * r;
    const innerH = h - 2 * r;
    if (innerW < 4 || innerH < 4) {
        return `M 0 0 H ${w} V ${h} H 0 Z`;
    }

    const nx = Math.max(2, Math.round(innerW / (2 * r)));
    const ny = Math.max(2, Math.round(innerH / (2 * r)));
    const parts = [`M ${r} ${r}`];

    /* Top: valleys at y=r, peaks at y=0 */
    for (let i = 0; i < nx; i += 1) {
        const xEnd = r + ((i + 1) * innerW) / nx;
        const xMid = r + (i + 0.5) * (innerW / nx);
        parts.push(`Q ${xMid} 0 ${xEnd} ${r}`);
    }

    /* Right: valleys at x=w-r, peaks at x=w */
    for (let i = 0; i < ny; i += 1) {
        const yEnd = r + ((i + 1) * innerH) / ny;
        const yMid = r + (i + 0.5) * (innerH / ny);
        parts.push(`Q ${w} ${yMid} ${w - r} ${yEnd}`);
    }

    /* Bottom: valleys at y=h-r, peaks at y=h */
    for (let i = 0; i < nx; i += 1) {
        const xEnd = w - r - ((i + 1) * innerW) / nx;
        const xMid = w - r - (i + 0.5) * (innerW / nx);
        parts.push(`Q ${xMid} ${h} ${xEnd} ${h - r}`);
    }

    /* Left: valleys at x=r, peaks at x=0 */
    for (let i = 0; i < ny; i += 1) {
        const yEnd = h - r - ((i + 1) * innerH) / ny;
        const yMid = h - r - (i + 0.5) * (innerH / ny);
        parts.push(`Q 0 ${yMid} ${r} ${yEnd}`);
    }

    parts.push('Z');
    return parts.join(' ');
}
