import React, { useCallback, useEffect, useRef, useState } from 'react';
import beadboxImg from '../../Icons/beadbox.png';
import { BeadEditorModal } from './BeadEditorModal';
import { BeadFactoryPanel } from './BeadFactoryPanel';
import { BeadTrayGrid } from './BeadTrayGrid';
import { normalizeBead } from './beadModel';
import { loadBeadsFromStorage, saveBeadsToStorage } from './beadStorage';

/** Mostly-vertical tray motion → random tilt, strength, and lateral kick. */
function makeTrayImpulse(ix, iy) {
    if (ix === 0 && iy === 0) return { ix: 0, iy: 0 };
    const angle = (Math.random() - 0.5) * 1.08;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    let jx = ix * c - iy * s;
    let jy = ix * s + iy * c;
    jy *= 0.48 + Math.random() * 0.48;
    jx += (Math.random() - 0.5) * 0.58;
    jy += (Math.random() - 0.5) * 0.22;
    const twist = (Math.random() - 0.5) * 0.42;
    const ct = Math.cos(twist);
    const st = Math.sin(twist);
    return {
        ix: jx * ct - jy * st,
        iy: jx * st + jy * ct,
    };
}

export function CustomizeBeadsPanel({ onBack }) {
    const [flySettled, setFlySettled] = useState(false);
    const [showSlotButtons, setShowSlotButtons] = useState(false);
    const [beads, setBeads] = useState(loadBeadsFromStorage);
    const [editorSlot, setEditorSlot] = useState(null);
    const [factoryMode, setFactoryMode] = useState(false);
    const [factorySlot, setFactorySlot] = useState(null);
    const [factoryNonce, setFactoryNonce] = useState(0);
    const [trayRattle, setTrayRattle] = useState({ key: 0, ix: 0, iy: 0 });
    const pendingRattleRef = useRef({ ix: 0, iy: 0 });
    const flyRef = useRef(null);

    const updateBeads = useCallback((updater) => {
        setBeads((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            saveBeadsToStorage(next);
            return next;
        });
    }, []);

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                /* Tray slides up into view → beads lag downward in box frame. */
                pendingRattleRef.current = { ix: 0, iy: 1 };
                setFlySettled(true);
            });
        });
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        const el = flyRef.current;
        if (!el) return undefined;
        const onTrayMoveStart = (e) => {
            if (e.target === el && e.propertyName === 'transform') {
                const p = pendingRattleRef.current;
                pendingRattleRef.current = { ix: 0, iy: 0 };
                setTrayRattle((prev) => ({
                    key: prev.key + 1,
                    ix: p.ix,
                    iy: p.iy,
                }));
            }
        };
        el.addEventListener('transitionstart', onTrayMoveStart);
        return () => el.removeEventListener('transitionstart', onTrayMoveStart);
    }, []);

    useEffect(() => {
        if (!flySettled) return undefined;
        const el = flyRef.current;
        let done = false;
        const finish = () => {
            if (done) return;
            done = true;
            setShowSlotButtons(true);
        };
        const onEnd = (e) => {
            if (e.target === el && e.propertyName === 'transform') finish();
        };
        el?.addEventListener('transitionend', onEnd);
        const t = window.setTimeout(finish, 1100);
        return () => {
            el?.removeEventListener('transitionend', onEnd);
            window.clearTimeout(t);
        };
    }, [flySettled]);

    const openNew = useCallback((slotIndex) => {
        pendingRattleRef.current = makeTrayImpulse(0, 1);
        setFactorySlot(slotIndex);
        setFactoryNonce((n) => n + 1);
        setFactoryMode(true);
    }, []);

    const closeFactory = useCallback(() => {
        pendingRattleRef.current = makeTrayImpulse(0, -1);
        setFactoryMode(false);
        setFactorySlot(null);
    }, []);

    const saveFactory = useCallback(
        (payload) => {
            if (factorySlot === null) return;
            const index = factorySlot;
            const saved = normalizeBead(payload);
            if (!saved) return;
            updateBeads((prev) => {
                const next = [...prev];
                next[index] = saved;
                return next;
            });
            closeFactory();
        },
        [factorySlot, updateBeads, closeFactory],
    );

    const handleCustomizeBack = useCallback(() => {
        if (factoryMode) {
            closeFactory();
            return;
        }
        onBack();
    }, [factoryMode, closeFactory, onBack]);

    useEffect(() => {
        if (!factoryMode) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') closeFactory();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [factoryMode, closeFactory]);

    const openEdit = useCallback((slotIndex) => {
        const b = beads[slotIndex];
        if (!b) return;
        setEditorSlot({ index: slotIndex, initial: { ...b } });
    }, [beads]);

    const closeEditor = useCallback(() => setEditorSlot(null), []);

    const saveEditor = useCallback(
        (payload) => {
            if (editorSlot === null) return;
            const { index } = editorSlot;
            const saved = normalizeBead(payload);
            if (!saved) return;
            updateBeads((prev) => {
                const next = [...prev];
                next[index] = saved;
                return next;
            });
            setEditorSlot(null);
        },
        [editorSlot, updateBeads],
    );

    const deleteSlot = useCallback(
        (slotIndex) => {
            updateBeads((prev) => {
                const next = [...prev];
                next[slotIndex] = null;
                return next;
            });
        },
        [updateBeads],
    );

    const flyClass = [
        'kaleidoscope-maker__beadbox-fly',
        flySettled ? 'kaleidoscope-maker__beadbox-fly--settled' : '',
        factoryMode && flySettled ? 'kaleidoscope-maker__beadbox-fly--factory-out' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <button type="button" className="kaleidoscope-maker__customize-back" onClick={handleCustomizeBack}>
                back
            </button>
            <div className="kaleidoscope-maker__customize-scene">
                <div
                    className={`kaleidoscope-maker__bead-factory${factoryMode ? ' kaleidoscope-maker__bead-factory--visible' : ''}`}
                    aria-hidden={!factoryMode}
                >
                    {factoryMode && factorySlot !== null ? (
                        <BeadFactoryPanel
                            key={`${factorySlot}-${factoryNonce}`}
                            onSave={saveFactory}
                            onCancel={closeFactory}
                        />
                    ) : null}
                </div>
                <div ref={flyRef} className={flyClass}>
                    <div className="kaleidoscope-maker__beadbox-stack">
                        <img src={beadboxImg} alt="" className="kaleidoscope-maker__beadbox-img" draggable={false} />
                        <BeadTrayGrid
                            beads={beads}
                            visible
                            interactive={showSlotButtons}
                            onAdd={openNew}
                            onEdit={openEdit}
                            onDelete={deleteSlot}
                            rattleKey={trayRattle.key}
                            rattleIx={trayRattle.ix}
                            rattleIy={trayRattle.iy}
                        />
                    </div>
                </div>
            </div>
            {editorSlot ? (
                <BeadEditorModal
                    key={editorSlot.index + '-e'}
                    initial={editorSlot.initial}
                    title="edit bead"
                    onSave={saveEditor}
                    onCancel={closeEditor}
                    onRemove={() => {
                        deleteSlot(editorSlot.index);
                        closeEditor();
                    }}
                />
            ) : null}
        </>
    );
}
