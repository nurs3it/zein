'use client';

import { Input } from '@/shared/ui/base/input';
import { Label } from '@/shared/ui/base/label';
import { Textarea } from '@/shared/ui/base/textarea';

interface BaseFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  min?: number;
  max?: number;
}

interface TextareaFieldProps extends BaseFieldProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function InputField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  min,
  max,
}: InputFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm sm:text-base">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className={error ? 'border-red-500' : ''}
        min={min}
        max={max}
      />
      {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function TextareaField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  rows = 3,
}: TextareaFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm sm:text-base">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  className = '',
}: SelectFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm sm:text-base">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : ''}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
    </div>
  );
}
