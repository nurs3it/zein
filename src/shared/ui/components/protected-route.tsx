'use client';

import React from 'react';
import { useAuth } from '@/features/auth/model/auth-hooks';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/base/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/base/card';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

// Компонент для отображения когда пользователь не авторизован
const UnauthorizedFallback: React.FC<{ redirectTo?: string }> = ({ redirectTo = '/sign/in' }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle>Требуется авторизация</CardTitle>
          <CardDescription>Для доступа к этой странице необходимо войти в систему</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => router.push(redirectTo)} className="w-full">
            Войти в систему
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Компонент для отображения когда сессия истекла
const SessionExpiredFallback: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <RefreshCw className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <CardTitle>Сессия истекла</CardTitle>
          <CardDescription>Ваша сессия истекла. Войдите в систему заново.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={onRefresh} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить
          </Button>
          <Button onClick={() => router.push('/sign/in')} className="w-full">
            Войти заново
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Компонент загрузки
const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-500">Проверка авторизации...</p>
      </div>
    </div>
  );
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  redirectTo = '/sign/in',
}) => {
  const {
    isAuthenticated,
    isLoading,
    hasAccessToken,
    isTokenValid,
    isSessionActive,
    isSessionExpired,
    isUnauthorized,
    recheckAuth,
  } = useAuth();

  // Показываем лоадер во время проверки
  if (isLoading) {
    return <LoadingFallback />;
  }

  // Если нет токена или пользователь неавторизован
  if (!hasAccessToken || isUnauthorized) {
    return fallback || <UnauthorizedFallback redirectTo={redirectTo} />;
  }

  // Если токен невалиден или сессия истекла
  if (!isTokenValid || isSessionExpired) {
    return <SessionExpiredFallback onRefresh={recheckAuth} />;
  }

  // Если сессия неактивна
  if (!isSessionActive) {
    return <SessionExpiredFallback onRefresh={recheckAuth} />;
  }

  // Если все проверки пройдены, но все еще не аутентифицирован
  if (!isAuthenticated) {
    return fallback || <UnauthorizedFallback redirectTo={redirectTo} />;
  }

  // Если авторизован, показываем контент
  return <>{children}</>;
};
