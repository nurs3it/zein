'use client';

import { Card } from '@/shared/ui/base/card';
import { Badge } from '@/shared/ui/base/badge';
import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  onClick: () => void;
  className?: string;
}

export function ActionCard({
  title,
  description,
  icon,
  color,
  onClick,
  className = '',
}: ActionCardProps) {
  return (
    <Card
      className={`p-6 hover:shadow-lg transition-shadow cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-3 bg-${color}-100 dark:bg-${color}-900 rounded-lg`}>
              <div className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`}>{icon}</div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Badge
              variant="secondary"
              className={`bg-${color}-100 text-${color}-800 hover:bg-${color}-200`}
            >
              Открыть
            </Badge>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </div>
    </Card>
  );
}
