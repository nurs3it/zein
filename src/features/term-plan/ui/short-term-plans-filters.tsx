'use client';

import { FilterSection, InputField, SelectFieldComponent } from '@/shared/ui/components';

const statusOptions = [
  { value: 'pending', label: 'Ожидает' },
  { value: 'processing', label: 'В обработке' },
  { value: 'completed', label: 'Завершено' },
  { value: 'failed', label: 'Ошибка' },
];

interface ShortTermPlansFiltersProps {
  filters: {
    search: string;
    status: string;
  };
  onFilterChange: (key: string, value: string | number | undefined) => void;
}

export function ShortTermPlansFilters({ filters, onFilterChange }: ShortTermPlansFiltersProps) {
  return (
    <FilterSection>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <InputField
          id="search"
          label="Поиск"
          placeholder="Поиск по теме урока..."
          value={filters.search || ''}
          onChange={value => onFilterChange('search', value)}
        />

        <SelectFieldComponent
          id="status"
          value={filters.status || ''}
          onValueChange={(value: string) => onFilterChange('status', value)}
          options={statusOptions}
          placeholder="Все статусы"
        />
      </div>
    </FilterSection>
  );
}
