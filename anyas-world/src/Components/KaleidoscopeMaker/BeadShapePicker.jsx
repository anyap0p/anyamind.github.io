import React, { useRef, useState } from 'react';
import cameraImg from '../../Icons/camera.png';
import { BEAD_SHAPES } from './beadModel';
import { fileToBeadImageDataUrl } from './beadImageUpload';
import { BeadVisual } from './BeadVisual';
import { STORAGE_UPLOAD_PRIVACY_TIP_SEEN } from './constants';

function hasSeenUploadPrivacyTip() {
    try {
        return localStorage.getItem(STORAGE_UPLOAD_PRIVACY_TIP_SEEN) === '1';
    } catch {
        return false;
    }
}

/**
 * Row of shape beads + “upload a photo”. Hover lifts/tilts; selected option
 * lightens and shows a “selected” badge in front.
 */
export function BeadShapePicker({ bead, onChange, className = '' }) {
    const fileInputRef = useRef(null);
    const tipSeenRef = useRef(hasSeenUploadPrivacyTip());
    const [privacyTipOpen, setPrivacyTipOpen] = useState(false);
    const fill = bead?.fill || '#888888';
    const accent = bead?.accent || fill;
    const selectedShape = bead?.shape;
    const hasImage = Boolean(bead?.image);

    const selectShape = (shape) => {
        onChange?.({ ...bead, shape });
    };

    const onPickImageFile = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        try {
            const image = await fileToBeadImageDataUrl(file);
            onChange?.({ ...bead, shape: 'image', image });
        } catch {
            /* unreadable file — keep current bead */
        }
    };

    const onUploadOptionClick = () => {
        if (hasImage && selectedShape !== 'image') {
            selectShape('image');
            return;
        }
        fileInputRef.current?.click();
    };

    const onUploadHover = () => {
        if (tipSeenRef.current || privacyTipOpen) return;
        setPrivacyTipOpen(true);
    };

    const closePrivacyTip = (e) => {
        e.preventDefault();
        e.stopPropagation();
        tipSeenRef.current = true;
        setPrivacyTipOpen(false);
        try {
            localStorage.setItem(STORAGE_UPLOAD_PRIVACY_TIP_SEEN, '1');
        } catch {
            /* ignore */
        }
    };

    return (
        <div className={`kaleidoscope-maker__shape-picker ${className}`.trim()}>
            <p className="kaleidoscope-maker__shape-picker-title">pick a shape</p>
            <div className="kaleidoscope-maker__shape-picker-row" role="listbox" aria-label="pick a shape">
                {BEAD_SHAPES.map((shape, i) => {
                    const selected = selectedShape === shape;
                    const tilt = i % 2 === 0 ? -7 : 8;
                    return (
                        <button
                            key={shape}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            className={`kaleidoscope-maker__shape-option${selected ? ' kaleidoscope-maker__shape-option--selected' : ''}`}
                            style={{ '--shape-tilt': `${tilt}deg` }}
                            onClick={() => selectShape(shape)}
                            aria-label={`${shape}${selected ? ', selected' : ''}`}
                        >
                            {selected ? (
                                <span className="kaleidoscope-maker__shape-option-badge" aria-hidden>
                                    selected
                                </span>
                            ) : null}
                            <span className="kaleidoscope-maker__shape-option-bead">
                                <BeadVisual shape={shape} fill={fill} accent={accent} lightDeg={18} />
                            </span>
                        </button>
                    );
                })}
                <div
                    className="kaleidoscope-maker__shape-option-upload-wrap"
                    onMouseEnter={onUploadHover}
                >
                    <button
                        type="button"
                        role="option"
                        aria-selected={selectedShape === 'image'}
                        className={`kaleidoscope-maker__shape-option kaleidoscope-maker__shape-option--upload${selectedShape === 'image' ? ' kaleidoscope-maker__shape-option--selected' : ''}`}
                        style={{ '--shape-tilt': '6deg' }}
                        onClick={onUploadOptionClick}
                        aria-label={
                            selectedShape === 'image'
                                ? 'photo bead, selected — click to upload a new photo'
                                : hasImage
                                  ? 'use uploaded photo'
                                  : 'upload a photo'
                        }
                    >
                        {selectedShape === 'image' ? (
                            <span className="kaleidoscope-maker__shape-option-badge" aria-hidden>
                                selected
                            </span>
                        ) : null}
                        <span className="kaleidoscope-maker__shape-option-bead">
                            {hasImage ? (
                                <BeadVisual
                                    shape="image"
                                    fill={fill}
                                    accent={accent}
                                    image={bead.image}
                                    lightDeg={18}
                                />
                            ) : (
                                <span className="kaleidoscope-maker__shape-option-upload-placeholder" aria-hidden>
                                    <img src={cameraImg} alt="" draggable={false} />
                                </span>
                            )}
                        </span>
                        <span className="kaleidoscope-maker__shape-option-upload-tip" aria-hidden="true">
                            upload a photo or gif
                        </span>
                    </button>
                    {privacyTipOpen ? (
                        <div
                            className="kaleidoscope-maker__upload-privacy-tip"
                            role="dialog"
                            aria-label="Privacy note"
                        >
                            <p className="kaleidoscope-maker__upload-privacy-tip-text">
                                all your data is stored on your device; not uploaded to a server :)
                            </p>
                            <button
                                type="button"
                                className="kaleidoscope-maker__upload-privacy-tip-close"
                                onClick={closePrivacyTip}
                                aria-label="Close privacy note"
                            >
                                ×
                            </button>
                        </div>
                    ) : null}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/gif,image/*"
                    className="kaleidoscope-maker__shape-picker-file"
                    onChange={onPickImageFile}
                />
            </div>
        </div>
    );
}
