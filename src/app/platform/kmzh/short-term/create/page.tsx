'use client';

import { useRouter } from 'next/navigation';
import { PageHeader, ShortTermPlanForm } from '@/features/term-plan';

export default function CreateShortTermPlanPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Создать краткосрочный план"
        description="Заполните форму для создания нового плана урока"
        showBackButton
        onBack={handleCancel}
      />

      <ShortTermPlanForm onCancel={handleCancel} />
    </div>
  );
}
