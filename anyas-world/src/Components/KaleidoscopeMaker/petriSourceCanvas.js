import { HEART_FINAL_GEM } from './heartFinalGemData';
import { FLOWER_FINAL_GEM } from './flowerGemData';
import { adjustBrightnessT, mixPrimaryAccent } from './heartGrayscaleMix';

/**

 * Renders the petri dish and beads to a canvas using the same coordinate space as physics.

 * Beads match build shapes: circle, oval, flower, heart (SVG gem paths from HEART_FINAL_GEM / FLOWER_FINAL_GEM).

 * @param {CanvasRenderingContext2D} ctx

 * @param {{ cx: number, cy: number, R: number, bodies: { x: number, y: number, r: number, vx: number, vy: number, bead: { shape?: string, fill: string, accent?: string } }[] }} world

 * @param {number} [tiltRad] Same tilt as physics / build view: whole dish + beads rotate about center.

 * @param {{ omitRimStroke?: boolean, tracers?: boolean }} [opts]
 *   omitRimStroke — kaleidoscope: no dish outline; transparent bg (beads only).
 *   tracers — fade the previous frame instead of wiping (motion trails).
 */

export function drawPetriSource(ctx, world, tiltRad = 0, opts = {}) {

    const { width, height } = ctx.canvas;

    /* Wipe/fade in identity space so a caller transform (hex-view 2× + margin) doesn't clip it. */
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (opts.omitRimStroke && opts.tracers) {
        /* Pull previous pixels toward transparent — leaves soft wakes behind moving beads. */
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
    } else {
        ctx.clearRect(0, 0, width, height);
        if (!opts.omitRimStroke) {
            ctx.fillStyle = 'rgba(248, 245, 238, 0.98)';
            ctx.fillRect(0, 0, width, height);
        }
    }
    ctx.restore();

    const { cx, cy, R, bodies } = world;



    ctx.save();

    ctx.translate(cx, cy);

    ctx.rotate(tiltRad);

    ctx.translate(-cx, -cy);



    if (opts.omitRimStroke) {

        /* Kaleidoscope tiles: clip to the dish but leave the background transparent
           so each fractal shows beads only — no white disk behind them. */
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.clip();

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



    /* Separate planes: glitter behind the beads → beads → glitter in front. */

    for (const b of bodies) {

        if (b.bead?.shape === 'glitter' && !b.bead.zFront) drawBeadShape(ctx, b, tiltRad);

    }

    for (const b of bodies) {

        if (b.bead?.shape !== 'glitter') drawBeadShape(ctx, b, tiltRad);

    }

    for (const b of bodies) {

        if (b.bead?.shape === 'glitter' && b.bead.zFront) drawBeadShape(ctx, b, tiltRad);

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



function walkGrayscaleGemCanvas(ctx, node, primary, accent, lightDeg) {

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

        walkGrayscaleGemCanvas(ctx, ch, primary, accent, lightDeg);

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

    walkGrayscaleGemCanvas(ctx, root, fill, accent || fill, lightDeg);

    ctx.restore();

}



function drawFlowerBeadCanvas(ctx, x, y, r, fill, accent, lightDeg, spinRad = 0) {

    const { viewBox, root } = FLOWER_FINAL_GEM;

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

    walkGrayscaleGemCanvas(ctx, root, fill, accent || fill, lightDeg);

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



/**

 * Holographic speck color, like real holo glitter: mostly silvery, with sharp

 * spectral flashes and occasional white-hot glints. The "facet" index jumps

 * discretely as the dish tilts (angle-dependent, like a real hologram) and

 * drifts slowly with time so idle glitter still twinkles.

 */

function holoSpeckColor(id, tiltRad) {

    const seed = ((id ?? 0) * 2654435761) >>> 0;

    const tSec = performance.now() * 0.001;

    const facet = Math.floor(

        tiltRad * (2.8 + (seed % 5) * 0.9) + tSec * (0.4 + ((seed >>> 3) % 5) * 0.18) + (seed % 97),

    );

    let h = (seed ^ Math.imul(facet, 0x9e3779b1)) >>> 0;

    h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0;

    const hue = h % 360;

    const glint = ((h >>> 10) % 1000) / 1000;

    if (glint > 0.93) return `hsl(${hue}, 40%, 96%)`;

    if (glint > 0.55) return `hsl(${hue}, 96%, 58%)`;

    return `hsl(${hue}, 16%, ${66 + (h % 16)}%)`;

}



/**

 * 0..1 lens-flare intensity for a speck right now. Time is split into

 * per-speck windows; a hash decides which windows sparkle and where in the

 * window the flash sits, so flares pop at random, one speck at a time.

 * Tilting shifts the windows, sweeping fresh sparkles across the field.

 */

function speckSparkle(id, tiltRad) {

    const seed = ((id ?? 0) * 2654435761) >>> 0;

    const tSec = performance.now() * 0.001;

    const windowLen = 1.5 + (seed % 5) * 0.45;

    const pos = tSec / windowLen + ((seed >>> 4) % 1000) / 1000 + tiltRad * (0.6 + (seed % 3) * 0.3);

    const wIdx = Math.floor(pos);

    let h = (seed ^ Math.imul(wIdx, 0x9e3779b1)) >>> 0;

    h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0;

    if (h % 1000 >= 240) return 0;

    const start = ((h >>> 10) % 600) / 1000;

    const u = (pos - wIdx - start) / 0.28;

    if (u <= 0 || u >= 1) return 0;

    return Math.sin(Math.PI * u);

}



/** Classic 4-point star flare: additive glow core + two tapered ray diamonds. */

function drawSpeckFlare(ctx, x, y, r, intensity, id) {

    const seed = ((id ?? 0) * 40503) >>> 0;

    const rot = ((seed % 360) * Math.PI) / 180;

    const len = r * (5 + (seed % 4)) * intensity;

    const wHalf = Math.max(0.5, r * 0.34);

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(rot);

    ctx.globalCompositeOperation = 'lighter';



    const gr = r * 3.4 * intensity + 0.01;

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, gr);

    g.addColorStop(0, `rgba(255,255,255,${0.85 * intensity})`);

    g.addColorStop(0.4, `rgba(255,255,255,${0.26 * intensity})`);

    g.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = g;

    ctx.fillRect(-gr, -gr, gr * 2, gr * 2);



    ctx.fillStyle = `rgba(255,255,255,${0.75 * intensity})`;

    ctx.beginPath();

    ctx.moveTo(-len, 0);

    ctx.lineTo(0, -wHalf);

    ctx.lineTo(len, 0);

    ctx.lineTo(0, wHalf);

    ctx.closePath();

    ctx.fill();



    /* Perpendicular ray pair, slightly shorter, for the classic flare asymmetry. */

    ctx.rotate(Math.PI / 2);

    const len2 = len * 0.62;

    ctx.beginPath();

    ctx.moveTo(-len2, 0);

    ctx.lineTo(0, -wHalf);

    ctx.lineTo(len2, 0);

    ctx.lineTo(0, wHalf);

    ctx.closePath();

    ctx.fill();



    ctx.restore();

}



/** Also used by PetriDishView, which draws glitter to overlay canvases (a DOM node per speck is too slow). */

export function drawGlitterSpeck(ctx, x, y, r, bead, id, tiltRad) {

    const color = bead.holo ? holoSpeckColor(id, tiltRad) : bead.fill;



    /* Soft halo behind every grain keeps the field looking ethereal, not gritty. */

    ctx.globalAlpha = 0.16;

    ctx.beginPath();

    ctx.arc(x, y, r * 2.3, 0, Math.PI * 2);

    ctx.fillStyle = color;

    ctx.fill();

    ctx.globalAlpha = 1;



    ctx.beginPath();

    ctx.arc(x, y, r, 0, Math.PI * 2);

    ctx.fillStyle = color;

    ctx.fill();



    const sparkle = speckSparkle(id, tiltRad);

    if (sparkle > 0.03) drawSpeckFlare(ctx, x, y, r, sparkle, id);

}



/** Still / fallback HTMLImageElements keyed by data URL. */
const beadImageCache = new Map();

/**
 * Animated GIF players for canvas. Browsers often freeze GIFs when drawImage'd from a
 * hidden <img>, so we decode frames (ImageDecoder) and advance by timestamp ourselves.
 * @type {Map<string, {
 *   status: 'loading' | 'ready' | 'fallback',
 *   frames: { bitmap: ImageBitmap|VideoFrame|HTMLImageElement, duration: number }[],
 *   totalMs: number,
 *   t0: number,
 *   img: HTMLImageElement | null,
 * }>}
 */
const gifPlayerCache = new Map();

function isGifSrc(src) {
    return typeof src === 'string' && /^data:image\/gif/i.test(src);
}

/** Paintable 1×1 host — zero-size / opacity:0 hosts often never advance GIF clocks. */
function beadGifHost() {
    let host = document.getElementById('km-bead-gif-host');
    if (!host) {
        host = document.createElement('div');
        host.id = 'km-bead-gif-host';
        host.setAttribute('aria-hidden', 'true');
        host.style.cssText =
            'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0.01;pointer-events:none;';
        document.body.appendChild(host);
    }
    return host;
}

function getBeadImage(src) {
    let img = beadImageCache.get(src);
    if (!img) {
        img = new Image();
        img.decoding = 'sync';
        img.src = src;
        beadImageCache.set(src, img);
        if (isGifSrc(src)) {
            img.style.width = '1px';
            img.style.height = '1px';
            img.style.display = 'block';
            beadGifHost().appendChild(img);
        }
    }
    return img.complete && img.naturalWidth > 0 ? img : null;
}

async function decodeGifWithImageDecoder(src, player) {
    const res = await fetch(src);
    const data = await res.arrayBuffer();
    const decoder = new ImageDecoder({ data, type: 'image/gif' });
    if (decoder.tracks?.ready) await decoder.tracks.ready;
    /* First decode populates track metadata in some engines. */
    await decoder.decode({ frameIndex: 0 });
    const track = decoder.tracks.selectedTrack;
    const count = Math.min(Math.max(1, track?.frameCount || 1), 160);
    const frames = [];
    let totalMs = 0;
    for (let i = 0; i < count; i += 1) {
        const { image, duration } = await decoder.decode({ frameIndex: i });
        /* Spec: duration is µs; missing/0 → treat as ~10fps. */
        const durationMs = Math.max(20, (duration || 100_000) / 1000);
        frames.push({ bitmap: image, duration: durationMs });
        totalMs += durationMs;
    }
    if (typeof decoder.close === 'function') decoder.close();
    if (frames.length === 0) throw new Error('no gif frames');
    player.frames = frames;
    player.totalMs = Math.max(totalMs, 20);
    player.t0 = performance.now();
    player.status = 'ready';
}

function attachGifImgFallback(src, player) {
    let img = beadImageCache.get(src);
    if (!img) {
        img = new Image();
        img.src = src;
        img.style.width = '1px';
        img.style.height = '1px';
        img.style.display = 'block';
        beadImageCache.set(src, img);
        beadGifHost().appendChild(img);
    } else if (!img.isConnected) {
        beadGifHost().appendChild(img);
    }
    player.img = img;
    player.status = 'fallback';
    if (!(img.complete && img.naturalWidth > 0)) {
        img.addEventListener(
            'load',
            () => {
                player.img = img;
                player.status = 'fallback';
            },
            { once: true },
        );
    }
}

function ensureGifPlayer(src) {
    let player = gifPlayerCache.get(src);
    if (player) return player;

    player = {
        status: 'loading',
        frames: [],
        totalMs: 0,
        t0: performance.now(),
        img: null,
    };
    gifPlayerCache.set(src, player);

    if (typeof ImageDecoder === 'function') {
        decodeGifWithImageDecoder(src, player).catch(() => attachGifImgFallback(src, player));
    } else {
        attachGifImgFallback(src, player);
    }

    return player;
}

function currentGifDrawable(src) {
    const player = ensureGifPlayer(src);
    if (player.status === 'ready' && player.frames.length > 0) {
        let t = (performance.now() - player.t0) % player.totalMs;
        for (let i = 0; i < player.frames.length; i += 1) {
            const frame = player.frames[i];
            if (t < frame.duration) {
                return {
                    source: frame.bitmap,
                    width: frame.bitmap.displayWidth || frame.bitmap.width || 1,
                    height: frame.bitmap.displayHeight || frame.bitmap.height || 1,
                };
            }
            t -= frame.duration;
        }
        const last = player.frames[player.frames.length - 1];
        return {
            source: last.bitmap,
            width: last.bitmap.displayWidth || last.bitmap.width || 1,
            height: last.bitmap.displayHeight || last.bitmap.height || 1,
        };
    }

    const img = player.img || getBeadImage(src);
    if (img && img.naturalWidth > 0) {
        return { source: img, width: img.naturalWidth, height: img.naturalHeight };
    }
    return null;
}

function drawImageBeadCanvas(ctx, x, y, r, src, fill, accent, spinRad = 0) {
    const drawable = isGifSrc(src) ? currentGifDrawable(src) : null;
    const still = drawable ? null : getBeadImage(src);
    const source = drawable?.source ?? still;
    if (!source) {
        /* Not decoded yet (first frame after load); placeholder until ready. */
        drawCircleBeadCanvas(ctx, x, y, r, fill, accent, spinRad);
        return;
    }
    const iw = drawable?.width ?? still.naturalWidth;
    const ih = drawable?.height ?? still.naturalHeight;
    const s = (2 * r) / Math.max(iw, ih, 1e-6);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(spinRad);
    ctx.drawImage(source, (-iw * s) / 2, (-ih * s) / 2, iw * s, ih * s);
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



function drawBeadShape(ctx, b, tiltRad = 0) {

    const { x, y, r, bead, vx, vy, spin } = b;

    if (bead.shape === 'glitter') {

        drawGlitterSpeck(ctx, x, y, r, bead, b.id, tiltRad);

        return;

    }

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

        case 'image':

            if (bead.image) {

                drawImageBeadCanvas(ctx, x, y, r, bead.image, fill, accent, spinRad);

            } else {

                drawCircleBeadCanvas(ctx, x, y, r, fill, accent, spinRad);

            }

            break;

        case 'heart':

            /* Fixed facet lighting; spin is canvas rotation only (matches DOM heart). */

            drawHeartBeadCanvas(ctx, x, y, r, fill, accent, 38, spinRad);

            break;

        case 'flower':

            /* Same fixed facet lighting as DOM flower bead (matches BeadVisual). */

            drawFlowerBeadCanvas(ctx, x, y, r, fill, accent, 38, spinRad);

            break;

        case 'oval':

            drawOvalBeadCanvas(ctx, x, y, r, fill, accent, spinRad);

            break;

        default:

            drawCircleBeadCanvas(ctx, x, y, r, fill, accent, spinRad);

    }

}
