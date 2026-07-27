import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackButton } from './BackButton';
import { loadBuildKaleidoscopeSnapshot } from './buildKaleidoscopeStorage';
import { playTrayWallClicks } from './beadTrayWallClick';
import { resumeKaleidoscopeAudio } from './kaleidoscopeAudioContext';
import {
    IMMERSIVE_ZOOM_DEFAULT,
    TIGHTNESS_DEFAULT,
    TIGHTNESS_MAX,
    TIGHTNESS_MIN,
    useKaleidoscopeViewControls,
    ZOOM_MAX,
    ZOOM_MIN,
} from './KaleidoscopeViewControlsContext';
import { addPetriBody, shakePetriWorld, stepPetriWorld } from './petriDishPhysics';
import { drawPetriSource } from './petriSourceCanvas';

const G = 195;
const SOURCE_SIZE = 512;
/** Source canvas oversampling: physics stays in SOURCE_SIZE space (same feel/sounds), pixels render at 2× for fidelity. */
const SOURCE_RENDER_SCALE = 2;
/**
 * White margin (world px) around the dish in the source canvases. Offset ring
 * tiles sample square crops that reach past the SOURCE_SIZE square; without
 * this padding those samples run off the canvas and leave hard straight
 * cutoffs (visible as harsh white-edged lines over the pattern backdrop).
 */
const SOURCE_MARGIN = 96;
/** Petri inner radius in source pixels (must match `KaleidoscopeHexView` world + `drawPetriSource`). */
const PETRI_R_SOURCE = SOURCE_SIZE * 0.43;
/** Peak dish rotation speed while a tilt button is held (rad/s). */
const TILT_MAX_RATE = 3.2;
/** How quickly the rotation speed eases toward its target (1/s); higher = snappier. */
const TILT_RATE_EASE = 11;
/** Min gap between collision-click batches so tilting doesn't machine-gun clinks. */
const CLICK_COOLDOWN_MS = 130;

function gravityFromTilt(tiltRad) {
    return { gx: G * Math.sin(tiltRad), gy: G * Math.cos(tiltRad) };
}

/**
 * Opacity feathers very gradually from center outward (very mild power curve).
 */
function opacityFeatherFromCenter(dist, maxDist) {
    if (maxDist < 2) return 1;
    const t = Math.min(1, dist / maxDist);
    const gentle = 1 - t ** 0.14;
    return 0.74 + 0.26 * gentle;
}

/** Hexagon count on each concentric ring (was 8). */
const HEXES_PER_RING = 12;

/** Half-side of the square crop each tile samples from the dish, in world units. */
const SAMPLE_HALF = Math.min(SOURCE_SIZE * 0.96, 2 * PETRI_R_SOURCE * 1.22) / 2;

/** Base tile size as a fraction of min(stage w, h). */
const TILE_SCALE = 0.448;
/** Default zoom for immersive full-bleed (slider can change this live). */
const ZOOM_KEY_STEP = 0.03;
/** How fast ◀/▶ change tightness while held (units/s). */
const TIGHTNESS_HOLD_RATE = 0.9;
/** Discrete step applied on each ◀/▶ press (so a click is visible). */
const TIGHTNESS_CLICK_STEP = 0.06;

/**
 * Tiles in draw order (back → front): opaque center first, then the rings over it.
 * Centered on the stage; `zoom` < 1 pulls the whole fractal back (smaller tiles).
 * `tightness` > 1 pulls rings closer together; < 1 spreads them out.
 */
function buildTileLayout(cw, ch, zoom = 1, tightness = 1) {
    const cx = cw / 2;
    const cy = ch / 2;
    const scale = Math.min(cw, ch);
    const a0 = scale * TILE_SCALE * zoom;
    const spread = 1 / Math.max(0.2, tightness);

    /* Ring distance from center (radiusMul) vs segment size (aMul) — higher radiusMul spreads them out. */
    const rings = [
        { radiusMul: 2.45, aMul: 0.88, offsetFactor: 0.38 },
        { radiusMul: 1.72, aMul: 0.9, offsetFactor: 0.25 },
        { radiusMul: 1.12, aMul: 0.94, offsetFactor: 0.12 },
    ];

    /* Sampling rects are in world units; drawHexTile scales them per source canvas. */
    const sampleHalf = SAMPLE_HALF;

    const maxDist = a0 * rings[0].radiusMul * spread + a0 * 0.08;

    const tiles = [];

    /* Center first: fully opaque dish behind the fractal rings. */
    tiles.push({
        tcx: cx,
        tcy: cy,
        a: a0 * 1.06,
        opacity: 1,
        sampleHalf,
        offsetFactor: 0,
        theta: 0,
        solid: true,
    });

    for (const spec of rings) {
        const a = a0 * spec.aMul;
        const rPix = a0 * spec.radiusMul * spread;
        for (let k = 0; k < HEXES_PER_RING; k += 1) {
            const theta = (k * 2 * Math.PI) / HEXES_PER_RING;
            const tcx = cx + Math.cos(theta) * rPix;
            const tcy = cy + Math.sin(theta) * rPix;
            const dist = Math.hypot(tcx - cx, tcy - cy);
            tiles.push({
                tcx,
                tcy,
                a,
                opacity: opacityFeatherFromCenter(dist, maxDist),
                sampleHalf,
                offsetFactor: spec.offsetFactor,
                theta,
            });
        }
    }

    return tiles;
}

/** Peak alpha at tile center (before kaleidoscope distance factor). */
const TILE_CENTER_ALPHA = 0.85;

/**
 * Soft circular mask radius as a fraction of tile size `a`.
 * No hexagon clip — a hard hex path was the white lattice the user kept seeing.
 */
const TILE_MASK_RADIUS_MUL = 1;

/**
 * `srcScale` maps world-space sample coords onto the given source canvas
 * (SOURCE_RENDER_SCALE for the hi-res canvas, 1 for the downsampled copy).
 */
function drawHexTile(ctx, sourceCanvas, scx, scy, dishR, tile, srcScale = 1) {
    const { tcx, tcy, a, opacity, sampleHalf, offsetFactor, theta } = tile;
    const offset = dishR * offsetFactor;
    const sx = (scx + Math.cos(theta) * offset + SOURCE_MARGIN) * srcScale;
    const sy = (scy + Math.sin(theta) * offset + SOURCE_MARGIN) * srcScale;
    const sh = sampleHalf * srcScale;

    const rMask = a * TILE_MASK_RADIUS_MUL;
    /* Dest square must sit entirely inside the destination-in fill, or the corners
       stay fully opaque and cut hard geometric seams through the kaleidoscope. */
    const side = rMask * 2;
    const dx = tcx - rMask;
    const dy = tcy - rMask;

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    if (tile.solid) {
        /* Center view: fully opaque disk behind the rings (no fade / no translucency). */
        ctx.beginPath();
        ctx.arc(tcx, tcy, rMask, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(sourceCanvas, sx - sh, sy - sh, 2 * sh, 2 * sh, dx, dy, side, side);
        ctx.restore();
        return;
    }

    ctx.drawImage(sourceCanvas, sx - sh, sy - sh, 2 * sh, 2 * sh, dx, dy, side, side);

    /* Soft circular alpha only — fades to 0 with no hard geometric edge.
       fillRect is larger than the image so every drawn pixel is masked. */
    ctx.globalCompositeOperation = 'destination-in';
    const peak = TILE_CENTER_ALPHA * opacity;
    const grd = ctx.createRadialGradient(tcx, tcy, 0, tcx, tcy, rMask);
    grd.addColorStop(0, `rgba(0,0,0,${peak})`);
    grd.addColorStop(0.2, `rgba(0,0,0,${peak * 0.92})`);
    grd.addColorStop(0.42, `rgba(0,0,0,${peak * 0.68})`);
    grd.addColorStop(0.62, `rgba(0,0,0,${peak * 0.4})`);
    grd.addColorStop(0.78, `rgba(0,0,0,${peak * 0.18})`);
    grd.addColorStop(0.9, `rgba(0,0,0,${peak * 0.05})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(dx - 2, dy - 2, side + 4, side + 4);
    ctx.restore();
}

function fitCanvasToCssPixels(canvas, cssW, cssH) {
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2.25);
    const bw = Math.max(1, Math.floor(cssW * dpr));
    const bh = Math.max(1, Math.floor(cssH * dpr));
    if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
    }
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    if (typeof ctx.imageSmoothingQuality === 'string') ctx.imageSmoothingQuality = 'high';
    return ctx;
}

export function KaleidoscopeHexView({
    onBack,
    activeSnapshot = null,
    immersiveChrome = false,
    chromeVisible = true,
    onChromeEnter,
    onChromeLeave,
    ambient = false,
    initialZoom = 1,
    ambientRotateRate = 0,
    chromeControlsInTitle = false,
    onReady,
}) {
    const stageWrapRef = useRef(null);
    const hexCanvasRef = useRef(null);
    /** Renders each hex on transparent backing so petri α blends with other tiles, not the stage fill first. */
    const hexTileScratchRef = useRef(null);
    const sourceCanvasRef = useRef(null);
    const sourceLoCanvasRef = useRef(null);

    const worldRef = useRef(null);
    const petriPairHitBufferRef = useRef([]);
    const tiltRef = useRef(0);
    const lastTRef = useRef(performance.now());
    const tilesRef = useRef([]);
    const layoutSizeRef = useRef({ w: 0, h: 0, zoom: 1, tightness: 1 });
    /** -1 / 0 / +1 while a tilt button is held; integrated per-frame for smooth rotation. */
    const tiltDirRef = useRef(0);
    const tiltVelRef = useRef(0);
    const lastClickAtRef = useRef(0);
    const readyCalledRef = useRef(false);

    const viewControls = useKaleidoscopeViewControls();
    const [localZoom, setLocalZoom] = useState(() =>
        ambient ? initialZoom : immersiveChrome ? IMMERSIVE_ZOOM_DEFAULT : initialZoom,
    );
    const [localTightness, setLocalTightness] = useState(TIGHTNESS_DEFAULT);
    const [localTracers, setLocalTracers] = useState(false);

    const zoom = viewControls?.zoom ?? localZoom;
    const setZoom = viewControls?.setZoom ?? setLocalZoom;
    const tightness = viewControls?.tightness ?? localTightness;
    const setTightness = viewControls?.setTightness ?? setLocalTightness;
    const tracers = viewControls?.tracers ?? localTracers;
    const setTracers = viewControls?.setTracers ?? setLocalTracers;

    const zoomRef = useRef(zoom);
    zoomRef.current = zoom;
    const ambientRotateRateRef = useRef(ambientRotateRate);
    ambientRotateRateRef.current = ambientRotateRate;
    const localTightnessRef = useRef(TIGHTNESS_DEFAULT);
    const tightnessRef = viewControls?.tightnessRef ?? localTightnessRef;
    if (!viewControls) {
        localTightnessRef.current = tightness;
    }
    /** -1 / 0 / +1 while a ◀/▶ carat is held (adjusts tightness, not tilt). */
    const tightnessDirRef = useRef(0);
    const tracersRef = useRef(tracers);
    tracersRef.current = tracers;

    const initWorldFromSnapshot = useCallback((snap) => {
        /* Prefer the explicit snapshot from build/gallery. Only fall back to localStorage
           when none was provided (e.g. refresh). Never treat a failed save as “use last”. */
        const effective =
            snap != null && Array.isArray(snap.beads) ? snap : loadBuildKaleidoscopeSnapshot();
        const cx = SOURCE_SIZE / 2;
        const cy = SOURCE_SIZE / 2;
        const R = PETRI_R_SOURCE;
        const world = { cx, cy, R, bodies: [] };
        const beads = effective?.beads ?? [];
        let id = 0;
        const g = gravityFromTilt(tiltRef.current);
        for (const bead of beads) {
            id += 1;
            addPetriBody(world, bead, id, g);
        }
        worldRef.current = world;
    }, []);

    const snapshotKey = activeSnapshot?.id ?? 'storage-latest';

    useEffect(() => {
        const paddedSide = SOURCE_SIZE + 2 * SOURCE_MARGIN;
        if (!sourceCanvasRef.current) {
            const c = document.createElement('canvas');
            c.width = paddedSide * SOURCE_RENDER_SCALE;
            c.height = paddedSide * SOURCE_RENDER_SCALE;
            sourceCanvasRef.current = c;
        }
        if (!sourceLoCanvasRef.current) {
            /* Downsampled copy for ring tiles; only the center tile samples the hi-res canvas. */
            const c = document.createElement('canvas');
            c.width = paddedSide;
            c.height = paddedSide;
            sourceLoCanvasRef.current = c;
        }
        initWorldFromSnapshot(activeSnapshot);
    }, [snapshotKey, activeSnapshot, initWorldFromSnapshot]);

    const syncLayout = useCallback(() => {
        const el = stageWrapRef.current;
        if (!el) return;
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w < 16 || h < 16) return;
        const z = zoomRef.current;
        const t = tightnessRef.current;
        if (
            layoutSizeRef.current.w === w &&
            layoutSizeRef.current.h === h &&
            layoutSizeRef.current.zoom === z &&
            layoutSizeRef.current.tightness === t &&
            tilesRef.current.length
        ) {
            return;
        }
        layoutSizeRef.current = { w, h, zoom: z, tightness: t };
        tilesRef.current = buildTileLayout(w, h, z, t);
    }, []);

    useEffect(() => {
        const el = stageWrapRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return undefined;
        const ro = new ResizeObserver(() => syncLayout());
        ro.observe(el);
        syncLayout();
        return () => ro.disconnect();
    }, [syncLayout]);

    useEffect(() => {
        syncLayout();
    }, [zoom, tightness, syncLayout]);

    useEffect(() => {
        let raf = 0;
        const source = sourceCanvasRef.current;
        const sctx = source?.getContext('2d');
        const sourceLo = sourceLoCanvasRef.current;
        const loCtx = sourceLo?.getContext('2d');
        if (loCtx) {
            loCtx.imageSmoothingEnabled = true;
            if (typeof loCtx.imageSmoothingQuality === 'string') loCtx.imageSmoothingQuality = 'high';
        }

        const frame = (now) => {
            const dt = Math.min(0.045, Math.max(0.001, (now - lastTRef.current) / 1000));
            lastTRef.current = now;

            /* Smooth continuous tilt: velocity eases toward held direction, integrates every frame. */
            if (ambientRotateRateRef.current !== 0) {
                tiltRef.current += ambientRotateRateRef.current * dt;
            } else {
                const targetVel = tiltDirRef.current * TILT_MAX_RATE;
                const ease = Math.min(1, TILT_RATE_EASE * dt);
                tiltVelRef.current += (targetVel - tiltVelRef.current) * ease;
                if (Math.abs(tiltVelRef.current) > 1e-4) {
                    tiltRef.current += tiltVelRef.current * dt;
                }
            }

            /* ◀/▶ carats nudge tightness while held. */
            if (tightnessDirRef.current !== 0) {
                const next = Math.min(
                    TIGHTNESS_MAX,
                    Math.max(
                        TIGHTNESS_MIN,
                        tightnessRef.current + tightnessDirRef.current * TIGHTNESS_HOLD_RATE * dt,
                    ),
                );
                if (Math.abs(next - tightnessRef.current) > 1e-6) {
                    tightnessRef.current = next;
                    setTightness(next);
                }
            }

            const world = worldRef.current;
            if (world && world.bodies.length > 0) {
                const pairHits = petriPairHitBufferRef.current;
                stepPetriWorld(world, dt, gravityFromTilt(tiltRef.current), 3, pairHits);
                if (!ambient && pairHits.length > 0 && now - lastClickAtRef.current >= CLICK_COOLDOWN_MS) {
                    lastClickAtRef.current = now;
                    playTrayWallClicks(pairHits);
                }
            }

            if (sctx && world) {
                /* World coords stay in SOURCE_SIZE space; the transform renders them at 2×
                   pixels, shifted inward by the sampling margin. Source stays transparent
                   outside beads so fractal tiles have no white disks. */
                sctx.setTransform(
                    SOURCE_RENDER_SCALE,
                    0,
                    0,
                    SOURCE_RENDER_SCALE,
                    SOURCE_MARGIN * SOURCE_RENDER_SCALE,
                    SOURCE_MARGIN * SOURCE_RENDER_SCALE,
                );
                drawPetriSource(sctx, world, tiltRef.current, {
                    omitRimStroke: true,
                    tracers: tracersRef.current,
                });
                /* Ring tiles sample this copy. Must clear first when not trailing: drawImage
                   won't erase old pixels where the (transparent) source is empty — that was
                   the accidental bead-wake tracer bug. */
                if (loCtx) {
                    loCtx.setTransform(1, 0, 0, 1, 0, 0);
                    if (!tracersRef.current) {
                        loCtx.clearRect(0, 0, sourceLo.width, sourceLo.height);
                    }
                    loCtx.drawImage(source, 0, 0, sourceLo.width, sourceLo.height);
                }
            }

            const stage = stageWrapRef.current;
            const hexCv = hexCanvasRef.current;
            if (stage && hexCv && source && world) {
                const cw = stage.clientWidth;
                const ch = stage.clientHeight;
                if (cw >= 16 && ch >= 16) {
                    const hctx = fitCanvasToCssPixels(hexCv, cw, ch);
                    hctx.clearRect(0, 0, cw, ch);
                    if (!ambient) {
                        hctx.fillStyle = '#ffffff';
                        hctx.fillRect(0, 0, cw, ch);
                    }

                    /* Soft full-stage pattern under the tiles: any leftover gaps blend into
                       pattern instead of flashing white honeycomb seams between soft circles. */
                    if (sourceLo) {
                        const cover = ambient ? Math.hypot(cw, ch) * 1.05 : Math.max(cw, ch) * 1.12;
                        const bx = (cw - cover) / 2;
                        const by = (ch - cover) / 2;
                        hctx.drawImage(
                            sourceLo,
                            world.cx - SAMPLE_HALF + SOURCE_MARGIN,
                            world.cy - SAMPLE_HALF + SOURCE_MARGIN,
                            SAMPLE_HALF * 2,
                            SAMPLE_HALF * 2,
                            bx,
                            by,
                            cover,
                            cover,
                        );
                        if (!ambient) {
                            /* Feather the backdrop itself so the stage rim stays soft white. */
                            hctx.save();
                            hctx.globalCompositeOperation = 'destination-in';
                            const vr = Math.min(cw, ch) * 0.62;
                            const vg = hctx.createRadialGradient(cw / 2, ch / 2, vr * 0.35, cw / 2, ch / 2, vr);
                            vg.addColorStop(0, 'rgba(0,0,0,0.55)');
                            vg.addColorStop(0.55, 'rgba(0,0,0,0.35)');
                            vg.addColorStop(0.85, 'rgba(0,0,0,0.1)');
                            vg.addColorStop(1, 'rgba(0,0,0,0)');
                            hctx.fillStyle = vg;
                            hctx.fillRect(0, 0, cw, ch);
                            hctx.restore();
                            /* destination-in punched the white away too — put white back underneath. */
                            hctx.globalCompositeOperation = 'destination-over';
                            hctx.fillStyle = '#ffffff';
                            hctx.fillRect(0, 0, cw, ch);
                            hctx.globalCompositeOperation = 'source-over';
                        }
                    }

                    let scratch = hexTileScratchRef.current;
                    if (!scratch) {
                        scratch = document.createElement('canvas');
                        hexTileScratchRef.current = scratch;
                    }
                    if (scratch.width !== hexCv.width || scratch.height !== hexCv.height) {
                        scratch.width = hexCv.width;
                        scratch.height = hexCv.height;
                    }
                    const tctx = scratch.getContext('2d');
                    const dpr = hctx.getTransform().a || 1;
                    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                    tctx.imageSmoothingEnabled = true;
                    if (typeof tctx.imageSmoothingQuality === 'string') tctx.imageSmoothingQuality = 'high';

                    syncLayout();
                    for (const tile of tilesRef.current) {
                        /* Each tile needs its own clear: destination-in would erase prior tiles
                           if they shared a layer. Bbox is padded past the soft mask. */
                        const extent = tile.a * TILE_MASK_RADIUS_MUL + 8;
                        const bx = Math.max(0, Math.floor(tile.tcx - extent));
                        const by = Math.max(0, Math.floor(tile.tcy - extent));
                        const bw = Math.min(cw, Math.ceil(tile.tcx + extent)) - bx;
                        const bh = Math.min(ch, Math.ceil(tile.tcy + extent)) - by;
                        if (bw <= 0 || bh <= 0) continue;
                        tctx.clearRect(bx - 2, by - 2, bw + 4, bh + 4);
                        const hi = tile.solid;
                        drawHexTile(
                            tctx,
                            hi ? source : sourceLo,
                            world.cx,
                            world.cy,
                            world.R,
                            tile,
                            hi ? SOURCE_RENDER_SCALE : 1,
                        );
                        hctx.drawImage(scratch, bx * dpr, by * dpr, bw * dpr, bh * dpr, bx, by, bw, bh);
                    }

                    if (!readyCalledRef.current && onReady) {
                        readyCalledRef.current = true;
                        onReady();
                    }
                }
            }

            raf = requestAnimationFrame(frame);
        };

        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [syncLayout, ambient, onReady]);

    const endTiltHold = useCallback((e) => {
        tiltDirRef.current = 0;
        try {
            e.currentTarget.releasePointerCapture?.(e.pointerId);
        } catch {
            /* ignore */
        }
    }, []);

    const onTiltButtonDown = useCallback(
        (dir) => (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            resumeKaleidoscopeAudio();
            e.preventDefault();
            e.currentTarget.setPointerCapture?.(e.pointerId);
            tiltDirRef.current = dir;
        },
        [],
    );

    /* ←/→ tilt (hold); ↑/↓ zoom; ,/. tightness (no shift — same keys as < >). */
    useEffect(() => {
        if (ambient) return undefined;
        const onKeyDown = (e) => {
            const tag = e.target?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

            if (e.key === 'ArrowLeft') {
                if (e.repeat) return;
                e.preventDefault();
                resumeKaleidoscopeAudio();
                tiltDirRef.current = -1;
            } else if (e.key === 'ArrowRight') {
                if (e.repeat) return;
                e.preventDefault();
                resumeKaleidoscopeAudio();
                tiltDirRef.current = 1;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_KEY_STEP).toFixed(2)));
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_KEY_STEP).toFixed(2)));
            } else if (e.key === ',' || e.key === '<') {
                /* Hold comma (or shift+,) to loosen fractals. */
                e.preventDefault();
                resumeKaleidoscopeAudio();
                if (!e.repeat) {
                    const next = Math.max(
                        TIGHTNESS_MIN,
                        +(tightnessRef.current - TIGHTNESS_CLICK_STEP).toFixed(2),
                    );
                    tightnessRef.current = next;
                    setTightness(next);
                }
                tightnessDirRef.current = -1;
            } else if (e.key === '.' || e.key === '>') {
                /* Hold period (or shift+.) to tighten fractals. */
                e.preventDefault();
                resumeKaleidoscopeAudio();
                if (!e.repeat) {
                    const next = Math.min(
                        TIGHTNESS_MAX,
                        +(tightnessRef.current + TIGHTNESS_CLICK_STEP).toFixed(2),
                    );
                    tightnessRef.current = next;
                    setTightness(next);
                }
                tightnessDirRef.current = 1;
            } else if (e.key === 'q' || e.key === 'Q') {
                if (e.repeat) return;
                e.preventDefault();
                resumeKaleidoscopeAudio();
                const world = worldRef.current;
                if (world) shakePetriWorld(world);
            }
        };
        const onKeyUp = (e) => {
            if (e.key === 'ArrowLeft' && tiltDirRef.current === -1) {
                tiltDirRef.current = 0;
            } else if (e.key === 'ArrowRight' && tiltDirRef.current === 1) {
                tiltDirRef.current = 0;
            } else if ((e.key === ',' || e.key === '<') && tightnessDirRef.current === -1) {
                tightnessDirRef.current = 0;
            } else if ((e.key === '.' || e.key === '>') && tightnessDirRef.current === 1) {
                tightnessDirRef.current = 0;
            }
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    const handleBack = useCallback(() => {
        resumeKaleidoscopeAudio();
        onBack?.();
    }, [onBack]);

    const handleShake = useCallback(() => {
        resumeKaleidoscopeAudio();
        const world = worldRef.current;
        if (world) shakePetriWorld(world);
    }, []);

    useEffect(() => {
        viewControls?.registerShake?.(handleShake);
        return () => viewControls?.registerShake?.(null);
    }, [viewControls, handleShake]);

    const showHexTopleft = !chromeControlsInTitle;

    const topleftClass = [
        'kaleidoscope-maker__hex-topleft',
        immersiveChrome ? 'kaleidoscope-maker__hex-topleft--immersive' : '',
        immersiveChrome && chromeVisible ? 'kaleidoscope-maker__hex-topleft--visible' : '',
    ]
        .filter(Boolean)
        .join(' ');

    if (ambient) {
        return (
            <div className="kaleidoscope-maker__hex-root kaleidoscope-maker__hex-root--ambient">
                <div ref={stageWrapRef} className="kaleidoscope-maker__hex-stage kaleidoscope-maker__hex-stage--ambient">
                    <canvas ref={hexCanvasRef} className="kaleidoscope-maker__hex-canvas" aria-hidden />
                </div>
            </div>
        );
    }

    return (
        <>
            {showHexTopleft ? (
                <div
                    className={topleftClass}
                    onMouseEnter={immersiveChrome ? onChromeEnter : undefined}
                    onMouseLeave={immersiveChrome ? onChromeLeave : undefined}
                >
                    <BackButton onClick={handleBack} />
                    <button type="button" className="kaleidoscope-maker__customize-back" onClick={handleShake}>
                        shake it
                    </button>
                    <label className="kaleidoscope-maker__hex-slider">
                        <span className="kaleidoscope-maker__hex-slider-label">zoom</span>
                        <input
                            type="range"
                            className="kaleidoscope-maker__hex-slider-input"
                            min={ZOOM_MIN}
                            max={ZOOM_MAX}
                            step={0.01}
                            value={zoom}
                            aria-label="Kaleidoscope zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            onPointerUp={(e) => e.currentTarget.blur()}
                            onKeyUp={(e) => {
                                if (e.key.startsWith('Arrow')) e.currentTarget.blur();
                            }}
                        />
                    </label>
                    <label className="kaleidoscope-maker__hex-slider">
                        <span className="kaleidoscope-maker__hex-slider-label">tightness</span>
                        <input
                            type="range"
                            className="kaleidoscope-maker__hex-slider-input"
                            min={TIGHTNESS_MIN}
                            max={TIGHTNESS_MAX}
                            step={0.01}
                            value={tightness}
                            aria-label="Fractal tightness"
                            onChange={(e) => {
                                const v = Number(e.target.value);
                                tightnessRef.current = v;
                                setTightness(v);
                            }}
                            onPointerUp={(e) => e.currentTarget.blur()}
                            onKeyUp={(e) => {
                                if (e.key.startsWith('Arrow')) e.currentTarget.blur();
                            }}
                        />
                    </label>
                    <label className="kaleidoscope-maker__hex-slider kaleidoscope-maker__hex-slider--check">
                        <input
                            type="checkbox"
                            checked={tracers}
                            onChange={(e) => setTracers(e.target.checked)}
                        />
                        <span className="kaleidoscope-maker__hex-slider-label">tracers</span>
                    </label>
                </div>
            ) : null}
            <div className="kaleidoscope-maker__hex-root">
                <div className="kaleidoscope-maker__hex-row">
                    <button
                        type="button"
                        className="kaleidoscope-maker__hex-tilt kaleidoscope-maker__hex-tilt--left"
                        aria-label="Tilt dish left"
                        onPointerDown={onTiltButtonDown(-1)}
                        onPointerUp={endTiltHold}
                        onPointerCancel={endTiltHold}
                    >
                        ◀
                    </button>
                    <div ref={stageWrapRef} className="kaleidoscope-maker__hex-stage">
                        <canvas ref={hexCanvasRef} className="kaleidoscope-maker__hex-canvas" aria-hidden />
                    </div>
                    <button
                        type="button"
                        className="kaleidoscope-maker__hex-tilt kaleidoscope-maker__hex-tilt--right"
                        aria-label="Tilt dish right"
                        onPointerDown={onTiltButtonDown(1)}
                        onPointerUp={endTiltHold}
                        onPointerCancel={endTiltHold}
                    >
                        ▶
                    </button>
                </div>
            </div>
        </>
    );
}
