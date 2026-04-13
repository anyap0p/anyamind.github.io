/** Single AudioContext for Kaleidoscope Maker SFX (tray clicks, bead add, etc.). */

let ctxRef = null;

export function getKaleidoscopeAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!ctxRef) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        ctxRef = new Ctx();
    }
    return ctxRef;
}

/** Call from a pointer/click handler so SFX can play (browser autoplay policies). */
export function resumeKaleidoscopeAudio() {
    const ctx = getKaleidoscopeAudioContext();
    if (ctx && ctx.state === 'suspended') {
        void ctx.resume();
    }
}
