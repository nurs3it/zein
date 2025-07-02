import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Settings, Home } from 'lucide-react';

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Добро пожаловать на платформу
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Вы успешно авторизованы и можете пользоваться всеми функциями
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Авторизован
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Главная
              </CardTitle>
              <CardDescription>Основная информация и статистика</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Здесь будет отображаться основная информация о вашем аккаунте.
              </p>
              <Button variant="outline" className="w-full">
                Перейти
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Настройки
              </CardTitle>
              <CardDescription>Управление профилем и настройками</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Настройте свой профиль и предпочтения.
              </p>
              <Button variant="outline" className="w-full">
                Настроить
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Выход
              </CardTitle>
              <CardDescription>Безопасный выход из системы</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Завершите сеанс работы в системе.
              </p>
              <Button variant="destructive" className="w-full">
                Выйти
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
