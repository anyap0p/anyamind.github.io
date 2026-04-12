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
import { PETRI_MAX_BEADS } from './constants';
import { addPetriBody, stepPetriWorld } from './petriDishPhysics';

const G = 195;

function gravityFromTilt(tiltRad) {
    return { gx: G * Math.sin(tiltRad), gy: G * Math.cos(tiltRad) };
}

export const PetriDishView = forwardRef(function PetriDishView({ onCountChange, className = '' }, ref) {
    const rootRef = useRef(null);
    const wrapRef = useRef(null);
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
                if (world.bodies.length >= PETRI_MAX_BEADS) return false;
                idRef.current += 1;
                addPetriBody(world, bead, idRef.current, gravityFromTilt(tiltRef.current));
                onCountChange?.(world.bodies.length);
                renderTick();
                return true;
            },
            getCount() {
                return worldRef.current?.bodies.length ?? 0;
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
                        {bodies.map((b) => {
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
                                    }}
                                >
                                    <BeadVisual
                                        shape={b.bead.shape}
                                        fill={b.bead.fill}
                                        accent={b.bead.accent}
                                        lightDeg={spin}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <p className="kaleidoscope-maker__petri-hint">Drag on the dish to tilt · beads fall with gravity</p>
        </div>
    );
});
