import axios from 'axios'
import { config } from '../config/env'

export const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    console.log('Adicionando token na requisição:', token ? 'existe' : 'não existe')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Erro no interceptor de request:', error)
    return Promise.reject(error)
  }
)

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', response.status)
    return response
  },
  async (error) => {
    console.log('Erro na resposta:', error.response?.status)
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Tentando refresh token...')
      originalRequest._retry = true

      try {
        const authService = (await import('../services/auth.service')).authService
        await authService.refreshToken()
        
        const newToken = authService.getToken()
        console.log('Novo token obtido:', newToken ? 'existe' : 'não existe')
        
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Erro no refresh:', refreshError)
        if (refreshError instanceof Error && refreshError.message === 'Token expirado') {
          console.log('Token expirado, redirecionando para login')
          localStorage.removeItem('authToken')
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api 