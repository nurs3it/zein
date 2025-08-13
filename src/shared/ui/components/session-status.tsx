'use client';

import { useAuth } from '@/features/auth/model/auth-hooks';
import { useBackendHealth } from '@/shared/hooks/session-hooks';
import { UserCheck, UserX, Loader, AlertTriangle, Server, ServerCrash } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SessionStatusProps {
  className?: string;
  showLabel?: boolean;
  showUserInfo?: boolean;
  showDetails?: boolean;
}

interface BackendStatusProps {
  className?: string;
  showLabel?: boolean;
  showDetails?: boolean;
}

export const BackendStatus = ({
  className = '',
  showLabel = true,
  showDetails = false,
}: BackendStatusProps) => {
  const [isClient, setIsClient] = useState(false);
  const { data: healthData, isLoading, error, refetch } = useBackendHealth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader className="h-4 w-4 text-gray-500 animate-spin" />
        {showLabel && <span className="text-sm text-gray-500">Загрузка...</span>}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader className="h-4 w-4 text-gray-500 animate-spin" />
        {showLabel && <span className="text-sm text-gray-500">Проверка сервера...</span>}
      </div>
    );
  }

  // Ошибка подключения к серверу
  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <ServerCrash className="h-4 w-4 text-red-500" />
        {showLabel && (
          <div className="flex flex-col">
            <span className="text-sm text-red-600">Сервер недоступен</span>
            {showDetails && (
              <button onClick={() => refetch()} className="text-xs text-blue-600 hover:underline">
                Повторить
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Сервер работает
  if (healthData?.status === 'healthy') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Server className="h-4 w-4 text-green-500" />
        {showLabel && (
          <div className="flex flex-col">
            <span className="text-sm text-green-600">Сервер работает</span>
            {showDetails && (
              <button onClick={() => refetch()} className="text-xs text-blue-600 hover:underline">
                Обновить
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Неизвестный статус
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-orange-500" />
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-sm text-orange-600">Неизвестный статус</span>
          {showDetails && (
            <button onClick={() => refetch()} className="text-xs text-blue-600 hover:underline">
              Обновить
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const SessionStatus = ({
  className = '',
  showLabel = true,
  showUserInfo = false,
  showDetails = false,
}: SessionStatusProps) => {
  const [isClient, setIsClient] = useState(false);
  const {
    isAuthenticated,
    hasAccessToken,
    isTokenValid,
    canRefresh,
    user,
    isLoading,
    tokenTimeLeft,
    isRefreshing,
  } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader className="h-4 w-4 text-gray-500 animate-spin" />
        {showLabel && <span className="text-sm text-gray-500">Загрузка...</span>}
      </div>
    );
  }

  if (isLoading || isRefreshing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader className="h-4 w-4 text-gray-500 animate-spin" />
        {showLabel && (
          <span className="text-sm text-gray-500">
            {isRefreshing ? 'Обновление токена...' : 'Проверка сессии...'}
          </span>
        )}
      </div>
    );
  }

  // Нет токена
  if (!hasAccessToken) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <UserX className="h-4 w-4 text-red-500" />
        {showLabel && (
          <div className="flex flex-col">
            <span className="text-sm text-red-600">Не авторизован</span>
            {showDetails && <span className="text-xs text-gray-500">Нет токена</span>}
          </div>
        )}
      </div>
    );
  }

  // Токен невалиден
  if (!isTokenValid) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <AlertTriangle className="h-4 w-4 text-red-500" />
        {showLabel && (
          <div className="flex flex-col">
            <span className="text-sm text-red-600">Токен истек</span>
            {showDetails && canRefresh && (
              <span className="text-xs text-orange-600">Можно обновить</span>
            )}
            {showDetails && !canRefresh && (
              <span className="text-xs text-gray-500">Требуется повторный вход</span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Авторизован и токен валиден
  if (isAuthenticated) {
    const timeLeftMinutes = Math.floor(tokenTimeLeft / 60);
    const timeLeftHours = Math.floor(timeLeftMinutes / 60);
    const willRefreshSoon = tokenTimeLeft > 0 && tokenTimeLeft <= 600; // 10 минут

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <UserCheck className="h-4 w-4 text-green-500" />
        {showLabel && (
          <div className="flex flex-col">
            <span className="text-sm text-green-600">Авторизован</span>
            {showUserInfo && user && (
              <span className="text-xs text-gray-500">{user?.name || user?.email}</span>
            )}
            {showDetails && tokenTimeLeft > 0 && (
              <span className="text-xs text-gray-500">
                {timeLeftHours > 0
                  ? `Истекает через ${timeLeftHours}ч ${timeLeftMinutes % 60}м`
                  : `Истекает через ${timeLeftMinutes}м`}
                {willRefreshSoon && ' (скоро обновится)'}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Состояние по умолчанию
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-gray-500" />
      {showLabel && <span className="text-sm text-gray-500">Неопределенное состояние</span>}
    </div>
  );
};
