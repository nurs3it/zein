// Конфигурация API - прямые запросы

export const API_CONFIG = {
  // Базовый URL для API
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://oneki.kz:8002/api',

  // Получить базовый URL для API
  getBaseUrl(): string {
    return this.API_URL;
  },

  // Настройки для axios
  getAxiosConfig() {
    return {
      baseURL: this.API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: false,
    };
  },
};

// Логирование конфигурации для отладки
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('[API_CONFIG] Прямые запросы к API:', {
    API_URL: API_CONFIG.API_URL,
    mode: 'direct',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
  });
}

export default API_CONFIG;
