import { createContext } from 'react'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '@/features/auth/types'

export interface AuthContextValue {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<LoginResponse>
  register: (data: RegisterRequest) => Promise<RegisterResponse>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)