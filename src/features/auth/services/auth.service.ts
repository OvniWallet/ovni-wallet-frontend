import { authApi } from '@/api/auth.api'
import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types'

export const authService = {
  login(credentials: LoginRequest): Promise<LoginResponse> {
    return authApi.login(credentials)
  },

  register(data: RegisterRequest): Promise<RegisterResponse> {
    return authApi.register(data)
  },

  refresh(refreshToken: string): Promise<RefreshResponse> {
    return authApi.refresh(refreshToken)
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token')

    if (!refreshToken) return

    await authApi.logout(refreshToken)
  },
}