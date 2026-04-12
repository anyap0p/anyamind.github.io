import React, { useCallback, useEffect, useRef, useState } from 'react';
import beadboxImg from '../../Icons/beadbox.png';
import { BuildBeadPickerGrid } from './BuildBeadPickerGrid';
import { appendKaleidoscopeSave } from './buildKaleidoscopeStorage';
import { PETRI_MAX_BEADS } from './constants';
import { loadBeadsFromStorage } from './beadStorage';
import { PetriDishView } from './PetriDishView';

export function BuildKaleidoscopeView({ onBack, onDone }) {
    const [beads] = useState(loadBeadsFromStorage);
    const [dishCount, setDishCount] = useState(0);
    const [boxSettled, setBoxSettled] = useState(false);
    const petriRef = useRef(null);

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            requestAnimationFrame(() => setBoxSettled(true));
        });
        return () => cancelAnimationFrame(id);
    }, []);

    const onPickBead = useCallback((bead) => {
        petriRef.current?.tryAddBead(bead);
    }, []);

    const handleDone = useCallback(() => {
        const bodies = petriRef.current?.getBodies?.() ?? [];
        const saved = appendKaleidoscopeSave(bodies);
        onDone?.(saved);
    }, [onDone]);

    const flyClass = [
        'kaleidoscope-maker__build-beadbox-fly',
        boxSettled ? 'kaleidoscope-maker__build-beadbox-fly--settled' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <button type="button" className="kaleidoscope-maker__customize-back" onClick={onBack}>
                back
            </button>
            <button type="button" className="kaleidoscope-maker__build-done" onClick={handleDone}>
                done
            </button>
            <div className="kaleidoscope-maker__build-body">
                <div className="kaleidoscope-maker__build-main-row">
                    <div className="kaleidoscope-maker__build-beadbox-col">
                        <div className={flyClass}>
                            <div className="kaleidoscope-maker__beadbox-stack kaleidoscope-maker__build-beadbox-stack">
                                <img src={beadboxImg} alt="" className="kaleidoscope-maker__beadbox-img" draggable={false} />
                                <BuildBeadPickerGrid beads={beads} dishCount={dishCount} onPickBead={onPickBead} />
                            </div>
                        </div>
                    </div>
                    <div className="kaleidoscope-maker__build-dish-col">
                        <PetriDishView ref={petriRef} onCountChange={setDishCount} />
                    </div>
                </div>
            </div>
        </>
    );
}
