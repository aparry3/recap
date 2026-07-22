# AGENTS.md — Recap Codebase Guide for AI Agents

This document provides everything an AI agent needs to understand and contribute to the Recap codebase.

## Quick Start

```bash
cd /path/to/recap
pnpm install
# Copy .env.example to .env.local and provide the required values
pnpm dev          # Starts at http://localhost:3000
```

## What Is Recap?

A **collaborative wedding photo gallery** web app. Couples create a password-protected gallery, share a QR code/link with guests, and guests upload photos/videos directly from their phones. No app download required.

**Key user flows:**
1. **Couple** creates gallery (via `/create`, pays with Stripe) → gets link + QR code
2. **Guest** visits gallery URL → enters password → enters name/email → uploads photos
3. **Admin** manages galleries via `/admin` dashboard

## Repo Structure

```
recap/
├── src/
│   ├── app/                          # Next.js App Router pages & API routes
│   │   ├── [path]/                   # Dynamic gallery pages (path = gallery slug)
│   │   │   ├── page.tsx              # Gallery entry point (SSR, fetches gallery by path)
│   │   │   ├── App.tsx               # Client-side gallery app shell
│   │   │   ├── upload/page.tsx       # Upload page
│   │   │   └── components/           # Gallery-specific components
│   │   │       ├── Content.tsx
│   │   │       ├── Header/
│   │   │       ├── Heading/
│   │   │       ├── LinkPage/         # Wedding website link integration
│   │   │       ├── Pages/            # Tab views: Gallery, Home, Me
│   │   │       │   ├── Tabs/         # Photos, Albums, People tabs
│   │   │       │   └── ...
│   │   │       ├── Password/         # Gallery password gate
│   │   │       ├── Sidebar/
│   │   │       └── TutorialOverlay/
│   │   ├── admin/                    # Admin dashboard
│   │   │   ├── page.tsx
│   │   │   ├── CreateAdminModal.tsx
│   │   │   ├── CreateGalleryModal.tsx
│   │   │   └── verify/[verificationId]/
│   │   ├── api/                      # REST API routes
│   │   │   ├── galleries/            # Gallery CRUD + media/people/albums
│   │   │   ├── media/                # Media CRUD + presigned URLs + upload completion
│   │   │   ├── albums/               # Album CRUD + media management
│   │   │   ├── people/               # Person CRUD + galleries
│   │   │   ├── likes/                # Like toggle/check/count
│   │   │   ├── verifications/        # Email verification
│   │   │   ├── admin/                # Admin-only endpoints
│   │   │   └── create-payment-intent/
│   │   ├── create/                   # Gallery creation flow (with Stripe)
│   │   ├── galleries/                # "My Galleries" page
│   │   ├── howto/                    # Help/FAQ
│   │   ├── privacy/ & terms/         # Legal pages
│   │   ├── verification/             # Email verification landing
│   │   ├── components/               # App-level shared components
│   │   ├── layout.tsx                # Root layout (Cormorant font, GA, metadata)
│   │   ├── page.tsx                  # Landing/marketing page
│   │   └── manifest.ts              # PWA manifest
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── Upload/                   # File selection + upload confirmation UI
│   │   ├── MediaGallery/             # Photo grid + lightbox + menu
│   │   ├── PersonPage/               # Registration form + validation + editing
│   │   ├── AlbumChip/ & AlbumSelect/ # Album UI elements
│   │   ├── CreateAlbum/              # Album creation/editing
│   │   ├── LikeButton/               # Heart/like interaction
│   │   ├── QrCode/                   # QR code generator
│   │   ├── ConfirmDelete/            # Deletion confirmation modal
│   │   ├── Button/ & Input/          # Base UI primitives
│   │   ├── Loading/                  # Loading spinner
│   │   ├── Notification/             # Toast notifications
│   │   ├── UploadStatus/             # Upload progress bar
│   │   ├── SyncStatus/               # Website sync indicator
│   │   └── branding/                 # Logo/icon components
│   │
│   ├── helpers/                      # Client-side utilities
│   │   ├── api/                      # API client functions
│   │   │   ├── galleryClient.ts      # createGallery, updateGallery, fetchGallery
│   │   │   ├── mediaClient.ts        # createMedia, deleteMedia, convertImageToWebP
│   │   │   ├── personClient.ts       # createPerson, fetchPerson
│   │   │   ├── albumClient.ts        # createAlbum, fetchAlbums, addMediaToAlbum
│   │   │   ├── likeClient.ts         # toggleLike, checkLike
│   │   │   └── adminClient.ts        # Admin API calls
│   │   ├── providers/                # React Context providers
│   │   │   ├── gallery.tsx           # GalleryProvider — central state for media, albums, uploads
│   │   │   ├── user.tsx              # UserProvider — person registration + auth
│   │   │   ├── albums.tsx
│   │   │   └── navigation.tsx
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── upload.ts             # uploadMedia, uploadLargeMedia, downloadMedia
│   │   │   ├── localStorage.ts       # useLocalStorage hook
│   │   │   ├── useLikes.ts
│   │   │   └── window.ts
│   │   ├── clientDb.ts               # Dexie IndexedDB for upload resilience
│   │   ├── files.ts                  # File processing utilities
│   │   ├── qrCode.ts                 # QR code generation
│   │   └── utils.ts                  # General utilities
│   │
│   └── lib/                          # Server-side libraries
│       ├── db/                       # Database service layer
│       │   ├── index.ts              # Kysely DB instance + Database interface
│       │   ├── galleryService.ts     # Gallery CRUD + soft delete + admin queries
│       │   ├── personService.ts      # Person CRUD + verification + admin status
│       │   ├── mediaService.ts       # Media CRUD + gallery/album/person queries
│       │   ├── albumService.ts       # Album CRUD + media management
│       │   ├── likeService.ts        # Like toggle + count
│       │   └── reminderService.ts    # Reminder CRUD and delivery state
│       ├── types/                    # TypeScript type definitions (Kysely table types)
│       │   └── Gallery.ts, Person.ts, Media.ts, Album.ts, Like.ts, Tag.ts, WeddingEvent.ts
│       ├── admin/middleware.ts       # Admin auth middleware
│       ├── aws/s3.ts                 # S3 client + presigned URLs + multipart upload
│       ├── email.ts                  # SendGrid client + email templates
│       ├── email/templates/          # HTML email templates
│       ├── web.ts                    # Wedding website scraping (Cheerio)
│       └── icons/                    # SVG icon components
│
├── migrations/                       # Kysely database migrations
├── public/                           # Static assets (branding, backgrounds, etc.)
├── migrate.ts                        # Migration runner script
├── next.config.js                    # Next.js config (bundle analyzer, security headers)
├── tailwind.config.ts
├── tsconfig.json
├── package.json                      # Project scripts and dependencies
└── vercel.json                       # Deployment and cron configuration
```

## Key Technologies & Patterns

### Database (Kysely + PostgreSQL)

- **Query builder:** Kysely with CamelCasePlugin (DB uses snake_case, code uses camelCase)
- **All IDs:** UUID v4, generated in application code (`uuid` package)
- **Service layer:** `src/lib/db/*Service.ts` — never write raw queries in API routes
- **Soft delete:** Galleries use `deletedAt` timestamp; queries filter these out by default

### Media Upload Pipeline

This is the most complex flow in the app:

```
Client selects files
  → Client generates WebP preview (canvas API, max 500px)
  → Client generates video thumbnail at 1s mark (if video)
  → POST /api/galleries/[id]/media (creates DB record, returns presigned S3 URLs)
  → Files stored in IndexedDB (Dexie) for crash resilience
  → Client uploads original + preview to S3 via presigned URLs
    → Small files: single PUT
    → Large files: multipart upload (create → parts → complete)
  → PUT /api/media/[id] with { uploaded: true }
  → IndexedDB entry removed
```

- **S3 key format:** `{personId}/{mediaId}` and `{personId}/{mediaId}-preview`
- **CloudFront URL** prepended when reading from DB (server-side, in service layer)
- **Retry logic:** 3 attempts with exponential backoff
- **Concurrency:** max 5 concurrent uploads
- On gallery load, orphaned media entries (not uploaded, no IndexedDB file) are cleaned up

### Authentication Model

**There is no traditional username/password auth system.** Instead:

1. **Gallery guests:** Enter name + optional email/phone → `person` record created → `personId` stored in cookie + localStorage
2. **Returning guests:** If email matches existing person, email verification is triggered to confirm identity
3. **Gallery access:** Each gallery has a password. Correct password stored as cookie keyed by `gallery.id`
4. **Admin access:** `person.isAdmin` flag. Admin endpoints check this via `src/lib/admin/middleware.ts`
5. **Admin invitation:** Existing admin creates new admin → sends email invitation → new admin verifies email

### Wedding Website Integration

When a gallery links to TheKnot or Zola, Cheerio scrapes the site's photo page,
filters for supported hosted images, and imports those photos into the gallery.

### UI Framework

**CRITICAL:** Always use `react-web-layout-components` for layout. Import `Container`, `Text`, etc. Read the library's documentation for proper usage patterns.

- Styling: SCSS Modules (`.module.scss`)
- Icons: FontAwesome (including Pro tiers — requires `.npmrc` registry config)
- Font: Cormorant (Google Fonts, loaded in root layout)

## Environment Variables

Copy `.env.example` to `.env.local`. The example file is the authoritative list of
runtime configuration and documents which values are required or optional. Next.js
loads `.env.local` automatically for development and builds.

## Common Tasks

### Adding a new API endpoint

1. Create route file at `src/app/api/{resource}/route.ts`
2. Use existing service functions from `src/lib/db/`
3. Return `NextResponse.json()`
4. If admin-only, use `requireAdmin()` from `src/lib/admin/middleware.ts`
5. Add client function in `src/helpers/api/{resource}Client.ts`

### Adding a database table/column

1. Create migration: `migrations/YYYYMMDDHHMMSS_description.ts`
2. Add `up()` and `down()` functions using Kysely schema builder
3. Update type definition in `src/lib/types/`
4. Update `Database` interface in `src/lib/db/index.ts`
5. Add service functions in `src/lib/db/`
6. Run migrations: `pnpm db:migrate`

### Adding a UI component

1. Create component in `src/components/ComponentName/index.tsx`
2. Use `react-web-layout-components` for layout (`Container`, `Text`)
3. Create SCSS module: `src/components/ComponentName/ComponentName.module.scss`
4. Use FontAwesome for icons

## Important Notes

- `next.config.js` has `ignoreBuildErrors: true` for TypeScript — builds won't fail on type errors
- `next.config.js` has `ignoreDuringBuilds: true` for ESLint — same for lint errors
- CloudFront domains in `next.config.js` images config: `d3aucbxkwf7gxk.cloudfront.net`, `d2zcso3rdm6ldw.cloudfront.net`
- The gallery creation and communications routes use `maxDuration = 60` for longer-running server work
- PWA metadata is provided by `src/app/manifest.ts`
- Tests use Vitest and run with `pnpm test`
