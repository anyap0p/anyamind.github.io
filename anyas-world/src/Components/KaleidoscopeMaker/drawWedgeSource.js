import { SEGMENTS } from './constants';

export function drawWedgeSource(bctx, bw, bh, t, mx, my) {
    const cx = bw / 2;
    const cy = bh / 2;
    const r = Math.min(bw, bh) * 0.48;
    const half = Math.PI / SEGMENTS;

    bctx.fillStyle = '#06060c';
    bctx.fillRect(0, 0, bw, bh);

    bctx.save();
    bctx.translate(cx, cy);
    bctx.beginPath();
    bctx.moveTo(0, 0);
    bctx.arc(0, 0, r, -half, half);
    bctx.closePath();
    bctx.clip();

    const pull = 0.22 * r;
    const ax = (mx - 0.5) * pull * 2;
    const ay = (my - 0.5) * pull * 2;

    for (let i = 0; i < 6; i++) {
        const phase = t * 0.0009 + i * 1.1;
        const px =
            Math.cos(phase) * r * 0.55 + Math.sin(phase * 0.7) * r * 0.15 + ax;
        const py =
            Math.sin(phase * 1.2) * r * 0.55 + Math.cos(phase * 0.5) * r * 0.12 + ay;
        const rad = r * (0.18 + (i % 3) * 0.08);
        const grd = bctx.createRadialGradient(px, py, 0, px, py, rad);
        const hue = (t * 0.04 + i * 58 + mx * 40 + my * 40) % 360;
        grd.addColorStop(0, `hsla(${hue}, 82%, 62%, 0.9)`);
        grd.addColorStop(0.45, `hsla(${(hue + 40) % 360}, 70%, 45%, 0.35)`);
        grd.addColorStop(1, 'transparent');
        bctx.fillStyle = grd;
        bctx.fillRect(-r, -r, 2 * r, 2 * r);
    }

    bctx.restore();
}
