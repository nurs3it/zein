'use client';

import { Button } from '@/shared/ui/base/button';
import { ReactNode } from 'react';

interface FormActionsProps {
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  submitIcon?: ReactNode;
  cancelIcon?: ReactNode;
  className?: string;
}

export function FormActions({
  onCancel,
  submitText = 'Сохранить',
  cancelText = 'Отмена',
  isLoading = false,
  submitIcon,
  cancelIcon,
  className = '',
}: FormActionsProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6 ${className}`}
    >
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          {cancelIcon}
          {cancelText}
        </Button>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        {submitIcon}
        {isLoading ? 'Сохранение...' : submitText}
      </Button>
    </div>
  );
}
