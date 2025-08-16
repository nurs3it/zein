'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/base/button';
import { BookOpen, FileText, Plus } from 'lucide-react';
import { PageHeader } from './page-header';
import { ActionCard, QuickActions } from '@/shared/ui/components';

const kmzhSections = [
  {
    id: 'short-term',
    title: 'Краткосрочные планы',
    description: 'Планы уроков на день, неделю',
    icon: <FileText className="h-6 w-6" />,
    href: '/platform/kmzh/short-term',
    color: 'blue',
  },
];

export function KMZHDashboard() {
  const router = useRouter();

  const handleSectionClick = (sectionId: string) => {
    const section = kmzhSections.find(s => s.id === sectionId);
    if (section) {
      router.push(section.href);
    }
  };

  const createButton = (
    <Button
      onClick={() => router.push('/platform/kmzh/short-term/create')}
      className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
    >
      <Plus className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">Создать план</span>
      <span className="sm:hidden">Создать</span>
    </Button>
  );

  const quickActions = [
    {
      label: 'Создать краткосрочный план',
      icon: <FileText className="h-4 w-4 mr-2" />,
      onClick: () => router.push('/platform/kmzh/short-term/create'),
    },
    {
      label: 'Просмотреть все планы',
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      onClick: () => router.push('/platform/kmzh/short-term'),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="КМЖ - Календарно-тематическое планирование"
        description="Система планирования учебного процесса и управления образовательными планами"
        actions={createButton}
      />

      {/* Основные разделы */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {kmzhSections.map(section => (
          <ActionCard
            key={section.id}
            title={section.title}
            description={section.description}
            icon={section.icon}
            color={section.color}
            onClick={() => handleSectionClick(section.id)}
          />
        ))}
      </div>

      {/* Быстрые действия */}
      <QuickActions title="Быстрые действия" actions={quickActions} />
    </div>
  );
}
