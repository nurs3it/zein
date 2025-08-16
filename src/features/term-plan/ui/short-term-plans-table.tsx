'use client';

import { Download, Trash2 } from 'lucide-react';
import { ShortTermPlan } from '@/entities/term-plan';
import {
  DataTable,
  DataTableBody,
  StatusBadge,
  TableActions,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableCell,
} from '@/shared/ui/components';

interface ShortTermPlansTableProps {
  plans: ShortTermPlan[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number) => void;
  onDownload: (path: string | null) => void;
  deleteLoading: boolean;
}

export function ShortTermPlansTable({
  plans,
  loading,
  error,
  onDelete,
  onDownload,
  deleteLoading,
}: ShortTermPlansTableProps) {
  if (plans.length === 0 && !loading && !error) {
    return (
      <DataTable emptyMessage="Планы не найдены">
        <table className="w-full">
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Тема урока</TableHeaderCell>
              <TableHeaderCell>Предмет</TableHeaderCell>
              <TableHeaderCell>Статус</TableHeaderCell>
              <TableHeaderCell>Создан</TableHeaderCell>
              <TableHeaderCell>Действия</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
        </table>
      </DataTable>
    );
  }

  return (
    <DataTable loading={loading} error={error}>
      <table className="w-full">
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>Тема урока</TableHeaderCell>
            <TableHeaderCell>Предмет</TableHeaderCell>
            <TableHeaderCell>Статус</TableHeaderCell>
            <TableHeaderCell>Создан</TableHeaderCell>
            <TableHeaderCell>Действия</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <DataTableBody>
          {plans.map(plan => (
            <TableRow key={plan.id}>
              <TableCell>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {plan.lesson_topic}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {plan.subject}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={plan.status} />
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(plan.created_at).toLocaleDateString('ru-RU')}
                </span>
              </TableCell>
              <TableCell>
                <TableActions
                  actions={[
                    {
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: () => onDelete(plan.id),
                      className: 'p-2 h-8 w-8 text-red-600 hover:text-red-700',
                      disabled: deleteLoading,
                      title: 'Удалить',
                    },
                    ...(plan.result_path
                      ? [
                          {
                            icon: <Download className="h-4 w-4" />,
                            onClick: () => onDownload(plan.result_path),
                            className: 'p-2 h-8 w-8 text-blue-600 hover:text-blue-700',
                            disabled: deleteLoading,
                            title: 'Скачать',
                          },
                        ]
                      : []),
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </DataTableBody>
      </table>
    </DataTable>
  );
}
