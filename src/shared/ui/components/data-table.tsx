'use client';

import { Card } from '@/shared/ui/base/card';
import { ReactNode } from 'react';

interface DataTableProps {
  children: ReactNode;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  className?: string;
}

export function DataTable({
  children,
  loading = false,
  error = null,
  className = '',
}: DataTableProps) {
  if (loading) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="p-4 sm:p-6 text-center text-gray-500">Загрузка...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="p-4 sm:p-6 text-center text-red-500">Ошибка: {error}</div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-full inline-block align-middle">{children}</div>
      </div>
    </Card>
  );
}

interface DataTableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function DataTableHeader({ children, className = '' }: DataTableHeaderProps) {
  return <thead className={`bg-gray-50 dark:bg-gray-800 ${className}`}>{children}</thead>;
}

interface DataTableBodyProps {
  children: ReactNode;
  className?: string;
}

export function DataTableBody({ children, className = '' }: DataTableBodyProps) {
  return (
    <tbody
      className={`bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 ${className}`}
    >
      {children}
    </tbody>
  );
}

interface DataTableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DataTableRow({ children, className = '', onClick }: DataTableRowProps) {
  return (
    <tr
      className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface DataTableCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

export function DataTableCell({ children, className = '', colSpan }: DataTableCellProps) {
  return (
    <td className={`px-3 sm:px-6 py-3 sm:py-4 text-sm ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
}

interface DataTableHeaderCellProps {
  children: ReactNode;
  className?: string;
}

export function DataTableHeaderCell({ children, className = '' }: DataTableHeaderCellProps) {
  return (
    <th
      className={`px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}
