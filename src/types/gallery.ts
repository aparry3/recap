// Gallery Types
export interface Gallery {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
}

export interface GallerySettings {
  allowUploads: boolean
  maxFileSize: number
  allowedFileTypes: string[]
}