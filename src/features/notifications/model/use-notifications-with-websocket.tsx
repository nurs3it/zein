'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/shared/store';
import { useWebSocket } from '@/shared/hooks';
import { useNotificationsQuery, useNotificationStatsQuery } from './notifications-hooks';
import { addNotification } from './notifications-slice';
import { NotificationList } from '@/entities/notification/model/types';

interface UseNotificationsWithWebSocketOptions {
  websocketUrl: string;
  userId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useNotificationsWithWebSocket = ({
  websocketUrl,
  userId,
  autoRefresh = true,
  refreshInterval = 30000, // 30 секунд
}: UseNotificationsWithWebSocketOptions) => {
  const dispatch = useAppDispatch();

  // Хуки для API
  const notificationsQuery = useNotificationsQuery();
  const statsQuery = useNotificationStatsQuery();

  // Обработчик сообщений от WebSocket
  const handleWebSocketMessage = useCallback(
    (data: { type?: string; user_id?: string; notification?: NotificationList }) => {
      // Проверяем, что сообщение относится к уведомлениям
      if (data.type === 'notification' && data.user_id === userId) {
        // Добавляем новое уведомление в store
        if (data.notification) {
          dispatch(addNotification(data.notification));
        }

        // Инвалидируем кеш для обновления данных
        notificationsQuery.refetch();
        statsQuery.refetch();
      }
    },
    [dispatch, userId, notificationsQuery, statsQuery]
  );

  // WebSocket соединение
  const { isConnected, reconnect } = useWebSocket({
    url: websocketUrl,
    onMessage: handleWebSocketMessage,
    onOpen: () => {
      // eslint-disable-next-line no-console
      console.log('WebSocket connected for notifications');
    },
    onClose: () => {
      // eslint-disable-next-line no-console
      console.log('WebSocket disconnected for notifications');
    },
    onError: error => {
      // eslint-disable-next-line no-console
      console.error('WebSocket error for notifications:', error);
    },
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
  });

  // Автоматическое обновление данных
  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const interval = setInterval(() => {
      notificationsQuery.refetch();
      statsQuery.refetch();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, notificationsQuery, statsQuery]);

  // Переподключение при потере соединения
  useEffect(() => {
    if (!isConnected) {
      const timeout = setTimeout(() => {
        reconnect();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isConnected, reconnect]);

  return {
    isWebSocketConnected: isConnected,
    reconnectWebSocket: reconnect,
    refetchNotifications: notificationsQuery.refetch,
    refetchStats: statsQuery.refetch,
  };
};
