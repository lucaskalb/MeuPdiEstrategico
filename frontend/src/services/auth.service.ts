import { config } from '../config/env';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';

class AuthService {
  private baseUrl = `${config.apiUrl}/api/auth`;

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer login');
    }

    const result = await response.json();
    this.setToken(result.token);
    return result;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar conta');
    }

    const result = await response.json();
    this.setToken(result.token);
    return result;
  }

  async refreshToken(): Promise<void> {
    const token = this.getToken();
    console.log('Tentando refresh com token:', token ? 'existe' : 'não existe');
    
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await fetch(`${this.baseUrl}/refresh`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    console.log('Resposta do refresh:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.log('Token expirado, removendo...');
        this.logout();
        throw new Error('Token expirado');
      }
      throw new Error('Erro ao atualizar token');
    }

    const result = await response.json();
    this.setToken(result.token);
    console.log('Token atualizado com sucesso');
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const authService = new AuthService(); 