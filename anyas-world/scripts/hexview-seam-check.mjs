/* Detect bright seam pixels in hexview-1.png and write a red overlay. */
import { readFileSync, writeFileSync } from 'fs';
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
const page = await browser.newPage();
const b64 = readFileSync('hexview-1.png').toString('base64');

const result = await page.evaluate(async (b64) => {
    const img = new Image();
    await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = `data:image/png;base64,${b64}`;
    });
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
    const seam = new Uint8ClampedArray(width * height * 4);
    let seamCount = 0;
    const rad = 4;
    const y0 = Math.floor(height * 0.18);
    const y1 = Math.floor(height * 0.82);
    const x0 = Math.floor(width * 0.08);
    const x1 = Math.floor(width * 0.92);
    for (let y = y0; y < y1; y += 1) {
        for (let x = x0; x < x1; x += 1) {
            const i = (y * width + x) * 4;
            const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
            let sum = 0;
            let n = 0;
            for (let dy = -rad; dy <= rad; dy += 1) {
                for (let dx = -rad; dx <= rad; dx += 1) {
                    if (dx === 0 && dy === 0) continue;
                    const j = ((y + dy) * width + (x + dx)) * 4;
                    sum += (data[j] + data[j + 1] + data[j + 2]) / 3;
                    n += 1;
                }
            }
            const avg = sum / n;
            if (lum - avg > 16 && lum > 215) {
                seam[i] = 255;
                seam[i + 1] = 0;
                seam[i + 2] = 0;
                seam[i + 3] = 255;
                seamCount += 1;
            } else {
                seam[i] = data[i];
                seam[i + 1] = data[i + 1];
                seam[i + 2] = data[i + 2];
                seam[i + 3] = 90;
            }
        }
    }
    const out = document.createElement('canvas');
    out.width = width;
    out.height = height;
    out.getContext('2d').putImageData(new ImageData(seam, width, height), 0, 0);
    return { seamCount, dataUrl: out.toDataURL('image/png') };
}, b64);

const b64out = result.dataUrl.slice('data:image/png;base64,'.length);
writeFileSync('hexview-seam-detect.png', Buffer.from(b64out, 'base64'));
console.log('seamCount', result.seamCount);
await browser.close();
