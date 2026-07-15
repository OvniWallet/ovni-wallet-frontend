import { httpClient } from './httpClient'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/features/auth/types'

export const authApi = {
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    // Alianeamos los campos exactamente con el DTO esperado por el Backend
    const response = await httpClient.post('/auth/register', {
      email: payload.email,
      password: payload.password,
      first_name: payload.first_name,
      last_name: payload.last_name,
      country_code: payload.country_code, // Aseguramos ISO-3 (ej. "ARG")
      timezone: payload.timezone,
    })

    // Suponiendo que el backend responde con { status: "success", data: { user: { id, email } } }
    const user = response.data.data.user

    return {
      user_id: user.id,
      email: user.email,
      wallet_id: undefined,
    }
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post('/auth/login', credentials)
    const data = response.data.data

    // Eliminamos la constante estática de TTL local para usar la respuesta directa del Backend
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
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
    }
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) return
    await httpClient.post('/auth/logout', { refresh_token: refreshToken })
  },
}