'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/shared/ui/base/card';
import { Button } from '@/shared/ui/base/button';
import { Badge } from '@/shared/ui/base/badge';
import { BookOpen, FileText, Plus, ChevronRight } from 'lucide-react';

const kmzhSections = [
  {
    id: 'short-term',
    title: 'Краткосрочные планы',
    description: 'Планы уроков на день, неделю',
    icon: FileText,
    href: '/platform/kmzh/short-term',
    color: 'blue',
  },
];

export default function KMZHPage() {
  const router = useRouter();

  const handleSectionClick = (sectionId: string) => {
    const section = kmzhSections.find(s => s.id === sectionId);
    if (section) {
      router.push(section.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            КМЖ - Календарно-тематическое планирование
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Система планирования учебного процесса и управления образовательными планами
          </p>
        </div>
        <Button
          onClick={() => router.push('/platform/kmzh/short-term/create')}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Создать план
        </Button>
      </div>

      {/* Основные разделы */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kmzhSections.map(section => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleSectionClick(section.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-3 bg-${section.color}-100 dark:bg-${section.color}-900 rounded-lg`}
                    >
                      <Icon
                        className={`h-6 w-6 text-${section.color}-600 dark:text-${section.color}-400`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Badge
                      variant="secondary"
                      className={`bg-${section.color}-100 text-${section.color}-800 hover:bg-${section.color}-200`}
                    >
                      Открыть
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Быстрые действия */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Быстрые действия
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/platform/kmzh/short-term/create')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Создать краткосрочный план
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/platform/kmzh/short-term')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Просмотреть все планы
          </Button>
        </div>
      </Card>
    </div>
  );
}
