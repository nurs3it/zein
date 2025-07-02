'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/shared/store/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultFallback: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToLogin = () => {
    router.push('/sign/in');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Доступ ограничен
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Для доступа к этой странице необходимо войти в систему
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button onClick={handleGoToLogin} className="w-full">
              Войти в систему
            </Button>
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="w-full flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = <DefaultFallback />,
}) => {
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);

  // Показываем лоадер во время проверки
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Если не авторизован, показываем fallback
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Если авторизован, показываем контент
  return <>{children}</>;
};
