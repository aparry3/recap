# Project Structure Documentation

## Overview
This document outlines the reorganized directory structure for the Recap collaborative photo gallery application, designed for better scalability, maintainability, and developer experience.

## Directory Structure

```
recap/
├── docs/                           # Documentation
│   ├── PROJECT_STRUCTURE.md       # This file
│   ├── API_REFERENCE.md           # API documentation
│   ├── DEPLOYMENT.md              # Deployment guide
│   ├── DEVELOPMENT.md             # Development setup
│   └── CHANGELOG.md               # Version history
├── public/                        # Static assets
│   ├── assets/                    # General assets
│   │   ├── images/               # Static images
│   │   ├── icons/                # Icon files
│   │   └── branding/             # Brand assets
│   ├── product/                  # Product-specific assets
│   ├── help/                     # Help documentation assets
│   └── backgrounds/              # Background images
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Route groups
│   │   ├── (gallery)/           # Gallery-specific routes
│   │   ├── api/                 # API routes
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── manifest.ts          # PWA manifest
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Base UI components
│   │   │   ├── button/          # Button component
│   │   │   ├── input/           # Input component
│   │   │   ├── loading/         # Loading component
│   │   │   └── index.ts         # UI components barrel export
│   │   ├── features/            # Feature-specific components
│   │   │   ├── gallery/         # Gallery components
│   │   │   ├── media/           # Media components
│   │   │   ├── albums/          # Album components
│   │   │   ├── upload/          # Upload components
│   │   │   └── auth/            # Authentication components
│   │   ├── layout/              # Layout components
│   │   │   ├── header/          # Header component
│   │   │   ├── footer/          # Footer component
│   │   │   └── sidebar/         # Sidebar component
│   │   └── index.ts             # Components barrel export
│   ├── lib/                     # Core utilities and configurations
│   │   ├── auth/                # Authentication utilities
│   │   ├── database/            # Database configuration and types
│   │   │   ├── migrations/      # Database migrations
│   │   │   ├── schema.ts        # Database schema
│   │   │   └── client.ts        # Database client
│   │   ├── services/            # External service integrations
│   │   │   ├── aws/             # AWS S3 integration
│   │   │   ├── stripe/          # Stripe integration
│   │   │   ├── email/           # Email service
│   │   │   └── ai/              # AI services
│   │   ├── validations/         # Input validation schemas
│   │   ├── constants/           # Application constants
│   │   └── utils/               # Utility functions
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-auth.ts          # Authentication hook
│   │   ├── use-gallery.ts       # Gallery hook
│   │   ├── use-media.ts         # Media hook
│   │   └── index.ts             # Hooks barrel export
│   ├── stores/                  # State management
│   │   ├── gallery-store.ts     # Gallery state
│   │   ├── media-store.ts       # Media state
│   │   └── auth-store.ts        # Authentication state
│   ├── types/                   # TypeScript type definitions
│   │   ├── database.ts          # Database types
│   │   ├── api.ts               # API types
│   │   ├── gallery.ts           # Gallery types
│   │   ├── media.ts             # Media types
│   │   └── index.ts             # Types barrel export
│   ├── styles/                  # Styling files
│   │   ├── globals.css          # Global styles
│   │   ├── components/          # Component-specific styles
│   │   └── themes/              # Theme configurations
│   └── data/                    # Static data and configurations
│       ├── constants.ts         # Application constants
│       └── config.ts            # Configuration files
├── migrations/                  # Database migrations (moved from root)
├── scripts/                     # Build and utility scripts
│   ├── migrate.ts              # Migration script
│   └── build.sh                # Build script
├── tests/                       # Test files
│   ├── __mocks__/              # Mock files
│   ├── components/             # Component tests
│   ├── api/                    # API tests
│   └── utils/                  # Utility tests
├── .env.example                # Environment variables example
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── package.json                # Package configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project overview
```

## Key Improvements

### 1. Separation of Concerns
- **Components**: Clearly separated UI components, feature components, and layout components
- **Services**: External integrations isolated in dedicated service modules
- **Types**: All TypeScript types centralized and organized by domain
- **Hooks**: Custom React hooks in dedicated directory

### 2. Scalability
- **Feature-based organization**: Components organized by feature rather than type
- **Barrel exports**: Index files for clean imports
- **Route grouping**: Next.js route groups for better organization
- **Modular services**: Each external service has its own module

### 3. Developer Experience
- **Clear naming conventions**: Consistent kebab-case for directories, camelCase for files
- **Documentation**: Comprehensive docs directory with specific guides
- **Configuration**: All config files at root level for easy access
- **Testing**: Dedicated test directory with organized structure

### 4. Maintainability
- **Single responsibility**: Each directory has a clear purpose
- **Easy navigation**: Logical grouping makes finding files intuitive
- **Version control**: Better organization for tracking changes
- **Deployment**: Clear separation of build and deployment concerns

## File Naming Conventions

### Directories
- Use **kebab-case** for all directory names
- Use descriptive names that clearly indicate purpose
- Group related functionality together

### Files
- **Components**: PascalCase for component files (e.g., `MediaGallery.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useGallery.ts`)
- **Utilities**: camelCase for utility files (e.g., `dateUtils.ts`)
- **Types**: camelCase for type files (e.g., `galleryTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE for constant files (e.g., `API_ENDPOINTS.ts`)

### Exports
- Use barrel exports (`index.ts`) for clean imports
- Export components as named exports, not default exports
- Group related exports together

## Import Conventions

### Absolute Imports
Configure path aliases in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/lib/*": ["src/lib/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/types/*": ["src/types/*"],
      "@/stores/*": ["src/stores/*"]
    }
  }
}
```

### Import Order
1. External libraries (React, Next.js, etc.)
2. Internal aliases (@/components, @/lib, etc.)
3. Relative imports (./*, ../*.ts)
4. Type imports (separate from value imports)

## Migration Strategy

### Phase 1: Core Structure
1. Create new directory structure
2. Move configuration files
3. Reorganize documentation

### Phase 2: Components
1. Reorganize components by feature
2. Create barrel exports
3. Update import statements

### Phase 3: Services and Utilities
1. Consolidate service integrations
2. Reorganize utility functions
3. Update type definitions

### Phase 4: Testing and Documentation
1. Update test files
2. Create comprehensive documentation
3. Validate all imports and exports

## Benefits of This Structure

1. **Improved Developer Onboarding**: Clear structure makes it easy for new developers to understand the codebase
2. **Better Code Reusability**: Well-organized components and utilities promote reuse
3. **Easier Maintenance**: Logical grouping makes it easier to find and modify code
4. **Scalability**: Structure can easily accommodate new features and components
5. **Better Testing**: Clear separation makes unit and integration testing easier
6. **Improved Performance**: Better organization can lead to more efficient bundling and tree-shaking