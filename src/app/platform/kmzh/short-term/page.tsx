'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/base/button';
import { Plus } from 'lucide-react';
import {
  useShortTermPlans,
  useDeleteShortTermPlan,
  PageHeader,
  ShortTermPlansTable,
  ShortTermPlansFilters,
} from '@/features/term-plan';
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

  const createButton = (
    <Button
      onClick={handleCreate}
      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
    >
      <Plus className="h-4 w-4 mr-2" />
      Создать план
    </Button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Краткосрочные планы"
        description="Управление планами уроков на день и неделю"
        actions={createButton}
      />

      <ShortTermPlansFilters filters={filters} onFilterChange={handleFilterChange} />

      <ShortTermPlansTable
        plans={shortTermPlans}
        loading={shortTermPlansLoading}
        error={shortTermPlansError}
        onDelete={handleDelete}
        onDownload={handleDownload}
        deleteLoading={deleteMutation.isPending}
      />
    </div>
  );
}
