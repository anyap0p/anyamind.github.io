import React, { useEffect, useLayoutEffect, useMemo, useReducer, useRef } from 'react';
import { beadPileLayout } from './beadPileLayout';
import { beadTrayOrbCount } from './beadModel';
import { BeadOrbPreview } from './BeadOrbPreview';
import { playTrayWallClicks } from './beadTrayWallClick';
import { copyPositions, createRattleState, stepRattleState } from './beadTrayRattleSim';

function PencilIcon() {
    return (
        <svg
            className="kaleidoscope-maker__slot-action-icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden
            focusable="false"
        >
            <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            />
        </svg>
    );
}

function TrashCanIcon() {
    return (
        <svg
            className="kaleidoscope-maker__slot-action-icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden
            focusable="false"
        >
            <path
                fill="currentColor"
                d="M9 3h6a1 1 0 0 1 1 1v1h4v2H4V5h4V4a1 1 0 0 1 1-1zm1 2v0h4V5h-4zM6 9h12l-.8 11.1A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.9L6 9zm3 2v8h2v-8H9zm4 0v8h2v-8h-2z"
            />
        </svg>
    );
}

/** Free physics, then ease to rest (avoids a hard snap to layout positions). */
const RATTLE_MS = 980;
const SETTLE_MS = 380;

function smoothstep01(t) {
    const u = Math.min(1, Math.max(0, t));
    return u * u * (3 - 2 * u);
}

export function BeadSlotCell({ slotIndex, bead, onAdd, onEdit, onDelete, rattleKey = 0, rattleIx = 0, rattleIy = 0 }) {
    const pile = useMemo(() => {
        if (!bead) return [];
        return beadPileLayout(slotIndex, beadTrayOrbCount(bead.size));
    }, [slotIndex, bead]);

    const pileRef = useRef(pile);
    pileRef.current = pile;

    const beadRef = useRef(bead);
    beadRef.current = bead;

    const [, forceRender] = useReducer((x) => x + 1, 0);
    const simRef = useRef(null);
    const rafRef = useRef(0);

    useLayoutEffect(() => {
        simRef.current = null;
        forceRender();
    }, [pile]);

    useEffect(() => {
        if (rattleKey < 1 || !beadRef.current) return undefined;

        const rest = pileRef.current.map((p) => ({ x: p.x, y: p.y }));
        if (rest.length === 0) return undefined;

        const state = createRattleState(rest, { ix: rattleIx, iy: rattleIy }, slotIndex, rattleKey);
        simRef.current = state;

        let last = performance.now();
        const t0 = last;
        let cancelled = false;
        let settleFrom = null;
        let settleT0 = 0;

        function frame(now) {
            if (cancelled || !beadRef.current) {
                simRef.current = null;
                forceRender();
                return;
            }

            if (settleFrom === null && now - t0 < RATTLE_MS) {
                const dt = Math.min(0.032, (now - last) / 1000);
                last = now;
                const wallHits = stepRattleState(state, dt);
                playTrayWallClicks(wallHits);
                forceRender();
                rafRef.current = requestAnimationFrame(frame);
                return;
            }

            if (settleFrom === null) {
                settleFrom = copyPositions(state.pos);
                settleT0 = now;
                for (let i = 0; i < state.vel.length; i += 1) {
                    state.vel[i].vx = 0;
                    state.vel[i].vy = 0;
                }
            }

            const u = Math.min(1, (now - settleT0) / SETTLE_MS);
            const s = smoothstep01(u);
            const n = rest.length;
            for (let i = 0; i < n; i += 1) {
                state.pos[i].x = settleFrom[i].x + (rest[i].x - settleFrom[i].x) * s;
                state.pos[i].y = settleFrom[i].y + (rest[i].y - settleFrom[i].y) * s;
            }
            forceRender();

            if (u < 1 - 1e-6) {
                rafRef.current = requestAnimationFrame(frame);
            } else {
                simRef.current = null;
                forceRender();
            }
        }

        rafRef.current = requestAnimationFrame(frame);
        return () => {
            cancelled = true;
            cancelAnimationFrame(rafRef.current);
            simRef.current = null;
        };
    }, [rattleKey, rattleIx, rattleIy, slotIndex]);

    if (!bead) {
        return (
            <button
                type="button"
                className="kaleidoscope-maker__slot-plus"
                onClick={() => onAdd(slotIndex)}
                aria-label="Add custom bead"
            >
                +
            </button>
        );
    }

    const sim = simRef.current;
    const livePos = sim ? copyPositions(sim.pos) : null;

    return (
        <div
            className="kaleidoscope-maker__slot-filled"
            tabIndex={0}
            role="group"
            aria-label="Custom bead compartment"
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEdit(slotIndex);
                }
            }}
        >
            <div className="kaleidoscope-maker__slot-pile" aria-hidden>
                {pile.map((layout, i) => (
                    <BeadOrbPreview
                        key={i}
                        bead={bead}
                        layout={layout}
                        x={livePos ? livePos[i].x : undefined}
                        y={livePos ? livePos[i].y : undefined}
                    />
                ))}
            </div>
            <div className="kaleidoscope-maker__slot-actions">
                <button
                    type="button"
                    className="kaleidoscope-maker__slot-edit"
                    onClick={() => onEdit(slotIndex)}
                    aria-label="Edit bead"
                >
                    <PencilIcon />
                </button>
                <button
                    type="button"
                    className="kaleidoscope-maker__slot-delete"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(slotIndex);
                    }}
                    aria-label="Delete bead"
                >
                    <TrashCanIcon />
                </button>
            </div>
        </div>
    );
}
