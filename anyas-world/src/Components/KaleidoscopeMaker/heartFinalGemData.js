import heartSvgRaw from '../../Icons/heartFInal.svg?raw';
import { extractFillHex, grayscaleMixTFromHex } from './heartGrayscaleMix';

/**
 * One-time parse of heartFInal.svg: keeps <g> transforms, stores per-path grayscale → mix factor t.
 * Black (#000) → t=0 → primary; white (#fff) → t=1 → accent.
 */

function walkElement(el, keyPath) {
    const tag = el.tagName?.toLowerCase();
    if (tag === 'path') {
        const d = el.getAttribute('d');
        if (!d || !d.trim()) return null;
        const style = el.getAttribute('style') || '';
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

function parseHeartGem() {
    const doc = new DOMParser().parseFromString(heartSvgRaw, 'image/svg+xml');
    const err = doc.querySelector('parsererror');
    if (err?.textContent) {
        console.warn('heartFInal.svg parse:', err.textContent.trim());
    }
    const rootSvg = doc.querySelector('svg');
    const viewBox = rootSvg?.getAttribute('viewBox') || '0 0 12.61533 12.530643';
    const layer2 = doc.querySelector('#layer2');
    const root = layer2 ? walkElement(layer2, 'layer2') : null;
    return { viewBox, root };
}

export const HEART_FINAL_GEM = parseHeartGem();
