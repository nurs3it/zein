'use client';

import { ReactNode } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldComponentProps {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  children?: ReactNode;
  options?: SelectOption[];
}

export function SelectFieldComponent({
  id,
  value,
  onValueChange,
  placeholder,
  className = '',
  children,
  options,
}: SelectFieldComponentProps) {
  return (
    <div className={className}>
      <select
        id={id}
        value={value}
        onChange={e => onValueChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children ||
          (options &&
            options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )))}
      </select>
    </div>
  );
}
