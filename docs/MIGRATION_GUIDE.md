# Migration Guide

This guide helps you adapt to the new project structure and understand the changes made to improve code organization, scalability, and maintainability.

## 🔄 What Changed

### Directory Structure
The project has been reorganized from a flat structure to a feature-based, scalable architecture:

#### Before:
```
src/
├── app/
├── components/       # All components mixed together
├── helpers/         # Mixed utilities and API clients
├── lib/             # Mixed services and utilities
```

#### After:
```
src/
├── app/             # Next.js App Router (unchanged)
├── components/      # Organized by type and feature
│   ├── ui/         # Base UI components
│   ├── features/   # Feature-specific components
│   └── layout/     # Layout components
├── lib/             # Core utilities and configurations
│   ├── database/   # Database-related code
│   ├── services/   # External service integrations
│   ├── utils/      # Utility functions
│   └── constants/  # Application constants
├── hooks/           # Custom React hooks
├── stores/          # State management
├── types/           # TypeScript type definitions
└── styles/          # Styling files
```

## 📦 Component Reorganization

### UI Components
Basic, reusable UI components have been moved to `src/components/ui/`:

#### Migration:
```typescript
// Before
import Button from '@/components/Button/Button'
import Input from '@/components/Input/Input'
import Loading from '@/components/Loading/Loading'

// After
import { Button, Input, Loading } from '@/components/ui'
```

### Feature Components
Feature-specific components are now organized by domain:

#### Migration:
```typescript
// Before
import MediaGallery from '@/components/MediaGallery/MediaGallery'
import AlbumSelect from '@/components/AlbumSelect/AlbumSelect'
import Upload from '@/components/Upload/Upload'

// After
import { MediaGallery } from '@/components/features/media'
import { AlbumSelect } from '@/components/features/albums'
import { Upload } from '@/components/features/upload'
```

## 🔧 Utility Functions

### Before:
```typescript
// Mixed in helpers/
import { someFunction } from '@/helpers/utils'
import { apiCall } from '@/helpers/api/client'
```

### After:
```typescript
// Organized by purpose
import { formatDate, slugify } from '@/lib/utils'
import { uploadToS3 } from '@/lib/services/aws'
import { validateEmail } from '@/lib/utils/validationUtils'
```

## 🎯 Import Path Changes

### Updated Path Aliases
The `tsconfig.json` has been updated with new path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/utils/*": ["./src/lib/utils/*"],
      "@/services/*": ["./src/lib/services/*"]
    }
  }
}
```

### Import Migration Examples

#### Components:
```typescript
// Before
import Button from '../../../components/Button/Button'
import MediaGallery from '../../components/MediaGallery'

// After
import { Button } from '@/components/ui'
import { MediaGallery } from '@/components/features/media'
```

#### Services:
```typescript
// Before
import { uploadFile } from '@/lib/aws/upload'
import { sendEmail } from '@/lib/email/sender'

// After
import { uploadFile } from '@/lib/services/aws'
import { sendEmail } from '@/lib/services/email'
```

#### Types:
```typescript
// Before
import { Gallery } from '@/lib/types/gallery'
import { MediaFile } from '@/lib/types/media'

// After
import { Gallery, MediaFile } from '@/types'
```

## 🗂️ File Location Changes

### Database Files
- `src/helpers/clientDb.ts` → `src/lib/database/clientDb.ts`
- `migrations/` → `src/lib/database/migrations/`

### Service Files
- `src/lib/aws/` → `src/lib/services/aws/`
- `src/lib/email/` → `src/lib/services/email/`
- `src/lib/gemini.ts` → `src/lib/services/ai/gemini.ts`

### Utility Files
- `src/helpers/utils.ts` → `src/lib/utils/`
- `src/helpers/files.ts` → `src/lib/utils/fileUtils.ts`
- `src/helpers/qrCode.ts` → `src/lib/utils/qrCode.ts`

### Type Files
- `src/lib/types/` → `src/types/`

### Style Files
- `src/app/globals.css` → `src/styles/globals.css`
- `src/app/page.module.scss` → `src/styles/components/page.module.scss`

## 🚀 New Features

### Barrel Exports
Components and utilities now use barrel exports for cleaner imports:

```typescript
// Import multiple components at once
import { Button, Input, Loading } from '@/components/ui'

// Import utilities
import { formatDate, slugify, isValidEmail } from '@/lib/utils'

// Import types
import { Gallery, MediaFile, ApiResponse } from '@/types'
```

### Custom Hooks
Custom React hooks are now in a dedicated directory:

```typescript
// New custom hooks
import { useAuth, useGallery, useMedia } from '@/hooks'

// Example usage
const { user, login, logout } = useAuth()
const { galleries, createGallery } = useGallery()
const { uploadFile, deleteFile } = useMedia()
```

### Enhanced Type Safety
New type definitions provide better type safety:

```typescript
import { ApiResponse, Gallery, MediaFile } from '@/types'

// Better typed API responses
const response: ApiResponse<Gallery[]> = await fetchGalleries()
```

## 🔍 Finding Your Files

### Quick Reference
Use this table to find where your files moved:

| Old Location | New Location |
|-------------|-------------|
| `src/components/Button/` | `src/components/ui/button/` |
| `src/components/MediaGallery/` | `src/components/features/media/MediaGallery/` |
| `src/helpers/api/` | `src/lib/services/api/` |
| `src/helpers/utils.ts` | `src/lib/utils/` |
| `src/lib/types/` | `src/types/` |
| `src/lib/aws/` | `src/lib/services/aws/` |
| `migrations/` | `src/lib/database/migrations/` |
| `src/app/globals.css` | `src/styles/globals.css` |

## 🛠️ Step-by-Step Migration

### 1. Update Imports
Replace old import paths with new ones using the examples above.

### 2. Update Component References
Change component imports to use barrel exports where available.

### 3. Update Type Imports
Move type imports to use the new `/types` directory.

### 4. Update Utility Imports
Change utility imports to use the new organized structure.

### 5. Update Service Imports
Move service imports to use the new `/services` directory.

### 6. Test Your Changes
Run `pnpm run dev` to ensure everything works correctly.

## 💡 Benefits of the New Structure

1. **Better Organization**: Files are grouped by purpose and feature
2. **Improved Scalability**: Easy to add new features without cluttering
3. **Enhanced Developer Experience**: Cleaner imports and better discoverability
4. **Better Maintainability**: Logical grouping makes code easier to maintain
5. **Improved Performance**: Better tree-shaking and bundle optimization

## 🆘 Common Issues

### Import Errors
If you encounter import errors:
1. Check the new file location in the structure
2. Update the import path using the new aliases
3. Ensure the file uses proper exports

### Type Errors
If you encounter type errors:
1. Check if types have been moved to `src/types/`
2. Update import paths to use `@/types`
3. Ensure proper type exports

### Component Errors
If components aren't found:
1. Check the new component location
2. Use barrel exports where available
3. Update import paths to use new structure

## 📞 Need Help?

If you encounter issues during migration:
1. Check the [Project Structure](PROJECT_STRUCTURE.md) documentation
2. Review the [API Reference](API_REFERENCE.md) for updated imports
3. Look at the new file structure in your IDE
4. Create an issue if you need assistance

## 🎉 Conclusion

The new structure provides a solid foundation for scaling the application while maintaining clean, organized code. The migration might require some effort upfront, but the benefits in terms of maintainability and developer experience are significant.

Happy coding! 🚀