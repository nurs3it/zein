'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  DollarSign,
  Eye,
  Clock,
  Target,
  ArrowRight,
} from 'lucide-react';

export const AnalyticsSection = () => {
  const metrics = [
    {
      title: 'Активность',
      value: '12.5k',
      change: '+12%',
      trend: 'up',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Посещения',
      value: '8.2k',
      change: '+8%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Время сессии',
      value: '4.2ч',
      change: '-2%',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Конверсия',
      value: '24%',
      change: '+5%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  const chartData = [
    { name: 'Пн', value: 65, color: 'bg-blue-500' },
    { name: 'Вт', value: 85, color: 'bg-blue-500' },
    { name: 'Ср', value: 45, color: 'bg-blue-500' },
    { name: 'Чт', value: 95, color: 'bg-blue-500' },
    { name: 'Пт', value: 75, color: 'bg-blue-500' },
    { name: 'Сб', value: 55, color: 'bg-blue-500' },
    { name: 'Вс', value: 70, color: 'bg-blue-500' },
  ];

  const topPages = [
    { name: 'Главная страница', views: 1240, growth: '+15%' },
    { name: 'Каталог товаров', views: 892, growth: '+8%' },
    { name: 'Профиль пользователя', views: 567, growth: '+12%' },
    { name: 'Настройки', views: 334, growth: '-3%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Аналитика</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Подробный отчет
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(metric => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;

          return (
            <Card key={metric.title} className={`${metric.bgColor} border-none`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {metric.value}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`${metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        <TrendIcon className="h-3 w-3 mr-1" />
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.color} bg-white dark:bg-gray-800`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Активность по дням
            </CardTitle>
            <CardDescription>Ваша активность за последние 7 дней</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map(item => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-8 text-sm text-gray-600 dark:text-gray-400">{item.name}</div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${item.color} transition-all duration-300`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-600 dark:text-gray-400 text-right">
                    {item.value}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Популярные страницы
            </CardTitle>
            <CardDescription>Наиболее посещаемые разделы</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div
                  key={page.name}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {page.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {page.views} просмотров
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={page.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}
                  >
                    {page.growth}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Доходы
            </CardTitle>
            <CardDescription>Финансовая статистика за месяц</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Общий доход</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">₽247,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Рост за месяц</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18%
                </Badge>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Прогресс цели</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">82%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                    style={{ width: '82%' }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Быстрые выводы
            </CardTitle>
            <CardDescription>Ключевые инсайты на основе данных</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Пик активности
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Четверг показал наибольшую активность пользователей
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Рост конверсии
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Конверсия выросла на 5% по сравнению с прошлым месяцем
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full justify-between">
                <span>Посмотреть все инсайты</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
