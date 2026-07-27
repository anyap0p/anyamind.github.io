import React, { useCallback, useEffect, useRef, useState } from 'react';
import beadboxImg from '../../Icons/beadbox.png';
import glitterBottleImg from '../../Icons/glitterbottle.png';
import { BackButton } from './BackButton';
import { BeadBoxPager } from './BeadBoxPager';
import { BuildBeadPickerGrid } from './BuildBeadPickerGrid';
import { appendKaleidoscopeSave } from './buildKaleidoscopeStorage';
import { SLOTS_PER_BOX } from './constants';
import { ForwardButton } from './ForwardButton';
import { loadBeadsFromStorage } from './beadStorage';
import { PetriDishView } from './PetriDishView';

export function BuildKaleidoscopeView({
    onBack,
    onDone,
    backInChrome = false,
    onChromeForwardChange,
}) {
    const [beads] = useState(loadBeadsFromStorage);
    const [dishCount, setDishCount] = useState(0);
    const [boxSettled, setBoxSettled] = useState(false);
    const [boxIndex, setBoxIndex] = useState(0);
    const [glitterOpen, setGlitterOpen] = useState(false);
    const [glitterColor, setGlitterColor] = useState('#ff7ad9');
    const petriRef = useRef(null);
    const slotOffset = boxIndex * SLOTS_PER_BOX;

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            requestAnimationFrame(() => setBoxSettled(true));
        });
        return () => cancelAnimationFrame(id);
    }, []);

    const onPickBead = useCallback((bead) => {
        petriRef.current?.tryAddBead(bead);
    }, []);

    const sprinkleColored = useCallback(() => {
        petriRef.current?.sprinkleGlitter({ fill: glitterColor });
    }, [glitterColor]);

    const sprinkleHolo = useCallback(() => {
        petriRef.current?.sprinkleGlitter({ holo: true });
    }, []);

    const handleDone = useCallback(() => {
        const bodies = petriRef.current?.getBodies?.() ?? [];
        const saved = appendKaleidoscopeSave(bodies);
        onDone?.(saved);
    }, [onDone]);

    useEffect(() => {
        if (!backInChrome) return undefined;
        onChromeForwardChange?.(handleDone, 'save and view');
        return () => onChromeForwardChange?.(null);
    }, [backInChrome, handleDone, onChromeForwardChange]);

    const flyClass = [
        'kaleidoscope-maker__build-beadbox-fly',
        boxSettled ? 'kaleidoscope-maker__build-beadbox-fly--settled' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            {backInChrome ? null : <BackButton onClick={onBack} />}
            {backInChrome ? null : <ForwardButton onClick={handleDone} />}
            <div className="kaleidoscope-maker__build-body">
                <div className="kaleidoscope-maker__build-main-row">
                    <div className="kaleidoscope-maker__build-beadbox-col">
                        <div className={flyClass}>
                            <div className="kaleidoscope-maker__beadbox-stack-rotator">
                                <div className="kaleidoscope-maker__beadbox-stack kaleidoscope-maker__build-beadbox-stack">
                                    <img src={beadboxImg} alt="" className="kaleidoscope-maker__beadbox-img" draggable={false} />
                                    <BuildBeadPickerGrid
                                        key={boxIndex}
                                        beads={beads}
                                        slotOffset={slotOffset}
                                        dishCount={dishCount}
                                        onPickBead={onPickBead}
                                    />
                                </div>
                            </div>
                            <BeadBoxPager boxIndex={boxIndex} onChange={setBoxIndex} />
                        </div>
                    </div>
                    <div className="kaleidoscope-maker__build-dish-col">
                        <PetriDishView ref={petriRef} onCountChange={setDishCount} />
                        <div className="kaleidoscope-maker__glitter-corner">
                            {glitterOpen ? (
                                <div className="kaleidoscope-maker__glitter-popover">
                                    <label className="kaleidoscope-maker__glitter-color" aria-label="Glitter color">
                                        <input
                                            type="color"
                                            value={glitterColor}
                                            onChange={(e) => setGlitterColor(e.target.value)}
                                        />
                                    </label>
                                    <button type="button" onClick={sprinkleColored}>
                                        sprinkle
                                    </button>
                                    <button
                                        type="button"
                                        className="kaleidoscope-maker__glitter-holo-btn"
                                        onClick={sprinkleHolo}
                                    >
                                        holographic
                                    </button>
                                </div>
                            ) : null}
                            <button
                                type="button"
                                className="kaleidoscope-maker__glitter-bottle"
                                onClick={() => setGlitterOpen((o) => !o)}
                                aria-label="Add glitter"
                                aria-expanded={glitterOpen}
                            >
                                <span className="kaleidoscope-maker__glitter-hint" aria-hidden>
                                    add some glitterrr
                                </span>
                                <img src={glitterBottleImg} alt="" draggable={false} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
