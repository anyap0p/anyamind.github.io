/** 2D circles in a circular dish: gravity + wall + pairwise collision. */

/** Low restitution + strong damping ≈ beads sliding in oil, not bouncing on water. */
const RESTITUTION = 0.07;
const DAMPING = 0.957;
const PAIR_ITERS = 4;

/** Min normal closing speed (px/s) to register a bead–bead clack for optional SFX. */
export const PETRI_PAIR_SOUND_MIN_CLOSING = 10;

/** Min outward radial speed (px/s) at dish rim for wall clack SFX. */
const PETRI_WALL_SOUND_MIN = 6;

function wrapAngle(rad) {
    let a = rad;
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
}

/**
 * Once per frame: roll from rim + bead–bead tangential slip (avoids multi-iter jitter / color pulsing).
 */
function applyContactSpin(cx, cy, R, bodies) {
    const n = bodies.length;
    for (let i = 0; i < n; i += 1) {
        const b = bodies[i];
        let dx = b.x - cx;
        let dy = b.y - cy;
        const dist = Math.hypot(dx, dy) || 1e-8;
        const maxD = R - b.r;
        if (dist < maxD - 2) continue;
        dx /= dist;
        dy /= dist;
        const vt = -dy * b.vx + dx * b.vy;
        b.spin = wrapAngle(b.spin + (vt * 0.055) / Math.max(b.r, 1e-6));
    }
    for (let i = 0; i < n; i += 1) {
        for (let j = i + 1; j < n; j += 1) {
            const a = bodies[i];
            const b = bodies[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 1e-8;
            const minD = a.r + b.r;
            if (dist >= minD + 1.25) continue;
            const nx = dx / dist;
            const ny = dy / dist;
            const tx = -ny;
            const ty = nx;
            const slip = (b.vx - a.vx) * tx + (b.vy - a.vy) * ty;
            const vreln = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            const depth = Math.max(0, minD - dist);
            const touch = Math.max(
                0,
                Math.min(1, 1.15 - dist / Math.max(minD, 1e-6) + depth / Math.max(minD, 1e-6)),
            );
            const slipKick = slip * 0.28 * touch;
            a.spin = wrapAngle(a.spin - slipKick / Math.max(a.r, 1e-6));
            b.spin = wrapAngle(b.spin + slipKick / Math.max(b.r, 1e-6));
            if (vreln < -1) {
                const jImp = (-(1 + RESTITUTION) * vreln) / 2;
                const twist = (jImp * 0.0035) / Math.max(a.r + b.r, 1e-6);
                a.spin = wrapAngle(a.spin + twist);
                b.spin = wrapAngle(b.spin - twist);
            }
        }
    }
}

/**
 * @param {number} beadSize 0–100
 * @param {number} dishRadiusPx nominal dish inner radius in px
 */
export function petriBeadRadiusPx(beadSize, dishRadiusPx) {
    const t = Math.min(100, Math.max(0, Number(beadSize) || 50)) / 100;
    const base = dishRadiusPx * 0.07;
    const span = dishRadiusPx * 0.11;
    return base + t * span;
}

/**
 * Effective gravity multiplier from bead size (0–100): larger beads pull “down” harder.
 */
export function gravityStrengthFromBeadSize(beadSize) {
    const t = Math.min(100, Math.max(0, Number(beadSize) || 50)) / 100;
    return 0.46 + t * 1.08;
}

/**
 * @param {{ cx: number, cy: number, R: number, bodies: object[] }} world
 * @param {object} bead normalized bead
 * @param {number} id
 * @param {{ gx: number, gy: number }} g gravity in dish-local px/s²
 */
export function addPetriBody(world, bead, id, g) {
    const { cx, cy, R, bodies } = world;
    const r = petriBeadRadiusPx(bead.size, R);
    const glen = Math.hypot(g.gx, g.gy) || 1;
    const ux = g.gx / glen;
    const uy = g.gy / glen;
    const spawn = R - r - 6;
    const jx = (Math.random() - 0.5) * spawn * 0.5;
    const jy = (Math.random() - 0.5) * spawn * 0.35;
    const vx = (Math.random() - 0.5) * 16;
    const vy = (Math.random() - 0.5) * 16;
    bodies.push({
        id,
        bead,
        x: cx - ux * spawn + jx,
        y: cy - uy * spawn + jy,
        vx,
        vy,
        r,
        /** Visual roll / highlight direction (rad); nudged by bead–bead and wall contact. */
        spin: Math.atan2(vy, vx),
    });
}

/**
 * Keeps bead inside circular rim; applies low restitution on outward radial motion.
 * @returns {number} radial impact speed (px/s) when a bounce was applied, else 0
 */
function resolveWall(cx, cy, R, b) {
    let dx = b.x - cx;
    let dy = b.y - cy;
    const dist = Math.hypot(dx, dy) || 1e-8;
    const maxD = R - b.r;
    if (dist <= maxD) return 0;
    dx /= dist;
    dy /= dist;
    b.x = cx + dx * maxD;
    b.y = cy + dy * maxD;
    const vn = b.vx * dx + b.vy * dy;
    if (vn > 0) {
        b.vx -= (1 + RESTITUTION) * vn * dx;
        b.vy -= (1 + RESTITUTION) * vn * dy;
        return vn;
    }
    return 0;
}

/**
 * Separates overlapping beads; applies impulse if approaching along normal.
 * @returns {number} closing speed along normal (px/s) when an impulse was applied, else 0
 */
function resolvePair(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1e-8;
    const minD = a.r + b.r;
    if (dist >= minD) return 0;
    const nx = dx / dist;
    const ny = dy / dist;
    const overlap = minD - dist;
    a.x -= nx * overlap * 0.5;
    a.y -= ny * overlap * 0.5;
    b.x += nx * overlap * 0.5;
    b.y += ny * overlap * 0.5;

    const vreln = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
    if (vreln < 0) {
        const j = (-(1 + RESTITUTION) * vreln) / 2;
        const jx = j * nx;
        const jy = j * ny;
        a.vx -= jx;
        a.vy -= jy;
        b.vx += jx;
        b.vy += jy;
        return -vreln;
    }
    return 0;
}

/**
 * @param {{ cx: number, cy: number, R: number, bodies: {x,y,vx,vy,r}[] }} world
 * @param {number} dt seconds
 * @param {{ gx: number, gy: number }} g
 * @param {number} [substeps=3]
 * @param {{ v: number }[] | null} [outPairHits]  reuse array; wall + bead–bead hits on last substep only (SFX)
 */
export function stepPetriWorld(world, dt, g, substeps = 3, outPairHits = null) {
    const { cx, cy, R, bodies } = world;
    const n = bodies.length;
    if (n === 0) return;
    if (outPairHits) {
        outPairHits.length = 0;
    }
    for (let i = 0; i < n; i += 1) {
        const b = bodies[i];
        if (typeof b.spin !== 'number' || Number.isNaN(b.spin)) {
            b.spin = Math.atan2(b.vy || 0, b.vx || 0);
        }
    }
    const h = dt / substeps;
    const lastS = substeps - 1;
    /** Pair overlaps are cleared by earlier iterations; sample bead–bead clacks on k===0 only. */
    const PAIR_HIT_RECORD_K = 0;
    for (let s = 0; s < substeps; s += 1) {
        for (let i = 0; i < n; i += 1) {
            const b = bodies[i];
            const gScale = gravityStrengthFromBeadSize(b.bead?.size);
            b.vx += g.gx * h * gScale;
            b.vy += g.gy * h * gScale;
            b.x += b.vx * h;
            b.y += b.vy * h;
            /* Time-based viscous drag (oil), frame-rate stable. */
            const visc = Math.exp(-5.8 * h);
            b.vx *= DAMPING * visc;
            b.vy *= DAMPING * visc;
        }
        for (let i = 0; i < n; i += 1) {
            const wallImpact = resolveWall(cx, cy, R, bodies[i]);
            if (
                outPairHits &&
                s === lastS &&
                wallImpact >= PETRI_WALL_SOUND_MIN
            ) {
                outPairHits.push({ v: Math.min(160, wallImpact * 1.45) });
            }
        }
        for (let k = 0; k < PAIR_ITERS; k += 1) {
            const recordPairHits = outPairHits && s === lastS && k === PAIR_HIT_RECORD_K;
            for (let i = 0; i < n; i += 1) {
                for (let j = i + 1; j < n; j += 1) {
                    const closing = resolvePair(bodies[i], bodies[j]);
                    if (recordPairHits && closing >= PETRI_PAIR_SOUND_MIN_CLOSING) {
                        /* Scale into same ballpark as tray wall hits for playTrayWallClicks */
                        outPairHits.push({ v: Math.min(160, closing * 2.1) });
                    }
                }
            }
        }
    }
    applyContactSpin(cx, cy, R, bodies);
}
