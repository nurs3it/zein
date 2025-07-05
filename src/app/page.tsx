'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useAuth } from '@/features/auth/model/auth-hooks';
import { useLogout } from '@/features/auth/model/auth-hooks';
import { useEffect, useState } from 'react';
import { getTokenInfoFromCookies } from '@/shared/lib/cookies';

import {
  ArrowRight,
  CheckCircle,
  FileText,
  BookOpen,
  Brain,
  GraduationCap,
  Sparkles,
  Gamepad2,
  Presentation,
  Github,
  Twitter,
  Globe,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const logoutMutation = useLogout();
  const [showLoading, setShowLoading] = useState(true);

  // Проверяем наличие токена в cookies при первой загрузке
  useEffect(() => {
    const tokenInfo = getTokenInfoFromCookies('access');

    if (!tokenInfo || !tokenInfo.isValid) {
      // Если токена нет или он невалидный - сразу показываем контент
      setShowLoading(false);
    } else {
      // Если токен есть - показываем лоадер минимум 2 секунды
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Показываем лоадер пока не готова информация о сессии или не прошло 2 секунды
  if (isLoading || showLoading) {
    return <LoadingScreen message="Проверяем сессию" />;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Zein</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Возможности
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Для кого
            </a>

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  // Авторизованный пользователь - dropdown меню
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {(user && 'name' in user && user.name) || user?.username || user?.email}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {(user && 'name' in user && user.name) ||
                              user?.username ||
                              'Пользователь'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href="/platform" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Платформа</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Выйти</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // Неавторизованный пользователь
                  <>
                    <Link href="/sign/in">
                      <Button variant="outline" size="sm">
                        Войти
                      </Button>
                    </Link>
                    <Link href="/sign/up">
                      <Button size="sm">Начать бесплатно</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
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
                  {(user && 'name' in user && user.name) || user?.username || 'Коллега'}!
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
              <>
                <Link href="/platform">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8"
                  >
                    Перейти в платформу
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </>
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Что умеет Zein
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Искусственный интеллект помогает автоматизировать все аспекты педагогической
              деятельности
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Авторские работы</CardTitle>
                <CardDescription>
                  ИИ помогает создавать качественные авторские работы за минуты
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Планы уроков
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Рабочие программы
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Контрольные работы
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Presentation className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Презентации</CardTitle>
                <CardDescription>Создание интерактивных презентаций с помощью ИИ</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Автоматический дизайн
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Подбор контента
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Интерактивные элементы
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Методички</CardTitle>
                <CardDescription>ИИ-генератор учебно-методических материалов</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Методические указания
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Учебные пособия
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Дидактические материалы
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>ИИ-Ассистент</CardTitle>
                <CardDescription>Персональный помощник для каждого педагога</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    24/7 поддержка
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Адаптация под предмет
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Анализ эффективности
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Для всех уровней</CardTitle>
                <CardDescription>От детского сада до университета</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Школы
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Колледжи
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Университеты
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Gamepad2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Скоро для студентов</CardTitle>
                <CardDescription>Интерактивные игры и обучающие инструменты</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Обучающие игры
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    ИИ-репетитор
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Адаптивное обучение
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section
        id="about"
        className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Для кого создан Zein
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Наша платформа помогает образовательным учреждениям любого уровня
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Учителя школ</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Создавайте увлекательные уроки, интерактивные презентации и авторские материалы для
                учеников с 1 по 11 класс. ИИ адаптирует контент под возраст и уровень подготовки.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Преподаватели колледжей
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Разрабатывайте профессиональные методички, практические работы и теоретические курсы
                для подготовки специалистов среднего звена.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Профессора вузов
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Создавайте научно-методические материалы, лекционные курсы и исследовательские
                проекты для студентов и аспирантов с помощью ИИ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">Zein</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Zein. Автоматизация образования с помощью искусственного интеллекта.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
