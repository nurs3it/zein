/**
 * Проверка здоровья бэкенда (без авторизации)
 * Используется только для проверки доступности сервера
 */
export const checkBackendHealth = async (): Promise<{ status: string }> => {
  // Создаем отдельный запрос без токена авторизации
  const response = await fetch('http://185.4.180.4:8002/api/health/', {
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
