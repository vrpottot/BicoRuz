export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  middleName?: string | null
}

export interface AuthResponse {
  state: number
  msg: string
  data?: {
    token: string
    user: User
  }
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  middleName?: string
}

export interface LoginData {
  email: string
  password: string
}
