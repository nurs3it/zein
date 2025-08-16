'use client';

import { Button } from '@/shared/ui/base/button';
import { Badge } from '@/shared/ui/base/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/base/card';
import { User, Bell, Settings, List, Clock, Inbox } from 'lucide-react';
import { useAuth } from '@/features/auth/model/auth-hooks';
import Link from 'next/link';

export const PlatformDashboard = () => {
  const { user } = useAuth();

  const userName = user?.name || 'Пользователь';

  const quickStats = [
    { label: 'Активных проектов', value: '0', trend: '—' },
    { label: 'Выполненных задач', value: '0', trend: '—' },
    { label: 'Новых уведомлений', value: '0', trend: '—' },
    { label: 'Время онлайн', value: '0ч', trend: '—' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Добро пожаловать, {userName || ''}!</h1>
              <p className="text-blue-100 mb-4">
                Ваша платформа готова к работе. Начните создавать проекты и задачи.
              </p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Последний вход: сегодня</span>
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
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">
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
              <div className="text-center py-12">
                <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Пока нет активности
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Начните работать с платформой, и здесь появятся ваши действия
                </p>
                <Button variant="outline" asChild>
                  <Link href="/platform/kmzh">Создать первый проект</Link>
                </Button>
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
              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link href="/platform/kmzh">
                  <List className="h-4 w-4" />
                  Создать проект
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
