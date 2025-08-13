'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/shared/ui/base/card';
import { Button } from '@/shared/ui/base/button';
import { Badge } from '@/shared/ui/base/badge';
import { Input } from '@/shared/ui/base/input';
import { Label } from '@/shared/ui/base/label';
import { Download, Plus, Search, Trash2 } from 'lucide-react';
import { useShortTermPlans, useDeleteShortTermPlan } from '@/features/term-plan';
import { API_CONFIG } from '@/shared';

export default function ShortTermPlansPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 10,
    search: '',
    status: '',
  });

  const { shortTermPlans, shortTermPlansLoading, shortTermPlansError } = useShortTermPlans(filters);
  const deleteMutation = useDeleteShortTermPlan();

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот план?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDownload = (path: string | null) => {
    if (path) {
      window.open(API_CONFIG.getMediaUrl() + '/' + path, '_blank');
    }
  };

  const handleCreate = () => {
    router.push('/platform/kmzh/short-term/create');
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Краткосрочные планы</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Управление планами уроков на день и неделю
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Создать план
        </Button>
      </div>

      {/* Фильтры */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="search">Поиск</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Поиск по теме урока..."
                value={filters.search || ''}
                onChange={e => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Статус</Label>
            <select
              id="status"
              value={filters.status || ''}
              onChange={e => handleFilterChange('status', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Все статусы</option>
              <option value="pending">Ожидает</option>
              <option value="processing">В обработке</option>
              <option value="completed">Завершено</option>
              <option value="failed">Ошибка</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Таблица планов */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Тема урока
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Предмет
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Создан
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {shortTermPlansLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Загрузка...
                  </td>
                </tr>
              ) : shortTermPlansError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                    Ошибка: {shortTermPlansError}
                  </td>
                </tr>
              ) : shortTermPlans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Планы не найдены
                  </td>
                </tr>
              ) : (
                shortTermPlans.map(plan => {
                  return (
                    <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {plan.lesson_topic}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {plan.subject}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className={
                            plan.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : plan.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : plan.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : plan.status === 'failed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {plan.status === 'pending'
                            ? 'Ожидает'
                            : plan.status === 'processing'
                              ? 'В обработке'
                              : plan.status === 'completed'
                                ? 'Завершено'
                                : plan.status === 'failed'
                                  ? 'Ошибка'
                                  : plan.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(plan.created_at).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(plan.id)}
                            className="p-2 h-8 w-8 text-red-600 hover:text-red-700"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {plan.result_path && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(plan.result_path)}
                              className="p-2 h-8 w-8 text-blue-600 hover:text-blue-700"
                              disabled={deleteMutation.isPending}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
