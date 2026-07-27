/** Longest side of a stored still image; keeps data URLs small enough for localStorage. */
const BEAD_IMAGE_MAX_SIDE = 128;

/** Working resolution for the alpha scan; huge uploads are pre-shrunk to keep it cheap. */
const TRIM_SCAN_MAX_SIDE = 1024;

/** Pixels this faint don't count toward the visible bounding box. */
const TRIM_ALPHA_MIN = 8;

/**
 * Animated GIFs are stored as-is (canvas re-encode would freeze them). Cap the data URL
 * so one upload cannot blow the localStorage budget; oversized GIFs fall back to a still.
 */
const MAX_GIF_DATA_URL_CHARS = 900_000;

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('bad image'));
        img.src = src;
    });
}

function isGifUpload(file, dataUrl) {
    if (file?.type === 'image/gif') return true;
    return typeof dataUrl === 'string' && /^data:image\/gif/i.test(dataUrl);
}

/** Bounding box of visible (non-transparent) pixels; falls back to the full frame. */
function alphaBoundingBox(ctx, w, h) {
    const { data } = ctx.getImageData(0, 0, w, h);
    let minX = w;
    let minY = h;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < h; y += 1) {
        const row = y * w;
        for (let x = 0; x < w; x += 1) {
            if (data[(row + x) * 4 + 3] >= TRIM_ALPHA_MIN) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }
    if (maxX < 0) return { x: 0, y: 0, w, h };
    return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/**
 * Still-image path: trim transparent margins, downscale, re-encode as PNG.
 * @param {string} dataUrl
 * @returns {Promise<string>}
 */
async function stillImageToBeadDataUrl(dataUrl) {
    const img = await loadImage(dataUrl);
    const w = img.naturalWidth || 1;
    const h = img.naturalHeight || 1;

    const workScale = Math.min(1, TRIM_SCAN_MAX_SIDE / Math.max(w, h));
    const ww = Math.max(1, Math.round(w * workScale));
    const wh = Math.max(1, Math.round(h * workScale));
    const work = document.createElement('canvas');
    work.width = ww;
    work.height = wh;
    const wctx = work.getContext('2d', { willReadFrequently: true });
    wctx.imageSmoothingEnabled = true;
    if (typeof wctx.imageSmoothingQuality === 'string') wctx.imageSmoothingQuality = 'high';
    wctx.drawImage(img, 0, 0, ww, wh);

    const box = alphaBoundingBox(wctx, ww, wh);

    const outScale = Math.min(1, BEAD_IMAGE_MAX_SIDE / Math.max(box.w, box.h));
    const cw = Math.max(1, Math.round(box.w * outScale));
    const ch = Math.max(1, Math.round(box.h * outScale));
    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    if (typeof ctx.imageSmoothingQuality === 'string') ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(work, box.x, box.y, box.w, box.h, 0, 0, cw, ch);
    return canvas.toDataURL('image/png');
}

/**
 * Reads a user-picked image and returns a data URL for the bead:
 * - GIFs keep their animation (stored as `data:image/gif…`) when under size cap
 * - other formats are trimmed and downscaled to a PNG
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function fileToBeadImageDataUrl(file) {
    const dataUrl = await readFileAsDataUrl(file);

    if (isGifUpload(file, dataUrl) && dataUrl.length <= MAX_GIF_DATA_URL_CHARS) {
        /* Decode once so we fail early on corrupt files; keep the original bytes for animation. */
        await loadImage(dataUrl);
        return dataUrl;
    }

    return stillImageToBeadDataUrl(dataUrl);
}
