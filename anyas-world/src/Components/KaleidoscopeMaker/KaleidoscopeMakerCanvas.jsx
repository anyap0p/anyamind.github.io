import React, { useEffect, useRef } from 'react';
import beadboxImg from '../../Icons/beadbox.png';
import { BUFFER, SEGMENTS } from './constants';
import { drawWedgeSource } from './drawWedgeSource';

export function KaleidoscopeMakerCanvas({ showBeadboxDecor = true }) {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);
    const bufferRef = useRef(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return undefined;

        let buffer = bufferRef.current;
        if (!buffer) {
            buffer = document.createElement('canvas');
            buffer.width = BUFFER;
            buffer.height = BUFFER;
            bufferRef.current = buffer;
        }

        const bctx = buffer.getContext('2d');
        const ctx = canvas.getContext('2d');
        let raf = 0;

        const paint = (t) => {
            const w = wrap.clientWidth;
            const h = wrap.clientHeight;
            if (w < 1 || h < 1) {
                raf = requestAnimationFrame(paint);
                return;
            }

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const cw = Math.floor(w * dpr);
            const ch = Math.floor(h * dpr);
            if (canvas.width !== cw || canvas.height !== ch) {
                canvas.width = cw;
                canvas.height = ch;
            }

            const { x: mx, y: my } = mouseRef.current;
            drawWedgeSource(bctx, BUFFER, BUFFER, t, mx, my);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = '#040408';
            ctx.fillRect(0, 0, cw, ch);

            const R = (Math.min(cw, ch) / 2) * 0.92;
            const tcx = cw / 2;
            const tcy = ch / 2;
            const wedge = (2 * Math.PI) / SEGMENTS;

            ctx.save();
            for (let i = 0; i < SEGMENTS; i++) {
                ctx.save();
                ctx.translate(tcx, tcy);
                ctx.rotate(i * wedge);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, R, -wedge / 2, wedge / 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(buffer, -BUFFER / 2, -BUFFER / 2);
                ctx.restore();
            }
            ctx.restore();

            raf = requestAnimationFrame(paint);
        };

        raf = requestAnimationFrame(paint);

        const onMove = (e) => {
            const rect = wrap.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            mouseRef.current = {
                x: Math.min(1, Math.max(0, x)),
                y: Math.min(1, Math.max(0, y)),
            };
        };

        const onLeave = () => {
            mouseRef.current = { x: 0.5, y: 0.5 };
        };

        wrap.addEventListener('pointermove', onMove);
        wrap.addEventListener('pointerleave', onLeave);

        return () => {
            cancelAnimationFrame(raf);
            wrap.removeEventListener('pointermove', onMove);
            wrap.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return (
        <div ref={wrapRef} className="kaleidoscope-maker__stage">
            <canvas ref={canvasRef} className="kaleidoscope-maker__canvas" aria-label="Kaleidoscope" />
            {showBeadboxDecor ? (
                <img src={beadboxImg} alt="" className="kaleidoscope-maker__beadbox" draggable={false} />
            ) : null}
        </div>
    );
}
