# chiragchhabra.vercel.app

Personal site of Chirag Chhabra — full-stack engineer (booking & payments, AI agents). Live at [chiragchhabra.vercel.app](https://chiragchhabra.vercel.app).

## What is in here

- **Landing page** — `src/components/` (Nav, Hero, Work, Principles, Stack, About, Timeline, Recommendations, Contact, Footer). All copy and numbers live in `src/data/site.js`.
- **Live matching engine** — `src/lib/matchingEngine.js` + `EnginePanel.jsx`. The order book from Market-Exchange, running in the browser; the benchmark is measured on the visitor's CPU. Loaded only when someone clicks "Run the engine live".
- **Admin dashboard** — `/admin` (`AdminPage.jsx`, `AdminDashboard.jsx`) backed by the serverless functions in `api/` (MongoDB). Edits projects, experience, social links, maintenance mode; reads contact-form messages and recruiter analytics. Loaded only on that route.
- **Contact form** — posts to `api/messages.mjs` and sends through EmailJS; the message counts as delivered if either lands.

## Design

Modelled on the editorial, paper-and-ink style: a cream canvas (`--canvas`) and one ink (`--ink`), hairline dividers, mono uppercase labels, big tight-tracked headlines with an italic serif phrase. Dark theme is the same stylesheet with a class flip (`.dark`), remembered in `localStorage`. Every colour is a CSS variable in `src/index.css`; Tailwind maps them to `bg-canvas`, `text-ink-2`, `border-line` and so on.

Type is self-hosted from `public/fonts` (Geist, Geist Mono, Instrument Serif — SIL OFL) with metric-matched fallback faces so the font swap never shifts the layout.

## Performance

Lighthouse 100 / 100 / 100 / 100 (mobile and desktop) is the target and the build is set up to keep it:

- `npm run build` runs `react-scripts build` and then `scripts/prerender.js`, which renders the landing page to static HTML inside `build/index.html`, inlines the stylesheet, and loads the app bundle after the first frame. React hydrates the page in place. No browser is needed for this step; it runs on plain Node with the Babel preset CRA already ships.
- No router, no animation library, no particles on the landing page. Reveal-on-scroll is one IntersectionObserver and CSS transitions.
- Images are WebP with explicit dimensions; fonts are preloaded; `vercel.json` sets long cache lifetimes for `/static`, `/fonts` and `/images`.

## Run it

```bash
npm install
npm start          # dev server on http://localhost:3000 (no prerender in dev)
npm run build      # production build → build/
```

The API routes need `MONGODB_URI` (and `ADMIN_PASSWORD` until a password is set in the dashboard) as environment variables on Vercel.

## Editing content

- Words, numbers, stack, principles, recommendations: `src/data/site.js`.
- Projects and experience: defaults in `src/context/PortfolioContext.jsx`; the admin dashboard can edit any project by title and add new ones, but the four curated projects always show.
- Project visuals: `public/images/<name>.webp` (1200×675) plus an optional `<name>-800.webp` for phones.
