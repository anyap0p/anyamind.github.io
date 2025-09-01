import { useEffect, useState, useRef, useMemo } from "react";
import "./Tunnel.css";

export default function TunnelScroll() {
    const [scrollPos, setScrollPos] = useState(0);
    const audioCtxRef = useRef(null);
    const audioBufferRef = useRef(null);
    const lastScrollY = useRef(window.scrollY);
    const chordPlayingRef = useRef(false);

    const pentatonicRatios = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3]; // relative to base pitch
    let scaleIndexRef = useRef(0);
    let directionRef = useRef(1);

    const NUM_ITEMS = 1000;
    const RADIUS = 600;
    const DEPTH = 1500;

    // Initialize AudioContext once
    useEffect(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
    }, []);

    // Load the sample
    useEffect(() => {
        const audioCtx = audioCtxRef.current;
        if (!audioCtx) return;

        fetch("/sparkle.mp3")
            .then((res) => res.arrayBuffer())
            .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
            .then((buffer) => {
                audioBufferRef.current = buffer;
            });
    }, []);

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            const audioCtx = audioCtxRef.current;
            const buffer = audioBufferRef.current;
            if (!audioCtx || !buffer) return;

            if (audioCtx.state === "suspended") audioCtx.resume();

            const scrollY = window.scrollY;
            const delta = scrollY - lastScrollY.current;
            lastScrollY.current = scrollY;

            setScrollPos(scrollY);

            if (Math.abs(delta) > 0 && !chordPlayingRef.current) {
                chordPlayingRef.current = true;

                // pick next pentatonic ratio
                let index = scaleIndexRef.current + directionRef.current;
                if (index >= pentatonicRatios.length) {
                    index = pentatonicRatios.length - 2;
                    directionRef.current = -1;
                } else if (index < 0) {
                    index = 1;
                    directionRef.current = 1;
                }
                scaleIndexRef.current = index;

                const playbackRate = pentatonicRatios[index];

                playSample(audioCtx, buffer, playbackRate, () => {
                    chordPlayingRef.current = false;
                });
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Generate emojis
    const getRandomEmoji = () => {
        const ranges = [
            [0x1F600, 0x1F64F],
            [0x1F300, 0x1F5FF],
            [0x1F680, 0x1F6FF],
            [0x1F900, 0x1F9FF],
        ];
        const [start, end] = ranges[Math.floor(Math.random() * ranges.length)];
        return String.fromCodePoint(start + Math.floor(Math.random() * (end - start + 1)));
    };

    const emojis = useMemo(() => Array.from({ length: NUM_ITEMS }, () => getRandomEmoji()), [NUM_ITEMS]);

    // Tunnel items
    const items = Array.from({ length: NUM_ITEMS }).map((_, i) => {
        const angle = (i / NUM_ITEMS) * Math.PI * 100;
        const x = Math.cos(angle) * RADIUS;
        const y = Math.sin(angle) * RADIUS / 1.5;
        const zPos = -i * DEPTH + scrollPos * 30;

        const fadeStart = -50000;
        const fadeEnd = 1000;
        let opacity = 1;
        if (zPos < fadeStart) opacity = 0;
        else if (zPos < 0) opacity = 1 - Math.abs(zPos / fadeStart);
        else if (zPos > 0) opacity = Math.max(0, 1 - zPos / fadeEnd);

        return (
            <div
                key={i}
                className="item"
                style={{
                    transform: `translateX(${x}px) translateY(${y}px) translateZ(${zPos}px)`,
                    opacity,
                }}
            >
                {emojis[i]}
            </div>
        );
    });

    return (
        <div className="viewport">
            <div className="tunnel">{items}</div>
        </div>
    );
}

// Play sample at a given playbackRate
function playSample(audioCtx, buffer, playbackRate, onEnd) {
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.setValueAtTime(playbackRate, audioCtx.currentTime);
    source.connect(audioCtx.destination);
    source.start();
    source.stop(audioCtx.currentTime + buffer.duration / playbackRate);

    setTimeout(onEnd, (buffer.duration / playbackRate) * 1000);
}
