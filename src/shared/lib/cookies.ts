// Ключи для cookies
export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

// Функции для работы с cookies на клиенте
export const clientCookies = {
  set: (name: string, value: string, options?: { expires?: number; path?: string }) => {
    if (typeof window === 'undefined') {
      return;
    }

    let cookieString = `${name}=${value}`;

    if (options?.expires) {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    }

    if (options?.path) {
      cookieString += `; path=${options.path}`;
    }

    cookieString += '; SameSite=Strict; Secure';

    document.cookie = cookieString;
  },

  get: (name: string): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }

    return null;
  },

  remove: (name: string, path?: string) => {
    if (typeof window === 'undefined') {
      return;
    }

    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;

    if (path) {
      cookieString += `; path=${path}`;
    }

    document.cookie = cookieString;
  },
};

// Интерфейс для JWT payload
interface JWTPayload {
  exp: number; // время истечения (Unix timestamp)
  iat: number; // время создания (Unix timestamp)
  user_id?: string | number;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

// Функция для декодирования JWT токена
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // JWT состоит из трех частей, разделенных точками
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Декодируем payload (вторая часть)
    const payload = parts[1];

    // Добавляем padding если необходимо
    const paddedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(paddedPayload);

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
};

// Функция для проверки валидности токена
export const isTokenValid = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload) {
    return false;
  }

  // Проверяем время истечения
  const now = Math.floor(Date.now() / 1000); // текущее время в секундах
  return payload.exp > now;
};

// Функция для получения информации о токене
export const getTokenInfo = (
  token: string
): {
  isValid: boolean;
  expiresAt: Date | null;
  issuedAt: Date | null;
  payload: JWTPayload | null;
} => {
  const payload = decodeJWT(token);

  if (!payload) {
    return {
      isValid: false,
      expiresAt: null,
      issuedAt: null,
      payload: null,
    };
  }

  const now = Math.floor(Date.now() / 1000);
  const isValid = payload.exp > now;

  return {
    isValid,
    expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
    issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
    payload,
  };
};

// Функция для получения времени до истечения токена
export const getTokenTimeLeft = (token: string): number => {
  const payload = decodeJWT(token);
  if (!payload) {
    return 0;
  }

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
};

// Универсальная функция для получения токена
export const getToken = (type: 'access' | 'refresh'): string | null => {
  const cookieName = type === 'access' ? COOKIE_KEYS.ACCESS_TOKEN : COOKIE_KEYS.REFRESH_TOKEN;
  return clientCookies.get(cookieName);
};

// Функция для проверки валидности токена из cookies
export const validateTokenFromCookies = (type: 'access' | 'refresh'): boolean => {
  const token = getToken(type);
  if (!token) {
    return false;
  }

  return isTokenValid(token);
};

// Функция для получения полной информации о токене из cookies
export const getTokenInfoFromCookies = (type: 'access' | 'refresh') => {
  const token = getToken(type);
  if (!token) {
    return null;
  }

  return getTokenInfo(token);
};

// Функция для сохранения токенов
export const setTokens = (accessToken: string, refreshToken: string) => {
  // Сохраняем токены в cookies
  clientCookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
    expires: 1, // 1 день
    path: '/',
  });

  clientCookies.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
    expires: 7, // 7 дней
    path: '/',
  });
};

// Функция для очистки токенов
export const clearTokens = () => {
  clientCookies.remove(COOKIE_KEYS.ACCESS_TOKEN, '/');
  clientCookies.remove(COOKIE_KEYS.REFRESH_TOKEN, '/');
};

// Функция для установки токена в cookies (alias для setTokens)
export const setTokenInCookies = (accessToken: string, refreshToken: string) => {
  setTokens(accessToken, refreshToken);
};

// Функция для удаления токенов из cookies (alias для clearTokens)
export const removeTokenFromCookies = () => {
  clearTokens();
};
