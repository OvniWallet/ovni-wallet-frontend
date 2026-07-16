import { type ReactNode, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { authService } from '@/features/auth/services/auth.service'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE_KEYS } from '@/constants/storage-keys'
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
  const [user, setUser] = useLocalStorage<User | null>(STORAGE_KEYS.USER, null)
  const [loading, setLoading] = useState(false)

  const isAuthenticated = Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN))

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    setLoading(true)

    try {
      const response = await authService.login(credentials)

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token)
      if (response.user) {
        setUser(response.user)
      }

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
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
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
