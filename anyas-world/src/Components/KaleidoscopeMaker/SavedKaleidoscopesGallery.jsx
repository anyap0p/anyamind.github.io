import React from 'react';
import { SavedKaleidoscopeThumbnail } from './SavedKaleidoscopeThumbnail';

export function SavedKaleidoscopesGallery({ items, onBack, onOpen }) {
    return (
        <div className="kaleidoscope-maker kaleidoscope-maker--gallery">
            <button type="button" className="kaleidoscope-maker__customize-back" onClick={onBack}>
                back
            </button>
            <h2 className="kaleidoscope-maker__gallery-title">saved kaleidoscopes</h2>
            <p className="kaleidoscope-maker__gallery-hint">tap a dish to open the live kaleidoscope</p>
            <div className="kaleidoscope-maker__gallery-scroll">
                <div className="kaleidoscope-maker__gallery-grid">
                    {items.map((item) => (
                        <SavedKaleidoscopeThumbnail key={item.id} item={item} onOpen={() => onOpen(item)} />
                    ))}
                </div>
            </div>
        </div>
    );
}
