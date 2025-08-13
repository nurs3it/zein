// Конфигурация API - умное переключение между прямыми запросами и прокси

export const API_CONFIG = {
  // В продакшене используем прокси для решения Mixed Content проблем
  // В dev режиме используем прямые запросы
  API_URL:
    process.env.NODE_ENV === 'production'
      ? '/api/proxy'
      : process.env.NEXT_PUBLIC_API_URL || 'http://oneki.kz:8002/api',

  // Получить базовый URL для API
  getBaseUrl(): string {
    return this.API_URL;
  },

  getMediaUrl(): string {
    return process.env.NEXT_PUBLIC_MEDIA_URL || 'http://oneki.kz:8002';
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

  // Проверка, используется ли прокси
  isUsingProxy(): boolean {
    return process.env.NODE_ENV === 'production';
  },

  // Получить информацию о режиме работы
  getMode(): 'direct' | 'proxy' {
    return this.isUsingProxy() ? 'proxy' : 'direct';
  },
};

// Логирование конфигурации для отладки
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('[API_CONFIG] Конфигурация API:', {
    API_URL: API_CONFIG.API_URL,
    mode: API_CONFIG.getMode(),
    isUsingProxy: API_CONFIG.isUsingProxy(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
  });
}

export default API_CONFIG;
