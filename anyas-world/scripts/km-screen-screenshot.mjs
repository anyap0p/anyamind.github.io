/* One-off diagnostic: opens a Kaleidoscope Maker screen from the home menu and
   screenshots it, reporting the gap between the title plaque and the content.
   Run with the dev server on :5173.
   Usage: node scripts/km-screen-screenshot.mjs "<menu label>" <width> <height> <out.png> */
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = process.env.KM_URL || 'http://localhost:5173/art/kaleidoscope-maker/full';
const LABEL = process.argv[2] || 'the bead factory';
const WIDTH = Number(process.argv[3] || 1280);
const HEIGHT = Number(process.argv[4] || 800);
const OUT = process.argv[5] || 'km-screen.png';

function makeSnapshot(seed) {
    const shapes = ['heart', 'circle', 'oval', 'flower'];
    const colors = ['#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#2ecc71', '#e67e22'];
    const beads = [];
    for (let i = 0; i < 20; i += 1) {
        beads.push({
            shape: shapes[(i + seed) % shapes.length],
            fill: colors[(i + seed) % colors.length],
            accent: colors[(i + seed + 3) % colors.length],
            size: 30 + ((i * 13) % 60),
        });
    }
    return { id: `diag-${seed}`, t: Date.now() - seed * 1000, beads, counts: {} };
}

const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: [`--window-size=${WIDTH},${HEIGHT + 100}`],
});
const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

/* Seed saved kaleidoscopes (collection page) + custom beads (stash page). */
await page.evaluateOnNewDocument((items, beads) => {
    localStorage.setItem('kaleidoscopeMaker_savedKaleidoscopes', JSON.stringify({ v: 1, items }));
    localStorage.setItem('kaleidoscopeMaker_customBeads', JSON.stringify(beads));
}, [makeSnapshot(1), makeSnapshot(2), makeSnapshot(3)], makeSnapshot(4).beads.slice(0, 12));

page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));

await page.goto(URL, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 2000));

const clicked = await page.evaluate((label) => {
    const btns = [...document.querySelectorAll('button')];
    const target = btns.find((b) => b.textContent.replace(/\u00a0/g, ' ').includes(label));
    if (!target) return false;
    target.click();
    return true;
}, LABEL);
console.log(`clicked "${LABEL}":`, clicked);
await new Promise((r) => setTimeout(r, 2500));

await page.screenshot({ path: OUT });

const metrics = await page.evaluate(() => {
    const rect = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom) };
    };
    const title = rect('.km-art-fullscreen__title') || rect('.kaleidoscope-maker-art__title-plaque') || rect('header');
    return {
        viewport: { w: window.innerWidth, h: window.innerHeight },
        title,
        titleCandidates: ['.km-art-fullscreen__title', '.km-art-fullscreen__header', '.kaleidoscope-maker__chrome-title']
            .map((s) => ({ sel: s, rect: rect(s) })),
        fsBodyPaddingTop: (() => {
            const el = document.querySelector('.km-art-fullscreen__body');
            return el ? getComputedStyle(el).paddingTop : null;
        })(),
        fsClasses: document.querySelector('.km-art-fullscreen')?.className ?? null,
        headerChildren: (() => {
            const el = document.querySelector('.km-art-fullscreen__header');
            if (!el) return null;
            return [...el.querySelectorAll(':scope > *')].map((c) => {
                const r = c.getBoundingClientRect();
                return {
                    cls: c.className?.toString().slice(0, 80),
                    y: Math.round(r.y),
                    h: Math.round(r.height),
                    bottom: Math.round(r.bottom),
                };
            });
        })(),
        headerPointerEvents: (() => {
            const el = document.querySelector('.km-art-fullscreen__header');
            return el ? getComputedStyle(el).pointerEvents : null;
        })(),
        reserveVars: (() => {
            const el = document.querySelector('.km-art-fullscreen');
            if (!el) return null;
            const cs = getComputedStyle(el);
            return {
                reserve: cs.getPropertyValue('--km-chrome-top-reserve').trim(),
                plaqueH: cs.getPropertyValue('--km-title-plaque-h').trim(),
                bodyGap: cs.getPropertyValue('--km-title-body-gap').trim(),
            };
        })(),
        factoryContent: (() => {
            const el = document.querySelector('.kaleidoscope-maker__bead-factory-content');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return {
                rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
                justifyContent: cs.justifyContent,
                paddingTop: cs.paddingTop,
            };
        })(),
        factoryPlaque: rect('.kaleidoscope-maker__bead-factory-content .kaleidoscope-maker__scalloped-plaque-wrap'),
        factory: rect('.kaleidoscope-maker__bead-factory'),
        factoryVisible: rect('.kaleidoscope-maker__bead-factory--visible'),
        tray: rect('.kaleidoscope-maker__beadbox-stack'),
        rotator: (() => {
            const el = document.querySelector('.kaleidoscope-maker__beadbox-stack-rotator');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return {
                rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom) },
                height: cs.height,
                containerType: cs.containerType,
            };
        })(),
        fly: rect('.kaleidoscope-maker__beadbox-fly'),
        pager: rect('.kaleidoscope-maker__beadbox-pager'),
        containerAncestors: (() => {
            const el = document.querySelector('.kaleidoscope-maker__beadbox-stack-rotator');
            if (!el) return null;
            const out = [];
            let cur = el.parentElement;
            while (cur && cur !== document.documentElement) {
                const cs = getComputedStyle(cur);
                if (cs.containerType && cs.containerType !== 'normal') {
                    const r = cur.getBoundingClientRect();
                    out.push({
                        cls: cur.className.toString().slice(0, 90),
                        containerName: cs.containerName,
                        w: Math.round(r.width),
                        h: Math.round(r.height),
                        paddingTop: cs.paddingTop,
                        paddingBottom: cs.paddingBottom,
                    });
                }
                cur = cur.parentElement;
            }
            return out;
        })(),
        gallery: rect('.kaleidoscope-maker__gallery-grid'),
        maker: rect('.kaleidoscope-maker'),
    };
});
console.log(JSON.stringify(metrics, null, 2));

await browser.close();
console.log('done');
