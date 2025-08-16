'use client';

import { Button } from '@/shared/ui/base/button';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  showBackButton = false,
  onBack,
  actions,
  className = '',
  icon,
}: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-start justify-between py-4 pb-0 gap-4 sm:gap-0 ${className}`}
    >
      <div className="flex items-start gap-3">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {icon && <div className="text-gray-600 dark:text-gray-400">{icon}</div>}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {description && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3 w-full sm:w-auto">{actions}</div>}
    </div>
  );
}
