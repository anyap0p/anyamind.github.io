/* One-off diagnostic: screenshots the kaleidoscope hex view so rendering
   artifacts can be inspected. Run with the preview server on :4173. */
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:4173/art/kaleidoscope-maker/full';

function makeSnapshot() {
    const shapes = ['heart', 'circle', 'oval', 'flower'];
    const colors = ['#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#2ecc71', '#e67e22', '#1abc9c', '#fd79a8'];
    const beads = [];
    for (let i = 0; i < 24; i += 1) {
        beads.push({
            shape: shapes[i % shapes.length],
            fill: colors[i % colors.length],
            accent: colors[(i + 3) % colors.length],
            size: 30 + ((i * 13) % 60),
        });
    }
    for (let i = 0; i < 300; i += 1) {
        const holo = i % 3 === 0;
        beads.push({
            shape: 'glitter',
            fill: holo ? '#ffffff' : colors[i % colors.length],
            accent: '#ffffff',
            size: (i * 29) % 101,
            holo,
            zFront: i % 2 === 0,
        });
    }
    return { v: 1, beads, counts: {} };
}

const snapshot = makeSnapshot();

const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: ['--window-size=1400,900', '--force-device-scale-factor=2'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });

await page.evaluateOnNewDocument((snap) => {
    localStorage.setItem('kaleidoscopeMaker_buildKaleidoscope', JSON.stringify(snap));
    localStorage.setItem(
        'kaleidoscopeMaker_savedKaleidoscopes',
        JSON.stringify({ v: 1, items: [{ id: 'diag-1', t: Date.now(), beads: snap.beads, counts: {} }] }),
    );
}, snapshot);

page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));
page.on('console', (m) => {
    if (m.type() === 'error') console.log('CONSOLE ERROR:', m.text());
});

await page.goto(URL, { waitUntil: 'networkidle0' });

// home -> gallery
await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    btns.find((b) => b.textContent.includes('view complete kaleidoscopes'))?.click();
});
await new Promise((r) => setTimeout(r, 800));

// gallery -> open first saved kaleidoscope (thumbnail is clickable)
await page.evaluate(() => {
    const grid = document.querySelector('.kaleidoscope-maker__gallery-grid');
    const target = grid?.querySelector('button') || grid?.firstElementChild;
    target?.click();
});

// let beads fall and settle
await new Promise((r) => setTimeout(r, 4500));
await page.screenshot({ path: 'hexview-1.png' });
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: 'hexview-2.png' });

const state = await page.evaluate(() => ({
    hasHexCanvas: !!document.querySelector('canvas'),
    bodyText: document.body.innerText.slice(0, 200),
}));
console.log('state:', JSON.stringify(state));

await browser.close();
console.log('done');
