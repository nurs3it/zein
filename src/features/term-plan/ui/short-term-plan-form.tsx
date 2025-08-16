'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/base/button';
import { Input } from '@/shared/ui/base/input';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateShortTermPlan } from '@/features/term-plan';
import { ShortTermPlanRequest, LangEnum, ShortTermPlanStatusEnum } from '@/entities/term-plan';
import {
  FormSection,
  FormActions,
  InputField,
  TextareaField,
  SelectField,
} from '@/shared/ui/components';

const langOptions = [
  { value: LangEnum.KK, label: 'Қазақша' },
  { value: LangEnum.RU, label: 'Русский' },
  { value: LangEnum.EN, label: 'English' },
];

interface ShortTermPlanFormProps {
  onCancel?: () => void;
}

export function ShortTermPlanForm({ onCancel }: ShortTermPlanFormProps) {
  const router = useRouter();
  const createMutation = useCreateShortTermPlan();

  const [formData, setFormData] = useState<Partial<ShortTermPlanRequest>>({
    lesson_topic: '',
    lesson_goal: '',
    class_number: 1,
    subject: '',
    lang: LangEnum.KK,
    learning_objectives: [''],
    theory: '',
    system_prompt: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof ShortTermPlanRequest,
    value: string | number | string[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку для поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLearningObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...(formData.learning_objectives || [''])];
    newObjectives[index] = value;
    setFormData(prev => ({ ...prev, learning_objectives: newObjectives }));
  };

  const addLearningObjective = () => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: [...(prev.learning_objectives || ['']), ''],
    }));
  };

  const removeLearningObjective = (index: number) => {
    if (formData.learning_objectives && formData.learning_objectives.length > 1) {
      const newObjectives = formData.learning_objectives.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, learning_objectives: newObjectives }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.lesson_topic?.trim()) {
      newErrors.lesson_topic = 'Тема урока обязательна';
    }

    if (!formData.lesson_goal?.trim()) {
      newErrors.lesson_goal = 'Цель урока обязательна';
    }

    if (!formData.subject?.trim()) {
      newErrors.subject = 'Предмет обязателен';
    }

    if (!formData.class_number || formData.class_number < 1 || formData.class_number > 11) {
      newErrors.class_number = 'Класс должен быть от 1 до 11';
    }

    if (formData.learning_objectives) {
      formData.learning_objectives.forEach((objective, index) => {
        if (!objective?.trim()) {
          newErrors[`learning_objective_${index}`] = 'Цель обучения обязательна';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const planData: ShortTermPlanRequest = {
        ...formData,
        created_at: new Date().toISOString(),
        status: ShortTermPlanStatusEnum.PENDING,
        result_path: null,
        error_message: null,
        suggested_text: null,
      } as ShortTermPlanRequest;

      await createMutation.mutateAsync(planData);
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
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Основная информация */}
        <FormSection title="Основная информация">
          <div className="space-y-4">
            <InputField
              id="lesson_topic"
              label="Тема урока"
              value={formData.lesson_topic || ''}
              onChange={value => handleInputChange('lesson_topic', value)}
              placeholder="Введите тему урока"
              error={errors.lesson_topic}
              required
            />

            <TextareaField
              id="lesson_goal"
              label="Цель урока"
              value={formData.lesson_goal || ''}
              onChange={value => handleInputChange('lesson_goal', value)}
              placeholder="Опишите цель урока"
              error={errors.lesson_goal}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                id="class_number"
                label="Класс"
                type="number"
                value={formData.class_number || ''}
                onChange={value => handleInputChange('class_number', value)}
                min={1}
                max={11}
                error={errors.class_number}
                required
              />

              <SelectField
                id="lang"
                label="Язык"
                value={formData.lang || ''}
                onChange={value => handleInputChange('lang', value)}
                options={langOptions}
              />
            </div>
          </div>
        </FormSection>

        {/* Предмет и направление */}
        <FormSection title="Предмет и направление">
          <div className="space-y-4">
            <InputField
              id="subject"
              label="Предмет"
              value={formData.subject || ''}
              onChange={value => handleInputChange('subject', value)}
              placeholder="Название предмета"
              error={errors.subject}
              required
            />
          </div>
        </FormSection>

        {/* Цели обучения */}
        <FormSection title="Цели обучения" fullWidth>
          <div className="space-y-3">
            {formData.learning_objectives?.map((objective, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={objective}
                  onChange={e => handleLearningObjectiveChange(index, e.target.value)}
                  placeholder={`Цель обучения ${index + 1}`}
                  className={errors[`learning_objective_${index}`] ? 'border-red-500' : ''}
                />
                {formData.learning_objectives && formData.learning_objectives.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLearningObjective(index)}
                    className="px-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addLearningObjective}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить цель обучения
            </Button>
          </div>
        </FormSection>

        {/* Дополнительная информация */}
        <FormSection title="Дополнительная информация" fullWidth>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TextareaField
              id="theory"
              label="Теория"
              value={formData.theory || ''}
              onChange={value => handleInputChange('theory', value)}
              placeholder="Основные правила, формулы, определения"
              rows={4}
            />

            <TextareaField
              id="system_prompt"
              label="Системный промпт"
              value={formData.system_prompt || ''}
              onChange={value => handleInputChange('system_prompt', value)}
              placeholder="Инструкции для ИИ системы"
              rows={4}
            />
          </div>
        </FormSection>
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
