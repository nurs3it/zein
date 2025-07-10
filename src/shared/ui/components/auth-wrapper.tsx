'use client';

import { useAuth } from '@/features/auth/model/auth-hooks';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useEffect, useState } from 'react';
import { getTokenInfoFromCookies } from '@/shared/lib/cookies';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isLoading } = useAuth();
  const [showLoading, setShowLoading] = useState(true);

  // Проверяем наличие токена в cookies при первой загрузке
  useEffect(() => {
    const tokenInfo = getTokenInfoFromCookies('access');

    if (!tokenInfo || !tokenInfo.isValid) {
      // Если токена нет или он невалидный - сразу показываем контент
      setShowLoading(false);
    } else {
      // Если токен есть - показываем лоадер минимум 2 секунды
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Показываем лоадер пока не готова информация о сессии или не прошло 2 секунды
  if (isLoading || showLoading) {
    return <LoadingScreen message="Проверяем сессию" />;
  }

  return <>{children}</>;
};
