import fs from 'fs';

const files = [
    'src/Components/KaleidoscopeMaker/KaleidoscopeMaker.css',
    'src/Pages/KaleidoscopeMakerArt.css',
];

const SPACING_PROPERTIES = [
    'gap',
    'row-gap',
    'column-gap',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'padding-inline',
    'padding-block',
    'padding-inline-start',
    'padding-inline-end',
    'padding-block-start',
    'padding-block-end',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'margin-inline',
    'margin-block',
    'margin-inline-start',
    'margin-inline-end',
    'margin-block-start',
    'margin-block-end',
    'scroll-padding',
    'scroll-padding-top',
    'scroll-padding-right',
    'scroll-padding-bottom',
    'scroll-padding-left',
    'border-radius',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-left-radius',
    'border-bottom-right-radius',
    'outline-offset',
];

const SPACING_CSS_VARS = [
    '--km-pager-extra',
    '--km-chrome-bottom-reserve',
    '--km-chrome-top-reserve',
    '--km-gallery-chrome-top',
    '--km-gallery-chrome-bottom',
    '--km-home-chrome-offset',
    '--km-scallop',
];

function scaleUnits(value) {
    const trimmed = value.trim();
    if (
        !trimmed ||
        trimmed === 'auto' ||
        trimmed === 'inherit' ||
        trimmed === 'unset' ||
        trimmed === 'none' ||
        trimmed === '0' ||
        trimmed === '0px'
    ) {
        return trimmed;
    }
    if (trimmed.includes('--km-space-scale') || trimmed.includes('--km-font-scale')) {
        return trimmed;
    }
    if (/^[\d.]+em$/.test(trimmed)) {
        return trimmed;
    }

    return trimmed.replace(/([\d.]+)(rem|vw|vmin|vmax|px|dvh)/g, (match, num, unit) => {
        if (num === '0') return match;
        return `calc(${num}${unit} * var(--km-space-scale))`;
    });
}

const spacingPropRe = new RegExp(
    `^(\\s*)(${SPACING_PROPERTIES.join('|')})\\s*:\\s*([^;]+);`,
    'gm',
);

const spacingVarRe = new RegExp(
    `^(\\s*)(${SPACING_CSS_VARS.join('|')})\\s*:\\s*([^;]+);`,
    'gm',
);

const transformRe = /^(\s*)transform:\s*([^;]+);/gm;

function scaleTransformValue(value) {
    const trimmed = value.trim();
    if (trimmed.includes('--km-space-scale')) return trimmed;
    return scaleUnits(trimmed);
}

for (const file of files) {
    const path = new URL(`../${file}`, import.meta.url);
    let css = fs.readFileSync(path, 'utf8');
    let propCount = 0;
    let varCount = 0;

    css = css.replace(spacingPropRe, (match, indent, prop, value) => {
        const scaled = scaleUnits(value);
        if (scaled !== value.trim()) propCount += 1;
        return scaled === value.trim() ? match : `${indent}${prop}: ${scaled};`;
    });

    css = css.replace(spacingVarRe, (match, indent, varName, value) => {
        const scaled = scaleUnits(value);
        if (scaled !== value.trim()) varCount += 1;
        return scaled === value.trim() ? match : `${indent}${varName}: ${scaled};`;
    });

    css = css.replace(transformRe, (match, indent, value) => {
        const scaled = scaleTransformValue(value);
        if (scaled !== value.trim()) propCount += 1;
        return scaled === value.trim() ? match : `${indent}transform: ${scaled};`;
    });

    css = css.replace(/^(\s*)max-height:\s*([^;]+);/gm, (match, indent, value) => {
        if (value.includes('--km-space-scale') || /100(?:d)?vh/.test(value)) return match;
        const scaled = scaleUnits(value);
        if (scaled === value.trim()) return match;
        propCount += 1;
        return `${indent}max-height: ${scaled};`;
    });

    fs.writeFileSync(path, css);
    console.log('Updated', file, `(${propCount} props, ${varCount} vars)`);
}
