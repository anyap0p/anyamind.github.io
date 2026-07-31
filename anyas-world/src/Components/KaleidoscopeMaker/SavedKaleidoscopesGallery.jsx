import React from 'react';
import { BackButton } from './BackButton';
import { SavedKaleidoscopeThumbnail } from './SavedKaleidoscopeThumbnail';
import { TrashCanIcon } from './slotActionIcons';

export function SavedKaleidoscopesGallery({ items, onBack, onOpen, onDelete, backInChrome = false }) {
    return (
        <div className="kaleidoscope-maker kaleidoscope-maker--gallery">
            {backInChrome ? null : <BackButton onClick={onBack} />}
            {backInChrome ? null : (
                <h2 className="kaleidoscope-maker__gallery-title">your kaleidoscope collection</h2>
            )}
            <div className="kaleidoscope-maker__gallery-scroll">
                <div className="kaleidoscope-maker__gallery-grid">
                    {items.map((item) => (
                        <div key={item.id} className="kaleidoscope-maker__saved-thumb-cell" tabIndex={0}>
                            <div className="kaleidoscope-maker__saved-thumb-frame">
                                <SavedKaleidoscopeThumbnail item={item} />
                            </div>
                            <div className="kaleidoscope-maker__saved-thumb-overlay">
                                <button
                                    type="button"
                                    className="kaleidoscope-maker__saved-thumb-open"
                                    onClick={() => onOpen?.(item)}
                                >
                                    open
                                </button>
                                <button
                                    type="button"
                                    className="kaleidoscope-maker__saved-thumb-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete?.(item);
                                    }}
                                    aria-label="Delete saved kaleidoscope"
                                >
                                    <TrashCanIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
