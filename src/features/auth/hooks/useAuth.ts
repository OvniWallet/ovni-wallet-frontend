import { useState } from 'react'
import { authService } from '../services/auth.service'
import type {
  LoginRequest,
  RegisterRequest,
  User,
} from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (credentials: LoginRequest) => {
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

  const register = async (data: RegisterRequest) => {
    setLoading(true)

    try {
      return await authService.register(data)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    setUser(null)
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
  }
}