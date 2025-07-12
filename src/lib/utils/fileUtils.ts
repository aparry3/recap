// File Utility Functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
}

export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/')
}

export const isVideoFile = (mimeType: string): boolean => {
  return mimeType.startsWith('video/')
}

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now()
  const extension = getFileExtension(originalName)
  const nameWithoutExt = originalName.replace(`.${extension}`, '')
  
  return `${nameWithoutExt}_${timestamp}.${extension}`
}