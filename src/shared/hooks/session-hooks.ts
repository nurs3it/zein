'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkBackendHealth, checkSession } from '@/shared/api/session-api';
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
  sessionValidation: ['session', 'validation'] as const,
  tokenRefresh: ['token', 'refresh'] as const,
} as const;

// Хук для проверки здоровья бэкенда
export const useBackendHealth = () => {
  return useQuery({
    queryKey: SESSION_KEYS.backendHealth,
    queryFn: checkBackendHealth,
    staleTime: 30 * 1000, // 30 секунд
    gcTime: 60 * 1000, // 1 минута
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 1000,
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
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.sessionValidation });
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

// Хук для проверки сессии через API
export const useSessionValidation = () => {
  const hasAccessToken = !!getToken('access');

  return useQuery({
    queryKey: SESSION_KEYS.sessionValidation,
    queryFn: checkSession,
    enabled: hasAccessToken, // Запрос только если есть токен
    staleTime: 30 * 1000, // 30 секунд
    gcTime: 60 * 1000, // 1 минута
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      // Не повторяем запрос при 401 ошибке
      if (error && 'response' in error && (error as any).response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
};

// Хук для комплексной проверки аутентификации
export const useAuthValidation = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const tokenRefreshMutation = useTokenRefresh();
  const isRefreshingRef = useRef(false);

  const hasAccessToken = !!getToken('access');
  const hasRefreshToken = !!getToken('refresh');

  const sessionValidation = useSessionValidation();
  const {
    data: sessionData,
    isLoading: sessionLoading,
    error: sessionError,
    refetch: refetchSession,
  } = sessionValidation;

  // Автоматическое обновление токена при ошибке 401
  useEffect(() => {
    if (
      sessionError &&
      'response' in sessionError &&
      (sessionError as any).response?.status === 401
    ) {
      const refreshTokenValue = getToken('refresh');
      const isRefreshTokenValid = refreshTokenValue ? validateTokenFromCookies('refresh') : false;

      if (refreshTokenValue && isRefreshTokenValid && !isRefreshingRef.current) {
        console.log('Session expired, attempting to refresh token...');

        isRefreshingRef.current = true;
        setIsRefreshing(true);

        tokenRefreshMutation.mutate(undefined, {
          onSuccess: () => {
            console.log('Token refreshed, retrying session check...');
            refetchSession();
          },
          onError: () => {
            console.log('Token refresh failed, clearing tokens...');
            clearTokens();
          },
          onSettled: () => {
            isRefreshingRef.current = false;
            setIsRefreshing(false);
          },
        });
      } else if (!isRefreshTokenValid && hasRefreshToken) {
        console.log('Refresh token is invalid, clearing tokens...');
        clearTokens();
      }
    }
  }, [sessionError, tokenRefreshMutation, refetchSession, hasRefreshToken]);

  // Извлекаем данные пользователя из токена как fallback
  const getUserFromToken = useCallback(() => {
    const accessToken = getToken('access');
    if (!accessToken) {
      return null;
    }

    const payload = decodeJWT(accessToken);
    if (!payload) {
      return null;
    }

    return {
      id: payload.user_id || payload.sub || payload.id,
      email: payload.email,
      username: payload.username,
      name: payload.name || payload.username,
      ...payload,
    };
  }, []);

  // Состояния
  const isSessionValid = sessionData?.authenticated === true;
  const isAuthenticated = hasAccessToken && isSessionValid;
  const isSessionExpired = hasAccessToken && !isSessionValid && !sessionError;
  const isUnauthorized = !hasAccessToken && !hasRefreshToken;
  const canRefresh = hasRefreshToken && validateTokenFromCookies('refresh');
  const isLoading = sessionLoading || isRefreshing;

  // Пользователь из API или из токена
  const user = sessionData?.user || getUserFromToken();

  // Информация о токене
  const accessTokenInfo = hasAccessToken ? getTokenInfoFromCookies('access') : null;
  const refreshTokenInfo = hasRefreshToken ? getTokenInfoFromCookies('refresh') : null;

  // Время до истечения токена
  const tokenTimeLeft = accessTokenInfo?.payload
    ? Math.max(0, accessTokenInfo.payload.exp - Math.floor(Date.now() / 1000))
    : 0;

  // Время последней активности
  const lastActivity = accessTokenInfo?.issuedAt?.toISOString();

  return {
    // Основные статусы
    hasAccessToken,
    hasRefreshToken,
    isTokenValid: isSessionValid,
    isRefreshTokenValid: hasRefreshToken ? validateTokenFromCookies('refresh') : false,
    isSessionActive: isAuthenticated,

    // Комплексная проверка аутентификации
    isAuthenticated,

    // Состояния загрузки
    isLoading,
    isRefreshing,

    // Данные пользователя
    user,
    tokenInfo: accessTokenInfo,
    refreshTokenInfo,
    lastActivity,

    // Ошибки
    error: sessionError,

    // Специальные статусы
    isSessionExpired,
    isUnauthorized,
    canRefresh,

    // Время до истечения токена
    tokenTimeLeft,

    // Функции для ручной проверки
    recheckAuth: () => {
      refetchSession();
    },
  };
};
