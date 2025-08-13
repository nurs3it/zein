import { apiClient } from '@/shared/config/axios';
import { ApiResponse } from '@/shared/types/api';
import { Notification } from '../model/types';

export const notificationApi = {
  // Получить все уведомления пользователя
  getNotifications: async (): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.get('/notifications/');
    return response.data;
  },

  // Скачать уведомление
  downloadNotification: async (id: string): Promise<void> => {
    const response = await apiClient.get(`/notifications/${id}/download/`);
    return response.data;
  },

  // Получить непрочитанные уведомления
  getUnreadNotifications: async (): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.get('/notifications/unread/');
    return response.data;
  },

  // Отметить уведомление как прочитанное
  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`/notifications/${notificationId}/read/`);
  },

  // Отметить все уведомления как прочитанные
  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/mark-all-read/');
  },

  // Удалить уведомление
  deleteNotification: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}/`);
  },
};
