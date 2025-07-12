# Recap - Collaborative Photo Galleries
## Complete API Documentation

### Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Data Types & Models](#data-types--models)
4. [REST API Endpoints](#rest-api-endpoints)
5. [Client Libraries](#client-libraries)
6. [React Components](#react-components)
7. [Utilities & Helpers](#utilities--helpers)
8. [Database Schema](#database-schema)
9. [Examples & Usage](#examples--usage)

---

## Overview

Recap is a collaborative photo galleries application built with Next.js 14, TypeScript, and PostgreSQL. It enables users to create shared photo galleries for events like weddings, with features including:

- **Multi-user photo sharing** with albums and galleries
- **AI-powered features** using Google Generative AI
- **Cloud storage** with AWS S3 integration
- **Payment processing** via Stripe
- **Email notifications** through SendGrid
- **PWA capabilities** for mobile app-like experience
- **QR code generation** for easy gallery sharing

---

## Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Kysely ORM
- **Database**: PostgreSQL with Vercel Postgres
- **Storage**: AWS S3 for media files
- **Services**: Stripe, SendGrid, Google Generative AI
- **Deployment**: Vercel

### Project Structure
```
src/
├── app/                 # Next.js app router
│   ├── api/            # API endpoints
│   ├── components/     # App-specific components
│   └── [pages]/        # Route pages
├── components/         # Reusable UI components
├── helpers/           # Helper functions and API clients
├── lib/               # Core libraries and utilities
│   ├── db/           # Database services
│   ├── types/        # TypeScript type definitions
│   └── [services]/   # External service integrations
```

---

## Data Types & Models

### Core Entities

#### Gallery
```typescript
interface GalleryTable {
    id: string
    name: string
    path: string           // URL path for gallery
    date?: Date           // Event date
    personId: string      // Creator ID
    created: Date
    password: string      // Access password
    zola?: string        // Zola website URL
    theknot?: string     // The Knot website URL
}

type Gallery = Selectable<GalleryTable>
type GalleryUpdate = Updateable<GalleryTable>
type NewGallery = Insertable<GalleryTable>
type NewGalleryData = Omit<NewGallery, 'id'|'personId'|'created'> & {personId?: string}
```

#### Media
```typescript
interface MediaTable {
    id: string
    url: string           // S3 URL
    preview: string       // Thumbnail URL
    isPrivate?: boolean
    height?: number
    width?: number
    personId: string      // Uploader ID
    latitude?: number     // GPS coordinates
    longitude?: number
    contentType: string   // MIME type
    created?: Date
    uploaded?: boolean    // Upload completion status
}

type Media = Selectable<MediaTable>
type MediaUpdate = Updateable<MediaTable>
type NewMedia = Insertable<MediaTable>
```

#### Album
```typescript
interface AlbumTable {
    id: string
    name: string
    isPrivate?: boolean
    date?: Date
    personId: string      // Creator ID
    galleryId: string
    created: Date
}

type Album = Selectable<AlbumTable>
type AlbumUpdate = Updateable<AlbumTable>
type NewAlbum = Insertable<AlbumTable>
```

#### Person
```typescript
interface PersonTable {
    id: string
    name: string
    email?: string
    phone?: string
    created: Date
}

type Person = Selectable<PersonTable>
type PersonUpdate = Updateable<PersonTable>
type NewPerson = Insertable<PersonTable>
```

#### Additional Types
- **Like**: User likes on media
- **Tag**: Media tagging system
- **WeddingEvent**: Wedding-specific events
- **Verification**: Email/phone verification

---

## REST API Endpoints

### Galleries

#### `POST /api/galleries`
Create a new gallery.

**Request Body:**
```typescript
{
  name: string
  path: string
  date?: Date
  password: string
  zola?: string
  theknot?: string
  personId: string
}
```

**Response:**
```typescript
{
  gallery: Gallery
  images: string[]        // Scraped images from wedding websites
  events?: WeddingEvent[] // Scraped events
}
```

#### `GET /api/galleries/[galleryId]`
Retrieve gallery details.

**Response:**
```typescript
{
  gallery: Gallery
}
```

#### `PUT /api/galleries/[galleryId]`
Update gallery information.

**Request Body:**
```typescript
GalleryUpdate
```

### Media

#### `POST /api/galleries/[galleryId]/media`
Upload new media to gallery.

**Request Body:**
```typescript
{
  contentType: string
  height?: number
  width?: number
  latitude?: number
  longitude?: number
  albumId?: string
  personId: string
}
```

**Response:**
```typescript
{
  media: Media
  presignedUrls: {
    uploadId?: string
    key: string
    large?: string
    small: string
  }
}
```

#### `GET /api/media/[mediaId]`
Get media details with presigned URLs.

**Response:**
```typescript
{
  media: Media
  presignedUrls: PresignedUrls
}
```

#### `PUT /api/media/[mediaId]`
Update media metadata.

**Request Body:**
```typescript
MediaUpdate
```

#### `DELETE /api/media/[mediaId]`
Delete media.

**Response:**
```typescript
{
  success: boolean
}
```

### Albums

#### `POST /api/galleries/[galleryId]/albums`
Create album in gallery.

**Request Body:**
```typescript
{
  name: string
  personId: string
  galleryId: string
}
```

#### `GET /api/galleries/[galleryId]/albums`
List albums in gallery.

**Response:**
```typescript
{
  albums: AlbumMediaData[] // Albums with media count and recent photos
}
```

#### `DELETE /api/albums/[albumId]`
Delete album.

#### `POST /api/albums/[albumId]/media`
Add media to album.

**Request Body:**
```typescript
{
  mediaIds: string[]
}
```

### People

#### `POST /api/people`
Create or update person.

**Request Body:**
```typescript
{
  name: string
  email?: string
  phone?: string
}
```

#### `GET /api/people/[personId]`
Get person details.

### Likes

#### `POST /api/likes`
Like/unlike media.

**Request Body:**
```typescript
{
  mediaId: string
  personId: string
}
```

### Payments

#### `POST /api/create-payment-intent`
Create Stripe payment intent.

**Request Body:**
```typescript
{
  amount: number
  currency: string
}
```

---

## Client Libraries

### Gallery Client (`/helpers/api/galleryClient.ts`)

#### `createGallery(newGallery: NewGalleryData, personId: string): Promise<GalleryWithImagesAndEvents>`
Creates a new gallery with optional wedding website scraping.

**Example:**
```typescript
const gallery = await createGallery({
  name: "John & Jane's Wedding",
  path: "john-jane-wedding",
  password: "love123",
  zola: "https://zola.com/john-jane"
}, personId)
```

#### `updateGallery(galleryId: string, galleryUpdate: GalleryUpdate): Promise<GalleryWithImagesAndEvents>`
Updates gallery information.

#### `fetchGallery(galleryId: string): Promise<Gallery>`
Retrieves gallery details.

#### `addPersonToGallery(galleryId: string, personId: string): Promise<GalleryPerson>`
Adds a person to gallery access list.

### Media Client (`/helpers/api/mediaClient.ts`)

#### `createMedia(media: NewMediaData, galleryId: string, albumId?: string): Promise<Media & {presignedUrls: PresignedUrls}>`
Creates media entry and returns upload URLs.

**Example:**
```typescript
const media = await createMedia({
  contentType: "image/jpeg",
  height: 1920,
  width: 1080,
  personId: "user123"
}, galleryId, albumId)

// Use presignedUrls.large for upload
```

#### `fetchMedia(id: string): Promise<Media & {presignedUrls: PresignedUrls}>`
Gets media with download URLs.

#### `updateMedia(id: string, mediaUpdate: MediaUpdate): Promise<Media>`
Updates media metadata.

#### `deleteMedia(id: string): Promise<boolean>`
Deletes media and S3 files.

#### `fetchGalleryImages(galleryId: string): Promise<Media[]>`
Lists all media in gallery.

#### `convertImageToWebP(imageFile: File | Blob, maxDimension: number = 500): Promise<Blob>`
Converts and resizes images to WebP format.

**Example:**
```typescript
const webpBlob = await convertImageToWebP(imageFile, 800)
```

#### `extractWebPPreview(videoFile: File): Promise<Blob>`
Extracts video thumbnail as WebP.

### Album Client (`/helpers/api/albumClient.ts`)

#### `createAlbum(galleryId: string, personId: string, name: string): Promise<Album>`
Creates new album.

#### `fetchAlbums(galleryId: string): Promise<AlbumMediaData[]>`
Lists albums with media counts.

#### `addMediaToAlbum(albumId: string, mediaIds: string[]): Promise<Media[]>`
Adds media to album.

#### `removeMediaIdsFromAlbum(albumId: string, mediaIds: string[]): Promise<Media[]>`
Removes media from album.

### Person Client (`/helpers/api/personClient.ts`)

#### `createPerson(person: NewPersonData): Promise<Person>`
Creates or updates person.

#### `fetchGalleryPeople(galleryId: string): Promise<GalleryPersonData[]>`
Lists people in gallery with contribution stats.

---

## React Components

### Core UI Components

#### `<Button>`
Reusable button component with consistent styling.

**Props:**
```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}
```

**Example:**
```jsx
<Button onClick={handleClick} disabled={loading}>
  Upload Photos
</Button>
```

#### `<Input>`
Form input component with validation.

#### `<Loading>`
Loading spinner component.

### Feature Components

#### `<Upload>`
Advanced file upload component with drag-and-drop, preview, and progress tracking.

**Features:**
- Multiple file selection
- Image/video preview
- Upload progress
- WebP conversion
- Album assignment

#### `<MediaGallery>`
Photo/video gallery with masonry layout.

**Features:**
- Responsive grid
- Lazy loading
- Lightbox modal
- Like functionality
- Album filtering

#### `<AlbumSelect>`
Album selection dropdown with creation option.

#### `<QrCode>`
QR code generator for gallery sharing.

#### `<LikeButton>`
Like/unlike button with animation.

#### `<ConfirmDelete>`
Confirmation modal for destructive actions.

### Layout Components

#### `<PersonPage>`
User profile and contribution view.

#### `<CreateAlbum>`
Album creation form.

#### `<Notification>`
Toast notification system.

#### `<SyncStatus>`
Offline sync status indicator.

#### `<RefreshStatusComponent>`
Pull-to-refresh component.

---

## Utilities & Helpers

### QR Code Generator (`/helpers/qrCode.ts`)

#### `generateCustomQRCodePNG(text: string, options: QRCodeOptions): Promise<string>`
Generates customized QR codes with embedded logos.

**Options:**
```typescript
interface QRCodeOptions {
  size: number              // Dimensions in pixels
  foregroundColor: string   // Module color
  backgroundColor: string   // Background color
  imageSrc?: string        // Center logo URL
  imageSize?: number       // Logo size ratio (0-1)
}
```

**Example:**
```typescript
const qrCode = await generateCustomQRCodePNG(
  "https://recap.app/wedding123",
  {
    size: 400,
    foregroundColor: "#2563eb",
    backgroundColor: "#ffffff",
    imageSrc: "/logo.svg",
    imageSize: 0.2
  }
)
```

### File Utilities (`/helpers/files.ts`)

#### `uploadFileToS3(file: File, presignedUrl: string): Promise<void>`
Uploads file to S3 using presigned URL.

#### `generateThumbnail(file: File): Promise<Blob>`
Generates image thumbnails.

### Client Database (`/helpers/clientDb.ts`)

#### Offline Storage with IndexedDB
Provides offline caching for media and gallery data using Dexie.

**Tables:**
- `mediaCache`: Cached media metadata
- `uploadQueue`: Pending uploads
- `galleryCache`: Gallery information

### Share Utilities (`/helpers/share.ts`)

#### `shareGallery(gallery: Gallery): Promise<void>`
Uses Web Share API to share gallery links.

### General Utils (`/helpers/utils.ts`)

#### `formatDate(date: Date): string`
Formats dates for display.

#### `generateId(): string`
Generates unique IDs.

#### `validateEmail(email: string): boolean`
Email validation.

---

## Database Schema

### Tables

```sql
-- Core entities
CREATE TABLE gallery (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    path VARCHAR UNIQUE NOT NULL,
    date TIMESTAMP,
    person_id VARCHAR NOT NULL,
    created TIMESTAMP DEFAULT NOW(),
    password VARCHAR NOT NULL,
    zola VARCHAR,
    theknot VARCHAR
);

CREATE TABLE person (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR,
    phone VARCHAR,
    created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE media (
    id VARCHAR PRIMARY KEY,
    url VARCHAR NOT NULL,
    preview VARCHAR NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    height INTEGER,
    width INTEGER,
    person_id VARCHAR NOT NULL,
    latitude DECIMAL,
    longitude DECIMAL,
    content_type VARCHAR NOT NULL,
    created TIMESTAMP DEFAULT NOW(),
    uploaded BOOLEAN DEFAULT FALSE
);

CREATE TABLE album (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    date TIMESTAMP,
    person_id VARCHAR NOT NULL,
    gallery_id VARCHAR NOT NULL,
    created TIMESTAMP DEFAULT NOW()
);

-- Relationship tables
CREATE TABLE gallery_media (
    gallery_id VARCHAR,
    media_id VARCHAR,
    PRIMARY KEY (gallery_id, media_id)
);

CREATE TABLE gallery_person (
    gallery_id VARCHAR,
    person_id VARCHAR,
    cover_photo_id VARCHAR,
    receive_messages BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (gallery_id, person_id)
);

CREATE TABLE album_media (
    album_id VARCHAR,
    media_id VARCHAR,
    PRIMARY KEY (album_id, media_id)
);

CREATE TABLE likes (
    id VARCHAR PRIMARY KEY,
    media_id VARCHAR NOT NULL,
    person_id VARCHAR NOT NULL,
    created TIMESTAMP DEFAULT NOW()
);
```

---

## Examples & Usage

### Complete Gallery Creation Workflow

```typescript
// 1. Create person
const person = await createPerson({
  name: "John Doe",
  email: "john@example.com"
})

// 2. Create gallery
const gallery = await createGallery({
  name: "John & Jane's Wedding",
  path: "john-jane-wedding", 
  password: "love123",
  date: new Date("2024-06-15")
}, person.id)

// 3. Create album
const album = await createAlbum(
  gallery.id,
  person.id,
  "Ceremony"
)

// 4. Upload media
const media = await createMedia({
  contentType: "image/jpeg",
  height: 1920,
  width: 1080,
  personId: person.id
}, gallery.id, album.id)

// 5. Upload file to S3
await uploadFileToS3(imageFile, media.presignedUrls.large)
```

### Media Processing Pipeline

```typescript
// Convert image to WebP
const webpImage = await convertImageToWebP(originalFile, 1200)

// Extract video thumbnail
const videoThumbnail = await extractWebPPreview(videoFile)

// Create media entries
const [imageMedia, videoMedia] = await Promise.all([
  createMedia({
    contentType: "image/webp",
    personId: userId
  }, galleryId),
  createMedia({
    contentType: "video/mp4", 
    personId: userId
  }, galleryId)
])

// Upload files
await Promise.all([
  uploadFileToS3(webpImage, imageMedia.presignedUrls.large),
  uploadFileToS3(videoFile, videoMedia.presignedUrls.large),
  uploadFileToS3(videoThumbnail, videoMedia.presignedUrls.small)
])
```

### Gallery Sharing with QR Code

```typescript
// Generate QR code for gallery
const qrCodeData = await generateCustomQRCodePNG(
  `${process.env.BASE_URL}/${gallery.path}`,
  {
    size: 400,
    foregroundColor: "#1f2937",
    backgroundColor: "#ffffff", 
    imageSrc: "/recap-logo.svg",
    imageSize: 0.15
  }
)

// Display in component
<img src={qrCodeData} alt="Gallery QR Code" />
```

### Offline Support

```typescript
// Cache gallery data
await cacheGallery(gallery)

// Queue upload for when online
await queueUpload(mediaFile, galleryId)

// Sync when connection restored
await syncPendingUploads()
```

### Real-time Updates

```typescript
// Listen for new media
useEffect(() => {
  const interval = setInterval(async () => {
    const latestMedia = await fetchGalleryImages(galleryId)
    setMedia(latestMedia)
  }, 5000)
  
  return () => clearInterval(interval)
}, [galleryId])
```

---

## Error Handling

### API Error Responses

All API endpoints return consistent error responses:

```typescript
{
  error: string          // Human-readable error message
  code?: string         // Error code for programmatic handling
  details?: any         // Additional error context
}
```

### Common Error Codes

- `INVALID_GALLERY_ID`: Gallery not found
- `UNAUTHORIZED`: Invalid authentication
- `UPLOAD_FAILED`: S3 upload error
- `INVALID_FILE_TYPE`: Unsupported media format
- `QUOTA_EXCEEDED`: Storage limit reached

### Client Error Handling

```typescript
try {
  const media = await createMedia(mediaData, galleryId)
} catch (error) {
  if (error.code === 'QUOTA_EXCEEDED') {
    showUpgradePrompt()
  } else {
    showErrorNotification(error.message)
  }
}
```

---

## Environment Variables

Required environment variables for deployment:

```bash
# Database
POSTGRES_HOST=
POSTGRES_DATABASE=
POSTGRES_PASSWORD=
POSTGRES_USER=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET_NAME=

# Stripe
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# Google AI
GOOGLE_AI_API_KEY=

# App
BASE_URL=
NEXTAUTH_SECRET=
```

---

This documentation covers all public APIs, functions, and components in the Recap collaborative photo galleries application. For additional details on specific implementations, refer to the source code or contact the development team.