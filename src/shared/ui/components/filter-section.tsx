'use client';

import { Card } from '@/shared/ui/base/card';
import { ReactNode } from 'react';

interface FilterSectionProps {
  children: ReactNode;
  className?: string;
}

export function FilterSection({ children, className = '' }: FilterSectionProps) {
  return <Card className={`p-4 sm:p-6 ${className}`}>{children}</Card>;
}
