// API configuration and fallback handling

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  fallbackToLocalStorage: process.env.NODE_ENV === 'development',
}

export function handleApiError(error: any, fallbackData?: any) {
  console.error('API Error:', error)
  
  if (API_CONFIG.fallbackToLocalStorage && fallbackData !== undefined) {
    console.warn('Falling back to localStorage data')
    return fallbackData
  }
  
  throw error
}
