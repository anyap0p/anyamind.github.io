import React from 'react';

/** Shared edit/delete action icons (bead tray slots, saved kaleidoscope thumbs). */

export function PencilIcon() {
    return (
        <svg
            className="kaleidoscope-maker__slot-action-icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden
            focusable="false"
        >
            <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            />
        </svg>
    );
}

export function TrashCanIcon() {
    return (
        <svg
            className="kaleidoscope-maker__slot-action-icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden
            focusable="false"
        >
            <path
                fill="currentColor"
                d="M9 3h6a1 1 0 0 1 1 1v1h4v2H4V5h4V4a1 1 0 0 1 1-1zm1 2v0h4V5h-4zM6 9h12l-.8 11.1A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.9L6 9zm3 2v8h2v-8H9zm4 0v8h2v-8h-2z"
            />
        </svg>
    );
}
