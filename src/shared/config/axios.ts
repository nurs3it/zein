import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getToken, clearTokens } from '@/shared/lib/cookies';

// Базовый URL для API
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://185.4.180.4:8002/api'
    : 'http://185.4.180.4:8002/api';

// Создание экземпляра axios
const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    withCredentials: true, // Для работы с cookies
    ...config,
  });

  // Request interceptor
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Проверяем, является ли это health endpoint
      const isHealthEndpoint = config.url?.includes('/health');

      // Добавляем токен только если это НЕ health endpoint
      if (!isHealthEndpoint) {
        const token = getToken('access');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Логирование запросов в dev режиме
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
      }
      return config;
    },
    error => {
      console.error('[API] Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      // Логирование ответов в dev режиме
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] Response ${response.status}:`, response.data);
      }
      return response;
    },
    error => {
      console.error('[API] Response error:', error);

      // Обработка ошибок авторизации
      if (error.response?.status === 401) {
        // Проверяем, не является ли это health endpoint
        const isHealthEndpoint = error.config?.url?.includes('/health');

        // Проверяем, не находимся ли уже на страницах авторизации
        const isOnAuthPage =
          typeof window !== 'undefined' &&
          (window.location.pathname === '/sign/in' || window.location.pathname === '/sign/up');

        // Редирект на страницу логина только если:
        // 1. Это не health endpoint
        // 2. Мы не на странице авторизации
        // 3. Мы в браузере
        if (!isHealthEndpoint && !isOnAuthPage && typeof window !== 'undefined') {
          // Очищаем токены при 401 ошибке
          clearTokens();

          // Редирект на страницу входа
          window.location.href = '/sign/in';
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Основной API клиент
export const apiClient = createApiClient();

// Клиент для SSR (без cookies)
export const apiClientSSR = createApiClient({
  withCredentials: false,
});

// Хелпер для создания API клиента с кастомными настройками
export const createCustomApiClient = (config: AxiosRequestConfig): AxiosInstance => {
  return createApiClient(config);
};

// Экспорт базового URL для использования в других частях приложения
export { BASE_URL };

// Вспомогательные функции для типизации
export type ApiClient = typeof apiClient;
export type ApiResponse<T = any> = AxiosResponse<T>;
export type ApiError = {
  response?: {
    status: number;
    data: any;
  };
  message: string;
};
