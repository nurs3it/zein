'use server';

import { LoginCredentials, RegisterCredentials, User, ApiResponse } from '@/shared/types';

// Мок данные для демонстрации
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    username: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function loginUser(credentials: LoginCredentials): Promise<ApiResponse<User>> {
  // Симуляция задержки сети
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = MOCK_USERS.find(u => u.email === credentials.email);

  if (!user || credentials.password !== 'password') {
    return {
      success: false,
      error: 'Неверный email или пароль',
    };
  }

  return {
    success: true,
    data: user,
    message: 'Вход выполнен успешно',
  };
}

export async function registerUser(credentials: RegisterCredentials): Promise<ApiResponse<User>> {
  // Симуляция задержки сети
  await new Promise(resolve => setTimeout(resolve, 1000));

  const existingUser = MOCK_USERS.find(u => u.email === credentials.email);

  if (existingUser) {
    return {
      success: false,
      error: 'Пользователь с таким email уже существует',
    };
  }

  const newUser: User = {
    id: String(MOCK_USERS.length + 1),
    email: credentials.email,
    username: credentials.username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  MOCK_USERS.push(newUser);

  return {
    success: true,
    data: newUser,
    message: 'Регистрация выполнена успешно',
  };
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  // Симуляция задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));

  // В реальном приложении здесь была бы проверка токена
  const user = MOCK_USERS[0];

  return {
    success: true,
    data: user,
  };
}

export async function logoutUser(): Promise<ApiResponse> {
  // Симуляция задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    message: 'Выход выполнен успешно',
  };
}
