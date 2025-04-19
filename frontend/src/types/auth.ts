export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  nickname: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  nickname: string;
  email: string;
} 