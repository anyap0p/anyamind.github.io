import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const PAD = 10;

/**
 * Fixed tooltip anchored under a chrome control so it isn’t clipped by
 * overflow on the maker / header — uses the full viewport.
 */
export function ChromeTip({ anchorRef, children, open }) {
    const tipRef = useRef(null);
    const [style, setStyle] = useState(null);

    useLayoutEffect(() => {
        if (!open) {
            setStyle(null);
            return undefined;
        }
        const el = anchorRef?.current;
        if (!el || typeof document === 'undefined') return undefined;

        const place = () => {
            const r = el.getBoundingClientRect();
            const tipEl = tipRef.current;
            const tipW = tipEl?.offsetWidth ?? 0;
            const half = tipW > 0 ? tipW / 2 : 60;
            const centerX = r.left + r.width / 2;
            const left = Math.min(
                Math.max(centerX, PAD + half),
                window.innerWidth - PAD - half,
            );
            const top = Math.min(r.bottom + 8, window.innerHeight - PAD - 28);
            setStyle({
                position: 'fixed',
                top,
                left,
                transform: 'translateX(-50%)',
                zIndex: 10000,
                visibility: tipW > 0 ? 'visible' : 'hidden',
            });
        };

        place();
        window.addEventListener('resize', place);
        window.addEventListener('scroll', place, true);
        return () => {
            window.removeEventListener('resize', place);
            window.removeEventListener('scroll', place, true);
        };
    }, [open, anchorRef, children]);

    if (!open || typeof document === 'undefined') return null;

    return createPortal(
        <span
            ref={tipRef}
            className="kaleidoscope-maker__chrome-tip"
            style={
                style ?? {
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    visibility: 'hidden',
                    pointerEvents: 'none',
                }
            }
            role="tooltip"
        >
            {children}
        </span>,
        document.body,
    );
}
