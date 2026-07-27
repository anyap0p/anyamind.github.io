/* One-off diagnostic: opens the mini bead editor from the stash and
   screenshots it with layout metrics. Dev server on :5173.
   Usage: node scripts/km-editor-screenshot.mjs <width> <height> <out.png> */
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = process.env.KM_URL || 'http://localhost:5173/art/kaleidoscope-maker/full';
const WIDTH = Number(process.argv[2] || 1280);
const HEIGHT = Number(process.argv[3] || 800);
const OUT = process.argv[4] || 'km-editor.png';

const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: [`--window-size=${WIDTH},${HEIGHT + 100}`],
});
const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

await page.evaluateOnNewDocument(() => {
    const beads = Array.from({ length: 12 }, (_, i) => ({
        shape: ['heart', 'circle', 'oval', 'flower'][i % 4],
        fill: '#e74c3c',
        accent: '#3498db',
        size: 40 + i * 4,
    }));
    localStorage.setItem('kaleidoscopeMaker_customBeads', JSON.stringify(beads));
});

page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));

await page.goto(URL, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 2000));

const clicked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const target = btns.find((b) => b.textContent.replace(/\u00a0/g, ' ').includes('your bead stash'));
    if (!target) return false;
    target.click();
    return true;
});
console.log('clicked stash:', clicked);
await new Promise((r) => setTimeout(r, 2500));

const editClicked = await page.evaluate(() => {
    const btn = document.querySelector('.kaleidoscope-maker__slot-edit');
    if (!btn) return false;
    btn.click();
    return true;
});
console.log('clicked edit:', editClicked);
await new Promise((r) => setTimeout(r, 1500));

await page.screenshot({ path: OUT });

const metrics = await page.evaluate(() => {
    const rect = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom) };
    };
    return {
        viewport: { w: window.innerWidth, h: window.innerHeight },
        backdrop: rect('.kaleidoscope-maker__bead-editor-backdrop'),
        plaqueWrap: rect('.kaleidoscope-maker__bead-editor-backdrop .kaleidoscope-maker__scalloped-plaque-wrap'),
        content: rect('.kaleidoscope-maker__bead-editor-content'),
        stack: rect('.kaleidoscope-maker__bead-editor-stack'),
        settings: rect('.kaleidoscope-maker__bead-editor-settings'),
        previewCol: rect('.kaleidoscope-maker__bead-editor-stack .kaleidoscope-maker__bead-factory-preview-col'),
        previewScaler: rect('.kaleidoscope-maker__bead-editor-stack .kaleidoscope-maker__bead-factory-preview-scaler'),
        shapeRow: rect('.kaleidoscope-maker__bead-editor-settings .kaleidoscope-maker__shape-picker-row'),
        doneBtn: rect('.kaleidoscope-maker__bead-editor-done'),
        contentComputed: (() => {
            const el = document.querySelector('.kaleidoscope-maker__bead-editor-content');
            if (!el) return null;
            const cs = getComputedStyle(el);
            return {
                display: cs.display,
                flexDirection: cs.flexDirection,
                containerType: cs.containerType,
                width: cs.width,
                height: cs.height,
                uiScale: cs.getPropertyValue('--km-bead-editor-ui-scale').trim(),
            };
        })(),
        stackComputed: (() => {
            const el = document.querySelector('.kaleidoscope-maker__bead-editor-stack');
            if (!el) return null;
            const cs = getComputedStyle(el);
            return { display: cs.display, flexDirection: cs.flexDirection, gap: cs.gap };
        })(),
    };
});
console.log(JSON.stringify(metrics, null, 2));

await browser.close();
console.log('done');
