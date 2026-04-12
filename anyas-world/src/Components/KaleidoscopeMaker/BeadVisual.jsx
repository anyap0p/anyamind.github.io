import React, { useId } from 'react';
import { HeartBeadDesigned } from './HeartBeadDesigned';
import { HEART_FINAL_GEM } from './heartFinalGemData';

export function BeadVisual({ shape, fill, accent, lightDeg, className = '' }) {
    const gid = useId().replace(/\W/g, '');
    const a = accent || fill;
    const gradId = `km-bead-grad-${gid}`;

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
        const spin = Number.isFinite(lightDeg) ? lightDeg : 0;
        return (
            <svg
                className={`kaleidoscope-maker__bead-visual kaleidoscope-maker__bead-visual--svg kaleidoscope-maker__bead-visual--flower ${className}`}
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
            >
                <defs>
                    <linearGradient id={gradId} x1="15%" y1="10%" x2="85%" y2="90%">
                        <stop offset="0%" stopColor={fill} />
                        <stop offset="55%" stopColor={fill} />
                        <stop offset="100%" stopColor={a} />
                    </linearGradient>
                </defs>
                <g transform={`translate(50,50) rotate(${spin})`}>
                    {[0, 72, 144, 216, 288].map((deg) => (
                        <ellipse
                            key={deg}
                            cx="0"
                            cy="-24"
                            rx="13"
                            ry="24"
                            fill={`url(#${gradId})`}
                            transform={`rotate(${deg})`}
                        />
                    ))}
                    <circle r="11" fill={a} opacity="0.95" />
                </g>
            </svg>
        );
    }

    const isOval = shape === 'oval';
    const spin = Number.isFinite(lightDeg) ? lightDeg : 0;
    return (
        <div
            className={`kaleidoscope-maker__bead-visual kaleidoscope-maker__bead-visual--${shape} ${className}`}
            style={{
                '--bead-fill': fill,
                '--bead-accent': a,
                transform: `rotate(${spin}deg)`,
                transformOrigin: 'center center',
                ...(isOval
                    ? {
                          width: '76%',
                          height: '100%',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                      }
                    : {}),
            }}
            aria-hidden
        />
    );
}
