'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkBackendHealth } from '@/shared/api/session-api';
import { refreshToken } from '@/features/auth/api/auth-api';
import {
  getToken,
  validateTokenFromCookies,
  getTokenInfoFromCookies,
  decodeJWT,
  setTokens,
  clearTokens,
} from '@/shared/lib/cookies';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

// Ключи для кеширования
export const SESSION_KEYS = {
  backendHealth: ['backend', 'health'] as const,
  tokenValidation: ['token', 'validation'] as const,
  tokenRefresh: ['token', 'refresh'] as const,
} as const;

// Интерфейс для пользователя из токена
interface TokenUser {
  id: string | number;
  email?: string;
  username?: string;
  name?: string;
  [key: string]: any;
}

// Хук для проверки здоровья бэкенда (без авторизации)
export const useBackendHealth = () => {
  return useQuery({
    queryKey: SESSION_KEYS.backendHealth,
    queryFn: checkBackendHealth,
    staleTime: 30 * 1000, // 30 секунд
    refetchInterval: 60 * 1000, // Обновлять каждую минуту
    retry: 3, // Повторять 3 раза при ошибке
    retryOnMount: true,
  });
};

// Хук для автоматического обновления токена
export const useTokenRefresh = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: SESSION_KEYS.tokenRefresh,
    mutationFn: async () => {
      const refreshTokenValue = getToken('refresh');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      console.log('Refreshing token...');
      const response = await refreshToken({ refresh: refreshTokenValue });
      return response;
    },
    onSuccess: data => {
      // Сохраняем новые токены
      setTokens(data.access, data.refresh);
      console.log('Token refreshed successfully');

      // Инвалидируем кеши для обновления состояния
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.tokenValidation });
      queryClient.invalidateQueries({ queryKey: ['auth', 'currentUser'] });
    },
    onError: error => {
      console.error('Token refresh failed:', error);
      // Очищаем токены при ошибке обновления
      clearTokens();
      toast.error('Сессия истекла. Необходимо войти заново.');

      // Редирект на страницу входа
      if (typeof window !== 'undefined') {
        window.location.href = '/sign/in';
      }
    },
  });
};

// Хук для локальной валидации токенов с автообновлением
export const useTokenValidation = () => {
  const [tokenData, setTokenData] = useState({
    hasAccessToken: false,
    hasRefreshToken: false,
    isAccessTokenValid: false,
    isRefreshTokenValid: false,
    accessTokenInfo: null as any,
    refreshTokenInfo: null as any,
    user: null as TokenUser | null,
    isRefreshing: false,
  });

  const tokenRefreshMutation = useTokenRefresh();
  const isRefreshingRef = useRef(false);

  const checkTokens = useCallback(() => {
    const accessToken = getToken('access');
    const refreshToken = getToken('refresh');

    const hasAccessToken = !!accessToken;
    const hasRefreshToken = !!refreshToken;

    const isAccessTokenValid = accessToken ? validateTokenFromCookies('access') : false;
    const isRefreshTokenValid = refreshToken ? validateTokenFromCookies('refresh') : false;

    const accessTokenInfo = accessToken ? getTokenInfoFromCookies('access') : null;
    const refreshTokenInfo = refreshToken ? getTokenInfoFromCookies('refresh') : null;

    // Извлекаем пользователя из токена
    let user: TokenUser | null = null;
    if (accessToken && isAccessTokenValid) {
      const payload = decodeJWT(accessToken);
      if (payload) {
        user = {
          id: payload.user_id || payload.sub || payload.id,
          email: payload.email,
          username: payload.username,
          name: payload.name || payload.username,
          ...payload,
        };
      }
    }

    setTokenData(prev => {
      // Проверяем, изменились ли основные данные
      const hasBasicChanges =
        prev.hasAccessToken !== hasAccessToken ||
        prev.hasRefreshToken !== hasRefreshToken ||
        prev.isAccessTokenValid !== isAccessTokenValid ||
        prev.isRefreshTokenValid !== isRefreshTokenValid ||
        prev.isRefreshing !== isRefreshingRef.current;

      // Проверяем изменения пользователя (более эффективно)
      const hasUserChanges =
        (!prev.user && user) ||
        (prev.user && !user) ||
        (prev.user &&
          user &&
          (prev.user.id !== user.id ||
            prev.user.email !== user.email ||
            prev.user.username !== user.username));

      // Обновляем состояние только если есть изменения
      if (hasBasicChanges || hasUserChanges) {
        return {
          hasAccessToken,
          hasRefreshToken,
          isAccessTokenValid,
          isRefreshTokenValid,
          accessTokenInfo,
          refreshTokenInfo,
          user,
          isRefreshing: isRefreshingRef.current,
        };
      }

      return prev;
    });
  }, []);

  // Отдельная функция для автообновления токена
  const autoRefreshToken = useCallback(() => {
    const accessToken = getToken('access');
    const refreshTokenValue = getToken('refresh');

    if (!accessToken || !refreshTokenValue || isRefreshingRef.current) {
      return;
    }

    const isAccessTokenValid = validateTokenFromCookies('access');
    const isRefreshTokenValid = validateTokenFromCookies('refresh');

    if (!isRefreshTokenValid) {
      console.log('Refresh token is invalid, cannot refresh');
      return;
    }

    const accessTokenInfo = getTokenInfoFromCookies('access');
    const timeLeft = accessTokenInfo?.payload
      ? accessTokenInfo.payload.exp - Math.floor(Date.now() / 1000)
      : 0;

    // Обновляем токен за 5 минут до истечения (300 секунд) или если токен уже невалиден
    const shouldRefresh =
      (!isAccessTokenValid && timeLeft <= 0) || // Токен истек
      (isAccessTokenValid && timeLeft > 0 && timeLeft <= 300); // Токен истечет в течение 5 минут

    if (shouldRefresh) {
      console.log(
        'Token needs refresh. Time left:',
        timeLeft,
        'seconds. Valid:',
        isAccessTokenValid
      );

      isRefreshingRef.current = true;
      setTokenData(prev => ({ ...prev, isRefreshing: true }));

      tokenRefreshMutation.mutate(undefined, {
        onSuccess: () => {
          console.log('Token refresh successful, rechecking tokens...');
          // Перепроверяем токены после успешного обновления
          setTimeout(() => {
            const newAccessToken = getToken('access');
            const newRefreshToken = getToken('refresh');

            const newIsAccessTokenValid = newAccessToken
              ? validateTokenFromCookies('access')
              : false;
            const newIsRefreshTokenValid = newRefreshToken
              ? validateTokenFromCookies('refresh')
              : false;
            const newAccessTokenInfo = newAccessToken ? getTokenInfoFromCookies('access') : null;
            const newRefreshTokenInfo = newRefreshToken ? getTokenInfoFromCookies('refresh') : null;

            let newUser = null;
            if (newAccessToken && newIsAccessTokenValid) {
              const payload = decodeJWT(newAccessToken);
              if (payload) {
                newUser = {
                  id: payload.user_id || payload.sub || payload.id,
                  email: payload.email,
                  username: payload.username,
                  name: payload.name || payload.username,
                  ...payload,
                };
              }
            }

            setTokenData({
              hasAccessToken: !!newAccessToken,
              hasRefreshToken: !!newRefreshToken,
              isAccessTokenValid: newIsAccessTokenValid,
              isRefreshTokenValid: newIsRefreshTokenValid,
              accessTokenInfo: newAccessTokenInfo,
              refreshTokenInfo: newRefreshTokenInfo,
              user: newUser,
              isRefreshing: false,
            });

            console.log('Token data updated after refresh');
          }, 100);
        },
        onSettled: () => {
          isRefreshingRef.current = false;
          setTokenData(prev => ({ ...prev, isRefreshing: false }));
        },
      });
    }
  }, [tokenRefreshMutation]);

  useEffect(() => {
    // Проверяем токены при монтировании
    checkTokens();

    // Проверяем токены каждые 30 секунд
    const interval = setInterval(() => {
      checkTokens();
      autoRefreshToken();
    }, 30 * 1000);

    // Слушаем изменения в cookies (для синхронизации между вкладками)
    const handleStorageChange = () => {
      checkTokens();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Убираем зависимости чтобы избежать лишних пересозданий

  return tokenData;
};

// Хук для комплексной проверки аутентификации
export const useAuthValidation = () => {
  const tokenValidation = useTokenValidation();

  const {
    hasAccessToken,
    hasRefreshToken,
    isAccessTokenValid,
    isRefreshTokenValid,
    accessTokenInfo,
    refreshTokenInfo,
    user,
    isRefreshing,
  } = tokenValidation;

  // Вычисляем статусы
  const isAuthenticated = hasAccessToken && isAccessTokenValid;
  const isSessionExpired = hasAccessToken && !isAccessTokenValid && !isRefreshTokenValid;
  const canRefresh = hasRefreshToken && isRefreshTokenValid;
  const isUnauthorized = !hasAccessToken && !hasRefreshToken;

  // Время последней активности (из токена)
  const lastActivity = accessTokenInfo?.issuedAt?.toISOString();

  return {
    // Основные статусы
    hasAccessToken,
    hasRefreshToken,
    isTokenValid: isAccessTokenValid,
    isRefreshTokenValid,
    isSessionActive: isAuthenticated,

    // Комплексная проверка аутентификации
    isAuthenticated,

    // Состояния загрузки
    isLoading: isRefreshing,
    isRefreshing,

    // Данные пользователя
    user,
    tokenInfo: accessTokenInfo,
    refreshTokenInfo,
    lastActivity,

    // Ошибки (нет, так как все локально)
    error: null,

    // Специальные статусы
    isSessionExpired,
    isUnauthorized,
    canRefresh,

    // Время до истечения токена
    tokenTimeLeft: accessTokenInfo?.payload
      ? Math.max(0, accessTokenInfo.payload.exp - Math.floor(Date.now() / 1000))
      : 0,

    // Функции для ручной проверки
    recheckAuth: () => {
      // Перезагружаем компонент или можем добавить логику
      window.location.reload();
    },
  };
};
