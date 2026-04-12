import { HEART_FINAL_GEM } from './heartFinalGemData';
import { adjustBrightnessT, mixPrimaryAccent } from './heartGrayscaleMix';

/**

 * Renders the petri dish and beads to a canvas using the same coordinate space as physics.

 * Beads match build shapes: circle, oval, flower, heart (heart gem paths from HEART_FINAL_GEM).

 * @param {CanvasRenderingContext2D} ctx

 * @param {{ cx: number, cy: number, R: number, bodies: { x: number, y: number, r: number, vx: number, vy: number, bead: { shape?: string, fill: string, accent?: string } }[] }} world

 * @param {number} [tiltRad] Same tilt as physics / build view: whole dish + beads rotate about center.

 * @param {{ omitRimStroke?: boolean }} [opts] Kaleidoscope: no dish outline; flat fill so no circular rim in hex tiles.

 */

export function drawPetriSource(ctx, world, tiltRad = 0, opts = {}) {

    const { width, height } = ctx.canvas;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = opts.omitRimStroke ? '#ffffff' : 'rgba(248, 245, 238, 0.98)';

    ctx.fillRect(0, 0, width, height);



    const { cx, cy, R, bodies } = world;



    ctx.save();

    ctx.translate(cx, cy);

    ctx.rotate(tiltRad);

    ctx.translate(-cx, -cy);



    if (opts.omitRimStroke) {

        /* No raised rim / tan donut — avoids a visible dish circle on white hex stage. */

        ctx.beginPath();

        ctx.arc(cx, cy, R, 0, Math.PI * 2);

        ctx.fillStyle = '#ffffff';

        ctx.fill();

        ctx.clip();

        ctx.fillStyle = 'rgba(245, 243, 238, 0.18)';

        ctx.fillRect(0, 0, width, height);

    } else {

        ctx.beginPath();

        ctx.arc(cx, cy, R + 5, 0, Math.PI * 2);

        ctx.fillStyle = 'rgba(228, 222, 210, 0.96)';

        ctx.fill();

        ctx.beginPath();

        ctx.arc(cx, cy, R, 0, Math.PI * 2);

        ctx.clip();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';

        ctx.fillRect(0, 0, width, height);

    }



    for (const b of bodies) {

        drawBeadShape(ctx, b);

    }



    ctx.restore();



    if (!opts.omitRimStroke) {

        ctx.save();

        ctx.translate(cx, cy);

        ctx.rotate(tiltRad);

        ctx.translate(-cx, -cy);

        ctx.beginPath();

        ctx.arc(cx, cy, R, 0, Math.PI * 2);

        ctx.strokeStyle = '#0a0a0a';

        ctx.lineWidth = 2.5;

        ctx.stroke();

        ctx.restore();

    }

}



function applySvgTransform(ctx, transformStr) {

    if (!transformStr) return;

    try {

        if (typeof DOMMatrix !== 'undefined') {

            const m = new DOMMatrix(transformStr.trim());

            ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);

            return;

        }

    } catch {

        /* fallback */

    }

    const tr = transformStr.match(/translate\(\s*([-\d.]+)[\s,]+([-\d.]+)\s*\)/);

    if (tr) {

        ctx.translate(parseFloat(tr[1]), parseFloat(tr[2]));

    }

}



function walkHeartGemCanvas(ctx, node, primary, accent, lightDeg) {

    if (node.kind === 'path') {

        const t = adjustBrightnessT(node.t, lightDeg);

        const c = mixPrimaryAccent(primary, accent, t);

        ctx.fillStyle = c;

        try {

            ctx.fill(new Path2D(node.d));

        } catch {

            /* ignore bad path */

        }

        return;

    }

    ctx.save();

    if (node.transform) applySvgTransform(ctx, node.transform);

    for (const ch of node.children) {

        walkHeartGemCanvas(ctx, ch, primary, accent, lightDeg);

    }

    ctx.restore();

}



function drawHeartBeadCanvas(ctx, x, y, r, fill, accent, lightDeg, spinRad = 0) {

    const { viewBox, root } = HEART_FINAL_GEM;

    if (!root) {

        drawCircleBeadCanvas(ctx, x, y, r, fill, accent, spinRad);

        return;

    }

    const parts = String(viewBox)

        .trim()

        .split(/[\s,]+/)

        .map(Number);

    const vx = parts[0] || 0;

    const vy = parts[1] || 0;

    const vw = parts[2] || 1;

    const vh = parts[3] || 1;

    const s = (2 * r) / Math.max(vw, vh, 1e-6);



    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(spinRad);

    ctx.scale(s, s);

    ctx.translate(-(vx + vw / 2), -(vy + vh / 2));

    walkHeartGemCanvas(ctx, root, fill, accent || fill, lightDeg);

    ctx.restore();

}



function drawFlowerBeadCanvas(ctx, x, y, r, fill, accent, spinRad = 0) {

    const a = accent || fill;

    const scale = (r * 1.08) / 37;

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(spinRad);

    ctx.scale(scale, scale);

    for (let i = 0; i < 5; i += 1) {

        ctx.save();

        ctx.rotate((i * 72 * Math.PI) / 180);

        ctx.translate(0, -24);

        const g = ctx.createLinearGradient(-13, -24, 13, 24);

        g.addColorStop(0, fill);

        g.addColorStop(0.55, fill);

        g.addColorStop(1, a);

        ctx.fillStyle = g;

        ctx.beginPath();

        ctx.ellipse(0, 0, 13, 24, 0, 0, Math.PI * 2);

        ctx.fill();

        ctx.restore();

    }

    ctx.fillStyle = a;

    ctx.beginPath();

    ctx.arc(0, 0, 11, 0, Math.PI * 2);

    ctx.fill();

    ctx.restore();

}



function drawOvalBeadCanvas(ctx, x, y, r, fill, accent, spinRad = 0) {

    const a = accent || fill;

    const rx = r * 0.78;

    const ry = r;

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(spinRad);

    const g = ctx.createRadialGradient(-rx * 0.35, -ry * 0.35, 0, 0, 0, r);

    g.addColorStop(0, fill);

    g.addColorStop(0.5, fill);

    g.addColorStop(1, a);

    ctx.fillStyle = g;

    ctx.beginPath();

    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);

    ctx.fill();

    ctx.restore();

}



function drawCircleBeadCanvas(ctx, x, y, r, fill, accent, spinRad = 0) {

    const a = accent || fill;

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(spinRad);

    const g = ctx.createRadialGradient(-r * 0.32, -r * 0.32, 0, 0, 0, r);

    g.addColorStop(0, fill);

    g.addColorStop(0.5, fill);

    g.addColorStop(1, a);

    ctx.fillStyle = g;

    ctx.beginPath();

    ctx.arc(0, 0, r, 0, Math.PI * 2);

    ctx.fill();

    ctx.restore();

}



function drawBeadShape(ctx, b) {

    const { x, y, r, bead, vx, vy, spin } = b;

    const fill = bead.fill;

    const accent = bead.accent || fill;

    const spinRad =
        typeof spin === 'number' && Number.isFinite(spin)
            ? spin
            : Number.isFinite(vx) && Number.isFinite(vy)
              ? Math.atan2(vy, vx)
              : 0;

    const shape = bead.shape || 'circle';



    switch (shape) {

        case 'heart':

            /* Fixed facet lighting; spin is canvas rotation only (matches DOM heart). */

            drawHeartBeadCanvas(ctx, x, y, r, fill, accent, 38, spinRad);

            break;

        case 'flower':

            drawFlowerBeadCanvas(ctx, x, y, r, fill, accent, spinRad);

            break;

        case 'oval':

            drawOvalBeadCanvas(ctx, x, y, r, fill, accent, spinRad);

            break;

        default:

            drawCircleBeadCanvas(ctx, x, y, r, fill, accent, spinRad);

    }

}
