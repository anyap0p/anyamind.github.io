import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export const ZOOM_MIN = 0.35;
export const ZOOM_MAX = 1.35;
export const TIGHTNESS_MIN = 0.55;
export const TIGHTNESS_MAX = 1.85;
export const TIGHTNESS_DEFAULT = 1;
export const IMMERSIVE_ZOOM_DEFAULT = 0.85;

const KaleidoscopeViewControlsContext = createContext(null);

export function KaleidoscopeViewControlsProvider({ children, immersiveChrome = false }) {
    const [zoom, setZoom] = useState(immersiveChrome ? IMMERSIVE_ZOOM_DEFAULT : 1);
    const [tightness, setTightnessState] = useState(TIGHTNESS_DEFAULT);
    const tightnessRef = useRef(TIGHTNESS_DEFAULT);
    const [tracers, setTracers] = useState(false);
    const shakeRef = useRef(null);

    const setTightness = useCallback((v) => {
        tightnessRef.current = v;
        setTightnessState(v);
    }, []);

    const registerShake = useCallback((fn) => {
        shakeRef.current = fn;
    }, []);

    const shake = useCallback(() => {
        shakeRef.current?.();
    }, []);

    const value = useMemo(
        () => ({
            zoom,
            setZoom,
            tightness,
            setTightness,
            tightnessRef,
            tracers,
            setTracers,
            registerShake,
            shake,
            immersiveChrome,
        }),
        [zoom, tightness, tracers, setTightness, registerShake, shake, immersiveChrome],
    );

    return (
        <KaleidoscopeViewControlsContext.Provider value={value}>
            {children}
        </KaleidoscopeViewControlsContext.Provider>
    );
}

export function useKaleidoscopeViewControls() {
    return useContext(KaleidoscopeViewControlsContext);
}
