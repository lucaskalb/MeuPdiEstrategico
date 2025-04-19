import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true,
})

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  // O token é enviado automaticamente via cookie HTTP-only
  return config
})

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Tentar refresh token
        await api.get('/api/auth/refresh')
        // Repetir a requisição original
        return api(originalRequest)
      } catch (refreshError) {
        // Se o refresh falhar, redirecionar para login
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api 