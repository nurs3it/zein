'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/shared/store';
import {
  NotificationFiltersComponent,
  NotificationStats as NotificationStatsComponent,
  NotificationItem,
  Pagination,
  PageWrapper,
  PageHeader,
  LoadingFallback,
} from '@/shared/ui/components';
import { Button } from '@/shared/ui/base/button';
import { Card } from '@/shared/ui/base/card';
import { Bell, Check, RefreshCw } from 'lucide-react';
import {
  useNotifications,
  useNotificationsQuery,
  useNotificationStatsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDownloadNotification,
} from '../model/notifications-hooks';
import {
  setFilters,
  setPage,
  setNotifications,
  setStats,
  setLoading,
  clearNotifications,
} from '../model/notifications-slice';
import { NotificationFilters } from '@/entities/notification/model/types';

export const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const { notifications, isLoading, error, unreadCount, totalCount, currentPage, filters, stats } =
    useNotifications();

  // Состояние для выбранных уведомлений
  const [selectedNotifications, setSelectedNotifications] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Хуки для API
  const { data: notificationsData, isLoading: isLoadingNotifications } =
    useNotificationsQuery(filters);
  const { data: statsData } = useNotificationStatsQuery();
  const markAsReadMutation = useMarkAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();
  const deleteNotificationMutation = useDeleteNotificationMutation();
  const downloadNotificationMutation = useDownloadNotification();

  // Обработка данных при изменении
  useEffect(() => {
    if (notificationsData) {
      const currentPage = filters?.page || 1;
      const hasNextPage = !!notificationsData.next;
      const hasPrevPage = !!notificationsData.previous;

      dispatch(
        setNotifications({
          notifications: notificationsData.results,
          totalCount: notificationsData.count,
          currentPage,
          hasNextPage,
          hasPrevPage,
        })
      );
    }
  }, [notificationsData, dispatch, filters?.page]);

  useEffect(() => {
    if (statsData) {
      dispatch(setStats(statsData));
    }
  }, [statsData, dispatch]);

  useEffect(() => {
    dispatch(setLoading(isLoadingNotifications));
  }, [isLoadingNotifications, dispatch]);

  // Обработчики
  const handleFiltersChange = (newFilters: Partial<NotificationFilters>) => {
    dispatch(setFilters(newFilters));
    setSelectedNotifications(new Set());
    setSelectAll(false);
  };

  const handleClearFilters = () => {
    dispatch(
      setFilters({
        page_size: 20,
        ordering: '-created_at',
      })
    );
    setSelectedNotifications(new Set());
    setSelectAll(false);
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    setSelectedNotifications(new Set());
    setSelectAll(false);
  };

  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate([notificationId]);
  };

  const handleMarkSelectedAsRead = () => {
    if (selectedNotifications.size > 0) {
      markAsReadMutation.mutate(Array.from(selectedNotifications));
      setSelectedNotifications(new Set());
      setSelectAll(false);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
    setSelectedNotifications(new Set());
    setSelectAll(false);
  };

  const handleDeleteNotification = (notificationId: number) => {
    deleteNotificationMutation.mutate(notificationId);
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.size > 0) {
      Array.from(selectedNotifications).forEach(id => {
        deleteNotificationMutation.mutate(id);
      });
      setSelectedNotifications(new Set());
      setSelectAll(false);
    }
  };

  const handleDownloadNotification = (notificationId: number) => {
    downloadNotificationMutation.mutate(notificationId);
  };

  const handleSelectNotification = (notificationId: number, checked: boolean) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(notificationId);
      } else {
        newSet.delete(notificationId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(new Set(notifications.map(n => n.id)));
      setSelectAll(true);
    } else {
      setSelectedNotifications(new Set());
      setSelectAll(false);
    }
  };

  const handleRefresh = () => {
    dispatch(clearNotifications());
    // Перезагружаем данные
    window.location.reload();
  };

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(totalCount / (filters.page_size || 20));

  if (error) {
    return (
      <PageWrapper>
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">Ошибка загрузки уведомлений: {error}</div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Попробовать снова
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader title="Уведомления" icon={<Bell className="h-6 w-6" />} />

      {/* Статистика */}
      {stats && (
        <div className="mb-6">
          <NotificationStatsComponent stats={stats} />
        </div>
      )}

      {/* Фильтры */}
      <NotificationFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Действия с выбранными */}
      {selectedNotifications.size > 0 && (
        <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Выбрано: {selectedNotifications.size}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkSelectedAsRead}
                disabled={markAsReadMutation.isPending}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Отметить как прочитанные
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={deleteNotificationMutation.isPending}
                className="text-red-600 hover:text-red-700"
              >
                Удалить выбранные
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Заголовок списка */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Уведомления ({totalCount})</h2>
          {unreadCount > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Непрочитанных: {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="text-green-600 hover:text-green-700"
            >
              <Check className="h-4 w-4 mr-1" />
              Отметить все как прочитанные
            </Button>
          )}
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Обновить
          </Button>
        </div>
      </div>

      {/* Список уведомлений */}
      {isLoading ? (
        <LoadingFallback />
      ) : notifications.length === 0 ? (
        <Card className="p-8 text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Нет уведомлений
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            У вас пока нет уведомлений. Они появятся здесь, когда будут доступны.
          </p>
        </Card>
      ) : (
        <>
          {/* Заголовок таблицы с чекбоксом */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={e => handleSelectAll(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Выбрать все
              </span>
            </div>
          </Card>

          {/* Список уведомлений */}
          <div className="space-y-3 mb-6">
            {notifications.map(notification => (
              <div key={notification.id} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedNotifications.has(notification.id)}
                  onChange={e => handleSelectNotification(notification.id, e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-4"
                />
                <div className="flex-1">
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDeleteNotification}
                    onDownload={handleDownloadNotification}
                    isMarkingAsRead={markAsReadMutation.isPending}
                    isDeleting={deleteNotificationMutation.isPending}
                    isDownloading={downloadNotificationMutation.isPending}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mb-6"
            />
          )}
        </>
      )}
    </PageWrapper>
  );
};
