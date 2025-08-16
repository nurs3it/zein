'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { useCreateShortTermPlan } from '@/features/term-plan';
import { LangEnum } from '@/entities/term-plan';
import { FormActions, InputField, TextareaField, SelectField } from '@/shared/ui/components';

const langOptions = [
  { value: LangEnum.KK, label: 'Қазақша' },
  { value: LangEnum.RU, label: 'Русский' },
  { value: LangEnum.EN, label: 'English' },
];

interface ShortTermPlanFormProps {
  onCancel?: () => void;
}

type FormData = {
  lesson_topic: string;
  lesson_goal: string;
  class_number: number;
  subject: string;
  lang: LangEnum;
};

export function ShortTermPlanForm({ onCancel }: ShortTermPlanFormProps) {
  const router = useRouter();
  const createMutation = useCreateShortTermPlan();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      lesson_topic: '',
      lesson_goal: '',
      class_number: 1,
      subject: '',
      lang: LangEnum.KK,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync(data as any);
      router.push('/platform/kmzh/short-term');
    } catch {
      // Handle error silently or show user-friendly message
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      <div className="space-y-4 sm:space-y-6">
        <InputField
          id="lesson_topic"
          label="Тема урока"
          value={watch('lesson_topic')}
          onChange={value => setValue('lesson_topic', value as string)}
          placeholder="Введите тему урока"
          error={errors.lesson_topic?.message}
          required
        />

        <TextareaField
          id="lesson_goal"
          label="Цель урока"
          value={watch('lesson_goal')}
          onChange={value => setValue('lesson_goal', value)}
          placeholder="Опишите цель урока"
          error={errors.lesson_goal?.message}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="class_number"
            label="Класс"
            type="number"
            value={watch('class_number')}
            onChange={value => setValue('class_number', value as number)}
            min={1}
            max={11}
            error={errors.class_number?.message}
            required
          />

          <SelectField
            id="lang"
            label="Язык"
            value={watch('lang')}
            onChange={value => setValue('lang', value as LangEnum)}
            options={langOptions}
          />
        </div>

        <InputField
          id="subject"
          label="Предмет"
          value={watch('subject')}
          onChange={value => setValue('subject', value as string)}
          placeholder="Название предмета"
          error={errors.subject?.message}
          required
        />
      </div>

      <FormActions
        onCancel={handleCancel}
        submitText="Создать план"
        isLoading={createMutation.isPending}
        submitIcon={<Plus className="h-4 w-4 mr-2" />}
        cancelText="Отмена"
      />
    </form>
  );
}
