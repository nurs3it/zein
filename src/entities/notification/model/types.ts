export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
}
