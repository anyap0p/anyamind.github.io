import React, { useRef, useState } from 'react';
import { ChromeTip } from './ChromeTip';

/** Shared → control (build: save and view; factory: save). */
export function ForwardButton({
    onClick,
    className = '',
    inTitle = false,
    tip = 'save and view',
    'aria-label': ariaLabel,
    ...rest
}) {
    const btnRef = useRef(null);
    const [tipOpen, setTipOpen] = useState(false);

    return (
        <button
            ref={btnRef}
            type="button"
            className={[
                inTitle
                    ? 'kaleidoscope-maker__forward-arrow--in-title'
                    : 'kaleidoscope-maker__build-done',
                'kaleidoscope-maker__forward-arrow',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            onClick={onClick}
            aria-label={ariaLabel ?? tip}
            onMouseEnter={() => setTipOpen(true)}
            onMouseLeave={() => setTipOpen(false)}
            onFocus={() => setTipOpen(true)}
            onBlur={() => setTipOpen(false)}
            {...rest}
        >
            <span aria-hidden="true">→</span>
            {inTitle ? (
                <ChromeTip anchorRef={btnRef} open={tipOpen}>
                    {tip}
                </ChromeTip>
            ) : (
                <span className="kaleidoscope-maker__forward-arrow-tip" aria-hidden="true">
                    {tip}
                </span>
            )}
        </button>
    );
}
