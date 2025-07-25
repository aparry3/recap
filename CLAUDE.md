# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recap is a collaborative photo gallery application built with Next.js 14+ that allows users to create and share photo galleries for events (particularly weddings). The application features password-protected galleries, album organization, person tagging, and direct upload to AWS S3.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
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

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, SCSS Modules
- **Database**: PostgreSQL with Kysely (type-safe query builder)
- **Storage**: AWS S3 with CloudFront CDN
- **APIs**: Next.js API Routes (REST)
- **Authentication**: Cookie-based with person ID
- **External Services**: SendGrid (email), Stripe (payments), Google Gemini API

### Database Architecture

The application uses Kysely for type-safe database queries with PostgreSQL:

- Database connection and types defined in `src/lib/db/index.ts`
- Service layer pattern: Each domain has a service file in `src/lib/db/*Service.ts`
- Migrations stored in `migrations/` directory
- CamelCase plugin automatically transforms column names

Key tables:
- `gallery` - Main gallery entity with password protection
- `person` - User/person records
- `media` - Photo/video files with S3 references
- `album` - Album collections within galleries
- Junction tables: `galleryMedia`, `galleryPerson`, `albumMedia`

### API Structure

REST API endpoints follow Next.js App Router conventions:

```
/api/galleries/[galleryId]/...
/api/media/[mediaId]/...
/api/people/[personId]/...
/api/albums/[albumId]/...
```

Client-side API calls are abstracted in `src/helpers/api/*Client.ts` files.

### Key Patterns

1. **Media Upload Flow**:
   - Get presigned URL from `/api/media/presigned-url`
   - Upload directly to S3 using presigned URL
   - Notify completion via `/api/media/end-upload`
   - Supports multipart upload for large files

2. **Authentication**:
   - Simple cookie-based auth with person ID
   - Cookies set in `src/lib/cookies.ts`
   - Gallery passwords stored separately from user auth

3. **Type System**:
   - Database types generated from Kysely in `src/lib/db/index.ts`
   - Domain types in `src/lib/types/*.ts`
   - Consistent use of TypeScript throughout

4. **State Management**:
   - React Context providers in `src/helpers/providers/`
   - Gallery, user, albums, and navigation contexts
   - Client-side database (Dexie) for offline support

5. **Service Layer**:
   - All database operations go through service files
   - Consistent method naming: `insert*`, `select*`, `update*`, `delete*`
   - UUID v4 for all primary keys

### Important Implementation Details

- CloudFront URLs are injected server-side for media files
- WebP preview images are generated for all media
- Email verification required for new users
- QR codes generated for easy gallery sharing
- Wedding website integration (TheKnot, Zola) via web scraping
- Progressive Web App support with service workers

### Environment Variables

Required environment variables (see `.env.example` if present):
- Database connection (PostgreSQL)
- AWS credentials (S3, CloudFront)
- SendGrid API key
- Stripe keys
- Google Gemini API key

### Code Style

- TypeScript strict mode
- SCSS modules for component styling
- Functional components with hooks
- Async/await for all asynchronous operations
- Error boundaries for robust error handling

### Development Tips

- Be sure to use .env.local when developing
- When making feature and UI changes, be sure to run the server using `source .env.local` & `pnpm dev`, and navigate to the changes on the website at http://localhost:3000

### UI Component Guidelines

- IMPORTANT!! Claude should always use components from the npm package react-web-layout-components, and should be sure to read the libraries docs to understand how to use the components to layout UI components and pages