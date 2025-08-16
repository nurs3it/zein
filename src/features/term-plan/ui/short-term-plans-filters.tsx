'use client';

import { FilterSection, SearchInput, SelectFieldComponent } from '@/shared/ui/components';

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchInput
          id="search"
          label="Поиск"
          placeholder="Поиск по теме урока..."
          value={filters.search || ''}
          onChange={value => onFilterChange('search', value)}
        />

        <SelectFieldComponent
          id="status"
          label="Статус"
          value={filters.status || ''}
          onChange={value => onFilterChange('status', value)}
          options={statusOptions}
          placeholder="Все статусы"
        />
      </div>
    </FilterSection>
  );
}
