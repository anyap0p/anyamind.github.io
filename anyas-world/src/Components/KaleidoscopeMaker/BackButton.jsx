import React, { useRef, useState } from 'react';
import { ChromeTip } from './ChromeTip';

/** Shared ← control for kaleidoscope maker screens. */
export function BackButton({
    onClick,
    className = '',
    inTitle = false,
    tip = 'home',
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
                inTitle ? 'kaleidoscope-maker__back-arrow--in-title' : 'kaleidoscope-maker__customize-back',
                'kaleidoscope-maker__back-arrow',
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
            <span aria-hidden="true">←</span>
            {inTitle ? (
                <ChromeTip anchorRef={btnRef} open={tipOpen}>
                    {tip}
                </ChromeTip>
            ) : (
                <span className="kaleidoscope-maker__back-arrow-tip" aria-hidden="true">
                    {tip}
                </span>
            )}
        </button>
    );
}
