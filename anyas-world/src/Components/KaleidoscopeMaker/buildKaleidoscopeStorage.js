import { normalizeBead } from './beadModel';
import { STORAGE_BUILD_KALEIDOSCOPE, STORAGE_SAVED_KALEIDOSCOPES } from './constants';

const SNAPSHOT_VERSION = 1;
const LIST_VERSION = 1;
const MAX_SAVED = 40;

function beadSignature(bead) {
    return `${bead.shape}|${bead.fill}|${bead.accent}|${bead.size}`;
}

function parseStoredSnapshot(parsed) {
    if (!parsed || typeof parsed !== 'object') return null;
    const beads = Array.isArray(parsed.beads)
        ? parsed.beads.map((e) => normalizeBead(e)).filter(Boolean)
        : [];
    const counts =
        parsed.counts && typeof parsed.counts === 'object' && !Array.isArray(parsed.counts)
            ? parsed.counts
            : {};
    return { v: parsed.v ?? SNAPSHOT_VERSION, beads, counts };
}

/**
 * @param {{ bead: object }[]} bodies from petri physics world (insertion order)
 * @returns {{ beads: object[], counts: Record<string, number> }}
 */
export function petriBodiesToSnapshot(bodies) {
    const beads = (bodies ?? []).map((b) => normalizeBead(b.bead)).filter(Boolean);
    const counts = {};
    for (const bead of beads) {
        const key = beadSignature(bead);
        counts[key] = (counts[key] || 0) + 1;
    }
    return { beads, counts };
}

function newSaveId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `k-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readSavedListRaw() {
    try {
        const raw = localStorage.getItem(STORAGE_SAVED_KALEIDOSCOPES);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.items)) return null;
        return parsed;
    } catch {
        return null;
    }
}

function normalizeSavedItem(raw) {
    if (!raw || typeof raw.id !== 'string') return null;
    const beads = Array.isArray(raw.beads) ? raw.beads.map((e) => normalizeBead(e)).filter(Boolean) : [];
    const counts =
        raw.counts && typeof raw.counts === 'object' && !Array.isArray(raw.counts) ? raw.counts : {};
    const createdAt = typeof raw.t === 'number' ? raw.t : raw.createdAt ?? 0;
    return { id: raw.id, createdAt, beads, counts };
}

function tryMigrateLegacyIntoList() {
    const existing = readSavedListRaw();
    if (existing && existing.items.length > 0) return;

    let legacy = null;
    try {
        const raw = localStorage.getItem(STORAGE_BUILD_KALEIDOSCOPE);
        if (raw) legacy = parseStoredSnapshot(JSON.parse(raw));
    } catch {
        legacy = null;
    }
    if (!legacy || !legacy.beads || legacy.beads.length === 0) return;

    const migrated = {
        v: LIST_VERSION,
        items: [
            {
                id: `migrated-${Date.now()}`,
                t: Date.now(),
                beads: legacy.beads,
                counts: legacy.counts,
            },
        ],
    };
    try {
        localStorage.setItem(STORAGE_SAVED_KALEIDOSCOPES, JSON.stringify(migrated));
    } catch {
        /* ignore */
    }
}

/**
 * All saved kaleidoscopes (newest last). Migrates a legacy single snapshot into the list once if needed.
 * @returns {{ id: string, createdAt: number, beads: object[], counts: Record<string, number> }[]}
 */
export function loadSavedKaleidoscopeList() {
    tryMigrateLegacyIntoList();
    const data = readSavedListRaw();
    if (!data) return [];
    return data.items.map(normalizeSavedItem).filter(Boolean);
}

/**
 * Persist latest build as a new gallery entry and as the “current” snapshot for the hex view / refresh.
 * @returns {{ id: string, createdAt: number, beads: object[], counts: Record<string, number> } | null}
 */
export function appendKaleidoscopeSave(bodies) {
    const { beads, counts } = petriBodiesToSnapshot(bodies);
    const id = newSaveId();
    const createdAt = Date.now();
    const entry = { id, t: createdAt, beads, counts };

    const prev = readSavedListRaw();
    const items = [...(prev?.items ?? []), entry].slice(-MAX_SAVED);
    const payload = { v: LIST_VERSION, items };

    const snapshotJson = JSON.stringify({
        v: SNAPSHOT_VERSION,
        beads,
        counts,
    });

    try {
        localStorage.setItem(STORAGE_SAVED_KALEIDOSCOPES, JSON.stringify(payload));
        localStorage.setItem(STORAGE_BUILD_KALEIDOSCOPE, snapshotJson);
    } catch {
        return null;
    }

    return { id, createdAt, beads, counts };
}

export function saveBuildKaleidoscopeSnapshot(bodies) {
    appendKaleidoscopeSave(bodies);
}

export function loadBuildKaleidoscopeSnapshot() {
    try {
        const raw = localStorage.getItem(STORAGE_BUILD_KALEIDOSCOPE);
        if (!raw) return null;
        return parseStoredSnapshot(JSON.parse(raw));
    } catch {
        return null;
    }
}
