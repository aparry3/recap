# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and other AI agents when working with code in this repository.

## Project Overview

**Recap** is a collaborative photo gallery web application built with Next.js 14+ (App Router). It's designed primarily for weddings — couples create password-protected galleries, share a QR code or link, and guests upload photos/videos directly. The app supports album organization, person tagging, likes, wedding website integration (TheKnot/Zola), and has a PWA service worker for offline support.

**Live domain:** `recap.photos` / `ourweddingrecap.com`

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server (sources .env.local automatically via package.json script)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Analyze bundle size
ANALYZE=true pnpm build

# Run database migrations
tsx migrate.ts
```

### ⚠️ Environment Setup

You **must** have a `.env.local` file with all required environment variables before running `pnpm dev` or `pnpm build`. The `pnpm dev` script automatically sources `.env.local`. For manual builds or migrations, run `source .env.local` first.

## Architecture Overview

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | SCSS Modules + Tailwind CSS |
| **Layout** | `react-web-layout-components` (Container, Text, etc.) |
| **Database** | PostgreSQL via Kysely (type-safe query builder) |
| **Storage** | AWS S3 (uploads) + CloudFront CDN (serving) |
| **Email** | SendGrid |
| **Payments** | Stripe |
| **AI** | Google Gemini API (event extraction from wedding websites) |
| **Web Scraping** | Cheerio (TheKnot/Zola wedding website integration) |
| **Offline** | Dexie (IndexedDB) for upload resilience, PWA service worker |
| **Icons** | FontAwesome (including Pro) |
| **Font** | Cormorant (Google Fonts) |
| **Analytics** | Google Analytics |

### Database Architecture

PostgreSQL with Kysely. CamelCasePlugin transforms snake_case DB columns to camelCase in TypeScript.

**Connection:** `src/lib/db/index.ts` — uses `pg` Pool with SSL.

**Service layer pattern:** Each domain has a service file in `src/lib/db/*Service.ts`. All database operations go through these services. Consistent method naming: `insert*`, `select*`, `update*`, `delete*`.

**Primary keys:** UUID v4 for all tables (generated via `uuid` package, not DB-side).

**Migrations:** `migrations/` directory, run via `tsx migrate.ts`.

#### Database Schema

```
person
├── id (PK, varchar/UUID)
├── name (varchar, NOT NULL)
├── email (varchar, nullable)
├── phone (varchar, nullable)
├── isAdmin (boolean, default false)
└── created (timestamp)

gallery
├── id (PK, varchar/UUID)
├── name (varchar, NOT NULL)
├── path (varchar, NOT NULL) — URL slug, e.g. "smith-wedding"
├── date (date, nullable) — wedding date
├── personId (FK → person) — gallery owner
├── createdBy (FK → person, nullable) — admin who created it
├── password (varchar) — access password
├── zola (varchar, nullable) — Zola wedding website URL
├── theknot (varchar, nullable) — TheKnot wedding website URL
├── deletedAt (timestamp, nullable) — soft delete
└── created (timestamp)

media
├── id (PK, varchar/UUID)
├── url (varchar) — S3 key path: "{personId}/{mediaId}"
├── preview (varchar) — S3 key path: "{personId}/{mediaId}-preview"
├── contentType (varchar)
├── height (integer, nullable)
├── width (integer, nullable)
├── personId (FK → person) — uploader
├── latitude (float8, nullable)
├── longitude (float8, nullable)
├── isPrivate (boolean, default false)
├── uploaded (boolean) — tracks upload completion
└── created (timestamp)

album
├── id (PK, varchar/UUID)
├── name (varchar, NOT NULL)
├── isPrivate (boolean, default false)
├── date (date, nullable)
├── personId (FK → person) — creator
├── galleryId (FK → gallery)
└── created (timestamp)

verification
├── id (PK, varchar/UUID)
├── personId (FK → person)
├── galleryId (varchar, nullable) — gallery context for verification
└── verified (boolean, default false)

weddingEvent
├── id (PK, varchar/UUID)
├── name (varchar, NOT NULL)
├── location (varchar, nullable)
├── start (date, nullable)
├── end (date, nullable)
├── attire (varchar, nullable)
└── galleryId (FK → gallery)

likes
├── id (PK, varchar/UUID)
├── mediaId (FK → media)
├── personId (FK → person)
├── created (timestamp)
└── UNIQUE(mediaId, personId)

--- Junction Tables ---

galleryMedia (PK: galleryId + mediaId)
galleryPerson (PK: galleryId + personId)
├── coverPhotoId (FK → media, nullable)
└── receiveMessages (boolean, default false)
albumMedia (PK: albumId + mediaId)
tag (PK: personId + mediaId)
```

### API Structure

REST API endpoints follow Next.js App Router conventions (`src/app/api/`):

```
POST   /api/galleries                           — Create gallery
GET    /api/galleries/[galleryId]                — Get gallery
PUT    /api/galleries/[galleryId]                — Update gallery
POST   /api/galleries/[galleryId]/media          — Create media entry (returns presigned URLs)
GET    /api/galleries/[galleryId]/media          — List gallery media
POST   /api/galleries/[galleryId]/albums         — Create album
GET    /api/galleries/[galleryId]/people          — List gallery contributors
POST   /api/galleries/[galleryId]/people          — Add person to gallery
PUT    /api/galleries/[galleryId]/people/[personId] — Update gallery person

GET    /api/media/[mediaId]                      — Get media with presigned URLs
PUT    /api/media/[mediaId]                      — Update media
DELETE /api/media/[mediaId]                      — Delete media
POST   /api/media/presigned-url                  — Get multipart upload presigned URL
POST   /api/media/end-upload                     — Complete multipart upload

GET    /api/albums/[albumId]                     — Get album
PUT    /api/albums/[albumId]                     — Update album
DELETE /api/albums/[albumId]                     — Delete album
POST   /api/albums/[albumId]/media               — Add/remove media from album

GET    /api/people/[personId]                    — Get person
PUT    /api/people/[personId]                    — Update person
GET    /api/people/[personId]/galleries           — Get person's galleries
POST   /api/people                               — Create person

POST   /api/likes/toggle                         — Toggle like
GET    /api/likes/check                          — Check if liked
GET    /api/likes/count                          — Get like count

POST   /api/verifications                        — Create verification
GET    /api/verifications/[verificationId]        — Check verification status

POST   /api/create-payment-intent                — Stripe payment

--- Admin Endpoints (require isAdmin=true) ---
GET    /api/admin/galleries                      — List admin's galleries (paginated)
POST   /api/admin/galleries                      — Create gallery as admin
PUT    /api/admin/galleries/[galleryId]            — Update gallery
DELETE /api/admin/galleries/[galleryId]            — Soft-delete gallery
POST   /api/admin/galleries/[galleryId]/restore    — Restore soft-deleted gallery
GET    /api/admin/stats                           — Admin dashboard stats
GET    /api/admin/admins                          — List admins
POST   /api/admin/admins                          — Create admin (sends invitation email)
DELETE /api/admin/admins/[personId]                — Remove admin
GET    /api/admin/verify/[verificationId]          — Admin email verification
```

Client-side API calls are abstracted in `src/helpers/api/*Client.ts` files.

### Key Patterns

1. **Media Upload Flow:**
   - Client calls `POST /api/galleries/[id]/media` → gets back `Media` record + `presignedUrls`
   - S3 key format: `{personId}/{mediaId}` (full) and `{personId}/{mediaId}-preview` (WebP thumbnail)
   - Small files: single PUT to presigned URL
   - Large files: multipart upload (server creates upload, client gets part URLs via `/api/media/presigned-url`, completes via `/api/media/end-upload`)
   - WebP previews generated client-side (canvas → blob conversion, max 500px)
   - Video thumbnails extracted client-side at 1-second mark
   - Files stored in IndexedDB (Dexie) during upload for crash resilience
   - On completion, `uploaded` flag set to `true`; orphaned entries (no IndexedDB file) get cleaned up on gallery load
   - Concurrent upload limit: 5 files at a time with retry logic (3 attempts, exponential backoff)

2. **Authentication:**
   - Simple cookie-based auth with `personId` stored in httpOnly cookie
   - Client also stores `personId` in localStorage
   - No traditional login/password for gallery guests — they enter name/email to create a `person` record
   - If email already exists, email verification flow is triggered
   - Gallery access requires gallery-specific password (stored in cookie keyed by `gallery.id`)
   - Admin access: `person.isAdmin` flag, checked via middleware in `src/lib/admin/middleware.ts`

3. **Wedding Website Integration:**
   - Galleries can link to Zola or TheKnot wedding websites
   - When linked, Cheerio scrapes the wedding site for event details and photos
   - Event text is sent to Google Gemini API to extract structured event data (name, location, start, end, attire)
   - Scraped photos from wedding sites are imported into the gallery

4. **State Management:**
   - React Context providers in `src/helpers/providers/`:
     - `GalleryProvider` — media, albums, people, upload state, selection
     - `UserProvider` — current person, registration flow
     - `AlbumsProvider` — album data
     - `NavigationProvider` — sidebar/navigation state
   - Client-side IndexedDB (Dexie) for upload resilience

5. **Service Layer:**
   - All database operations go through service files in `src/lib/db/`
   - `galleryService.ts`, `personService.ts`, `mediaService.ts`, `albumService.ts`, `likeService.ts`, `eventService.ts`, `tagService.ts`
   - Consistent patterns: functions accept typed data, return typed results
   - CloudFront URL prepended to media URLs when reading from DB

6. **Soft Delete:**
   - Galleries use soft delete (`deletedAt` timestamp)
   - All gallery queries filter out soft-deleted by default (`where deletedAt is null`)
   - Admin can restore soft-deleted galleries

### Page Structure

```
/                           — Marketing landing page
/[path]                     — Gallery view (dynamic, path = gallery.path slug)
/[path]/upload              — Upload page for gallery
/create                     — Create new gallery (with Stripe payment)
/galleries                  — List person's galleries
/admin                      — Admin dashboard
/admin/verify/[id]          — Admin email verification
/verification/[id]          — User email verification
/howto                      — Help/FAQ page
/privacy                    — Privacy policy
/terms                      — Terms of service
```

### Environment Variables

**Server-side:**
- `POSTGRES_HOST`, `POSTGRES_DATABASE`, `POSTGRES_USER`, `POSTGRES_PASSWORD` — PostgreSQL
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` — AWS credentials
- `AWS_S3_BUCKET` — S3 bucket name
- `AWS_CLOUDFRONT_URL` — CloudFront distribution URL
- `SENDGRID_API_KEY`, `SENDGRID_EMAIL` — SendGrid email
- `ORDER_NOTIFICATION_EMAIL` — internal notification recipient
- `STRIPE_SECRET_KEY` — Stripe payments
- `GEMINI_API_KEY` — Google Gemini API
- `BASE_URL` — app base URL (e.g., `https://recap.photos`)

**Client-side (NEXT_PUBLIC_):**
- `NEXT_PUBLIC_BASE_URL` — base URL for client
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` — GA tracking ID
- `NEXT_PUBLIC_ASSETS_CLOUDFRONT_URL` — assets CDN URL

### Code Style & Conventions

- TypeScript with `ignoreBuildErrors: true` in next.config.js (loose strictness)
- SCSS modules for component styling (`.module.scss`)
- **UI layout: ALWAYS use `react-web-layout-components`** (`Container`, `Text`, etc.) — read the library's docs for layout patterns
- FontAwesome icons (including Pro tier — `@fortawesome/pro-regular-svg-icons`, `@fortawesome/pro-solid-svg-icons`)
- Functional components with hooks
- Async/await for all async operations
- Cormorant Google Font throughout
- `.npmrc` configured for FontAwesome Pro registry

### Deployment

- Hosted on Vercel (uses `@vercel/functions`, `@vercel/postgres`, `@vercel/postgres-kysely`)
- CloudFront domains: `d3aucbxkwf7gxk.cloudfront.net`, `d2zcso3rdm6ldw.cloudfront.net`
- PWA support via `next-pwa`

### Development Tips

- Always have `.env.local` configured before developing
- Run dev server with `pnpm dev` (auto-sources `.env.local`)
- Navigate to `http://localhost:3000` to test changes
- When making UI changes, use `react-web-layout-components` — read its docs
- When implementing features using markdown documentation (in `_claude_docs/`), update the documentation as you complete steps
- The `_claude_docs/` directory contains PRDs, checklists, and RFCs for feature work

### Documentation

- `API_DOCUMENTATION.md` — Complete API endpoint documentation
- `QUICK_REFERENCE.md` — Quick reference for common patterns and types
- `USER_MANAGEMENT_ANALYSIS.md` — Analysis of user management system
- `_claude_docs/` — Feature PRDs, checklists, and implementation guides
