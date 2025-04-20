import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import type { LoginRequest, RegisterRequest } from '../types/auth'

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Verifica se existe token no localStorage ao inicializar
    return !!authService.getToken()
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Se não estiver autenticado e não tiver token, redireciona para login
    if (!isAuthenticated && !authService.getToken()) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data)
    setIsAuthenticated(true)
    navigate('/dashboard')
  }

  const register = async (data: RegisterRequest) => {
    await authService.register(data)
    navigate('/login')
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
} 