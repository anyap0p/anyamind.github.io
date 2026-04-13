/** Rest positions inside the pile inset (room for width × scale × rotation + rattle). */
const MAX_TRAY_ORBS = 16;

const BASES = [
    [22, 22],
    [78, 24],
    [50, 18],
    [18, 50],
    [82, 52],
    [52, 78],
    [24, 76],
    [78, 74],
    [50, 50],
    [38, 58],
    [32, 34],
    [68, 40],
    [46, 44],
    [62, 60],
    [40, 64],
    [58, 36],
    [44, 28],
    [72, 62],
];

function frac(n) {
    return n - Math.floor(n);
}

/** Deterministic spread for orb indices beyond BASES.length. */
function extraBase(slotIndex, i) {
    const j = slotIndex * 199 + i * 503 + i * i * 7;
    const gx = frac(Math.sin(j * 12.9898) * 43758.5453);
    const gy = frac(Math.sin(j * 78.233) * 43758.5453);
    return [18 + gx * 64, 20 + gy * 60];
}

/**
 * @param {number} slotIndex
 * @param {number} count  how many orbs (caller uses beadTrayOrbCount)
 */
export function beadPileLayout(slotIndex, count = MAX_TRAY_ORBS) {
    const c = Math.min(Math.max(1, count), MAX_TRAY_ORBS);
    return Array.from({ length: c }, (_, i) => {
        const [bx, by] = i < BASES.length ? BASES[i] : extraBase(slotIndex, i);
        const j = slotIndex * 13 + i * 17;
        const nx = Math.min(82, Math.max(18, bx + (j % 5) - 2));
        const ny = Math.min(80, Math.max(20, by + ((j * 3) % 5) - 2));
        return {
            x: nx,
            y: ny,
            rot: ((slotIndex * 11 + i * 19) % 50) - 25,
        };
    });
}
