'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
  Settings,
  Check,
  Filter,
  Clock,
  User,
  Shield,
  CreditCard,
  Mail,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: string;
  icon: React.ElementType;
}

export const NotificationsSection = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'Новое обновление системы',
      message: 'Доступна новая версия платформы с улучшенными функциями безопасности',
      time: '2 минуты назад',
      read: false,
      category: 'Система',
      icon: Info,
    },
    {
      id: '2',
      type: 'success',
      title: 'Платеж успешно обработан',
      message: 'Ваш платеж на сумму ₽12,500 был успешно обработан',
      time: '15 минут назад',
      read: false,
      category: 'Платежи',
      icon: CreditCard,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Требуется подтверждение email',
      message: 'Пожалуйста, подтвердите новый email адрес для завершения изменений',
      time: '1 час назад',
      read: false,
      category: 'Безопасность',
      icon: Mail,
    },
    {
      id: '4',
      type: 'error',
      title: 'Неудачная попытка входа',
      message: 'Обнаружена неудачная попытка входа в ваш аккаунт',
      time: '2 часа назад',
      read: true,
      category: 'Безопасность',
      icon: Shield,
    },
    {
      id: '5',
      type: 'info',
      title: 'Новый пользователь присоединился',
      message: 'Пользователь "john_doe" присоединился к вашей команде',
      time: '3 часа назад',
      read: true,
      category: 'Команда',
      icon: User,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') {
      return !n.read;
    }
    if (filter === 'read') {
      return n.read;
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Уведомления</h2>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {unreadCount} новых
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={markAllAsRead}>
            <Check className="h-4 w-4" />
            Прочитать все
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Настройки
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex items-center gap-1">
              {['all', 'unread', 'read'].map(filterType => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(filterType as typeof filter)}
                  className="text-sm"
                >
                  {filterType === 'all'
                    ? 'Все'
                    : filterType === 'unread'
                      ? 'Непрочитанные'
                      : 'Прочитанные'}
                  {filterType === 'unread' && unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'unread' ? 'Нет новых уведомлений' : 'Нет уведомлений'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map(notification => {
            const IconComponent = getNotificationIcon(notification.type);
            // const NotificationIcon = notification.icon;

            return (
              <Card
                key={notification.id}
                className={`transition-all duration-200 hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-semibold text-gray-900 dark:text-white ${
                                !notification.read ? 'font-bold' : ''
                              }`}
                            >
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3" />
                              {notification.time}
                            </div>
                            <Badge
                              variant="outline"
                              className={`${getBadgeColor(notification.type)} text-xs`}
                            >
                              {notification.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Настройки уведомлений
          </CardTitle>
          <CardDescription>Управляйте типами уведомлений, которые хотите получать</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Email уведомления',
                description: 'Получать уведомления на email',
                enabled: true,
              },
              { name: 'Push уведомления', description: 'Уведомления в браузере', enabled: true },
              { name: 'SMS уведомления', description: 'Важные уведомления по SMS', enabled: false },
              { name: 'Еженедельная сводка', description: 'Отчет о активности', enabled: true },
            ].map(setting => (
              <div
                key={setting.name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {setting.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
                </div>
                <div
                  className={`w-10 h-6 rounded-full ${
                    setting.enabled ? 'bg-blue-500' : 'bg-gray-300'
                  } relative transition-colors duration-200`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
                      setting.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
