import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');
mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, 'CNAME'), 'anya.observer\n', 'utf8');
