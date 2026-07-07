import { authApi } from '@/api/auth.api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types'

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return authApi.login(credentials)
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return authApi.register(data)
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    return authApi.refresh(refreshToken)
  },

  logout: async (): Promise<void> => {
    return authApi.logout()
  },
}