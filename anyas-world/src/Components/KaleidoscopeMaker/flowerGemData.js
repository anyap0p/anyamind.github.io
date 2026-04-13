import flowerSvgRaw from '../../Icons/flower.svg?raw';
import { extractFillHex, grayscaleMixTFromHex } from './heartGrayscaleMix';

/**
 * Parse flower.svg: <g id="g343"> holds the artwork (Inkscape layer + transforms).
 * Grayscale fills map to bead primary (dark) / accent (light), same as the heart gem.
 */

function isDisplayNone(style) {
    if (!style) return false;
    return /display\s*:\s*none/i.test(style);
}

function walkElement(el, keyPath) {
    const tag = el.tagName?.toLowerCase();
    if (tag === 'path') {
        const style = el.getAttribute('style') || '';
        if (isDisplayNone(style)) return null;
        const d = el.getAttribute('d');
        if (!d || !d.trim()) return null;
        const fillAttr = el.getAttribute('fill');
        const hex = extractFillHex(style, fillAttr);
        const t = grayscaleMixTFromHex(hex);
        return {
            k: keyPath,
            kind: 'path',
            d,
            t,
        };
    }
    if (tag === 'g') {
        const gStyle = el.getAttribute('style') || '';
        if (isDisplayNone(gStyle)) return null;
        const children = [...el.children]
            .map((c, i) => walkElement(c, `${keyPath}/${i}`))
            .filter(Boolean);
        if (children.length === 0) return null;
        return {
            k: el.getAttribute('id') || keyPath,
            kind: 'g',
            transform: el.getAttribute('transform') || undefined,
            children,
        };
    }
    return null;
}

function parseFlowerGem() {
    const doc = new DOMParser().parseFromString(flowerSvgRaw, 'image/svg+xml');
    const err = doc.querySelector('parsererror');
    if (err?.textContent) {
        console.warn('flower.svg parse:', err.textContent.trim());
    }
    const rootSvg = doc.querySelector('svg');
    const viewBox = rootSvg?.getAttribute('viewBox') || '0 0 106.89167 104.06944';
    const art = doc.querySelector('#g343') || doc.querySelector('#layer1');
    const root = art ? walkElement(art, art.getAttribute('id') || 'flower-root') : null;
    return { viewBox, root };
}

export const FLOWER_FINAL_GEM = parseFlowerGem();
