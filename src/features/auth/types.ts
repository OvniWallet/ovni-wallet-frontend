export interface User {
  id: string
  email: string
  name?: string
  first_name?: string
  last_name?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
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
  user_id: string
  email: string
  wallet_id?: string   
}