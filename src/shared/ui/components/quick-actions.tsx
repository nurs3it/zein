'use client';

import { Card } from '@/shared/ui/base/card';
import { Button } from '@/shared/ui/base/button';
import { ReactNode } from 'react';

interface QuickAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'lg' | 'default';
  className?: string;
}

interface QuickActionsProps {
  title: string;
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ title, actions, className = '' }: QuickActionsProps) {
  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'outline'}
            size={action.size || 'sm'}
            onClick={action.onClick}
            className="w-full sm:w-auto"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
