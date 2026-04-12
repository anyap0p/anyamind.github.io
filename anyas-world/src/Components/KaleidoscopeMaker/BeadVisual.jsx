import React, { useId } from 'react';
import { HeartBeadDesigned } from './HeartBeadDesigned';

export function BeadVisual({ shape, fill, accent, lightDeg, className = '' }) {
    const gid = useId().replace(/\W/g, '');
    const a = accent || fill;
    const gradId = `km-bead-grad-${gid}`;

    if (shape === 'heart' || shape === 'flower') {
        return (
            <svg
                className={`kaleidoscope-maker__bead-visual kaleidoscope-maker__bead-visual--svg ${className}`}
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
                {shape === 'heart' ? (
                    <HeartBeadDesigned fill={fill} accent={a} lightDeg={lightDeg} />
                ) : (
                    <g transform="translate(50,50)">
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
                )}
            </svg>
        );
    }

    const isOval = shape === 'oval';
    return (
        <div
            className={`kaleidoscope-maker__bead-visual kaleidoscope-maker__bead-visual--${shape} ${className}`}
            style={{
                '--bead-fill': fill,
                '--bead-accent': a,
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
