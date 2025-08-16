'use client';

import { Badge } from '@/shared/ui/base/badge';

interface StatusConfig {
  label: string;
  className: string;
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfigs: Record<string, StatusConfig> = {
  pending: {
    label: 'Ожидает',
    className: 'bg-yellow-100 text-yellow-800',
  },
  processing: {
    label: 'В обработке',
    className: 'bg-blue-100 text-blue-800',
  },
  completed: {
    label: 'Завершено',
    className: 'bg-green-100 text-green-800',
  },
  failed: {
    label: 'Ошибка',
    className: 'bg-red-100 text-red-800',
  },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfigs[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-800',
  };

  return (
    <Badge variant="secondary" className={`${config.className} ${className}`}>
      {config.label}
    </Badge>
  );
}
