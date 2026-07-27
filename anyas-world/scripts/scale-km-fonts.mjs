import fs from 'fs';

const files = [
    'src/Components/KaleidoscopeMaker/KaleidoscopeMaker.css',
    'src/Pages/KaleidoscopeMakerArt.css',
];

function scaleFontValue(value) {
    const trimmed = value.trim();
    if (trimmed.includes('--km-font-scale') || trimmed === 'inherit' || trimmed === '0') {
        return trimmed;
    }
    if (/^[\d.]+em$/.test(trimmed)) {
        return trimmed;
    }
    return trimmed.replace(/([\d.]+)(rem|vw|vmin|vmax)/g, (_, num, unit) => {
        return `calc(${num}${unit} * var(--km-font-scale))`;
    });
}

for (const file of files) {
    const path = new URL(`../${file}`, import.meta.url);
    let css = fs.readFileSync(path, 'utf8');
    css = css.replace(/font-size:\s*([^;]+);/g, (match, value) => {
        const scaled = scaleFontValue(value);
        return scaled === value.trim() ? match : `font-size: ${scaled};`;
    });
    fs.writeFileSync(path, css);
    console.log('Updated', file);
}
