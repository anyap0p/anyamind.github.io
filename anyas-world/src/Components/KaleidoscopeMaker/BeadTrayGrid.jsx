import React from 'react';
import { BEAD_GRID_COLS, BEAD_GRID_ROWS, BEAD_HALVES } from './constants';
import { BeadSlotCell } from './BeadSlotCell';

export function BeadTrayGrid({
    beads,
    visible,
    interactive = false,
    onAdd,
    onEdit,
    onDelete,
    rattleKey = 0,
    rattleIx = 0,
    rattleIy = 0,
}) {
    return (
        <div
            className={`kaleidoscope-maker__bead-slot-grid${visible ? ' kaleidoscope-maker__bead-slot-grid--visible' : ''}${interactive ? ' kaleidoscope-maker__bead-slot-grid--interactive' : ''}`}
        >
            {Array.from({ length: BEAD_GRID_ROWS }, (_, row) => (
                <div key={row} className="kaleidoscope-maker__bead-slot-row">
                    <div className="kaleidoscope-maker__bead-slot-half">
                        {Array.from({ length: BEAD_HALVES }, (_, j) => {
                            const i = row * BEAD_GRID_COLS + j;
                            return (
                                <div key={i} className="kaleidoscope-maker__slot-cell">
                                    <BeadSlotCell
                                        slotIndex={i}
                                        bead={beads[i]}
                                        onAdd={onAdd}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        rattleKey={rattleKey}
                                        rattleIx={rattleIx}
                                        rattleIy={rattleIy}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="kaleidoscope-maker__bead-slot-half">
                        {Array.from({ length: BEAD_HALVES }, (_, j) => {
                            const i = row * BEAD_GRID_COLS + BEAD_HALVES + j;
                            return (
                                <div key={i} className="kaleidoscope-maker__slot-cell">
                                    <BeadSlotCell
                                        slotIndex={i}
                                        bead={beads[i]}
                                        onAdd={onAdd}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        rattleKey={rattleKey}
                                        rattleIx={rattleIx}
                                        rattleIy={rattleIy}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
