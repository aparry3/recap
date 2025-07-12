// Media Types
export interface MediaFile {
  id: string
  filename: string
  url: string
  thumbnailUrl?: string
  fileSize: number
  mimeType: string
  width?: number
  height?: number
  createdAt: Date
}

export interface MediaUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}