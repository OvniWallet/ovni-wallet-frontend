import { httpClient } from './httpClient'
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/features/auth/types'

export const authApi = {
  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const response = await httpClient.post<ApiResponse<RegisterResponse>>(
      '/auth/register',
      payload,
    )

    return response.data.data
  },

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials,
    )

    return response.data.data
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const response = await httpClient.post<ApiResponse<RefreshResponse>>(
      '/auth/refresh',
      {
        refresh_token: refreshToken,
      },
    )

    return response.data.data
  },

  async logout(refreshToken: string): Promise<LogoutResponse> {
    const response = await httpClient.post<ApiResponse<LogoutResponse>>(
      '/auth/logout',
      {
        refresh_token: refreshToken,
      },
    )

    return response.data.data
  },
}