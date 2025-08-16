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
              <TableHeaderCell>Статус</TableHeaderCell>
              <TableHeaderCell className="hidden sm:table-cell">Тема урока</TableHeaderCell>
              <TableHeaderCell className="hidden sm:table-cell">Предмет</TableHeaderCell>
              <TableHeaderCell className="hidden sm:table-cell">Создан</TableHeaderCell>
              <TableHeaderCell>Действия</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
        </table>
      </DataTable>
    );
  }

  return (
    <DataTable loading={loading} error={error}>
      {/* Мобильная версия таблицы */}
      <div className="block sm:hidden space-y-3 px-6">
        {plans.map(plan => (
          <div
            key={plan.id}
            className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {plan.lesson_topic}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.subject}</p>
              </div>
              <StatusBadge status={plan.status} />
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Создан: {new Date(plan.created_at).toLocaleDateString('ru-RU')}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onDelete(plan.id)}
                disabled={deleteLoading}
                className="p-2 h-8 w-8 text-red-600 hover:text-red-700 border border-red-200 rounded hover:bg-red-50 disabled:opacity-50"
                title="Удалить"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {plan.result_path && (
                <button
                  onClick={() => onDownload(plan.result_path)}
                  disabled={deleteLoading}
                  className="p-2 h-8 w-8 text-blue-600 hover:text-blue-700 border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-50"
                  title="Скачать"
                >
                  <Download className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Десктопная версия таблицы */}
      <table className="w-full hidden sm:table">
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>Статус</TableHeaderCell>
            <TableHeaderCell>Тема урока</TableHeaderCell>
            <TableHeaderCell>Предмет</TableHeaderCell>
            <TableHeaderCell>Создан</TableHeaderCell>
            <TableHeaderCell>Действия</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <DataTableBody>
          {plans.map(plan => (
            <TableRow key={plan.id}>
              <TableCell>
                <StatusBadge status={plan.status} />
              </TableCell>
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
