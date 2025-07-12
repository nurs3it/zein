// Базовые типы для API ответов
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  field?: string;
  code?: string;
}

// Типы для аутентификации
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}

// Типы пользователя
export interface User {
  id: number;
  email: string;
  name: string;
  date_joined: string;
  is_active: boolean;
}
