'use client';

import { ReactNode } from 'react';

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return <thead className={`bg-gray-50 dark:bg-gray-800 ${className}`}>{children}</thead>;
}

interface TableHeaderRowProps {
  children: ReactNode;
  className?: string;
}

export function TableHeaderRow({ children, className = '' }: TableHeaderRowProps) {
  return <tr className={className}>{children}</tr>;
}

interface TableHeaderCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

export function TableHeaderCell({ children, className = '', colSpan }: TableHeaderCellProps) {
  return (
    <th
      className={`px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider ${className}`}
      colSpan={colSpan}
    >
      {children}
    </th>
  );
}
