import { apiRequest } from './config'

export interface LoginCredentials {
  email: string
  password: string
  user_type?: 'user' | 'student'
}

export interface SignupData {
  email: string
  password: string
  password_confirmation: string
  first_name: string
  last_name: string
  profile_type?: number // 2 for parent, 3 for teacher
}

export interface User {
  id: string
  email: string
  token: string
  profile?: {
    id: string
    first_name: string
    last_name: string
    profile_type: number
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiRequest<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response))
    }
    
    return response
  },

  async signup(data: SignupData): Promise<User> {
    const response = await apiRequest<User>('/auth', {
      method: 'POST',
      body: JSON.stringify({ user: data }),
    })
    
    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response))
    }
    
    return response
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', {
        method: 'DELETE',
      })
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser()
  },
}