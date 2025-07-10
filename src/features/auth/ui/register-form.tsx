'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useRegister } from '../model/auth-hooks';
import { RegisterData } from '@/shared/types/api';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/shared/store/hooks';

const registerSchema = z.object({
  name: z.string().min(3, 'Имя должно содержать минимум 3 символа'),
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  // Редирект если уже авторизован
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/platform');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterData) => {
    await registerMutation.mutateAsync(data);
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
        <CardDescription>Создайте новый аккаунт для доступа к платформе</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              type="text"
              placeholder="Введите ваше имя"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Введите пароль"
                {...register('password')}
                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Регистрация...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Зарегистрироваться
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Уже есть аккаунт?{' '}
            <button
              onClick={() => router.push('/sign/in')}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Войти
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
