import React from 'react';

import { KaleidoscopeSettingsPlaque } from './KaleidoscopeSettingsPlaque';

import { KaleidoscopeShortcutsPlaque } from './KaleidoscopeShortcutsPlaque';

/** Shortcuts left of the title, settings right — kaleidoscope view chrome. */
export function KaleidoscopeViewChrome() {
    return (
        <>
            <div className="kaleidoscope-maker__view-chrome-side kaleidoscope-maker__view-chrome-side--left">
                <KaleidoscopeShortcutsPlaque />
            </div>
            <div className="kaleidoscope-maker__view-chrome-side kaleidoscope-maker__view-chrome-side--right">
                <KaleidoscopeSettingsPlaque />
            </div>
        </>
    );
}
