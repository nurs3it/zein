'use client';

import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { useAuth } from '@/features/auth/model/auth-hooks';

export const PlatformHeader = () => {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Добро пожаловать{user && `, ${(user && 'name' in user && user.name) || user?.username}`}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Вы успешно авторизованы и можете пользоваться всеми функциями платформы
        </p>
      </div>
      <Badge variant="secondary" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        Авторизован
      </Badge>
    </div>
  );
};
