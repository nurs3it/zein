'use client';

import { Card } from '@/shared/ui/base/card';
import { Badge } from '@/shared/ui/base/badge';
import { Bell, CheckCircle, AlertTriangle, XCircle, Info, Settings } from 'lucide-react';
import { NotificationStats as NotificationStatsType } from '@/entities/notification/model/types';

interface NotificationStatsProps {
  stats: NotificationStatsType;
  className?: string;
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
      return <Bell className="h-5 w-5 text-gray-500" />;
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

export const NotificationStats = ({ stats, className = '' }: NotificationStatsProps) => {
  // Обеспечиваем значения по умолчанию для безопасной работы
  const byType = stats.by_type || {};
  const byStatus = stats.by_status || {};

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Общее количество */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Всего уведомлений
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total_notifications || 0}
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </Card>

      {/* Непрочитанные */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Непрочитанные</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.unread_count || 0}
            </p>
          </div>
          <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
            >
              {stats.unread_count || 0}
            </Badge>
          </div>
        </div>
      </Card>

      {/* По типам */}
      <Card className="p-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">По типам</p>
          <div className="space-y-2">
            {Object.keys(byType).length > 0 ? (
              Object.entries(byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(type)}
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {type === 'system' ? 'Система' : type}
                    </span>
                  </div>
                  <Badge variant="outline" className={getTypeColor(type)}>
                    {count}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                Нет данных
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* По статусам */}
      <Card className="p-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">По статусам</p>
          <div className="space-y-2">
            {Object.keys(byStatus).length > 0 ? (
              Object.entries(byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {status === 'pending'
                      ? 'В ожидании'
                      : status === 'sent'
                        ? 'Отправлено'
                        : status === 'read'
                          ? 'Прочитано'
                          : 'Ошибка'}
                  </span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                Нет данных
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
