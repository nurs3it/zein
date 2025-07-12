import { API_CONFIG } from '@/shared/config/api-config';
import { apiClient } from '@/shared/config/axios';

/**
 * Проверка здоровья бэкенда (без авторизации)
 * Используется только для проверки доступности сервера
 */
export const checkBackendHealth = async (): Promise<{ status: string }> => {
  const healthUrl = `${API_CONFIG.getBaseUrl()}/health`;

  // Создаем отдельный запрос без токена авторизации
  const response = await fetch(healthUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Backend health check failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Проверка сессии пользователя
 * Используется для проверки валидности текущей сессии
 */
export const checkSession = async (): Promise<{
  authenticated: boolean;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}> => {
  const response = await apiClient.get('/users/session/');
  return response.data;
};
