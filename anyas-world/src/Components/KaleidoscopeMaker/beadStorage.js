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

export function saveBeadsToStorage(beads) {
    try {
        localStorage.setItem(STORAGE_CUSTOM_BEADS, JSON.stringify(beads));
    } catch {
        /* ignore quota */
    }
}
