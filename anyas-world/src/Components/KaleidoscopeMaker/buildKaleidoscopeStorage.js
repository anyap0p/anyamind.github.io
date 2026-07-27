import { normalizeBead } from './beadModel';
import {
    STORAGE_BEAD_ASSETS,
    STORAGE_BUILD_KALEIDOSCOPE,
    STORAGE_SAVED_KALEIDOSCOPES,
} from './constants';

const SNAPSHOT_VERSION = 1;
const LIST_VERSION = 1;
const MAX_SAVED = 40;
/** If a new save won't fit, try again with glitter thinned to this many specks. */
const STORAGE_MAX_GLITTER = 240;

/** FNV-1a: short stable key for a data URL (full URL would bloat the counts map). */
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

function readAssets() {
    try {
        const raw = localStorage.getItem(STORAGE_BEAD_ASSETS);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
        return parsed;
    } catch {
        return {};
    }
}

function unpackBead(raw, assets) {
    if (!raw || typeof raw !== 'object') return null;
    if (typeof raw.imageKey === 'string' && !raw.image && assets?.[raw.imageKey]) {
        return normalizeBead({ ...raw, image: assets[raw.imageKey] });
    }
    return normalizeBead(raw);
}

function packBead(bead, assetsOut) {
    const n = normalizeBead(bead);
    if (!n) return null;
    if (n.image) {
        const key = hashShort(n.image);
        assetsOut[key] = n.image;
        const packed = { ...n, imageKey: key };
        delete packed.image;
        return packed;
    }
    return n;
}

function packBeads(beads, assetsOut) {
    return (beads ?? []).map((b) => packBead(b, assetsOut)).filter(Boolean);
}

function unpackBeads(beads, assets) {
    return (beads ?? []).map((b) => unpackBead(b, assets)).filter(Boolean);
}

function thinGlitter(beads, maxGlitter) {
    const solid = [];
    const glitter = [];
    for (const b of beads ?? []) {
        if (b?.shape === 'glitter') glitter.push(b);
        else solid.push(b);
    }
    if (glitter.length <= maxGlitter) return beads ?? [];
    const step = Math.ceil(glitter.length / maxGlitter);
    return [...solid, ...glitter.filter((_, i) => i % step === 0)];
}

function normalizeSavedItem(raw, assets) {
    if (!raw || typeof raw.id !== 'string') return null;
    const beads = unpackBeads(raw.beads, assets);
    const counts =
        raw.counts && typeof raw.counts === 'object' && !Array.isArray(raw.counts) ? raw.counts : {};
    const createdAt = typeof raw.t === 'number' ? raw.t : raw.createdAt ?? 0;
    return { id: raw.id, createdAt, beads, counts };
}

function gcAssets(assets, items) {
    const used = new Set();
    for (const item of items ?? []) {
        for (const b of item?.beads ?? []) {
            if (typeof b?.imageKey === 'string') used.add(b.imageKey);
        }
    }
    const next = {};
    for (const key of used) {
        if (assets[key]) next[key] = assets[key];
    }
    return next;
}

/** Move inline data-URL images on old gallery rows into the shared asset map (dedupe). */
function migrateInlineImagesInList() {
    const data = readSavedListRaw();
    if (!data?.items?.length) return;

    const assets = { ...readAssets() };
    let changed = false;
    const items = data.items.map((item) => {
        if (!item || !Array.isArray(item.beads)) return item;
        const beads = item.beads.map((b) => {
            if (!b || typeof b !== 'object') return b;
            if (typeof b.image === 'string' && b.image.startsWith('data:image/')) {
                changed = true;
                return packBead(b, assets) ?? b;
            }
            return b;
        });
        return { ...item, beads };
    });
    if (!changed) return;

    try {
        const prunedAssets = gcAssets(assets, items);
        localStorage.setItem(STORAGE_BEAD_ASSETS, JSON.stringify(prunedAssets));
        localStorage.setItem(STORAGE_SAVED_KALEIDOSCOPES, JSON.stringify({ v: LIST_VERSION, items }));
    } catch {
        /* Quota too tight to rewrite — leave legacy rows as-is. */
    }
}

function tryMigrateLegacyIntoList() {
    const existing = readSavedListRaw();
    if (existing && existing.items.length > 0) return;

    let legacy = null;
    try {
        const raw = localStorage.getItem(STORAGE_BUILD_KALEIDOSCOPE);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                const assets = readAssets();
                legacy = {
                    beads: unpackBeads(parsed.beads, assets),
                    counts:
                        parsed.counts && typeof parsed.counts === 'object' && !Array.isArray(parsed.counts)
                            ? parsed.counts
                            : {},
                };
            }
        }
    } catch {
        legacy = null;
    }
    if (!legacy || !legacy.beads || legacy.beads.length === 0) return;

    const assets = {};
    const packedBeads = packBeads(legacy.beads, assets);
    const migrated = {
        v: LIST_VERSION,
        items: [
            {
                id: `migrated-${Date.now()}`,
                t: Date.now(),
                beads: packedBeads,
                counts: legacy.counts,
            },
        ],
    };
    try {
        localStorage.setItem(STORAGE_BEAD_ASSETS, JSON.stringify(assets));
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
    migrateInlineImagesInList();
    const data = readSavedListRaw();
    if (!data) return [];
    const assets = readAssets();
    return data.items.map((raw) => normalizeSavedItem(raw, assets)).filter(Boolean);
}

function writeGallery(items, assets, snapshotPacked) {
    const prunedAssets = gcAssets(assets, items);
    /* Assets first so a failed list write never leaves the gallery pointing at missing images. */
    localStorage.setItem(STORAGE_BEAD_ASSETS, JSON.stringify(prunedAssets));
    localStorage.setItem(STORAGE_SAVED_KALEIDOSCOPES, JSON.stringify({ v: LIST_VERSION, items }));
    localStorage.setItem(
        STORAGE_BUILD_KALEIDOSCOPE,
        JSON.stringify({
            v: SNAPSHOT_VERSION,
            beads: snapshotPacked.beads,
            counts: snapshotPacked.counts,
        }),
    );
}

/**
 * Save a bead snapshot to the gallery (and as the current build snapshot).
 * @returns {{ id: string, createdAt: number, beads: object[], counts: Record<string, number> } | null}
 */
export function persistKaleidoscopeSnapshot({ beads, counts, id, createdAt }) {
    const saveId = id ?? newSaveId();
    const t = createdAt ?? Date.now();
    const normalized = (beads ?? []).map((b) => normalizeBead(b)).filter(Boolean);
    if (normalized.length === 0) return null;

    const prev = readSavedListRaw();
    const prevItems = prev?.items ?? [];
    const assets = { ...readAssets() };
    const attempts = [normalized, thinGlitter(normalized, STORAGE_MAX_GLITTER)];

    for (const attemptBeads of attempts) {
        const attemptCounts = {};
        for (const bead of attemptBeads) {
            const n = normalizeBead(bead);
            if (!n) continue;
            const key = beadSignature(n);
            attemptCounts[key] = (attemptCounts[key] || 0) + 1;
        }
        const attemptAssets = { ...assets };
        const packedBeads = packBeads(attemptBeads, attemptAssets);
        const entry = { id: saveId, t, beads: packedBeads, counts: attemptCounts };
        const items = [...prevItems, entry].slice(-MAX_SAVED);

        try {
            writeGallery(items, attemptAssets, { beads: packedBeads, counts: attemptCounts });
            const prunedAssets = gcAssets(attemptAssets, items);
            return normalizeSavedItem(entry, prunedAssets);
        } catch {
            /* try thinned glitter */
        }
    }

    return null;
}

/**
 * Persist latest build as a new gallery entry and as the “current” snapshot for the hex view / refresh.
 * Never deletes existing gallery entries on quota failure — old saves stay put.
 * @returns {{ id: string, createdAt: number, beads: object[], counts: Record<string, number>, persisted: boolean }}
 */
export function appendKaleidoscopeSave(bodies) {
    const { beads, counts } = petriBodiesToSnapshot(bodies);
    const id = newSaveId();
    const createdAt = Date.now();
    const result = { id, createdAt, beads, counts, persisted: false };

    const prev = readSavedListRaw();
    const prevItems = prev?.items ?? [];
    const assets = { ...readAssets() };

    const attempts = [beads, thinGlitter(beads, STORAGE_MAX_GLITTER)];

    for (const attemptBeads of attempts) {
        const attemptAssets = { ...assets };
        const packedBeads = packBeads(attemptBeads, attemptAssets);
        const entry = { id, t: createdAt, beads: packedBeads, counts };
        const items = [...prevItems, entry].slice(-MAX_SAVED);

        try {
            writeGallery(items, attemptAssets, { beads: packedBeads, counts });
            result.persisted = true;
            /* Return full in-memory beads (with images) for the hex view this session. */
            return result;
        } catch {
            /* try next compaction level — do not drop older gallery items */
        }
    }

    /* Gallery left untouched. Still try to remember “current” build if there's room. */
    try {
        const snapAssets = { ...readAssets() };
        const packed = packBeads(thinGlitter(beads, STORAGE_MAX_GLITTER), snapAssets);
        localStorage.setItem(STORAGE_BEAD_ASSETS, JSON.stringify({ ...readAssets(), ...snapAssets }));
        localStorage.setItem(
            STORAGE_BUILD_KALEIDOSCOPE,
            JSON.stringify({ v: SNAPSHOT_VERSION, beads: packed, counts }),
        );
    } catch {
        /* session-only */
    }

    return result;
}

/**
 * Remove one gallery entry by id. Syncs the “current” build snapshot to the newest remaining item.
 * @returns {{ id: string, createdAt: number, beads: object[], counts: Record<string, number> }[]}
 */
export function deleteSavedKaleidoscope(id) {
    const prev = readSavedListRaw();
    const items = (prev?.items ?? []).filter((raw) => raw && raw.id !== id);
    const assets = readAssets();

    try {
        if (items.length === 0) {
            localStorage.removeItem(STORAGE_SAVED_KALEIDOSCOPES);
            localStorage.removeItem(STORAGE_BUILD_KALEIDOSCOPE);
            localStorage.removeItem(STORAGE_BEAD_ASSETS);
        } else {
            const prunedAssets = gcAssets(assets, items);
            localStorage.setItem(STORAGE_BEAD_ASSETS, JSON.stringify(prunedAssets));
            localStorage.setItem(STORAGE_SAVED_KALEIDOSCOPES, JSON.stringify({ v: LIST_VERSION, items }));
            const newest = items[items.length - 1];
            const snap = normalizeSavedItem(newest, prunedAssets);
            if (snap) {
                const packAssets = {};
                const packedBeads = packBeads(snap.beads, packAssets);
                localStorage.setItem(
                    STORAGE_BUILD_KALEIDOSCOPE,
                    JSON.stringify({
                        v: SNAPSHOT_VERSION,
                        beads: packedBeads,
                        counts: snap.counts,
                    }),
                );
                localStorage.setItem(
                    STORAGE_BEAD_ASSETS,
                    JSON.stringify({ ...prunedAssets, ...packAssets }),
                );
            }
        }
    } catch {
        /* ignore */
    }

    return items.map((raw) => normalizeSavedItem(raw, readAssets())).filter(Boolean);
}

export function saveBuildKaleidoscopeSnapshot(bodies) {
    appendKaleidoscopeSave(bodies);
}

export function loadBuildKaleidoscopeSnapshot() {
    try {
        const raw = localStorage.getItem(STORAGE_BUILD_KALEIDOSCOPE);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        const assets = readAssets();
        const beads = unpackBeads(parsed.beads, assets);
        const counts =
            parsed.counts && typeof parsed.counts === 'object' && !Array.isArray(parsed.counts)
                ? parsed.counts
                : {};
        return { v: parsed.v ?? SNAPSHOT_VERSION, beads, counts };
    } catch {
        return null;
    }
}
