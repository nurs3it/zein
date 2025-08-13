import { apiClient } from '@/shared/config/axios';
import { UserProfile } from '../model/types';

export const userApi = {
  // Получить профиль текущего пользователя
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  // Обновить профиль пользователя
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.put('/user/profile', data);
    return response.data;
  },

  // Загрузить аватар
  uploadAvatar: async (file: File): Promise<{ avatar: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Изменить пароль
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await apiClient.post('/user/change-password', data);
  },

  // Удалить аккаунт
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/user/account');
  },
};
