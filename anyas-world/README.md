# Anya's World

Portfolio built with [React](https://react.dev/) and [Vite](https://vite.dev/).

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended) and npm

## Setup

```bash
npm install
```

## Scripts

In this directory:

| Command | Description |
| -------- | ----------- |
| `npm run dev` or `npm start` | Start the Vite dev server with hot reload. Default URL: [http://localhost:5173](http://localhost:5173). |
| `npm run build` | Production build to the `dist` folder. |
| `npm run preview` | Serve the `dist` build locally to verify production output. |
| `npm test` | Run [Vitest](https://vitest.dev/) in watch mode. Use `npx vitest run` for a single non-interactive run. |
| `npm run deploy` | Runs `predeploy` (`npm run build`), writes `dist/CNAME` for the custom domain, then publishes `dist` to the `gh-pages` branch via [gh-pages](https://github.com/tschaub/gh-pages). |

## Deployment (GitHub Pages)

The app is configured for static hosting. Production assets live in **`dist`** after `npm run build`.

- **`npm run deploy`** pushes the contents of `dist` to the `gh-pages` branch. Ensure your GitHub repository Pages source is set to that branch (or your usual workflow).
- The deploy script adds **`CNAME`** with `anya.observer` so GitHub Pages serves the custom domain. Adjust `scripts/write-cname.mjs` if the domain changes.

Routing uses **`HashRouter`**, so client-side routes work without special server rewrite rules.

If the site were ever served from a **subpath** (for example `https://username.github.io/repository-name/`), set Vite’s `base` in `vite.config.js` to that path (e.g. `'/repository-name/'`).

## Project layout

- **`index.html`** — HTML shell at the project root (Vite entry).
- **`src/main.jsx`** — Application entry; mounts `<App />`.
- **`public/`** — Static files copied to `dist` as-is (favicon, `manifest.json`, etc.).

## Learn more

- [Vite documentation](https://vite.dev/guide/)
- [React documentation](https://react.dev/)
