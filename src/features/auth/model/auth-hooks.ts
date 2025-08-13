import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginUser, registerUser, refreshToken, logoutUser, getCurrentUser } from '../api/auth-api';
import {
  AuthCredentials,
  RegisterData,
  RefreshTokenRequest,
  RawApiUser,
  ApiUser,
} from '@/shared/types/api';
import { useAppDispatch } from '@/shared/store';
import { setUser, clearUser, setError, setLoading } from './auth-slice';
import { setTokens, clearTokens, getToken } from '@/shared/lib/cookies';
import { toast } from 'sonner';
import { useAuthValidation, SESSION_KEYS } from '@/shared/hooks/session-hooks';

// Ключи для кеширования
export const AUTH_KEYS = {
  currentUser: ['auth', 'currentUser'] as const,
  login: ['auth', 'login'] as const,
  register: ['auth', 'register'] as const,
  refresh: ['auth', 'refresh'] as const,
} as const;

// Адаптер для приведения API пользователя к локальному формату
const adaptApiUser = (apiUser: RawApiUser) => ({
  id: apiUser.id.toString(),
  email: apiUser.email,
  username: apiUser.name || apiUser.email,
  createdAt: apiUser.date_joined,
  updatedAt: new Date().toISOString(),
});

// Хук для проверки наличия токена
export const useTokenCheck = () => {
  const checkToken = () => {
    const token = getToken('access');
    return !!token;
  };

  return { hasToken: checkToken(), checkToken };
};

// Хук для получения текущего пользователя
export const useCurrentUser = () => {
  const { hasAccessToken, isTokenValid, isAuthenticated } = useAuthValidation();
  const dispatch = useAppDispatch();

  const userQuery = useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: getCurrentUser,
    enabled: hasAccessToken && isTokenValid && isAuthenticated, // Запрос только если есть валидный токен и сессия
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: false,
  });

  // Сохраняем данные пользователя в Redux store при успешной загрузке
  React.useEffect(() => {
    if (userQuery.data && userQuery.isSuccess) {
      dispatch(setUser(adaptApiUser(userQuery.data)));
    }
  }, [userQuery.data, userQuery.isSuccess, dispatch]);

  return userQuery;
};

// Хук для авторизации
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: AuthCredentials) => loginUser(credentials),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: data => {
      // Сохраняем токены в cookies
      setTokens(data.access, data.refresh);
      // Сохраняем данные пользователя в кеше
      queryClient.setQueryData(AUTH_KEYS.currentUser, data.user);
      toast.success('Вход выполнен успешно');

      // Инвалидируем кеши для обновления статуса
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.sessionValidation });
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.currentUser });

      // Принудительно перезапускаем проверку токенов
      setTimeout(() => {
        window.dispatchEvent(new Event('storage'));
      }, 100);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Произошла ошибка при входе';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      // console.error('Login error:', error);
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

// Хук для регистрации
export const useRegister = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => registerUser(userData),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: data => {
      // Сохраняем токены в cookies
      setTokens(data.access, data.refresh);
      // Сохраняем данные пользователя в кеше
      queryClient.setQueryData(AUTH_KEYS.currentUser, data.user);
      dispatch(setUser(adaptApiUser(data.user)));
      toast.success('Регистрация выполнена успешно');

      // Инвалидируем кеши для обновления статуса
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.sessionValidation });
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.currentUser });

      // Принудительно перезапускаем проверку токенов
      setTimeout(() => {
        window.dispatchEvent(new Event('storage'));
      }, 100);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Произошла ошибка при регистрации';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      // console.error('Registration error:', error);
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

// Хук для обновления токена
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (tokenData: RefreshTokenRequest) => refreshToken(tokenData),
    onSuccess: data => {
      // Сохраняем новые токены
      setTokens(data.access, data.refresh);
      toast.success('Токен обновлен успешно');
    },
    onError: (_error: Error) => {
      // const errorMessage = error.message || 'Ошибка обновления токена';
      // console.error('Token refresh error:', errorMessage);
      toast.error('Необходимо войти заново');

      // Очищаем токены при ошибке обновления
      clearTokens();
    },
  });
};

// Хук для выхода из системы
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Очищаем токены из cookies
      clearTokens();
      dispatch(clearUser());
      toast.success('Выход выполнен успешно');
      // Очищаем кеш пользователя
      queryClient.removeQueries({ queryKey: AUTH_KEYS.currentUser });
      // Очищаем кеши сессии
      queryClient.removeQueries({ queryKey: SESSION_KEYS.sessionValidation });
      // Очищаем весь кеш (опционально)
      queryClient.clear();

      // Принудительно перезапускаем проверку токенов
      setTimeout(() => {
        window.dispatchEvent(new Event('storage'));
      }, 100);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Произошла ошибка при выходе';
      toast.error(errorMessage);
      // console.error('Logout error:', error);
    },
  });
};

// Хук для проверки аутентификации с валидацией токена и сессии
export const useAuth = () => {
  const authValidation = useAuthValidation();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const dispatch = useAppDispatch();

  // Очищаем данные пользователя в Redux store, если пользователь не авторизован
  React.useEffect(() => {
    if (!authValidation.isAuthenticated) {
      dispatch(clearUser());
    }
  }, [authValidation.isAuthenticated, dispatch]);

  return {
    // Из валидации сессии
    hasAccessToken: authValidation.hasAccessToken,
    hasRefreshToken: authValidation.hasRefreshToken,
    isTokenValid: authValidation.isTokenValid,
    isRefreshTokenValid: authValidation.isRefreshTokenValid,
    isSessionActive: authValidation.isSessionActive,
    isAuthenticated: authValidation.isAuthenticated,
    isSessionExpired: authValidation.isSessionExpired,
    isUnauthorized: authValidation.isUnauthorized,
    canRefresh: authValidation.canRefresh,

    // Данные пользователя (приоритет currentUser, fallback - token)
    user: (user || authValidation.user) as ApiUser | null,
    tokenInfo: authValidation.tokenInfo,
    refreshTokenInfo: authValidation.refreshTokenInfo,
    lastActivity: authValidation.lastActivity,
    tokenTimeLeft: authValidation.tokenTimeLeft,

    // Состояние автообновления
    isRefreshing: authValidation.isRefreshing,

    // Общее состояние загрузки
    isLoading: authValidation.isLoading || userLoading,

    // Ошибки
    error: authValidation.error,

    // Функции
    recheckAuth: authValidation.recheckAuth,
  };
};
