import { countFilledBeads, saveBeadsToStorage } from './beadStorage';
import { persistKaleidoscopeSnapshot } from './buildKaleidoscopeStorage';
import { normalizeBead } from './beadModel';
import { SLOT_COUNT } from './constants';
import { generateRandomKaleidoscopeSnapshot } from './generateRandomKaleidoscopeSnapshot';

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

/** Unique non-glitter bead designs for the tray (glitter is added during build). */
function uniqueTrayBeads(beads) {
    const seen = new Set();
    const out = [];
    for (const raw of beads ?? []) {
        const bead = normalizeBead(raw);
        if (!bead || bead.shape === 'glitter') continue;
        const sig = beadSignature(bead);
        if (seen.has(sig)) continue;
        seen.add(sig);
        out.push(bead);
    }
    return out;
}

function seedBeadTrayFromKaleidoscope(beads) {
    const tray = Array.from({ length: SLOT_COUNT }, () => null);
    const unique = uniqueTrayBeads(beads);
    for (let i = 0; i < Math.min(unique.length, SLOT_COUNT); i += 1) {
        tray[i] = unique[i];
    }
    saveBeadsToStorage(tray);
}

/**
 * First-time starter: random kaleidoscope saved to gallery + bead tray filled
 * with the unique bead designs from that kaleidoscope.
 */
export function seedStarterKaleidoscope() {
    const generated = generateRandomKaleidoscopeSnapshot();
    const persisted = persistKaleidoscopeSnapshot(generated);
    const snapshot = persisted ?? generated;

    if (countFilledBeads() === 0) {
        seedBeadTrayFromKaleidoscope(snapshot.beads);
    }

    return snapshot;
}
