# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recap is a wedding photo sharing platform that allows couples to collect and organize photos from their wedding guests through QR codes. It's a Next.js 14 application with PostgreSQL database, AWS S3 storage, and various integrations.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18.3.1, TypeScript 5.6.3
- **Styling**: SCSS modules + Tailwind CSS
- **Database**: PostgreSQL with Kysely ORM
- **Storage**: AWS S3 (via CloudFront CDN)
- **Email**: SendGrid
- **Payments**: Stripe
- **AI**: Google Gemini
- **Hosting**: Vercel

## Development Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run Next.js linter

# Database Migrations
./migrate.sh create <migration_name>  # Create new migration file
./migrate.sh up                       # Run all pending migrations
./migrate.sh down                     # Rollback last migration

# Bundle Analysis
ANALYZE=true npm run build           # Analyze bundle size
```

## Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── [path]/           # Dynamic gallery routes
│   └── create/           # Gallery creation flow
├── components/            # React components (using SCSS modules)
├── helpers/              # Client-side utilities
│   ├── api/             # API client functions
│   └── hooks/           # Custom React hooks
└── lib/                  # Server-side utilities
    ├── db/              # Database services (Kysely)
    ├── aws/             # S3 integration
    └── types/           # TypeScript type definitions
```

### Database Schema

Key tables (using camelCase in code via CamelCasePlugin):
- `gallery` - Wedding galleries
- `person` - Users and participants
- `media` - Photos and videos
- `album` - Photo collections
- `tag` - Photo tagging
- `likes` - Social features
- `verification` - User verification
- `wedding_event` - Event details

### API Routes Pattern

All API routes are in `src/app/api/` and follow RESTful conventions:
- GET/POST/PUT/DELETE methods
- JSON request/response
- Error handling with appropriate status codes

### Styling Conventions

1. Component-specific styles: SCSS modules (`ComponentName.module.scss`)
2. Global utilities: Tailwind CSS classes
3. Custom font: Cormorant (Google Font)

## Key Development Patterns

### Database Queries
Always use Kysely for type-safe queries:
```typescript
import { db } from '@/lib/db';

// Example query
const galleries = await db
  .selectFrom('gallery')
  .selectAll()
  .where('isActive', '=', true)
  .execute();
```

### API Client Functions
Use helper functions in `src/helpers/api/`:
```typescript
import { fetchGallery } from '@/helpers/api/gallery';

const gallery = await fetchGallery(galleryId);
```

### Component Structure
- Use functional components with TypeScript
- Place styles in `.module.scss` files
- Use existing patterns from similar components

### TypeScript Path Alias
Use `@/*` for imports from `src/*`:
```typescript
import { db } from '@/lib/db';
import Button from '@/components/Button';
```

## Environment Variables

Required for development:
- `POSTGRES_HOST`
- `POSTGRES_DATABASE`
- `POSTGRES_PASSWORD`
- `POSTGRES_USER`
- AWS credentials (for S3)
- SendGrid API key
- Stripe API keys

## Important Notes

1. **No Test Framework**: Currently no automated tests - verify changes manually
2. **React Strict Mode**: Disabled in next.config.js
3. **PWA Support**: Service worker configuration in place
4. **Image Domains**: CloudFront domains configured for Next.js Image component
5. **Security Headers**: Configured in next.config.js
6. **Database Migrations**: Use Kysely migrations with TypeScript
7. **Bundle Size**: Monitor with `ANALYZE=true npm run build`

## Common Workflows

### Adding a New Feature
1. Create database migration if needed: `./migrate.sh create feature_name`
2. Update types in `src/lib/types/`
3. Add API route in `src/app/api/`
4. Create/update components in `src/components/`
5. Add client-side API helpers in `src/helpers/api/`

### Database Changes
1. Create migration: `./migrate.sh create descriptive_name`
2. Edit the generated file in `migrations/`
3. Run migration: `./migrate.sh up`
4. Update TypeScript types in `src/lib/types/`

### Debugging
- Check browser console for client errors
- Check terminal for server errors
- Database queries are logged in development
- Use React Developer Tools for component debugging