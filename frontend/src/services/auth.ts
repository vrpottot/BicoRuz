import type { User, AuthResponse } from '../types/auth'

const API_BASE_URL = 'http://localhost:3001/api'

export class AuthService {
  private static getToken(): string | null {
    return localStorage.getItem('token')
  }

  private static setToken(token: string): void {
    localStorage.setItem('token', token)
  }

  static removeToken(): void {
    localStorage.removeItem('token')
  }

  static async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    middleName?: string
  ): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, firstName, lastName, middleName }),
    })

    const data = await response.json()

    if (data.state === -1) {
      throw new Error(data.msg || 'Ошибка регистрации')
    }

    if (data.data?.token) {
      this.setToken(data.data.token)
    }

    return data
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (data.state === -1) {
      throw new Error(data.msg || 'Ошибка входа')
    }

    if (data.data?.token) {
      this.setToken(data.data.token)
    }

    return data
  }

  static async getCurrentUser(): Promise<User | null> {
    const token = this.getToken()
    if (!token) {
      return null
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.state === -1) {
        this.removeToken()
        return null
      }

      return data.data?.user || null
    } catch (error) {
      this.removeToken()
      return null
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static logout(): void {
    this.removeToken()
  }
}
