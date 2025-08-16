'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/shared/store';
import { NotificationItem, PageWrapper, PageHeader, LoadingFallback } from '@/shared/ui/components';
import { Button } from '@/shared/ui/base/button';
import { Card } from '@/shared/ui/base/card';
import { Bell, Check, RefreshCw, Filter, X } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);

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
        <div className="text-center py-6 px-4">
          <div className="text-red-600 mb-3 text-sm">Ошибка загрузки уведомлений: {error}</div>
          <Button onClick={handleRefresh} variant="outline" className="w-full sm:w-auto">
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

      {/* Компактная статистика и быстрые действия */}
      <Card className="mb-3 p-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Статистика */}
          {stats && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{totalCount}</span>
                <span className="text-gray-500">всего</span>
              </div>
              {unreadCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  <span className="font-medium text-orange-600">{unreadCount}</span>
                  <span className="text-gray-500">новых</span>
                </div>
              )}
            </div>
          )}

          {/* Быстрые действия */}
          <div className="flex items-center gap-2 ml-auto">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="text-green-600 hover:text-green-700 h-7 px-2"
              >
                <Check className="h-3 w-3 mr-1" />
                Все прочитаны
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-7 px-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Обновить
            </Button>
          </div>
        </div>
      </Card>

      {/* Компактные фильтры */}
      <Card className="mb-3 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Фильтры</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-6 px-2 text-xs"
            >
              {showFilters ? 'Скрыть' : 'Показать'}
            </Button>
            {(filters.page_size !== 20 || filters.ordering !== '-created_at') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
              >
                <X className="h-3 w-3 mr-1" />
                Сбросить
              </Button>
            )}
          </div>
        </div>

        {/* Основные фильтры всегда видны */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={filters.ordering}
            onChange={e => handleFiltersChange({ ordering: e.target.value })}
            className="h-7 px-2 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="-created_at">Сначала новые</option>
            <option value="created_at">Сначала старые</option>
          </select>

          <select
            value={filters.page_size}
            onChange={e => handleFiltersChange({ page_size: Number(e.target.value), page: 1 })}
            className="h-7 px-2 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>10 на странице</option>
            <option value={20}>20 на странице</option>
            <option value={50}>50 на странице</option>
          </select>
        </div>

        {/* Дополнительные фильтры */}
        {showFilters && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.is_read === undefined ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFiltersChange({ is_read: undefined })}
                className="h-6 px-2 text-xs"
              >
                Все
              </Button>
              <Button
                variant={filters.is_read === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFiltersChange({ is_read: false })}
                className="h-6 px-2 text-xs"
              >
                Непрочитанные
              </Button>
              <Button
                variant={filters.is_read === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFiltersChange({ is_read: true })}
                className="h-6 px-2 text-xs"
              >
                Прочитанные
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Действия с выбранными - компактно */}
      {selectedNotifications.size > 0 && (
        <Card className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Выбрано: {selectedNotifications.size}
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkSelectedAsRead}
                disabled={markAsReadMutation.isPending}
                className="text-green-600 hover:text-green-700 h-7 px-2"
              >
                <Check className="h-3 w-3 mr-1" />
                Прочитаны
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={deleteNotificationMutation.isPending}
                className="text-red-600 hover:text-red-700 h-7 px-2"
              >
                Удалить
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Список уведомлений */}
      {isLoading ? (
        <LoadingFallback />
      ) : notifications.length === 0 ? (
        <Card className="p-6 text-center">
          <Bell className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Нет уведомлений
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            У вас пока нет уведомлений. Они появятся здесь, когда будут доступны.
          </p>
        </Card>
      ) : (
        <>
          {/* Заголовок списка с чекбоксом */}
          <Card className="mb-3 p-2">
            <div className="flex items-center justify-between">
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
                <span className="text-sm text-gray-500">({totalCount} уведомлений)</span>
              </div>
            </div>
          </Card>

          {/* Список уведомлений */}
          <div className="space-y-2 mb-4">
            {notifications.map(notification => (
              <div key={notification.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={selectedNotifications.has(notification.id)}
                  onChange={e => handleSelectNotification(notification.id, e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-3"
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

          {/* Упрощенная пагинация */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3"
              >
                Назад
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400 px-3">
                {currentPage} из {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3"
              >
                Вперед
              </Button>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
};
