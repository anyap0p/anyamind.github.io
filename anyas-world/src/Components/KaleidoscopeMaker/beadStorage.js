import { normalizeBead } from './beadModel';
import { SLOT_COUNT, STORAGE_CUSTOM_BEADS } from './constants';

export function loadBeadsFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_CUSTOM_BEADS);
        if (!raw) return Array.from({ length: SLOT_COUNT }, () => null);
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return Array.from({ length: SLOT_COUNT }, () => null);
        const next = parsed.slice(0, SLOT_COUNT);
        while (next.length < SLOT_COUNT) next.push(null);
        return next.map((entry) => (entry == null ? null : normalizeBead(entry)));
    } catch {
        return Array.from({ length: SLOT_COUNT }, () => null);
    }
}

export function countFilledBeads(beads = loadBeadsFromStorage()) {
    return beads.reduce((n, bead) => n + (bead ? 1 : 0), 0);
}

/** First empty tray slot, or -1 if every slot is filled. */
export function findFirstEmptyBeadSlot(beads = loadBeadsFromStorage()) {
    return beads.findIndex((bead) => !bead);
}

export function saveBeadsToStorage(beads) {
    try {
        localStorage.setItem(STORAGE_CUSTOM_BEADS, JSON.stringify(beads));
    } catch {
        /* ignore quota */
    }
}
