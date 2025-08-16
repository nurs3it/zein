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
  ChevronDown,
  ChevronUp,
  FileText,
  Tag,
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
      hour: '2-digit',
      minute: '2-digit',
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
      className={`transition-all duration-200 hover:shadow-md ${
        notification.is_read
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
          : 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700'
      }`}
    >
      <div className="p-4">
        {/* Верхняя строка: заголовок, статус, время */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Иконка типа */}
            <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.notification_type)}</div>

            {/* Заголовок и метаданные */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4
                  className={`text-base font-semibold truncate ${
                    notification.is_read
                      ? 'text-gray-600 dark:text-gray-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {notification.localized_title}
                </h4>

                {/* Статус "Новое" */}
                {!notification.is_read && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1"
                  >
                    Новое
                  </Badge>
                )}
              </div>

              {/* Приоритет и категория */}
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-1 ${getTypeColor(notification.notification_type)}`}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {notification.notification_type_display}
                </Badge>
              </div>
            </div>
          </div>

          {/* Время и статус */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              {formatDate(notification.created_at)}
            </div>

            {/* Статус прочтения */}
            <div className="flex items-center gap-1 text-xs">
              <div
                className={`h-2 w-2 rounded-full ${
                  notification.is_read ? 'bg-gray-400 dark:bg-gray-500' : 'bg-blue-500'
                }`}
              ></div>
              <span className="text-gray-500 dark:text-gray-400">
                {notification.is_read ? 'Прочитано' : 'Непрочитано'}
              </span>
            </div>
          </div>
        </div>

        {/* Сообщение */}
        <div className="mb-3">
          <p
            className={`text-sm leading-relaxed ${
              notification.is_read
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {notification.localized_message}
          </p>
        </div>

        {/* Информационная панель */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
          {/* Левая колонка */}
          <div className="space-y-2">
            {/* ID уведомления */}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Tag className="h-3 w-3" />
              <span>ID: {notification.id}</span>
            </div>

            {/* Связанный объект */}
            {notification.related_object_type && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <ExternalLink className="h-3 w-3" />
                <span>Тип: {notification.related_object_type}</span>
              </div>
            )}

            {/* Файл */}
            {notification.file_name && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <FileText className="h-3 w-3" />
                <span>Файл: {notification.file_name}</span>
              </div>
            )}
          </div>

          {/* Правая колонка */}
          <div className="space-y-2">
            {/* Категория */}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Tag className="h-3 w-3" />
              <span>Категория: {notification.notification_type_display}</span>
            </div>

            {/* Дата создания */}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>Создано: {formatDate(notification.created_at)}</span>
            </div>

            {/* Статус прочтения */}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div
                className={`h-2 w-2 rounded-full ${
                  notification.is_read ? 'bg-gray-400 dark:bg-gray-500' : 'bg-blue-500'
                }`}
              ></div>
              <span>Статус: {notification.is_read ? 'Прочитано' : 'Непрочитано'}</span>
            </div>
          </div>
        </div>

        {/* Нижняя строка: действия */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          {/* Левая сторона: кнопка расширения */}
          <div className="flex items-center gap-2">
            {(notification.file_name || notification.related_object_type) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-8 px-2"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Скрыть детали
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Показать детали
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Правая сторона: основные действия */}
          <div className="flex items-center gap-2">
            {!notification.is_read && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAsRead}
                disabled={isMarkingAsRead}
                className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 h-8 px-3"
              >
                <Check className="h-3 w-3 mr-1" />
                Прочитано
              </Button>
            )}

            {notification.file_path && onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 h-8 px-3"
              >
                <Download className="h-3 w-3 mr-1" />
                Скачать
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-900/20 h-8 px-3"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Удалить
            </Button>
          </div>
        </div>

        {/* Дополнительная информация (развернутая) */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="space-y-2">
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Техническая информация
                </h5>
                <div>ID уведомления: {notification.id}</div>
                <div>Создано: {new Date(notification.created_at).toISOString()}</div>
                <div>Тип: {notification.notification_type}</div>
                <div>Статус: {notification.is_read ? 'Прочитано' : 'Непрочитано'}</div>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Файловая информация
                </h5>
                {notification.file_path && <div>Путь: {notification.file_path}</div>}
                {notification.file_name && <div>Имя: {notification.file_name}</div>}
                {notification.related_object_type && (
                  <div>Связанный объект: {notification.related_object_type}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
