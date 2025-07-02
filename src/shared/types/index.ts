export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorInfo {
  componentStack?: string;
  errorBoundary?: boolean;
}

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  timestamp?: string;
}
