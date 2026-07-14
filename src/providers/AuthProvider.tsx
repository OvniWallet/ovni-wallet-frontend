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

function getStoredUser(): User | null {
  const storedUser = localStorage.getItem('auth_user')

  if (!storedUser) return null

  try {
    return JSON.parse(storedUser) as User
  } catch {
    localStorage.removeItem('auth_user')
    return null
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(getStoredUser)
  const [loading, setLoading] = useState(false)

  const isAuthenticated =
    Boolean(user) && Boolean(localStorage.getItem('access_token'))

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    setLoading(true)

    try {
      const response = await authService.login(credentials)

      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      localStorage.setItem('auth_user', JSON.stringify(response.user))
      localStorage.setItem('user', JSON.stringify(response.user))

      setUser(response.user)

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
      localStorage.removeItem('auth_user')
      localStorage.removeItem('user')

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