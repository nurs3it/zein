'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/base/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/features/auth/model/auth-hooks';

export const HomeCTA = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 text-center">
        {isAuthenticated ? (
          // Секция для авторизованных пользователей
          <>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Готовы к новым свершениям?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Вы уже часть образовательной революции! Создавайте, экспериментируйте и делитесь
              своими успехами с коллегами.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/platform">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 bg-white text-blue-600 hover:bg-gray-100"
                >
                  Создать новый проект
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-white text-white hover:bg-white/10"
              >
                Мои проекты
              </Button>
            </div>
          </>
        ) : (
          // Секция для неавторизованных пользователей
          <>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Присоединяйтесь к образовательной революции
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Тысячи учителей уже экономят часы времени каждый день благодаря ИИ-помощнику Zein.
              Попробуйте бесплатно прямо сейчас!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign/up">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 bg-white text-blue-600 hover:bg-gray-100"
                >
                  Начать бесплатно
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sign/in">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 border-white text-white hover:bg-white/10"
                >
                  Уже есть аккаунт?
                </Button>
              </Link>
            </div>

            <div className="mt-12 text-blue-100 text-sm">
              <p>
                ✨ Бесплатная пробная версия на 14 дней • Без привязки карты • Техподдержка 24/7
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
