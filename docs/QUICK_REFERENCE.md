# Recap API Quick Reference

## Most Common API Patterns

### Gallery Management
```typescript
// Create gallery
const gallery = await createGallery({
  name: "Event Name",
  path: "event-url",
  password: "access123"
}, personId)

// Fetch gallery
const gallery = await fetchGallery(galleryId)
```

### Media Upload Workflow
```typescript
// 1. Create media entry
const media = await createMedia({
  contentType: "image/jpeg",
  height: 1920,
  width: 1080,
  personId: userId
}, galleryId, albumId)

// 2. Convert to WebP (optional)
const webpBlob = await convertImageToWebP(imageFile, 1200)

// 3. Upload to S3
await uploadFileToS3(webpBlob, media.presignedUrls.large)
```

### Album Operations
```typescript
// Create album
const album = await createAlbum(galleryId, personId, "Album Name")

// Add media to album
await addMediaToAlbum(albumId, [mediaId1, mediaId2])

// List albums with media counts
const albums = await fetchAlbums(galleryId)
```

## Key React Components

### Upload Component
```jsx
import Upload from '@/components/Upload'

<Upload 
  galleryId={galleryId}
  albumId={albumId}
  onUploadComplete={handleComplete}
/>
```

### Media Gallery
```jsx
import MediaGallery from '@/components/MediaGallery'

<MediaGallery 
  media={mediaList}
  onLike={handleLike}
  onDelete={handleDelete}
/>
```

### QR Code Generator
```jsx
import QrCode from '@/components/QrCode'

<QrCode 
  url={galleryUrl}
  size={400}
  color="#2563eb"
  logo="/logo.svg"
/>
```

## REST API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/galleries` | Create gallery |
| `GET` | `/api/galleries/[id]` | Get gallery |
| `POST` | `/api/galleries/[id]/media` | Upload media |
| `GET` | `/api/media/[id]` | Get media with URLs |
| `POST` | `/api/galleries/[id]/albums` | Create album |
| `POST` | `/api/albums/[id]/media` | Add media to album |
| `POST` | `/api/likes` | Like/unlike media |
| `POST` | `/api/people` | Create/update person |

## Utility Functions

### File Processing
```typescript
// Convert image to WebP
const webpBlob = await convertImageToWebP(imageFile, maxSize)

// Extract video thumbnail
const thumbnail = await extractWebPPreview(videoFile)

// Generate QR code
const qrCode = await generateCustomQRCodePNG(url, options)
```

### Data Validation
```typescript
// Email validation
const isValid = validateEmail(email)

// Date formatting
const formatted = formatDate(new Date())

// Generate unique ID
const id = generateId()
```

## Error Handling Pattern
```typescript
try {
  const result = await apiCall()
  // Handle success
} catch (error) {
  switch (error.code) {
    case 'QUOTA_EXCEEDED':
      showUpgradePrompt()
      break
    case 'INVALID_FILE_TYPE':
      showFileTypeError()
      break
    default:
      showGenericError(error.message)
  }
}
```

## TypeScript Types Quick Reference

```typescript
// Core types
type Gallery = { id: string, name: string, path: string, ... }
type Media = { id: string, url: string, preview: string, ... }
type Album = { id: string, name: string, galleryId: string, ... }
type Person = { id: string, name: string, email?: string, ... }

// API response types
type GalleryWithImagesAndEvents = Gallery & { images: string[], events?: WeddingEvent[] }
type MediaWithUrls = Media & { presignedUrls: PresignedUrls }
type AlbumMediaData = Album & { count: number, recentMedia?: Media[] }
```

---

For complete documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)