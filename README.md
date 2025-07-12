# Recap - Collaborative Photo Galleries

A modern, collaborative photo gallery application built with Next.js 14, TypeScript, and PostgreSQL. Create and share photo galleries for events like weddings, parties, and special occasions.

## 🚀 Features

- **Multi-user photo sharing** with albums and galleries
- **AI-powered features** using Google Generative AI
- **Cloud storage** with AWS S3 integration
- **Payment processing** via Stripe
- **Email notifications** through SendGrid
- **PWA capabilities** for mobile app-like experience
- **QR code generation** for easy gallery sharing
- **Real-time collaboration** with offline sync

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Kysely ORM
- **Database**: PostgreSQL with Vercel Postgres
- **Storage**: AWS S3 for media files
- **Services**: Stripe, SendGrid, Google Generative AI
- **Deployment**: Vercel

### Project Structure
```
├── docs/                        # Documentation
├── public/                      # Static assets
│   ├── assets/                 # Organized assets
│   │   ├── images/            # Static images
│   │   └── icons/             # Icon files
│   ├── product/               # Product-specific assets
│   ├── help/                  # Help documentation
│   └── backgrounds/           # Background images
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components
│   │   ├── features/        # Feature-specific components
│   │   │   ├── gallery/     # Gallery components
│   │   │   ├── media/       # Media components
│   │   │   ├── albums/      # Album components
│   │   │   ├── upload/      # Upload components
│   │   │   └── auth/        # Authentication components
│   │   └── layout/          # Layout components
│   ├── lib/                 # Core utilities and configurations
│   │   ├── database/        # Database configuration
│   │   ├── services/        # External service integrations
│   │   │   ├── aws/         # AWS S3 integration
│   │   │   ├── stripe/      # Stripe integration
│   │   │   ├── email/       # Email service
│   │   │   └── ai/          # AI services
│   │   ├── utils/           # Utility functions
│   │   └── constants/       # Application constants
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # State management
│   ├── types/               # TypeScript type definitions
│   └── styles/              # Styling files
├── scripts/                 # Build and utility scripts
└── tests/                   # Test files
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database
- AWS S3 bucket
- Stripe account
- SendGrid account
- Google AI account

### Installation
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env.local` and configure environment variables
4. Run database migrations: `pnpm run migrate`
5. Start development server: `pnpm run dev`

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
AWS_BUCKET_NAME=...

# Stripe
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...

# SendGrid
SENDGRID_API_KEY=...

# Google AI
GOOGLE_AI_API_KEY=...
```

## 📝 Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm run migrate` - Run database migrations

## 🧩 Import Conventions

The project uses path aliases for clean imports:

```typescript
// UI Components
import { Button, Input, Loading } from '@/components/ui'

// Feature Components
import { MediaGallery } from '@/components/features/media'
import { AlbumSelect } from '@/components/features/albums'

// Utilities
import { formatDate, slugify } from '@/lib/utils'
import { uploadToS3 } from '@/lib/services/aws'

// Types
import { Gallery, MediaFile } from '@/types'

// Hooks
import { useAuth, useGallery } from '@/hooks'
```

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📚 Documentation

- [Project Structure](docs/PROJECT_STRUCTURE.md) - Detailed directory structure
- [API Reference](docs/API_REFERENCE.md) - Complete API documentation
- [Development Guide](docs/DEVELOPMENT.md) - Development setup and guidelines
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the project structure
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with modern web technologies and best practices for scalability and maintainability.
