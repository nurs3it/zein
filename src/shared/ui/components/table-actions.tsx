'use client';

import { Button } from '@/shared/ui/base/button';
import { ReactNode } from 'react';

interface TableAction {
  icon: ReactNode;
  onClick: () => void;
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'sm' | 'lg' | 'default';
  className?: string;
  disabled?: boolean;
  title?: string;
}

interface TableActionsProps {
  actions: TableAction[];
  className?: string;
}

export function TableActions({ actions, className = '' }: TableActionsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'ghost'}
          size={action.size || 'sm'}
          onClick={action.onClick}
          className={action.className}
          disabled={action.disabled}
          title={action.title}
        >
          {action.icon}
        </Button>
      ))}
    </div>
  );
}
