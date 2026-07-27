import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import { buildScallopPathPx } from './scallopPath';

/**
 * Cream panel with even outward scalloped edges via SVG clipPath.
 * allowOverflow: clip only the background layer so hovers/tooltips can extend outside.
 */
export function ScallopedPlaque({ className = '', scallopRadius = 9, allowOverflow = false, children }) {
    const wrapRef = useRef(null);
    const clipId = `km-scallop-${useId().replace(/:/g, '')}`;
    const [pathD, setPathD] = useState('');

    useLayoutEffect(() => {
        const el = wrapRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return undefined;

        const place = () => {
            const w = el.offsetWidth;
            const h = el.offsetHeight;
            if (w < 8 || h < 8) return;
            setPathD(buildScallopPathPx(w, h, scallopRadius));
        };

        place();
        const ro = new ResizeObserver(place);
        ro.observe(el);
        return () => ro.disconnect();
    }, [scallopRadius]);

    const clipUrl = pathD ? `url(#${clipId})` : undefined;
    const clipStyle = clipUrl ? { clipPath: clipUrl, WebkitClipPath: clipUrl } : undefined;
    const wrapClass = [
        'kaleidoscope-maker__scalloped-plaque-wrap',
        allowOverflow ? 'kaleidoscope-maker__scalloped-plaque-wrap--overflow-visible' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={wrapClass}>
            {pathD ? (
                <svg className="kaleidoscope-maker__scallop-defs" aria-hidden="true" width="0" height="0">
                    <defs>
                        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                            <path d={pathD} />
                        </clipPath>
                    </defs>
                </svg>
            ) : null}
            {allowOverflow ? (
                <div ref={wrapRef} className={className}>
                    <div
                        className="kaleidoscope-maker__scalloped-plaque-bg"
                        style={clipStyle}
                        aria-hidden
                    />
                    <div className="kaleidoscope-maker__scalloped-plaque-content">{children}</div>
                </div>
            ) : (
                <div ref={wrapRef} className={className} style={clipStyle}>
                    {children}
                </div>
            )}
        </div>
    );
}
