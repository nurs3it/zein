import { useAppSelector, useAppDispatch } from '@/shared/store';
import { notificationApi } from '@/entities/notification/api/notification-api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  markAsRead as markAsReadAction,
  markAllAsRead as markAllAsReadAction,
  removeNotification as removeNotificationAction,
} from './notifications-slice';
import { NotificationFilters } from '@/entities/notification/model/types';

export const useNotifications = () => {
  const {
    notifications,
    isLoading,
    error,
    unreadCount,
    totalCount,
    currentPage,
    hasNextPage,
    hasPrevPage,
    filters,
    stats,
  } = useAppSelector(state => state.notifications);

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    totalCount,
    currentPage,
    hasNextPage,
    hasPrevPage,
    filters,
    stats,
  };
};

// React Query хуки для работы с API
export const useNotificationsQuery = (filters?: NotificationFilters) => {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => notificationApi.getNotifications(filters),
    staleTime: 2 * 60 * 1000, // 2 минуты
  });
};

export const useNotificationStatsQuery = () => {
  return useQuery({
    queryKey: ['notifications', 'stats'],
    queryFn: notificationApi.getNotificationStats,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: (_, notificationIds) => {
      dispatch(markAsReadAction(notificationIds));
      // Инвалидируем кеш уведомлений
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats'] });
    },
  });
};

export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      dispatch(markAllAsReadAction());
      // Инвалидируем кеш уведомлений
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats'] });
    },
  });
};

export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: (_, notificationId) => {
      dispatch(removeNotificationAction(notificationId));
      // Инвалидируем кеш уведомлений
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats'] });
    },
  });
};

export const useDownloadNotification = () => {
  return useMutation({
    mutationFn: notificationApi.downloadNotification,
    onSuccess: (blob, notificationId) => {
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notification-${notificationId}.pdf`; // или другое имя файла
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
};
