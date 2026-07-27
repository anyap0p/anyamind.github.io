/* One-off diagnostic: screenshots the build screen in mobile portrait so the
   tray / dish / pager layout can be inspected. Run with the dev server on :5173. */
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:5173/art/kaleidoscope-maker/full';
const WIDTH = Number(process.argv[2] || 630);
const HEIGHT = Number(process.argv[3] || 766);
const OUT = process.argv[4] || 'build-portrait.png';

const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: [`--window-size=${WIDTH},${HEIGHT + 100}`],
});
const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));

await page.goto(URL, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 2000));

const clicked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const target = btns.find((b) => b.textContent.replace(/\u00a0/g, ' ').includes('kaleidoscope assembly'));
    if (!target) return false;
    target.click();
    return true;
});
console.log('clicked assembly:', clicked);
await new Promise((r) => setTimeout(r, 2500));

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
        rotator: rect('.kaleidoscope-maker__beadbox-stack-rotator'),
        pager: rect('.kaleidoscope-maker__beadbox-pager'),
        dish: rect('.kaleidoscope-maker__build-dish-col'),
        glitter: rect('.kaleidoscope-maker__glitter-corner'),
        buildBody: rect('.kaleidoscope-maker__build-body'),
        layout: rect('.kaleidoscope-maker--build-layout'),
        img: rect('.kaleidoscope-maker__beadbox-img'),
        stack: rect('.kaleidoscope-maker__build-beadbox-stack'),
        imgComputed: (() => {
            const el = document.querySelector('.kaleidoscope-maker__beadbox-img');
            if (!el) return null;
            const cs = getComputedStyle(el);
            return { maxHeight: cs.maxHeight, width: cs.width, height: cs.height };
        })(),
        fsBody: (() => {
            const el = document.querySelector('.km-art-fullscreen__body');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return {
                rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
                display: cs.display,
                flexDirection: cs.flexDirection,
                alignItems: cs.alignItems,
                justifyContent: cs.justifyContent,
                padding: cs.padding,
            };
        })(),
        layoutComputed: (() => {
            const el = document.querySelector('.kaleidoscope-maker--build-layout');
            if (!el) return null;
            const cs = getComputedStyle(el);
            return {
                alignSelf: cs.alignSelf,
                margin: cs.margin,
                width: cs.width,
                maxWidth: cs.maxWidth,
                justifyContent: cs.justifyContent,
            };
        })(),
        buildBodyComputed: (() => {
            const el = document.querySelector('.kaleidoscope-maker__build-body');
            if (!el) return null;
            const cs = getComputedStyle(el);
            return { justifyContent: cs.justifyContent, alignItems: cs.alignItems, padding: cs.padding };
        })(),
        layoutVars: (() => {
            const el = document.querySelector('.kaleidoscope-maker--build-layout');
            if (!el) return null;
            const cs = getComputedStyle(el);
            const names = [
                '--km-build-beadbox-width-share',
                '--km-build-dish-height-share',
                '--km-build-dish-cap',
                '--km-beadbox-visual-w',
                '--km-beadbox-visual-h',
                '--km-build-dish-max',
                '--km-build-pager-extra',
                '--km-space-scale',
            ];
            return Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(n).trim()]));
        })(),
    };
});
console.log(JSON.stringify(metrics, null, 2));

await browser.close();
console.log('done');
