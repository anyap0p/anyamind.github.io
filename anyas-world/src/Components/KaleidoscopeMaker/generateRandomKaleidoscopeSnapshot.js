import { makeGlitterBead, normalizeBead, randomBead, randomHex } from './beadModel';

function hashShort(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
}

function beadSignature(bead) {
    const img = bead.image ? hashShort(bead.image) : '';
    const holo = bead.holo ? 'holo' : '';
    const z = bead.zFront ? 'f' : '';
    return `${bead.shape}|${bead.fill}|${bead.accent}|${bead.size}|${img}|${holo}|${z}`;
}

function countsForBeads(beads) {
    const counts = {};
    for (const bead of beads) {
        const key = beadSignature(bead);
        counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
}

/** Random kaleidoscope contents for the first-time starter pack. */
export function generateRandomKaleidoscopeSnapshot() {
    const beads = [];

    const beadCount = 14 + Math.floor(Math.random() * 12);
    for (let i = 0; i < beadCount; i += 1) {
        beads.push(normalizeBead(randomBead()));
    }

    const glitterCount = 48 + Math.floor(Math.random() * 96);
    const palette = [randomHex(), randomHex(), randomHex()];
    for (let i = 0; i < glitterCount; i += 1) {
        beads.push(
            makeGlitterBead({
                fill: palette[Math.floor(Math.random() * palette.length)],
                holo: Math.random() < 0.12,
            }),
        );
    }

    return {
        beads,
        counts: countsForBeads(beads),
    };
}
