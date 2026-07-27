/* Diagnostic variant: sparse beads, dpr 1, tilt held, zoomed clips. */
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:4173/art/kaleidoscope-maker/full';

function makeSnapshot() {
    const shapes = ['heart', 'circle', 'oval', 'flower'];
    const colors = ['#e74c3c', '#3498db', '#f1c40f', '#9b59b6'];
    const beads = [];
    for (let i = 0; i < 10; i += 1) {
        beads.push({
            shape: shapes[i % shapes.length],
            fill: colors[i % colors.length],
            accent: colors[(i + 1) % colors.length],
            size: 30 + ((i * 17) % 60),
        });
    }
    for (let i = 0; i < 80; i += 1) {
        beads.push({
            shape: 'glitter',
            fill: '#ffffff',
            accent: '#ffffff',
            size: (i * 29) % 101,
            holo: true,
            zFront: i % 2 === 0,
        });
    }
    return { v: 1, beads, counts: {} };
}

const snapshot = makeSnapshot();

const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: ['--window-size=1280,860'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 860, deviceScaleFactor: 1 });

await page.evaluateOnNewDocument((snap) => {
    localStorage.setItem('kaleidoscopeMaker_buildKaleidoscope', JSON.stringify(snap));
    localStorage.setItem(
        'kaleidoscopeMaker_savedKaleidoscopes',
        JSON.stringify({ v: 1, items: [{ id: 'diag-1', t: Date.now(), beads: snap.beads, counts: {} }] }),
    );
}, snapshot);

page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));

await page.goto(URL, { waitUntil: 'networkidle0' });

await page.evaluate(() => {
    [...document.querySelectorAll('button')]
        .find((b) => b.textContent.includes('view complete kaleidoscopes'))
        ?.click();
});
await new Promise((r) => setTimeout(r, 600));
await page.evaluate(() => {
    document.querySelector('.kaleidoscope-maker__gallery-grid button')?.click();
});
await new Promise((r) => setTimeout(r, 3500));

await page.screenshot({ path: 'hexview-sparse.png' });

/* Hold right tilt for 1.6s, screenshot mid-tilt and after release. */
const tiltBtn = await page.$('.kaleidoscope-maker__hex-tilt:not(.kaleidoscope-maker__hex-tilt--left)');
if (tiltBtn) {
    const box = await tiltBtn.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await new Promise((r) => setTimeout(r, 1600));
    await page.screenshot({ path: 'hexview-tilting.png' });
    await page.mouse.up();
}
await new Promise((r) => setTimeout(r, 2500));

/* Zoomed clips of areas where seams would sit (between rings, off-center). */
await page.screenshot({ path: 'hexview-clip-left.png', clip: { x: 60, y: 250, width: 420, height: 320 } });
await page.screenshot({ path: 'hexview-clip-top.png', clip: { x: 420, y: 40, width: 420, height: 320 } });

await browser.close();
console.log('done');
