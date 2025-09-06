// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

export const apiConfig = {
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
}

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// API request helper
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${apiConfig.baseURL}${endpoint}`
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...getAuthHeaders(),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}