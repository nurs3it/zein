'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/base/button';
import { Badge } from '@/shared/ui/base/badge';
import { Card } from '@/shared/ui/base/card';
import {
  Check,
  Trash2,
  Download,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Settings,
  Clock,
} from 'lucide-react';
import { NotificationList } from '@/entities/notification/model/types';

interface NotificationItemProps {
  notification: NotificationList;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  onDownload?: (id: number) => void;
  isMarkingAsRead?: boolean;
  isDeleting?: boolean;
  isDownloading?: boolean;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'system':
      return <Settings className="h-5 w-5 text-purple-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'info':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'system':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'Только что';
  } else if (diffInHours < 24) {
    return `${diffInHours} ч. назад`;
  } else if (diffInHours < 48) {
    return 'Вчера';
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
};

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  onDownload,
  isMarkingAsRead = false,
  isDeleting = false,
  isDownloading = false,
}: NotificationItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMarkAsRead = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = () => {
    onDelete(notification.id);
  };

  const handleDownload = () => {
    if (onDownload && notification.file_path) {
      onDownload(notification.id);
    }
  };

  return (
    <Card
      className={`p-4 transition-all duration-200 hover:shadow-md ${
        notification.is_read
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
          : 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Иконка типа */}
        <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.notification_type)}</div>

        {/* Основной контент */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4
                  className={`text-sm font-medium ${
                    notification.is_read
                      ? 'text-gray-600 dark:text-gray-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {notification.localized_title}
                </h4>
                <Badge
                  variant="outline"
                  className={`text-xs ${getTypeColor(notification.notification_type)}`}
                >
                  {notification.notification_type_display}
                </Badge>
                {!notification.is_read && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    Новое
                  </Badge>
                )}
              </div>

              <p
                className={`text-sm ${
                  notification.is_read
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-gray-700 dark:text-gray-300'
                } mb-2`}
              >
                {notification.localized_message}
              </p>

              {/* Метаданные */}
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(notification.created_at)}
                </div>

                {notification.related_object_type && (
                  <div className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    {notification.related_object_type}
                  </div>
                )}
              </div>

              {/* Дополнительная информация */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-medium">ID:</span> {notification.id}
                    </div>
                    {notification.file_name && (
                      <div>
                        <span className="font-medium">Файл:</span> {notification.file_name}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Действия */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {!notification.is_read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAsRead}
                  disabled={isMarkingAsRead}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                  title="Отметить как прочитанное"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}

              {notification.file_path && onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  title="Скачать файл"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Удалить уведомление"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка расширения */}
      {(notification.file_name || notification.related_object_type) && (
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isExpanded ? 'Скрыть детали' : 'Показать детали'}
          </Button>
        </div>
      )}
    </Card>
  );
};
