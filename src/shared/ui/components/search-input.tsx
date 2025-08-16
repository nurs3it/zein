'use client';

import { Input } from '@/shared/ui/base/input';
import { Label } from '@/shared/ui/base/label';
import { Search } from 'lucide-react';

interface SearchInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  className = '',
}: SearchInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm sm:text-base">
        {label}
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
