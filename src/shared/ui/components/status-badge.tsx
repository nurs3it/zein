'use client';

import { Badge } from '@/shared/ui/base/badge';
import { PenTool, Circle } from 'lucide-react';

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
    <div className="relative">
      <Badge
        variant="secondary"
        className={`${config.className} text-xs sm:text-sm transition-all duration-300 gap-2 ${className}`}
      >
        {/* Ненавязчивые анимации с иконками для объяснения состояния */}
        {status === 'pending' && (
          <div className="w-3 h-3 text-yellow-600 animate-ping opacity-70">
            <Circle className="w-3 h-3" />
          </div>
        )}

        {status === 'processing' && (
          <div className="w-3 h-3 text-blue-600 animate-pulse opacity-70">
            <PenTool className="w-3 h-3" />
          </div>
        )}
        {config.label}
      </Badge>
    </div>
  );
}
