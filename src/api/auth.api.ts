import { httpClient } from './httpClient'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/features/auth/types'

interface ApiResponse<T> {
  status: 'success'
  data: T
}

export const authApi = {
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    const response = await httpClient.post<ApiResponse<RegisterResponse>>(
      '/auth/register',
      payload,
    )

    return response.data.data
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials,
    )

    return response.data.data
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await httpClient.post<ApiResponse<LoginResponse>>(
      '/auth/refresh',
      { refresh_token: refreshToken },
    )

    return response.data.data
  },

  logout: async (): Promise<void> => {
    await httpClient.post('/auth/logout')
  },
}