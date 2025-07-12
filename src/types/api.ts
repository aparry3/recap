// API Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}

export interface ApiError {
  message: string
  code: string
  details?: Record<string, unknown>
}