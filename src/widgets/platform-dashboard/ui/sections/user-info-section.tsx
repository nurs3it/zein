'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/base/card';
import { Badge } from '@/shared/ui/base/badge';
import { Button } from '@/shared/ui/base/button';
import { User, Shield, Crown, Calendar, Globe, Settings, Edit } from 'lucide-react';
import { useAuth } from '@/features/auth/model/auth-hooks';

export const UserInfoSection = () => {
  const { user } = useAuth();

  const userName = user?.name || 'Пользователь';
  const userEmail = user && 'email' in user && user.email ? user.email : 'email@example.com';

  const accessRights = [
    { name: 'Полный доступ', level: 'admin', color: 'bg-green-100 text-green-800' },
    { name: 'Аналитика', level: 'analytics', color: 'bg-blue-100 text-blue-800' },
    { name: 'Управление', level: 'management', color: 'bg-purple-100 text-purple-800' },
    { name: 'Безопасность', level: 'security', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Информация о пользователе
        </h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Редактировать
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-xl">{userName || ''}</CardTitle>
            <CardDescription className="text-sm">{userEmail}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Premium пользователь
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">127</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Дней активности</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">98%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Время работы</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Rights Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Права доступа
            </CardTitle>
            <CardDescription>Ваши текущие права доступа к функциям платформы</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {accessRights.map(right => (
              <div
                key={right.name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {right.name}
                </span>
                <Badge className={right.color}>Активен</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Статус аккаунта
            </CardTitle>
            <CardDescription>Общая информация о вашем аккаунте</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Тарифный план</span>
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                Professional
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Дата регистрации</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">15 мая 2024</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Последний вход</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Сегодня, 14:30
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Статус</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Активен</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Быстрые действия
            </CardTitle>
            <CardDescription>Часто используемые функции</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3">
              <Calendar className="h-4 w-4" />
              Запланировать встречу
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Shield className="h-4 w-4" />
              Настройки безопасности
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Globe className="h-4 w-4" />
              Управление доступом
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
