// Базовые типы для API ответов
export interface ApiResponse<T = unknown> {
  count: number;
  next: string | null;
  page_info: {
    current_page: number;
    total_pages: number;
    page_size: number;
    has_next: boolean;
    has_previous: boolean;
  };
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  field?: string;
  code?: string;
  detail?: string;
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
  user: import('@/entities/user').User;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}

// Удаляем дублирующий интерфейс User, используем из entities
