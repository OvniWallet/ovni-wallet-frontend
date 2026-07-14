export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  country_of_residence: string
  timezone: string
  kyc_status?: 'PENDING' | 'VERIFIED' | 'REJECTED'
  created_at?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  country_code: string
  timezone: string
}

export interface RegisterResponse {
  user: User
}

export interface RefreshResponse {
  access_token: string
  refresh_token: string
}

export interface LogoutResponse {
  message: string
}

export interface ApiResponse<T> {
  status: 'success'
  data: T
}