import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useTermPlanSelector } from '@/shared/store';
import { termPlanApi } from '@/entities/term-plan';
import {
  setShortTermPlansLoading,
  setShortTermPlans,
  setShortTermPlansError,
  setPagination,
  addShortTermPlan,
  updateShortTermPlan,
  removeShortTermPlan,
} from './term-plan-slice';
import { TermPlanFilters, ShortTermPlanRequest } from '@/entities/term-plan';

// Ключи для кеширования
export const TERM_PLAN_KEYS = {
  shortTermPlans: ['term-plan', 'short-term-plans'] as const,
  shortTermPlan: (id: number) => ['term-plan', 'short-term-plan', id] as const,
} as const;

// Хуки для краткосрочных планов
export const useShortTermPlans = (filters?: TermPlanFilters) => {
  const dispatch = useAppDispatch();
  const { shortTermPlans, shortTermPlansLoading, shortTermPlansError } = useTermPlanSelector();

  const query = useQuery({
    queryKey: [...TERM_PLAN_KEYS.shortTermPlans, filters],
    queryFn: () => termPlanApi.getShortTermPlans(filters),
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  // Синхронизируем состояние с Redux
  React.useEffect(() => {
    if (query.data) {
      dispatch(setShortTermPlans(query.data.results));
      dispatch(
        setPagination({
          currentPage: Math.ceil(query.data.count / 10), // Примерная логика для пагинации
          totalPages: Math.ceil(query.data.count / 10),
          totalCount: query.data.count,
        })
      );
    }
  }, [query.data, dispatch]);

  React.useEffect(() => {
    dispatch(setShortTermPlansLoading(query.isLoading));
  }, [query.isLoading, dispatch]);

  React.useEffect(() => {
    if (query.error) {
      dispatch(setShortTermPlansError(query.error.message));
    } else {
      dispatch(setShortTermPlansError(null));
    }
  }, [query.error, dispatch]);

  return {
    ...query,
    shortTermPlans,
    shortTermPlansLoading,
    shortTermPlansError,
  };
};

export const useShortTermPlan = (id: number) => {
  return useQuery({
    queryKey: TERM_PLAN_KEYS.shortTermPlan(id),
    queryFn: () => termPlanApi.getShortTermPlan(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateShortTermPlan = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShortTermPlanRequest) => termPlanApi.createShortTermPlan(data),
    onSuccess: data => {
      dispatch(addShortTermPlan(data));
      queryClient.invalidateQueries({ queryKey: TERM_PLAN_KEYS.shortTermPlans });
    },
  });
};

export const useUpdateShortTermPlan = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ShortTermPlanRequest> }) =>
      termPlanApi.updateShortTermPlan(id, data),
    onSuccess: data => {
      dispatch(updateShortTermPlan(data));
      queryClient.invalidateQueries({ queryKey: TERM_PLAN_KEYS.shortTermPlans });
      queryClient.invalidateQueries({ queryKey: TERM_PLAN_KEYS.shortTermPlan(data.id) });
    },
  });
};

export const useDeleteShortTermPlan = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => termPlanApi.deleteShortTermPlan(id),
    onSuccess: (_, id) => {
      dispatch(removeShortTermPlan(id));
      queryClient.invalidateQueries({ queryKey: TERM_PLAN_KEYS.shortTermPlans });
    },
  });
};
