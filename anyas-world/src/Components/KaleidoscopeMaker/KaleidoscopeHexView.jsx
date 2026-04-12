import React, { useCallback, useEffect, useRef } from 'react';
import { loadBuildKaleidoscopeSnapshot } from './buildKaleidoscopeStorage';
import { addPetriBody, stepPetriWorld } from './petriDishPhysics';
import { drawPetriSource } from './petriSourceCanvas';

const G = 195;
const SOURCE_SIZE = 512;
/** Petri inner radius in source pixels (must match `KaleidoscopeHexView` world + `drawPetriSource`). */
const PETRI_R_SOURCE = SOURCE_SIZE * 0.43;
const TILT_STEP = 0.11;
const TILT_REPEAT_MS = 38;
const TILT_REPEAT_DELAY_MS = 200;

function gravityFromTilt(tiltRad) {
    return { gx: G * Math.sin(tiltRad), gy: G * Math.cos(tiltRad) };
}

/** Pointy-top hexagon path; `a` = circumradius (center → vertex). */
function hexPath(ctx, cx, cy, a) {
    ctx.beginPath();
    for (let i = 0; i < 6; i += 1) {
        const ang = Math.PI / 2 + i * (Math.PI / 3);
        const x = cx + a * Math.cos(ang);
        const y = cy + a * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
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

/**
 * Tiles in draw order (back → front): outer ring, …, center.
 * Same a0 rule as before the “fit / 2.5 rings” experiments: scale from min(stage w, h).
 */
function buildTileLayout(cw, ch) {
    const cx = cw / 2;
    const cy = ch / 2;
    const scale = Math.min(cw, ch);
    const a0 = scale * 0.448;

    const rings = [
        { radiusMul: 2.14, aMul: 0.93, offsetFactor: 0.38 },
        { radiusMul: 1.52, aMul: 0.97, offsetFactor: 0.25 },
        { radiusMul: 1.02, aMul: 1, offsetFactor: 0.12 },
    ];

    const dishDiameter = 2 * PETRI_R_SOURCE;
    const cropSide = Math.min(SOURCE_SIZE * 0.96, dishDiameter * 1.22);
    const sampleHalf = cropSide / 2;

    const maxDist = a0 * rings[0].radiusMul + a0 * 0.08;

    const tiles = [];
    for (const spec of rings) {
        const a = a0 * spec.aMul;
        const rPix = a0 * spec.radiusMul;
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

    tiles.push({
        tcx: cx,
        tcy: cy,
        a: a0 * 1.06,
        opacity: opacityFeatherFromCenter(0, maxDist),
        sampleHalf,
        offsetFactor: 0,
        theta: 0,
    });

    return tiles;
}

/** Peak alpha at hex center (before kaleidoscope distance factor). */
const HEX_CENTER_ALPHA = 0.74;

/** Radial mask extends past circumradius so flat hex sides fade before the clip, avoiding a harsh outline. */
const HEX_MASK_RADIUS_MUL = 1.14;

function drawHexTile(ctx, sourceCanvas, scx, scy, dishR, tile) {
    const { tcx, tcy, a, opacity, sampleHalf, offsetFactor, theta } = tile;
    const offset = dishR * offsetFactor;
    const sx = scx + Math.cos(theta) * offset;
    const sy = scy + Math.sin(theta) * offset;

    const dw = Math.sqrt(3) * a;
    const dh = 2 * a;
    const dx = tcx - dw / 2;
    const dy = tcy - dh / 2;

    /* Peak alpha at geometric center (inner radius 0 so the core isn’t left fully opaque). */
    const peak = HEX_CENTER_ALPHA * opacity;

    ctx.save();
    hexPath(ctx, tcx, tcy, a);
    ctx.clip();
    ctx.globalAlpha = 1;
    ctx.drawImage(
        sourceCanvas,
        sx - sampleHalf,
        sy - sampleHalf,
        2 * sampleHalf,
        2 * sampleHalf,
        dx,
        dy,
        dw,
        dh,
    );
    /* Black + α only for destination-in; outer radius > a softens the hex clip edge on flat sides. */
    ctx.globalCompositeOperation = 'destination-in';
    const rMask = a * HEX_MASK_RADIUS_MUL;
    const grd = ctx.createRadialGradient(tcx, tcy, 0, tcx, tcy, rMask);
    grd.addColorStop(0, `rgba(0,0,0,${peak})`);
    grd.addColorStop(0.12, `rgba(0,0,0,${peak * 0.94})`);
    grd.addColorStop(0.32, `rgba(0,0,0,${peak * 0.72})`);
    grd.addColorStop(0.52, `rgba(0,0,0,${peak * 0.48})`);
    grd.addColorStop(0.68, `rgba(0,0,0,${peak * 0.28})`);
    grd.addColorStop(0.82, `rgba(0,0,0,${peak * 0.12})`);
    grd.addColorStop(0.92, `rgba(0,0,0,${peak * 0.035})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(tcx - rMask * 1.15, tcy - rMask * 1.15, rMask * 2.3, rMask * 2.3);
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

export function KaleidoscopeHexView({ onBack, activeSnapshot = null }) {
    const stageWrapRef = useRef(null);
    const hexCanvasRef = useRef(null);
    /** Renders each hex on transparent backing so petri α blends with other tiles, not the stage fill first. */
    const hexTileScratchRef = useRef(null);
    const sourceCanvasRef = useRef(null);

    const worldRef = useRef(null);
    const tiltRef = useRef(0);
    const lastTRef = useRef(performance.now());
    const tilesRef = useRef([]);
    const layoutSizeRef = useRef({ w: 0, h: 0 });
    const tiltRepeatRef = useRef({ timeoutId: 0, intervalId: 0 });

    const clearTiltRepeat = useCallback(() => {
        const t = tiltRepeatRef.current;
        if (t.timeoutId) window.clearTimeout(t.timeoutId);
        if (t.intervalId) window.clearInterval(t.intervalId);
        tiltRepeatRef.current = { timeoutId: 0, intervalId: 0 };
    }, []);

    const bumpTilt = useCallback((delta) => {
        tiltRef.current += delta;
    }, []);

    const startTiltRepeat = useCallback(
        (delta) => {
            clearTiltRepeat();
            bumpTilt(delta);
            const tid = window.setTimeout(() => {
                tiltRepeatRef.current.intervalId = window.setInterval(() => bumpTilt(delta), TILT_REPEAT_MS);
            }, TILT_REPEAT_DELAY_MS);
            tiltRepeatRef.current.timeoutId = tid;
        },
        [bumpTilt, clearTiltRepeat],
    );

    useEffect(() => () => clearTiltRepeat(), [clearTiltRepeat]);

    const initWorldFromSnapshot = useCallback((snap) => {
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

    useEffect(() => {
        if (!sourceCanvasRef.current) {
            const c = document.createElement('canvas');
            c.width = SOURCE_SIZE;
            c.height = SOURCE_SIZE;
            sourceCanvasRef.current = c;
        }
        initWorldFromSnapshot(activeSnapshot);
    }, [activeSnapshot, initWorldFromSnapshot]);

    const syncLayout = useCallback(() => {
        const el = stageWrapRef.current;
        if (!el) return;
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w < 16 || h < 16) return;
        if (layoutSizeRef.current.w === w && layoutSizeRef.current.h === h && tilesRef.current.length) return;
        layoutSizeRef.current = { w, h };
        tilesRef.current = buildTileLayout(w, h);
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
        let raf = 0;
        const source = sourceCanvasRef.current;
        const sctx = source?.getContext('2d');

        const frame = (now) => {
            const world = worldRef.current;
            if (world && world.bodies.length > 0) {
                const dt = Math.min(0.045, Math.max(0.001, (now - lastTRef.current) / 1000));
                lastTRef.current = now;
                stepPetriWorld(world, dt, gravityFromTilt(tiltRef.current));
            } else {
                lastTRef.current = now;
            }

            if (sctx && world) {
                drawPetriSource(sctx, world, tiltRef.current, { omitRimStroke: true });
            }

            const stage = stageWrapRef.current;
            const hexCv = hexCanvasRef.current;
            if (stage && hexCv && source && world) {
                const cw = stage.clientWidth;
                const ch = stage.clientHeight;
                if (cw >= 16 && ch >= 16) {
                    const hctx = fitCanvasToCssPixels(hexCv, cw, ch);
                    hctx.clearRect(0, 0, cw, ch);
                    hctx.fillStyle = '#ffffff';
                    hctx.fillRect(0, 0, cw, ch);

                    let scratch = hexTileScratchRef.current;
                    if (!scratch) {
                        scratch = document.createElement('canvas');
                        hexTileScratchRef.current = scratch;
                    }
                    if (scratch.width !== hexCv.width || scratch.height !== hexCv.height) {
                        scratch.width = hexCv.width;
                        scratch.height = hexCv.height;
                    }
                    const sctx = scratch.getContext('2d');
                    const dpr = hctx.getTransform().a || 1;
                    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                    sctx.imageSmoothingEnabled = true;
                    if (typeof sctx.imageSmoothingQuality === 'string') sctx.imageSmoothingQuality = 'high';

                    syncLayout();
                    const tiles = tilesRef.current;
                    const scx = world.cx;
                    const scy = world.cy;
                    const dishR = world.R;
                    for (const tile of tiles) {
                        sctx.clearRect(0, 0, cw, ch);
                        drawHexTile(sctx, source, scx, scy, dishR, tile);
                        hctx.drawImage(scratch, 0, 0, cw, ch);
                    }
                }
            }

            raf = requestAnimationFrame(frame);
        };

        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [syncLayout]);

    const endTiltHold = useCallback(
        (e) => {
            clearTiltRepeat();
            try {
                e.currentTarget.releasePointerCapture?.(e.pointerId);
            } catch {
                /* ignore */
            }
        },
        [clearTiltRepeat],
    );

    const onTiltButtonDown = useCallback(
        (delta) => (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            e.preventDefault();
            e.currentTarget.setPointerCapture?.(e.pointerId);
            startTiltRepeat(delta);
        },
        [startTiltRepeat],
    );

    return (
        <>
            <button type="button" className="kaleidoscope-maker__customize-back" onClick={onBack}>
                back
            </button>
            <div className="kaleidoscope-maker__hex-root">
                <div className="kaleidoscope-maker__hex-row">
                    <button
                        type="button"
                        className="kaleidoscope-maker__hex-tilt kaleidoscope-maker__hex-tilt--left"
                        aria-label="Tilt dish left"
                        onPointerDown={onTiltButtonDown(-TILT_STEP)}
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
                        onPointerDown={onTiltButtonDown(TILT_STEP)}
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
