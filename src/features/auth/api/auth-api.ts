import { apiClient } from '@/shared/config/axios';
import {
  AuthCredentials,
  RegisterData,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/shared/types/api';

// Функция для извлечения сообщения об ошибке
const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  // Обработка ошибок валидации
  if (error.response?.data && typeof error.response.data === 'object') {
    const errors = Object.values(error.response.data).flat();
    if (errors.length > 0) {
      return errors[0] as string;
    }
  }

  if (error.response?.status === 401) {
    return 'Неверный email или пароль';
  }

  if (error.response?.status === 400) {
    return 'Некорректные данные';
  }

  if (error.response?.status === 500) {
    return 'Ошибка сервера, попробуйте позже';
  }

  if (error.message) {
    return error.message;
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
export const getCurrentUser = async () => {
  return {
    id: '1',
    email: 'test@test.com',
    username: 'test',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // try {
  //   const response = await apiClient.get('/users/me/');
  //   return response.data;
  // } catch (error) {
  //   const errorMessage = getErrorMessage(error);
  //   throw new Error(errorMessage);
  // }
};
