'use client';

import { Card } from '@/shared/ui/base/card';
import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function FormSection({
  title,
  children,
  className = '',
  fullWidth = false,
}: FormSectionProps) {
  return (
    <Card className={`p-6 ${fullWidth ? 'lg:col-span-2' : ''} ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </Card>
  );
}
