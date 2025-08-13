import { apiClient } from '@/shared/config/axios';
import {
  AuthCredentials,
  RegisterData,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ApiUser,
} from '@/shared/types/api';

// Функция для извлечения сообщения об ошибке
const getErrorMessage = (error: unknown): string => {
  // Проверяем, что error - это объект с полями response
  if (error && typeof error === 'object' && 'response' in error) {
    const errorWithResponse = error as { response?: { data?: unknown; status?: number } };

    if (errorWithResponse.response?.data && typeof errorWithResponse.response.data === 'object') {
      const data = errorWithResponse.response.data as Record<string, unknown>;

      if ('message' in data && typeof data.message === 'string') {
        return data.message;
      }

      if ('detail' in data && typeof data.detail === 'string') {
        return data.detail;
      }

      if ('error' in data && typeof data.error === 'string') {
        return data.error;
      }

      // Обработка ошибок валидации
      const errors = Object.values(data).flat();
      if (errors.length > 0 && typeof errors[0] === 'string') {
        return errors[0];
      }
    }

    if (errorWithResponse.response?.status === 401) {
      return 'Неверный email или пароль';
    }

    if (errorWithResponse.response?.status === 400) {
      return 'Некорректные данные';
    }

    if (errorWithResponse.response?.status === 500) {
      return 'Ошибка сервера, попробуйте позже';
    }
  }

  // Проверяем, что error - это объект с полем message
  if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as { message?: unknown };
    if (typeof errorWithMessage.message === 'string') {
      return errorWithMessage.message;
    }
  }

  return 'Произошла неизвестная ошибка';
};

// Регистрация пользователя
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/users/register/', data);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
};

// Авторизация пользователя
export const loginUser = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/users/token/', credentials);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
};

// Обновление токена
export const refreshToken = async (
  tokenData: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>('/users/token/refresh/', tokenData);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
};

// Выход из системы
export const logoutUser = async (): Promise<void> => {
  // Здесь можно добавить логику для отзыва токена на сервере
  // Пока что просто очищаем cookies на клиенте через utility
  // clearTokens() будет вызван в hook
};

// Получение информации о текущем пользователе
export const getCurrentUser = async (): Promise<ApiUser> => {
  try {
    const response = await apiClient.get<ApiUser>('/users/me/');
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
};
