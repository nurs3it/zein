import { ApiUser } from './api';

export interface AuthState {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T = unknown> {
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
