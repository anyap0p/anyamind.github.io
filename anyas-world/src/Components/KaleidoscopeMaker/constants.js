export const SEGMENTS = 12;
export const BUFFER = 360;
export const STORAGE_CUSTOM_BEADS = 'kaleidoscopeMaker_customBeads';
/** Saved petri configuration from “build kaleidoscope”: bead list (order) + per-type counts (latest / refresh) */
export const STORAGE_BUILD_KALEIDOSCOPE = 'kaleidoscopeMaker_buildKaleidoscope';
/** Gallery: array of completed builds */
export const STORAGE_SAVED_KALEIDOSCOPES = 'kaleidoscopeMaker_savedKaleidoscopes';
/** Shared image/GIF bytes keyed by hash — deduped across gallery saves */
export const STORAGE_BEAD_ASSETS = 'kaleidoscopeMaker_beadAssets';
/** User dismissed the local-storage privacy tip on the upload shape option */
export const STORAGE_UPLOAD_PRIVACY_TIP_SEEN = 'kaleidoscopeMaker_uploadPrivacyTipSeen';
export const BEAD_GRID_COLS = 8;
export const BEAD_GRID_ROWS = 4;
export const BEAD_HALVES = 4;
/** Slots in one physical bead-box tray. */
export const SLOTS_PER_BOX = BEAD_GRID_COLS * BEAD_GRID_ROWS;
/** How many bead boxes the maker can hold (paged in customize + build). */
export const BEAD_BOX_COUNT = 2;
export const SLOT_COUNT = SLOTS_PER_BOX * BEAD_BOX_COUNT;
export const PETRI_MAX_BEADS = 28;
/** Glitter specks are tiny; they get their own (bigger) cap separate from beads. */
export const PETRI_MAX_GLITTER = 1200;
/** Dots added per click of the glitter bottle. */
export const GLITTER_PER_SPRINKLE = 24;
