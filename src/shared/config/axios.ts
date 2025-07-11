import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getToken, clearTokens } from '@/shared/lib/cookies';
import { API_CONFIG } from './api-config';

// Создание экземпляра axios
const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const defaultConfig = API_CONFIG.getAxiosConfig();

  const apiClient = axios.create({
    ...defaultConfig,
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

      // Логирование запросов (в продакшене тоже для отладки)
      // eslint-disable-next-line no-console
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        fullUrl: `${config.baseURL}${config.url}`,
        headers: Object.fromEntries(
          Object.entries(config.headers || {}).filter(
            ([key]) => !key.toLowerCase().includes('authorization')
          )
        ),
        hasAuth: !!config.headers?.Authorization,
        data: config.data,
        env: process.env.NODE_ENV,
      });
      return config;
    },
    error => {
      // eslint-disable-next-line no-console
      console.error('[API] Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      // Логирование ответов (в продакшене тоже для отладки)
      // eslint-disable-next-line no-console
      console.log(`[API] Response ${response.status}:`, {
        url: response.config.url,
        method: response.config.method,
        status: response.status,
        data: response.data,
        env: process.env.NODE_ENV,
      });
      return response;
    },
    error => {
      // eslint-disable-next-line no-console
      console.error('[API] Response error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        },
      });

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

// Основной API клиент (теперь работает напрямую)
export const apiClient = createApiClient();

// Клиент для SSR (без credentials)
export const apiClientSSR = createApiClient({
  withCredentials: false,
});

// Хелпер для создания API клиента с кастомными настройками
export const createCustomApiClient = (config: AxiosRequestConfig): AxiosInstance => {
  return createApiClient(config);
};

// Экспорт базового URL для использования в других частях приложения
export const BASE_URL = API_CONFIG.getBaseUrl();

// Вспомогательные функции для типизации
export type ApiClient = typeof apiClient;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse<T = any> = AxiosResponse<T>;
export type ApiError = {
  response?: {
    status: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  };
  message: string;
};
