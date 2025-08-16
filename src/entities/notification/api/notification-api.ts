import { apiClient } from '@/shared/config/axios';
import {
  Notification,
  PaginatedNotificationList,
  NotificationFilters,
  NotificationStats,
} from '../model/types';

export const notificationApi = {
  // Получить все уведомления пользователя с пагинацией и фильтрами
  getNotifications: async (filters?: NotificationFilters): Promise<PaginatedNotificationList> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(`/notifications/?${params.toString()}`);
    return response.data;
  },

  // Получить детальную информацию об уведомлении
  getNotification: async (id: number): Promise<Notification> => {
    const response = await apiClient.get(`/notifications/${id}/`);
    return response.data;
  },

  // Скачать файл из уведомления
  downloadNotification: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/notifications/${id}/download/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Получить статистику уведомлений
  getNotificationStats: async (): Promise<NotificationStats> => {
    const response = await apiClient.get('/notifications/stats/');
    return response.data;
  },

  // Отметить уведомление как прочитанное
  markAsRead: async (notificationIds: number[]): Promise<void> => {
    await apiClient.post('/notifications/mark-read/', {
      notification_ids: notificationIds,
    });
  },

  // Отметить все уведомления как прочитанные
  markAllAsRead: async (): Promise<void> => {
    await apiClient.post('/notifications/mark-all-read/');
  },

  // Удалить уведомление
  deleteNotification: async (notificationId: number): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}/`);
  },
};
