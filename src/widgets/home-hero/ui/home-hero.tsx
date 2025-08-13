'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/base/button';
import { Badge } from '@/shared/ui/base/badge';
import { ArrowRight, Brain } from 'lucide-react';
import { useAuth } from '@/features/auth/model/auth-hooks';

export const HomeHero = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 text-center">
        <Badge
          variant="secondary"
          className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
        >
          🤖 ИИ для образования
        </Badge>

        {isAuthenticated ? (
          // Приветствие для авторизованного пользователя
          <>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Добро пожаловать, <br />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {user?.username || 'Коллега'}!
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Рады видеть вас снова в Zein! Продолжайте создавать удивительные материалы с помощью
              ИИ. Ваша платформа готова к работе и ждет новых проектов.
            </p>
          </>
        ) : (
          // Стандартный заголовок для неавторизованных пользователей
          <>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Автоматизируем работу
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                учителей с помощью ИИ
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Zein — это платформа для школ, колледжей и университетов, которая помогает учителям
              создавать авторские работы, презентации и методички за минуты, а не часы.
              Искусственный интеллект берет рутину на себя.
            </p>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            // Авторизованный пользователь
            <Link href="/platform">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8"
              >
                Перейти в платформу
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            // Неавторизованный пользователь
            <>
              <Link href="/sign/up">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                >
                  Попробовать бесплатно
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/platform">
                <Button variant="outline" size="lg" className="px-8">
                  <Brain className="mr-2 h-5 w-5" />
                  Посмотреть демо
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          {isAuthenticated ? (
            // Персональная статистика для авторизованных пользователей
            <>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">12</div>
                <div className="text-gray-600 dark:text-gray-400">Ваших проектов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">48ч</div>
                <div className="text-gray-600 dark:text-gray-400">Времени сэкономлено</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">97%</div>
                <div className="text-gray-600 dark:text-gray-400">Эффективность работы</div>
              </div>
            </>
          ) : (
            // Общая статистика для неавторизованных пользователей
            <>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">5000+</div>
                <div className="text-gray-600 dark:text-gray-400">Учителей используют</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">2 мин</div>
                <div className="text-gray-600 dark:text-gray-400">Создание презентации</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">300+</div>
                <div className="text-gray-600 dark:text-gray-400">Образовательных учреждений</div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
