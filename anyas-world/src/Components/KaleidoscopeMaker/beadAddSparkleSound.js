import { getKaleidoscopeAudioContext } from './kaleidoscopeAudioContext';

/** Raindrop-style plop + sparkly chimes — Web Audio, no asset file. */
export function playBeadAddSparkleSound() {
    const ctx = getKaleidoscopeAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
        void ctx.resume();
    }

    const t0 = ctx.currentTime;
    /* Sparkle follows the plop slightly so it reads as “hit” then “glint”. */
    const tSparkle = t0 + 0.014;
    const sr = ctx.sampleRate;

    // —— Plop: sine sweeping down (classic water-droplet bloop) ——
    const plopOsc = ctx.createOscillator();
    plopOsc.type = 'sine';
    const f0 = 580 + Math.random() * 120;
    const f1 = 140 + Math.random() * 55;
    plopOsc.frequency.setValueAtTime(f0, t0);
    plopOsc.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t0 + 0.1);
    const plopGain = ctx.createGain();
    plopGain.gain.setValueAtTime(0, t0);
    plopGain.gain.linearRampToValueAtTime(0.13, t0 + 0.004);
    plopGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.15);
    plopOsc.connect(plopGain);
    plopGain.connect(ctx.destination);
    plopOsc.start(t0);
    plopOsc.stop(t0 + 0.16);

    // Soft body one octave below, shorter
    const plopLow = ctx.createOscillator();
    plopLow.type = 'sine';
    plopLow.frequency.setValueAtTime(f0 * 0.48, t0);
    plopLow.frequency.exponentialRampToValueAtTime(Math.max(35, f1 * 0.55), t0 + 0.085);
    const plopLowG = ctx.createGain();
    plopLowG.gain.setValueAtTime(0, t0);
    plopLowG.gain.linearRampToValueAtTime(0.06, t0 + 0.005);
    plopLowG.gain.exponentialRampToValueAtTime(0.001, t0 + 0.11);
    plopLow.connect(plopLowG);
    plopLowG.connect(ctx.destination);
    plopLow.start(t0);
    plopLow.stop(t0 + 0.12);

    // —— Sparkle: bandpassed noise + high sine dings ——
    const n = Math.max(1, Math.floor(sr * 0.072));
    const buffer = ctx.createBuffer(1, n, sr);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < n; i += 1) {
        const e = Math.exp(-i / (n * 0.12));
        data[i] = (Math.random() * 2 - 1) * e * 0.85;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(3400 + Math.random() * 1800, tSparkle);
    bp.Q.setValueAtTime(5.5, tSparkle);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0, tSparkle);
    ng.gain.linearRampToValueAtTime(0.1, tSparkle + 0.0025);
    ng.gain.exponentialRampToValueAtTime(0.001, tSparkle + 0.055);
    noise.connect(bp);
    bp.connect(ng);
    ng.connect(ctx.destination);
    noise.start(tSparkle);
    noise.stop(tSparkle + 0.065);

    const freqs = [1760, 2530, 3610];
    freqs.forEach((f, i) => {
        const t = tSparkle + i * 0.018;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f * (0.985 + Math.random() * 0.03), t);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.052, t + 0.003);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.24);
    });
}
