import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useReducer,
    useRef,
    useState,
} from 'react';
import { BeadVisual } from './BeadVisual';
import { playBeadAddSparkleSound } from './beadAddSparkleSound';
import { makeGlitterBead } from './beadModel';
import { GLITTER_PER_SPRINKLE, PETRI_MAX_BEADS, PETRI_MAX_GLITTER } from './constants';
import { addPetriBody, stepPetriWorld } from './petriDishPhysics';
import { drawGlitterSpeck } from './petriSourceCanvas';

const G = 195;

function gravityFromTilt(tiltRad) {
    return { gx: G * Math.sin(tiltRad), gy: G * Math.cos(tiltRad) };
}

/** Beads and glitter specks share the world but have separate caps. */
function countByKind(world) {
    let beads = 0;
    let glitter = 0;
    for (const b of world.bodies) {
        if (b.bead?.shape === 'glitter') glitter += 1;
        else beads += 1;
    }
    return { beads, glitter };
}

/** Redraws one glitter plane (behind or in front of the beads) onto its overlay canvas. */
function drawGlitterLayer(canvas, world, front, tiltRad) {
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w < 2 || h < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bw = Math.max(1, Math.round(w * dpr));
    const bh = Math.max(1, Math.round(h * dpr));
    if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (!world) return;
    for (const b of world.bodies) {
        if (b.bead?.shape !== 'glitter' || Boolean(b.bead.zFront) !== front) continue;
        drawGlitterSpeck(ctx, b.x, b.y, b.r, b.bead, b.id, tiltRad);
    }
}

export const PetriDishView = forwardRef(function PetriDishView({ onCountChange, className = '' }, ref) {
    const rootRef = useRef(null);
    const wrapRef = useRef(null);
    const glitterBackRef = useRef(null);
    const glitterFrontRef = useRef(null);
    const worldRef = useRef(null);
    const tiltRef = useRef(0);
    const idRef = useRef(0);
    const [, renderTick] = useReducer((x) => x + 1, 0);
    const lastTRef = useRef(performance.now());
    const [tiltRad, setTiltRad] = useState(0);
    const dragRef = useRef(null);

    tiltRef.current = tiltRad;

    const syncWorldToSize = useCallback(() => {
        const el = wrapRef.current;
        if (!el) return;
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w < 8 || h < 8) return;
        const side = Math.min(w, h);
        const R = side * 0.43;
        const cx = w / 2;
        const cy = h / 2;
        const prev = worldRef.current;
        if (!prev) {
            worldRef.current = { cx, cy, R, bodies: [] };
            return;
        }
        if (Math.abs(prev.R - R) < 0.5 && Math.abs(prev.cx - cx) < 0.5 && Math.abs(prev.cy - cy) < 0.5) {
            return;
        }
        const oR = prev.R || R;
        const ox = prev.cx;
        const oy = prev.cy;
        for (const b of prev.bodies) {
            b.x = cx + ((b.x - ox) / oR) * R;
            b.y = cy + ((b.y - oy) / oR) * R;
            b.r = (b.r / oR) * R;
        }
        prev.cx = cx;
        prev.cy = cy;
        prev.R = R;
    }, []);

    useLayoutEffect(() => {
        syncWorldToSize();
        const el = wrapRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return undefined;
        const ro = new ResizeObserver(() => {
            syncWorldToSize();
            renderTick();
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [syncWorldToSize]);

    useImperativeHandle(
        ref,
        () => ({
            tryAddBead(bead) {
                syncWorldToSize();
                const world = worldRef.current;
                if (!world || !bead) return false;
                if (countByKind(world).beads >= PETRI_MAX_BEADS) return false;
                idRef.current += 1;
                addPetriBody(world, bead, idRef.current, gravityFromTilt(tiltRef.current));
                onCountChange?.(countByKind(world).beads);
                renderTick();
                playBeadAddSparkleSound();
                return true;
            },
            /** Adds a pinch of glitter dots (colored, or holo rainbow-cycling). */
            sprinkleGlitter({ fill, holo = false } = {}) {
                syncWorldToSize();
                const world = worldRef.current;
                if (!world) return false;
                const room = PETRI_MAX_GLITTER - countByKind(world).glitter;
                const n = Math.min(GLITTER_PER_SPRINKLE, Math.max(0, room));
                if (n === 0) return false;
                const g = gravityFromTilt(tiltRef.current);
                for (let i = 0; i < n; i += 1) {
                    idRef.current += 1;
                    addPetriBody(world, makeGlitterBead({ fill, holo }), idRef.current, g);
                }
                renderTick();
                playBeadAddSparkleSound();
                return true;
            },
            getCount() {
                const world = worldRef.current;
                return world ? countByKind(world).beads : 0;
            },
            /** Physics bodies in dish order (for saving build configuration). */
            getBodies() {
                const world = worldRef.current;
                return world?.bodies ? [...world.bodies] : [];
            },
        }),
        [onCountChange, syncWorldToSize],
    );

    useEffect(() => {
        let raf = 0;
        const loop = (now) => {
            const world = worldRef.current;
            if (world && world.bodies.length > 0) {
                const dt = Math.min(0.045, Math.max(0.001, (now - lastTRef.current) / 1000));
                lastTRef.current = now;
                stepPetriWorld(world, dt, gravityFromTilt(tiltRef.current));
                renderTick();
            } else {
                lastTRef.current = now;
            }
            /* Glitter renders on canvas planes (a DOM node per speck would crush React at high counts). */
            drawGlitterLayer(glitterBackRef.current, world, false, tiltRef.current);
            drawGlitterLayer(glitterFrontRef.current, world, true, tiltRef.current);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    const onPointerDown = (e) => {
        if (e.button !== 0) return;
        e.target.setPointerCapture?.(e.pointerId);
        dragRef.current = { x: e.clientX, tilt: tiltRef.current };
    };

    const onPointerMove = (e) => {
        const d = dragRef.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        d.x = e.clientX;
        let next = d.tilt + dx * 0.014;
        d.tilt = next;
        next = Math.max(-1.35, Math.min(1.35, next));
        setTiltRad(next);
        tiltRef.current = next;
    };

    const onPointerUp = (e) => {
        dragRef.current = null;
        try {
            e.target.releasePointerCapture?.(e.pointerId);
        } catch {
            /* ignore */
        }
    };

    const world = worldRef.current;
    const bodies = world?.bodies ?? [];
    const tiltDeg = (tiltRad * 180) / Math.PI;

    return (
        <div
            ref={rootRef}
            className={`kaleidoscope-maker__petri-wrap ${className}`.trim()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="application"
            aria-label="Petri dish: drag sideways to tilt the kaleidoscope"
        >
            <div className="kaleidoscope-maker__petri-sizer">
                <div
                    className="kaleidoscope-maker__petri-rotate"
                    style={{ transform: `rotate(${tiltDeg}deg)` }}
                >
                    <div className="kaleidoscope-maker__petri-rim" aria-hidden />
                    <div ref={wrapRef} className="kaleidoscope-maker__petri-inner">
                        {/* Glitter planes: canvas behind the beads, DOM beads, canvas in front. */}
                        <canvas
                            ref={glitterBackRef}
                            className="kaleidoscope-maker__petri-glitter-canvas"
                            style={{ zIndex: 1 }}
                            aria-hidden
                        />
                        {bodies.map((b) => {
                            if (b.bead.shape === 'glitter') return null;
                            const spinRad =
                                typeof b.spin === 'number' && Number.isFinite(b.spin)
                                    ? b.spin
                                    : Math.atan2(b.vy, b.vx);
                            const spin = (spinRad * 180) / Math.PI;
                            return (
                                <div
                                    key={b.id}
                                    className="kaleidoscope-maker__petri-bead"
                                    data-shape={b.bead.shape}
                                    style={{
                                        left: `${b.x - b.r}px`,
                                        top: `${b.y - b.r}px`,
                                        width: `${b.r * 2}px`,
                                        height: `${b.r * 2}px`,
                                        zIndex: 2,
                                    }}
                                >
                                    <BeadVisual
                                        shape={b.bead.shape}
                                        fill={b.bead.fill}
                                        accent={b.bead.accent}
                                        image={b.bead.image}
                                        seed={b.id}
                                        lightDeg={spin}
                                    />
                                </div>
                            );
                        })}
                        <canvas
                            ref={glitterFrontRef}
                            className="kaleidoscope-maker__petri-glitter-canvas"
                            style={{ zIndex: 3 }}
                            aria-hidden
                        />
                    </div>
                </div>
            </div>
            <p className="kaleidoscope-maker__petri-hint">Drag on the dish to tilt · beads fall with gravity</p>
        </div>
    );
});
