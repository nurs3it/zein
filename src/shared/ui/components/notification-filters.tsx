'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/base/button';
import { Input } from '@/shared/ui/base/input';
import { Label } from '@/shared/ui/base/label';
import { SelectFieldComponent } from '@/shared/ui/components/select-field';
import { Card } from '@/shared/ui/base/card';
import { Filter, X } from 'lucide-react';
import {
  NotificationFilters,
  NotificationType,
  NotificationStatus,
} from '@/entities/notification/model/types';

interface NotificationFiltersProps {
  filters: NotificationFilters;
  onFiltersChange: (filters: Partial<NotificationFilters>) => void;
  onClearFilters: () => void;
}

const notificationTypes: { value: NotificationType; label: string }[] = [
  { value: 'info', label: 'Информация' },
  { value: 'success', label: 'Успех' },
  { value: 'warning', label: 'Предупреждение' },
  { value: 'error', label: 'Ошибка' },
  { value: 'system', label: 'Система' },
];

const notificationStatuses: { value: NotificationStatus; label: string }[] = [
  { value: 'pending', label: 'В ожидании' },
  { value: 'sent', label: 'Отправлено' },
  { value: 'read', label: 'Прочитано' },
  { value: 'failed', label: 'Ошибка' },
];

export const NotificationFiltersComponent = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: NotificationFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (
    key: keyof NotificationFilters,
    value: string | boolean | number | undefined
  ) => {
    onFiltersChange({ [key]: value });
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) =>
      value !== undefined &&
      value !== null &&
      value !== '' &&
      key !== 'page_size' &&
      key !== 'ordering'
  );

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Фильтры</h3>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Очистить
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Скрыть' : 'Показать'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Поиск</Label>
            <Input
              id="search"
              placeholder="Поиск по тексту..."
              value={filters.search || ''}
              onChange={e => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification_type">Тип уведомления</Label>
            <SelectFieldComponent
              id="notification_type"
              value={filters.notification_type || ''}
              onValueChange={value => handleFilterChange('notification_type', value || undefined)}
              placeholder="Все типы"
            >
              {notificationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </SelectFieldComponent>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Статус</Label>
            <SelectFieldComponent
              id="status"
              value={filters.status || ''}
              onValueChange={value => handleFilterChange('status', value || undefined)}
              placeholder="Все статусы"
            >
              {notificationStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </SelectFieldComponent>
          </div>

          <div className="space-y-2">
            <Label htmlFor="is_read">Прочитано</Label>
            <SelectFieldComponent
              id="is_read"
              value={filters.is_read?.toString() || ''}
              onValueChange={value =>
                handleFilterChange(
                  'is_read',
                  value === 'true' ? true : value === 'false' ? false : undefined
                )
              }
              placeholder="Все"
            >
              <option value="">Все</option>
              <option value="true">Прочитано</option>
              <option value="false">Не прочитано</option>
            </SelectFieldComponent>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_from">Дата с</Label>
            <Input
              id="date_from"
              type="date"
              value={filters.date_from || ''}
              onChange={e => handleFilterChange('date_from', e.target.value || undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_to">Дата по</Label>
            <Input
              id="date_to"
              type="date"
              value={filters.date_to || ''}
              onChange={e => handleFilterChange('date_to', e.target.value || undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page_size">На странице</Label>
            <SelectFieldComponent
              id="page_size"
              value={filters.page_size?.toString() || '20'}
              onValueChange={value => handleFilterChange('page_size', parseInt(value))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </SelectFieldComponent>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ordering">Сортировка</Label>
            <SelectFieldComponent
              id="ordering"
              value={filters.ordering || '-created_at'}
              onValueChange={value => handleFilterChange('ordering', value)}
            >
              <option value="-created_at">Сначала новые</option>
              <option value="created_at">Сначала старые</option>
              <option value="-updated_at">По обновлению (новые)</option>
              <option value="updated_at">По обновлению (старые)</option>
            </SelectFieldComponent>
          </div>
        </div>
      )}
    </Card>
  );
};
