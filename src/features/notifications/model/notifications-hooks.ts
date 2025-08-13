import { useAppSelector } from '@/shared/store';
import { notificationApi } from '@/entities/notification/api/notification-api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useNotifications = () => {
  const { notifications, isLoading, error, unreadCount } = useAppSelector(
    state => state.notifications
  );

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
  };
};

// React Query хуки для работы с API
export const useNotificationsQuery = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.getNotifications,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const useUnreadNotificationsQuery = () => {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: notificationApi.getUnreadNotifications,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });
};

export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      // Инвалидируем кеш уведомлений
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      // Инвалидируем кеш уведомлений
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: () => {
      // Инвалидируем кеш уведомлений
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
