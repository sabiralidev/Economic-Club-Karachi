# Economic Club Karachi

Economic Club Karachi's responsive public website, built with the Next.js App Router, strict TypeScript, React, Tailwind CSS, and GSAP. Public copy that has not been confirmed by ECK is explicitly labeled as proposed, illustrative, or awaiting review.

## Requirements

- Node.js 20.9 or later
- npm
- MongoDB 6.0 or later for all persistent API features

## Setup

```bash
npm install
cp .env.example .env.local
```

Set `MONGODB_URI`, `ADMIN_SESSION_SECRET` (at least 32 random characters), and `NEXT_PUBLIC_SITE_URL` in `.env.local`. MongoDB-backed API routes return a service-unavailable response until a database is configured. Homepage and list pages show explicit empty/unavailable states; dynamic database-backed detail pages require MongoDB. `.env.example` contains placeholders only.

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

`npm run admin:create` manually provisions an administrator from `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD`. Use an individual password of at least 16 characters, set the variables through a local ignored env file or deployment secret manager, and run this command deliberately. It never creates a default account or prints the password.

Playwright's Chromium browser must be installed once to run end-to-end tests:

```bash
npx playwright install chromium
```

## MongoDB and deployment

The server-only Mongoose connection in `lib/db/mongodb.ts` reuses a global connection promise during development reloads, validates MongoDB URI schemes, disables buffered queries, and uses a bounded connection pool and server-selection timeout. Models create their indexes through Mongoose. Use a dedicated MongoDB database and application user with only the permissions the app needs; enable TLS for remote databases, restrict network access, and configure backups before production. Do not use a production URI for tests.

Required runtime variables:

- `MONGODB_URI`: `mongodb://` or `mongodb+srv://` connection string for the app database.
- `ADMIN_SESSION_SECRET`: random secret with at least 32 characters. Generate and store it with your deployment secret manager; do not commit it.
- `NEXT_PUBLIC_SITE_URL`: canonical HTTPS site origin in production. Admin login and mutations require a matching same-origin `Origin` header.

For a first administrator, configure `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD` only in an ignored local env file or secret manager, then explicitly run `npm run admin:create`. Remove the temporary bootstrap secret from the environment after creation. Admin credentials are scrypt-hashed; sessions use signed, eight-hour, `HttpOnly`, `SameSite=Lax` cookies, with `Secure` enabled in production. Administrators manage accounts operationally; there is no public account-creation API.

The database-backed rate limiter stores hashed client addresses and short-lived counters. Configure the trusted reverse proxy to set `X-Real-IP` or `X-Forwarded-For`; do not expose the application directly to untrusted proxy headers. Contact and application forms are rate-limited and accept optional idempotency keys. No email notification provider is configured; successful form responses mean that the submission was stored, not that an email was sent.

Set `TEST_MONGODB_URI` only to an isolated database whose database name ends in `_test` to enable the MongoDB integration test. That test creates and removes only its own uniquely identified fixture.

## API

All responses use `{ "data": ..., "error": null }` on success and `{ "data": null, "error": { "message": ... } }` on errors. List routes accept `page` (default 1), `limit` (default 20, maximum 100), supported filters, `q` for indexed text search, and documented `sort` options. Public read APIs return published records only.

| Public route | Methods | Purpose |
| --- | --- | --- |
| `/api/services`, `/api/services/[slug]` | GET | Published, non-archived services; filter by category/search and sort. |
| `/api/events`, `/api/events/[slug]` | GET | Published, non-archived, non-cancelled events; filter by status/category/date and sort. Venue is shown only when verified. |
| `/api/events/[slug]/register` | POST | Register interest only when the published upcoming event has registration enabled. |
| `/api/articles`, `/api/articles/[slug]` | GET | Published, non-archived articles; search, category/tag filter, paginate, and sort. |
| `/api/gallery`, `/api/gallery/[slug]` | GET | Published, non-archived gallery items; category/search filters and pagination. |
| `/api/inquiries` | POST | Persist a contact inquiry. Membership-purpose submissions are validated and stored as membership applications. |
| `/api/applications` | POST | Persist a membership/participation application with required consent. |
| `/api/settings` | GET | Approved public site settings only. |
| `/api/health` | GET | Application and database readiness without exposing connection details. |

Admin endpoints require an active session. Editors may manage content, including publish/unpublish and archive state; administrators alone can view/manage submissions and update site settings. Every mutation is validated and same-origin checked.

| Admin route | Methods | Access |
| --- | --- | --- |
| `/api/admin/session` | GET, POST, DELETE | Sign in, inspect current account, and sign out. |
| `/api/admin/services`, `/api/admin/services/[id]` | GET, POST; GET, PATCH, DELETE | Editor or administrator content management. |
| `/api/admin/events`, `/api/admin/events/[id]` | GET, POST; GET, PATCH, DELETE | Editor or administrator content management. |
| `/api/admin/articles`, `/api/admin/articles/[id]` | GET, POST; GET, PATCH, DELETE | Editor or administrator content management. |
| `/api/admin/gallery`, `/api/admin/gallery/[id]` | GET, POST; GET, PATCH, DELETE | Editor or administrator content management. |
| `/api/admin/site-settings` | GET, PATCH | Administrator only. |
| `/api/admin/inquiries`, `/api/admin/inquiries/[id]` | GET; GET, PATCH, DELETE | Administrator only; status changes are validated. |
| `/api/admin/applications`, `/api/admin/applications/[id]` | GET; GET, PATCH, DELETE | Administrator only; status changes are validated. |

## Phase 5 integration checklist

| Frontend feature | Integrated server operation | Behavior |
| --- | --- | --- |
| Home services, events and insights sections | Published Mongoose queries in `lib/content/database.ts` | Loads small, sorted result sets; displays empty or unavailable states without invented content. |
| Services list and detail | Published services query by page/search/category and lookup by slug | Search and pagination are URL-backed; details and metadata use the published record. |
| Events list and detail | Published event query by status/category/date/text and lookup by slug | Filters and pagination are URL-backed; an unverified venue is never returned. |
| Event registration | `/api/events/[slug]/register` | Registration form is shown as a request only when the event is upcoming and registration is enabled. |
| News and article detail | Published article query by text/category/tag and lookup by slug | Search and pagination use server queries; related articles are loaded from the same category. |
| Gallery and gallery detail | Published gallery query by category/text and lookup by slug | Paginated records and approved image URLs are displayed with the existing accessible lightbox. |
| Contact | `/api/inquiries` plus approved public settings | Contact, phone and address are shown only when configured; submissions remain in the form on recoverable errors. |
| Membership / participation | `/api/applications` | Saves a consented application with a selected interest category. |
| Admin content management | Protected `/api/admin/{services,events,articles,gallery}` routes | Editors/admins can create, edit, publish/unpublish, archive/unarchive and delete records. The dashboard uses a JSON editor validated by the API. |
| Admin inquiries and applications | Protected `/api/admin/{inquiries,applications}` routes | Admin-only lists show safe submission fields and timestamps; statuses can be updated or records deleted. |
| Admin authentication and site settings | `/api/admin/session`, `/api/admin/site-settings` | Server-verified roles protect dashboard access and all data/mutations; settings are admin-only. |

Gallery uploads are not configured: administrators must provide approved local image paths or HTTPS image URLs. No notification provider is configured, so successful submissions confirm database persistence only and do not claim an email was sent. The contact page reads approved settings directly on the server; missing settings are not replaced with fabricated contact data.

Real database workflows—including admin bootstrap/login, CRUD persistence, submission storage, and the 12 end-to-end scenarios—must be exercised against an isolated configured MongoDB database before release. This workspace does not include a configured test database, so those scenarios are not claimed as verified. The MongoDB integration test remains gated on `TEST_MONGODB_URI` and a database name ending in `_test`.

## Structure

- `app/`: App Router layouts, public pages, dynamic detail routes, API handlers, and protected admin dashboard.
- `components/`: shared brand/layout components and reusable homepage sections.
- `lib/`: published-content database queries, validation, server environment, MongoDB, and admin session utilities.
- `models/`: Mongoose schemas and indexes for content, settings, administrators, submissions, and rate limits.
- `app/api/`: public and admin Route Handlers for MongoDB-backed content, forms, sessions, settings, and health.
- `tests/`: Vitest/React Testing Library unit tests and Playwright end-to-end tests.
- `public/`: static brand assets.

Primary navigation: Home, About, Services, Events, Community, Insights, Contact. Supporting routes include `/business`, `/membership`, `/services/[slug]`, `/events/[slug]`, `/gallery`, `/insights/[slug]`, `/privacy`, and `/terms`. `/admin` redirects unauthenticated users to `/admin/login`; content operations are enforced by protected APIs, not only by dashboard UI controls.

## Design and accessibility

The design tokens use a dark purple foundation with restrained turquoise, yellow, blue, and green accents. Shared layout includes the public asset at `public/eck-mark.svg`, semantic navigation, a skip link, visible keyboard focus, responsive spacing, reduced-motion handling, and GSAP/ScrollTrigger reveals. Homepage photography is illustrative editorial stock imagery in `public/images/`, not documentation of ECK activity; replace it with client-approved imagery before launch. ECK should confirm the logo asset, mission and history copy, services, events, contact details, membership information, and article drafts before public launch.
