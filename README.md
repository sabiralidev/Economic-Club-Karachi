# Economic Club Karachi

Foundation for the Economic Club Karachi website. The project uses the Next.js App Router, TypeScript strict mode, React, and Tailwind CSS. Phase 1 establishes reusable layout/design foundations and route skeletons; detailed public content and admin workflows remain future implementation work.

## Requirements

- Node.js 20.9 or later
- npm
- MongoDB only when a feature that uses the database is enabled

## Setup

```bash
npm install
cp .env.example .env.local
```

Set `MONGODB_URI` to a MongoDB connection URI before using database-backed features. Set `ADMIN_SESSION_SECRET` to a cryptographically random value of at least 32 characters before enabling admin authentication. `.env.example` contains placeholders only. The MongoDB connection is created lazily, so the public site can be built without MongoDB credentials; no database connection is claimed or tested as part of this foundation.

## Development and production

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

## Tests

```bash
npm test
npm run test:e2e
```

Playwright's Chromium browser must be installed to run end-to-end tests:

```bash
npx playwright install chromium
```

## Database

The server-only MongoDB connection helper is `lib/db/mongodb.ts`. MongoDB models belong in `models/`, and database-backed business logic belongs in `lib/services/`. Configure `MONGODB_URI` in `.env.local` before attempting a real connection. No database migration or seed command is currently needed.

## Structure and route plan

- `app/`: App Router layouts, public route skeletons, dynamic detail routes, and protected admin routes.
- `components/`: shared brand, layout, and page components.
- `lib/`: server environment validation, MongoDB connection, and admin session utilities.
- `models/`: reserved for Mongoose models as domain features are added.
- `app/api/`: Next.js Route Handlers, beginning with the application liveness endpoint at `/api/health`.
- `tests/`: Vitest/React Testing Library unit tests and Playwright end-to-end tests.
- `public/`: static brand assets.

Primary public navigation: Home, About, Services, Business, Events, Community, Gallery, Insights, Membership, Contact. Supporting routes include `/services/[slug]`, `/events/[slug]`, `/gallery/[slug]`, `/insights/[slug]`, `/privacy`, and `/terms`. Admin routes are `/admin`, `/admin/login`, and future management subroutes. Authentication session validation is established, but credential verification, login/logout endpoints, and user provisioning must be completed before production admin use.

## Design and accessibility

The design tokens use a dark purple foundation with turquoise, yellow, blue, and green accents and warm-neutral page surfaces. The included public SVG mark is a new geometric placeholder inspired by the described ECK identity; no source logo asset was present in the repository. Replace it with the approved supplied logo when available. Shared layout includes semantic navigation, a skip link, visible keyboard focus, responsive spacing, and reduced-motion handling. A small, reduced-motion-aware GSAP/ScrollTrigger reveal is demonstrated on the home page.
