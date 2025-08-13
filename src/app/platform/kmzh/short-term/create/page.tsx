'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/shared/ui/base/card';
import { Button } from '@/shared/ui/base/button';
import { Input } from '@/shared/ui/base/input';
import { Label } from '@/shared/ui/base/label';
import { Textarea } from '@/shared/ui/base/textarea';
import { ChevronLeft, Save, X, Plus, Trash2 } from 'lucide-react';
import { useCreateShortTermPlan } from '@/features/term-plan';
import { ShortTermPlanRequest, LangEnum, ShortTermPlanStatusEnum } from '@/entities/term-plan';

const langOptions = [
  { value: LangEnum.KK, label: 'Қазақша' },
  { value: LangEnum.RU, label: 'Русский' },
  { value: LangEnum.EN, label: 'English' },
];

export default function CreateShortTermPlanPage() {
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
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleCancel} className="p-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Создать краткосрочный план
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Заполните форму для создания нового плана урока
            </p>
          </div>
        </div>
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Основная информация */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Основная информация
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="lesson_topic">Тема урока *</Label>
                <Input
                  id="lesson_topic"
                  value={formData.lesson_topic || ''}
                  onChange={e => handleInputChange('lesson_topic', e.target.value)}
                  placeholder="Введите тему урока"
                  className={errors.lesson_topic ? 'border-red-500' : ''}
                />
                {errors.lesson_topic && (
                  <p className="text-sm text-red-500 mt-1">{errors.lesson_topic}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lesson_goal">Цель урока *</Label>
                <Textarea
                  id="lesson_goal"
                  value={formData.lesson_goal || ''}
                  onChange={e => handleInputChange('lesson_goal', e.target.value)}
                  placeholder="Опишите цель урока"
                  rows={3}
                  className={errors.lesson_goal ? 'border-red-500' : ''}
                />
                {errors.lesson_goal && (
                  <p className="text-sm text-red-500 mt-1">{errors.lesson_goal}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="class_number">Класс *</Label>
                  <Input
                    id="class_number"
                    type="number"
                    min="1"
                    max="11"
                    value={formData.class_number || ''}
                    onChange={e => handleInputChange('class_number', parseInt(e.target.value))}
                    className={errors.class_number ? 'border-red-500' : ''}
                  />
                  {errors.class_number && (
                    <p className="text-sm text-red-500 mt-1">{errors.class_number}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lang">Язык</Label>
                  <select
                    id="lang"
                    value={formData.lang || ''}
                    onChange={e => handleInputChange('lang', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {langOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Предмет и тип */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Предмет и направление
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Предмет *</Label>
                <Input
                  id="subject"
                  value={formData.subject || ''}
                  onChange={e => handleInputChange('subject', e.target.value)}
                  placeholder="Название предмета"
                  className={errors.subject ? 'border-red-500' : ''}
                />
                {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject}</p>}
              </div>
            </div>
          </Card>

          {/* Цели обучения */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Цели обучения
            </h3>

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
          </Card>

          {/* Дополнительная информация */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Дополнительная информация
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="theory">Теория</Label>
                <Textarea
                  id="theory"
                  value={formData.theory || ''}
                  onChange={e => handleInputChange('theory', e.target.value)}
                  placeholder="Основные правила, формулы, определения"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="system_prompt">Системный промпт</Label>
                <Textarea
                  id="system_prompt"
                  value={formData.system_prompt || ''}
                  onChange={e => handleInputChange('system_prompt', e.target.value)}
                  placeholder="Инструкции для ИИ системы"
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {createMutation.isPending ? 'Создание...' : 'Создать план'}
          </Button>
        </div>
      </form>
    </div>
  );
}
