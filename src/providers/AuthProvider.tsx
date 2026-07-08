import { useState, type ReactNode } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { authService } from '@/features/auth/services/auth.service'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '@/features/auth/types'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const isAuthenticated = Boolean(localStorage.getItem('access_token'))

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    setLoading(true)

    try {
      const response = await authService.login(credentials)

      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)

      return response
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    data: RegisterRequest,
  ): Promise<RegisterResponse> => {
    setLoading(true)

    try {
      return await authService.register(data)
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setLoading(true)

    try {
      await authService.logout()
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      setUser(null)
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}