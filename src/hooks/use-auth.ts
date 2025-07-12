// Authentication Hook
import { useState, useEffect } from 'react'

export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  })

  const login = (email: string, password: string) => {
    // TODO: Implement login logic
    console.log('Login:', { email, password })
  }

  const logout = () => {
    // TODO: Implement logout logic
    setAuthState(prev => ({ ...prev, user: null }))
  }

  return {
    ...authState,
    login,
    logout
  }
}