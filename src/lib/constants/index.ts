// Application Constants
export const APP_NAME = 'Recap'
export const APP_DESCRIPTION = 'Collaborative Photo Galleries'

// API Constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
export const API_TIMEOUT = 10000

// File Upload Constants
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/quicktime'
]

// Gallery Constants
export const MAX_GALLERIES_PER_USER = 10
export const MAX_MEDIA_PER_GALLERY = 1000

// Routes
export const ROUTES = {
  HOME: '/',
  GALLERIES: '/galleries',
  UPLOAD: '/upload',
  PROFILE: '/profile',
  SETTINGS: '/settings'
} as const