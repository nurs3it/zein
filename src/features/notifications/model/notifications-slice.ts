import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  NotificationList,
  NotificationFilters,
  NotificationStats,
} from '@/entities/notification/model/types';

interface NotificationState {
  notifications: NotificationList[];
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  filters: NotificationFilters;
  stats: NotificationStats | null;
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
  unreadCount: 0,
  totalCount: 0,
  currentPage: 1,
  hasNextPage: false,
  hasPrevPage: false,
  filters: {
    page_size: 20,
    ordering: '-created_at',
  },
  stats: null,
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setNotifications: (
      state,
      action: PayloadAction<{
        notifications: NotificationList[];
        totalCount: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      }>
    ) => {
      state.notifications = action.payload.notifications;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.currentPage;
      state.hasNextPage = action.payload.hasNextPage;
      state.hasPrevPage = action.payload.hasPrevPage;
      state.unreadCount = action.payload.notifications.filter(n => !n.is_read).length;
      state.error = null;
    },

    addNotification: (state, action: PayloadAction<NotificationList>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
      state.totalCount += 1;
    },

    markAsRead: (state, action: PayloadAction<number[]>) => {
      const ids = new Set(action.payload);
      state.notifications.forEach(notification => {
        if (ids.has(notification.id) && !notification.is_read) {
          notification.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
    },

    markAllAsRead: state => {
      state.notifications.forEach(n => {
        if (!n.is_read) {
          n.is_read = true;
        }
      });
      state.unreadCount = 0;
    },

    removeNotification: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.is_read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
      state.totalCount = Math.max(0, state.totalCount - 1);
    },

    setFilters: (state, action: PayloadAction<Partial<NotificationFilters>>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
      state.currentPage = 1;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
      state.filters.page = action.payload;
    },

    setStats: (state, action: PayloadAction<NotificationStats>) => {
      state.stats = action.payload;
      state.unreadCount = action.payload.unread_count;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: state => {
      state.error = null;
    },

    clearNotifications: state => {
      state.notifications = [];
      state.totalCount = 0;
      state.currentPage = 1;
      state.hasNextPage = false;
      state.hasPrevPage = false;
      state.unreadCount = 0;
    },
  },
});

export const {
  setLoading,
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  setFilters,
  setPage,
  setStats,
  setError,
  clearError,
  clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
