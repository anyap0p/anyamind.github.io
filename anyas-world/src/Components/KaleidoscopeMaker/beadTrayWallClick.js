/** Short plastic/wood tray wall click — Web Audio, no asset file. */

import { getKaleidoscopeAudioContext } from './kaleidoscopeAudioContext';

function playOneClick(ctx, gainPeak, delaySec) {
    const t0 = ctx.currentTime + delaySec;
    const duration = 0.042;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2100 + Math.random() * 1100, t0);
    filter.Q.setValueAtTime(2.8, t0);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2800 + Math.random() * 700, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.0012);
    gain.gain.exponentialRampToValueAtTime(0.0009, t0 + duration);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.012);
}

/**
 * @param {{ v: number }[]} hits  per-wall impact speeds (normal to wall), pre-filtered
 */
export function playTrayWallClicks(hits) {
    if (!hits.length) return;
    const ctx = getKaleidoscopeAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
        void ctx.resume();
    }

    const n = hits.length;
    const attenuate = 1 / Math.sqrt(0.45 + n);
    hits.forEach((h, i) => {
        const peak = Math.min(0.2, (0.06 + (h.v / 130) * 0.16) * attenuate);
        playOneClick(ctx, peak, i * 0.0018);
    });
}
