// Shared constants
export const APP_NAME = 'Zein';
export const APP_VERSION = '1.0.0';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  USER: {
    PROFILE: '/user/profile',
    AVATAR: '/user/avatar',
    PASSWORD: '/user/change-password',
    ACCOUNT: '/user/account',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD: '/notifications/unread',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: '/notifications/:id',
  },
} as const;

// Theme constants
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;
