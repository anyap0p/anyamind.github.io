import { loadSavedKaleidoscopeList } from './buildKaleidoscopeStorage';
import { seedStarterKaleidoscope } from './seedStarterKaleidoscope';

/** One random saved kaleidoscope for the home backdrop, or a persisted starter if none saved. */
export function pickHomeBackdropSnapshot() {
    const saved = loadSavedKaleidoscopeList();
    if (saved.length > 0) {
        return saved[Math.floor(Math.random() * saved.length)];
    }
    return seedStarterKaleidoscope();
}
