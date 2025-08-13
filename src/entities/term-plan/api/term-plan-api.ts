import { apiClient } from '@/shared/config/axios';
import { ApiResponse } from '@/shared/types/api';
import { ShortTermPlan, ShortTermPlanRequest, TermPlanFilters } from '../model/types';

export const termPlanApi = {
  // Получить краткосрочные планы
  getShortTermPlans: async (filters?: TermPlanFilters): Promise<ApiResponse<ShortTermPlan>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`/term-plan/short-term-plans/?${params.toString()}`);
    return response.data;
  },

  // Получить краткосрочный план по ID
  getShortTermPlan: async (id: number): Promise<ShortTermPlan> => {
    const response = await apiClient.get(`/term-plan/short-term-plans/${id}/`);
    return response.data;
  },

  // Создать краткосрочный план
  createShortTermPlan: async (data: ShortTermPlanRequest): Promise<ShortTermPlan> => {
    const response = await apiClient.post('/term-plan/short-term-plans/', data);
    return response.data;
  },

  // Обновить краткосрочный план
  updateShortTermPlan: async (
    id: number,
    data: Partial<ShortTermPlanRequest>
  ): Promise<ShortTermPlan> => {
    const response = await apiClient.patch(`/term-plan/short-term-plans/${id}/`, data);
    return response.data;
  },

  // Удалить краткосрочный план
  deleteShortTermPlan: async (id: number): Promise<void> => {
    await apiClient.delete(`/term-plan/short-term-plans/${id}/`);
  },
};
