// Validation Utility Functions
export const validateRequired = (value: unknown, fieldName: string): string | null => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`
  }
  return null
}

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email) {
    return 'Email is required'
  }
  
  if (!emailRegex.test(email)) {
    return 'Invalid email format'
  }
  
  return null
}

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`
  }
  return null
}

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters long`
  }
  return null
}

export const validateFileSize = (file: File, maxSize: number): string | null => {
  if (file.size > maxSize) {
    return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
  }
  return null
}

export const validateFileType = (file: File, allowedTypes: string[]): string | null => {
  if (!allowedTypes.includes(file.type)) {
    return `File type ${file.type} is not allowed`
  }
  return null
}