import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Root URL for user/organization pages (e.g. username.github.io). If the app is ever
// served from a subpath, set base to that path (e.g. '/repo-name/').
export default defineConfig({
    plugins: [react()],
    base: '/',
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
    },
});
