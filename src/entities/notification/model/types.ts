export interface Notification {
  id: number;
  recipient: number;
  title_ru: string | null;
  message_ru: string | null;
  notification_type: NotificationType;
  notification_type_display: string;
  status: NotificationStatus;
  status_display: string;
  localized_title: string;
  localized_message: string;
  push_sent: boolean;
  push_sent_at: string | null;
  email_sent: boolean;
  email_sent_at: string | null;
  read_at: string | null;
  is_read: boolean;
  is_sent: boolean;
  created_at: string;
  updated_at: string;
  file_path: string | null;
  file_name: string | null;
  related_object_id: number | null;
  related_object_type: string | null;
}

export interface NotificationList {
  id: number;
  notification_type: NotificationType;
  notification_type_display: string;
  localized_title: string;
  localized_message: string;
  is_read: boolean;
  created_at: string;
  file_path: string | null;
  file_name: string | null;
  related_object_id: number | null;
  related_object_type: string | null;
}

export interface PaginatedNotificationList {
  count: number;
  next: string | null;
  previous: string | null;
  results: NotificationList[];
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';
export type NotificationStatus = 'pending' | 'sent' | 'read' | 'failed';

export interface NotificationFilters {
  created_after?: string;
  created_before?: string;
  date_from?: string;
  date_to?: string;
  email_sent?: boolean;
  is_read?: boolean;
  notification_type?: NotificationType;
  push_sent?: boolean;
  read_after?: string;
  read_before?: string;
  status?: NotificationStatus;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface NotificationStats {
  by_type: Record<NotificationType, number>;
  by_status: Record<NotificationStatus, number>;
  filters_applied: boolean;
  read_count: number;
  recent_count: number;
  total_notifications: number;
  unread_count: number;
}
