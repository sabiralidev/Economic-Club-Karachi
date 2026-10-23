# Economic Club Karachi

Economic Club Karachi's responsive public website, built with the Next.js App Router, strict TypeScript, React, Tailwind CSS, and GSAP. Public copy that has not been confirmed by ECK is explicitly labeled as proposed, illustrative, or awaiting review.

## Requirements

- Node.js 20.9 or later
- npm
- MongoDB for inquiry submissions

## Setup

```bash
npm install
cp .env.example .env.local
```

Set `MONGODB_URI` in `.env.local` for the contact and membership inquiry form to store submissions. Without it, the public pages still run, but inquiry submission returns a temporary-unavailable response. `ADMIN_SESSION_SECRET` is reserved for the existing admin foundation and is not needed for public pages. `.env.example` contains placeholders only.

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

Playwright's Chromium browser must be installed once to run end-to-end tests:

```bash
npx playwright install chromium
```

## Database

The server-only MongoDB connection helper is `lib/db/mongodb.ts`. Inquiry validation lives in `lib/validation/inquiry.ts`; submissions are stored using `models/inquiry.ts` through `app/api/inquiries/route.ts`. Configure `MONGODB_URI` before accepting real inquiries. No database migration or seed command is currently needed.

## Structure and route plan

- `app/`: App Router layouts, public pages, dynamic detail routes, API handlers, and admin foundation.
- `components/`: shared brand/layout components and reusable homepage sections.
- `lib/`: content drafts, validation, server environment, MongoDB, and admin session utilities.
- `models/`: Mongoose models, including public inquiries.
- `app/api/`: Route Handlers at `/api/health` and `/api/inquiries`.
- `tests/`: Vitest/React Testing Library unit tests and Playwright end-to-end tests.
- `public/`: static brand assets.

Primary navigation: Home, About, Services, Events, Community, Insights, Contact. Supporting routes include `/business`, `/membership`, `/services/[slug]`, `/events/[slug]`, `/gallery`, `/insights/[slug]`, `/privacy`, and `/terms`. Admin routes remain a foundation only; authentication, account provisioning and admin workflows are not production-ready.

## Design and accessibility

The design tokens use a dark purple foundation with restrained turquoise, yellow, blue, and green accents. Shared layout includes the public asset at `public/eck-mark.svg`, semantic navigation, a skip link, visible keyboard focus, responsive spacing, reduced-motion handling, and GSAP/ScrollTrigger reveals. Homepage photography is illustrative editorial stock imagery in `public/images/`, not documentation of ECK activity; replace it with client-approved imagery before launch. ECK should confirm the logo asset, mission and history copy, services, events, contact details, membership information, and article drafts before public launch.
