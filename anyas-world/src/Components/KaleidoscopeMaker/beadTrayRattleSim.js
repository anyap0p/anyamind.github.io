/** Simplified 2D tray physics in %-of-cell units (uniform scale). */

const SPRING_K = 34;
const REPULSE_STRENGTH = 14;
const REST_SEP = 7.2;
const DAMPING = 0.987;
const WALL = { xmin: 16, xmax: 84, ymin: 18, ymax: 82 };
const BOUNCE = 0.28;
/** Min speed (toward wall) to count a hit — avoids audio spam when pressed against wall. */
export const TRAY_WALL_HIT_MIN_SPEED = 9;

function frac(n) {
    return n - Math.floor(n);
}

function seeded01(n) {
    return frac(Math.sin(n * 12.9898) * 43758.5453);
}

/**
 * @param {{ x: number, y: number }[]} rest
 * @param {{ ix: number, iy: number }} impulse  box moves up → iy = +1 (beads lag down in tray coords)
 * @param {number} slotIndex
 * @param {number} rattleKey
 */
export function createRattleState(rest, impulse, slotIndex, rattleKey) {
    const n = rest.length;
    const pos = rest.map((p) => ({ x: p.x, y: p.y }));
    const vel = pos.map((_, i) => {
        const s = slotIndex * 47 + i * 19 + rattleKey * 13;
        const nx = (seeded01(s) - 0.5) * 56;
        const ny = (seeded01(s + 3) - 0.5) * 40;
        const nz = (seeded01(s + 7) - 0.5) * 28;
        const main = 1.02;
        const w = 0.78 + seeded01(s + 101) * 0.44;
        return {
            vx: impulse.ix * 118 * main * w + nx + nz,
            vy: impulse.iy * 118 * main * w + ny + (seeded01(s + 11) - 0.5) * 18,
        };
    });
    return { pos, vel, rest };
}

/**
 * @param {{ pos: {x,y}[], vel: {vx,vy}[], rest: {x,y}[] }} state
 * @param {number} dt  seconds
 * @returns {{ v: number }[]} wall hits this substep (incoming speed normal to wall)
 */
export function stepRattleState(state, dt) {
    const hits = [];
    const { pos, vel, rest } = state;
    const n = pos.length;
    const ax = new Float64Array(n);
    const ay = new Float64Array(n);

    for (let i = 0; i < n; i++) {
        ax[i] = SPRING_K * (rest[i].x - pos[i].x);
        ay[i] = SPRING_K * (rest[i].y - pos[i].y);
    }

    /* Local repulsion only (O(n)); spring + walls keep the pile plausible. */
    const neighborOffsets = [1, 2, 3, 5, 8, 13, 21];
    for (let i = 0; i < n; i++) {
        for (const off of neighborOffsets) {
            const j = i + off;
            if (j >= n) break;
            const dx = pos[i].x - pos[j].x;
            const dy = pos[i].y - pos[j].y;
            const d = Math.hypot(dx, dy) + 0.08;
            if (d < REST_SEP * 1.45) {
                const push = REPULSE_STRENGTH * (REST_SEP - d);
                const nx = dx / d;
                const ny = dy / d;
                ax[i] += nx * push;
                ay[i] += ny * push;
                ax[j] -= nx * push;
                ay[j] -= ny * push;
            }
        }
    }

    const dtClamped = Math.min(dt, 0.034);
    for (let i = 0; i < n; i++) {
        vel[i].vx = (vel[i].vx + ax[i] * dtClamped) * DAMPING;
        vel[i].vy = (vel[i].vy + ay[i] * dtClamped) * DAMPING;
        pos[i].x += vel[i].vx * dtClamped;
        pos[i].y += vel[i].vy * dtClamped;

        if (pos[i].x < WALL.xmin) {
            const incoming = -vel[i].vx;
            pos[i].x = WALL.xmin;
            vel[i].vx = Math.abs(vel[i].vx) * BOUNCE;
            if (incoming > TRAY_WALL_HIT_MIN_SPEED) hits.push({ v: incoming });
        } else if (pos[i].x > WALL.xmax) {
            const incoming = vel[i].vx;
            pos[i].x = WALL.xmax;
            vel[i].vx = -Math.abs(vel[i].vx) * BOUNCE;
            if (incoming > TRAY_WALL_HIT_MIN_SPEED) hits.push({ v: incoming });
        }
        if (pos[i].y < WALL.ymin) {
            const incoming = -vel[i].vy;
            pos[i].y = WALL.ymin;
            vel[i].vy = Math.abs(vel[i].vy) * BOUNCE;
            if (incoming > TRAY_WALL_HIT_MIN_SPEED) hits.push({ v: incoming });
        } else if (pos[i].y > WALL.ymax) {
            const incoming = vel[i].vy;
            pos[i].y = WALL.ymax;
            vel[i].vy = -Math.abs(vel[i].vy) * BOUNCE;
            if (incoming > TRAY_WALL_HIT_MIN_SPEED) hits.push({ v: incoming });
        }
    }
    return hits;
}

export function copyPositions(pos) {
    return pos.map((p) => ({ x: p.x, y: p.y }));
}
