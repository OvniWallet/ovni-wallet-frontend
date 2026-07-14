import { httpClient } from './httpClient'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/features/auth/types'

const ACCESS_TOKEN_TTL_SECONDS = 7200

export const authApi = {
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    const response = await httpClient.post('/auth/register', {
      email: payload.email,
      password: payload.password,
      first_name: payload.first_name,
      last_name: payload.last_name,
      country_code: payload.country_of_residence,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })

    const user = response.data.data.user

    return {
      user_id: user.id,
      email: user.email,
      wallet_id: undefined,
    } as unknown as RegisterResponse
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post('/auth/login', credentials)
    const data = response.data.data

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: ACCESS_TOKEN_TTL_SECONDS,
    }
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await httpClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    })
    const data = response.data.data

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: ACCESS_TOKEN_TTL_SECONDS,
    }
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) return
    await httpClient.post('/auth/logout', { refresh_token: refreshToken })
  },
}