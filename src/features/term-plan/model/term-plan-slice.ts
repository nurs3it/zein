import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShortTermPlan, TermPlanFilters } from '@/entities/term-plan';

interface TermPlanState {
  // Краткосрочные планы
  shortTermPlans: ShortTermPlan[];
  shortTermPlansLoading: boolean;
  shortTermPlansError: string | null;

  // Фильтры
  filters: TermPlanFilters;

  // Пагинация
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

const initialState: TermPlanState = {
  shortTermPlans: [],
  shortTermPlansLoading: false,
  shortTermPlansError: null,

  filters: {
    page: 1,
    page_size: 10,
  },

  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalCount: 0,
};

export const termPlanSlice = createSlice({
  name: 'termPlan',
  initialState,
  reducers: {
    // Краткосрочные планы
    setShortTermPlansLoading: (state, action: PayloadAction<boolean>) => {
      state.shortTermPlansLoading = action.payload;
    },
    setShortTermPlans: (state, action: PayloadAction<ShortTermPlan[]>) => {
      state.shortTermPlans = action.payload;
    },
    setShortTermPlansError: (state, action: PayloadAction<string | null>) => {
      state.shortTermPlansError = action.payload;
    },
    addShortTermPlan: (state, action: PayloadAction<ShortTermPlan>) => {
      state.shortTermPlans.unshift(action.payload);
    },
    updateShortTermPlan: (state, action: PayloadAction<ShortTermPlan>) => {
      const index = state.shortTermPlans.findIndex(plan => plan.id === action.payload.id);
      if (index !== -1) {
        state.shortTermPlans[index] = action.payload;
      }
    },
    removeShortTermPlan: (state, action: PayloadAction<number>) => {
      state.shortTermPlans = state.shortTermPlans.filter(plan => plan.id !== action.payload);
    },

    // Фильтры и пагинация
    setFilters: (state, action: PayloadAction<Partial<TermPlanFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
      state.filters.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.filters.page_size = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<{ currentPage: number; totalPages: number; totalCount: number }>
    ) => {
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalCount = action.payload.totalCount;
    },

    // Очистка ошибок
    clearErrors: state => {
      state.shortTermPlansError = null;
    },

    // Сброс состояния
    resetTermPlanState: _state => {
      return { ...initialState };
    },
  },
});

export const {
  // Краткосрочные планы
  setShortTermPlansLoading,
  setShortTermPlans,
  setShortTermPlansError,
  addShortTermPlan,
  updateShortTermPlan,
  removeShortTermPlan,

  // Фильтры и пагинация
  setFilters,
  setCurrentPage,
  setPageSize,
  setPagination,

  // Общие
  clearErrors,
  resetTermPlanState,
} = termPlanSlice.actions;

export default termPlanSlice.reducer;
