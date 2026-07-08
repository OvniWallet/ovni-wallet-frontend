import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/features/auth/types'

export const authApi = {
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    // Simulamos retraso de red
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      token: 'fake-jwt-token-ovniwallet',
      refresh_token: 'fake-refresh-token-ovniwallet',
      user: {
        id: 'user-mock-123',
        email: payload.email,
        name: 'Usuario Mock',
      },
    } as unknown as RegisterResponse
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      token: 'fake-jwt-token-ovniwallet',
      refresh_token: 'fake-refresh-token-ovniwallet',
      user: {
        id: 'user-mock-123',
        email: credentials.email,
        name: 'Santiago Dev',
      },
    } as unknown as LoginResponse
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      token: 'fake-jwt-token-ovniwallet',
      refresh_token: refreshToken,
      user: {
        id: 'user-mock-123',
        email: 'santiago@ovni.com',
        name: 'Santiago Dev',
      },
    } as unknown as LoginResponse
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
  },
}