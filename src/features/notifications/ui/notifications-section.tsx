'use client';

import { Button } from '@/shared/ui/base/button';
import { Bell, Check, Trash2, X, Info, Clock, AlertCircle } from 'lucide-react';
import {
  useNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from '../model/notifications-hooks';
import { NotificationList } from '@/entities/notification/model/types';

export const NotificationsSection = () => {
  const { data: notifications, isLoading } = useNotificationsQuery();
  const markAsReadMutation = useMarkAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();
  const deleteNotificationMutation = useDeleteNotificationMutation();

  const unreadCount = (notifications?.results || []).filter(
    (n: NotificationList) => !n.is_read
  ).length;

  const totalCount = notifications?.results?.length || 0;
  const readCount = totalCount - unreadCount;

  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate([notificationId]);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDeleteNotification = (notificationId: number) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <X className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationTypeCount = (type: string) => {
    return (notifications?.results || []).filter(n => n.notification_type === type).length;
  };

  if (isLoading) {
    return (
      <div className="p-3 text-center">
        <div className="animate-pulse space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!notifications?.results.length) {
    return (
      <div className="p-3 text-center text-gray-500 dark:text-gray-400">
        <Bell className="h-6 w-6 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Нет уведомлений</p>
        <p className="text-xs mt-1">У вас пока нет уведомлений</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Заголовок и статистика */}
      <div className="px-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Уведомления</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="text-xs h-6 px-2"
            >
              <Check className="h-3 w-3 mr-1" />
              Все прочитаны
            </Button>
          )}
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <div className="font-semibold text-blue-600 dark:text-blue-400">{totalCount}</div>
            <div className="text-gray-500">Всего</div>
          </div>
          <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
            <div className="font-semibold text-orange-600 dark:text-orange-400">{unreadCount}</div>
            <div className="text-gray-500">Новых</div>
          </div>
          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <div className="font-semibold text-green-600 dark:text-green-400">{readCount}</div>
            <div className="text-gray-500">Прочитано</div>
          </div>
        </div>
      </div>

      {/* Типы уведомлений */}
      <div className="px-3">
        <div className="flex flex-wrap gap-1 text-xs">
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
            <Info className="h-3 w-3 text-blue-500" />
            <span>Info: {getNotificationTypeCount('info')}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-700 rounded">
            <Check className="h-3 w-3 text-green-500" />
            <span>Success: {getNotificationTypeCount('success')}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-700 rounded">
            <AlertCircle className="h-3 w-3 text-yellow-500" />
            <span>Warning: {getNotificationTypeCount('warning')}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-700 rounded">
            <X className="h-3 w-3 text-red-500" />
            <span>Error: {getNotificationTypeCount('error')}</span>
          </div>
        </div>
      </div>

      {/* Список уведомлений */}
      <div className="space-y-2">
        {notifications.results.slice(0, 3).map((notification: NotificationList) => (
          <div
            key={notification.id}
            className={`mx-3 p-3 rounded-lg border transition-colors ${
              notification.is_read
                ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Иконка */}
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.notification_type)}
              </div>

              {/* Контент */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {notification.localized_title}
                  </h4>
                  {!notification.is_read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                  )}
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {notification.localized_message}
                </p>

                {/* Метаданные */}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(notification.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  <div className="flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {notification.notification_type_display}
                  </div>

                  {notification.related_object_type && (
                    <div className="flex items-center gap-1">
                      <span>Объект: {notification.related_object_type}</span>
                    </div>
                  )}
                </div>

                {/* Действия */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markAsReadMutation.isPending}
                        className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
                      >
                        <Check className="h-2 w-2" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNotification(notification.id)}
                      disabled={deleteNotificationMutation.isPending}
                      className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-2 w-2" />
                    </Button>
                  </div>

                  {/* Дополнительная информация */}
                  <div className="text-xs text-gray-400">ID: {notification.id}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Показать больше */}
      {notifications.results.length > 3 && (
        <div className="px-3 text-center">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() => (window.location.href = '/platform/notifications')}
          >
            Показать все ({notifications.results.length})
          </Button>
        </div>
      )}
    </div>
  );
};
