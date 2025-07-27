import { apiClient } from '@/shared/config/axios';

export const getNotifications = async () => {
  const response = await apiClient.get('/notifications');
  return response.data;
};
