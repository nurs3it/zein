'use client';

import { Button } from '@/shared/ui/base/button';
import { Badge } from '@/shared/ui/base/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/base/card';
import { User, Bell, Settings, List, Clock } from 'lucide-react';
import { useAuth } from '@/features/auth/model/auth-hooks';
import Link from 'next/link';

export const PlatformDashboard = () => {
  const { user } = useAuth();

  const userName =
    user && 'name' in user && user.name ? user.name : user?.username || 'Пользователь';

  const quickStats = [
    { label: 'Активных проектов', value: '12', trend: '+3' },
    { label: 'Выполненных задач', value: '156', trend: '+24' },
    { label: 'Новых уведомлений', value: '8', trend: '+2' },
    { label: 'Время онлайн', value: '4.2ч', trend: '+0.5ч' },
  ];

  const recentActivity = [
    { action: 'Создан новый проект', time: '2 минуты назад', type: 'project' },
    { action: 'Обновлен профиль', time: '1 час назад', type: 'profile' },
    { action: 'Добавлен новый пользователь', time: '3 часа назад', type: 'user' },
    { action: 'Настроены уведомления', time: '5 часов назад', type: 'settings' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Добро пожаловать, {userName}!</h1>
              <p className="text-blue-100 mb-4">
                Вот краткий обзор вашей активности и последних обновлений
              </p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Последний вход: сегодня, 14:30</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map(stat => (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {stat.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Последняя активность
              </CardTitle>
              <CardDescription>Ваши недавние действия в системе</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Быстрые действия
              </CardTitle>
              <CardDescription>Часто используемые функции</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link href="/platform/profile">
                  <User className="h-4 w-4" />
                  Управление профилем
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link href="/platform/notifications">
                  <Bell className="h-4 w-4" />
                  Проверить уведомления
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
