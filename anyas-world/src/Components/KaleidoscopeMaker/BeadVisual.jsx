import React, { memo } from 'react';
import { HeartBeadDesigned } from './HeartBeadDesigned';
import { FlowerBeadDesigned } from './FlowerBeadDesigned';
import { HEART_FINAL_GEM } from './heartFinalGemData';
import { FLOWER_FINAL_GEM } from './flowerGemData';

/**
 * Memoized: parent often moves this via CSS (tray physics) while shape/fill/accent/lightDeg stay the same.
 * Skips re-rendering hundreds of SVG paths every animation frame.
 */
function BeadVisualInner({ shape, fill, accent, lightDeg, image, holo, seed, className = '' }) {
    const a = accent || fill;

    if (shape === 'glitter') {
        if (holo) {
            /* Sparkle animation is mostly silver with abrupt spectral flashes; per-speck
               duration/delay desync the twinkle and a seeded hue-rotate varies flash colors. */
            const s = Number.isFinite(seed) ? Math.abs(Math.round(seed)) : 0;
            const dur = 2.1 + (s % 7) * 0.55;
            const delay = -((s * 0.63) % dur);
            const hueOff = (s * 47) % 360;
            return (
                <span
                    className={`kaleidoscope-maker__bead-visual kaleidoscope-maker__bead-visual--glitter kaleidoscope-maker__bead-visual--glitter-holo ${className}`}
                    style={{
                        animationDuration: `${dur}s`,
                        animationDelay: `${delay}s`,
                        filter: `hue-rotate(${hueOff}deg)`,
                    }}
                    aria-hidden
                />
            );
        }
        return (
            <span
                className={`kaleidoscope-maker__bead-visual kaleidoscope-maker__bead-visual--glitter ${className}`}
                style={{ '--bead-fill': fill, '--bead-accent': a }}
                aria-hidden
            />
        );
    }

    if (shape === 'image' && image) {
        const spinDeg = Number.isFinite(lightDeg) ? lightDeg : 0;
        return (
            <img
                src={image}
                alt=""
                draggable={false}
                className={`kaleidoscope-maker__bead-visual kaleidoscope-maker__bead-visual--image ${className}`}
                style={{ transform: `rotate(${spinDeg}deg)`, transformOrigin: 'center center' }}
                aria-hidden
            />
        );
    }

    if (shape === 'heart') {
        const vb = HEART_FINAL_GEM.viewBox || '0 0 12.61533 12.530643';
        const spinDeg = Number.isFinite(lightDeg) ? lightDeg : 0;
        return (
            <svg
                className={`kaleidoscope-maker__bead-visual kaleidoscope-maker__bead-visual--svg kaleidoscope-maker__bead-visual--heart ${className}`}
                viewBox={vb}
                preserveAspectRatio="xMidYMid meet"
                style={{ transform: `rotate(${spinDeg}deg)`, transformOrigin: 'center center' }}
                aria-hidden
            >
                {/* Fixed lighting on facets; rotation comes from the SVG transform only (no sin(light) flicker). */}
                <HeartBeadDesigned fill={fill} accent={a} lightDeg={38} />
            </svg>
        );
    }

    if (shape === 'flower') {
        const vb = FLOWER_FINAL_GEM.viewBox || '0 0 106.89167 104.06944';
        const spinDeg = Number.isFinite(lightDeg) ? lightDeg : 0;
        return (
            <svg
                className={`kaleidoscope-maker__bead-visual kaleidoscope-maker__bead-visual--svg kaleidoscope-maker__bead-visual--flower ${className}`}
                viewBox={vb}
                preserveAspectRatio="xMidYMid meet"
                style={{ transform: `rotate(${spinDeg}deg)`, transformOrigin: 'center center' }}
                aria-hidden
            >
                {/* Fixed lighting on facets; rotation from SVG transform (same pattern as heart). */}
                <FlowerBeadDesigned fill={fill} accent={a} lightDeg={38} />
            </svg>
        );
    }

    const spin = Number.isFinite(lightDeg) ? lightDeg : 0;
    return (
        <div
            className={`kaleidoscope-maker__bead-visual kaleidoscope-maker__bead-visual--${shape} ${className}`}
            style={{
                '--bead-fill': fill,
                '--bead-accent': a,
                transform: `rotate(${spin}deg)`,
                transformOrigin: 'center center',
            }}
            aria-hidden
        />
    );
}

export const BeadVisual = memo(BeadVisualInner);
BeadVisual.displayName = 'BeadVisual';
