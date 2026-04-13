/**
 * GitHub Pages has no server rewrite to index.html for deep links.
 * Serving the SPA shell as 404.html lets client-side routing load on refresh/direct URL.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');
const indexHtml = join(dist, 'index.html');
const fallback = join(dist, '404.html');

if (!existsSync(indexHtml)) {
    console.error('copy-spa-fallback: dist/index.html missing — run vite build first.');
    process.exit(1);
}
copyFileSync(indexHtml, fallback);
console.log('copy-spa-fallback: wrote dist/404.html');
