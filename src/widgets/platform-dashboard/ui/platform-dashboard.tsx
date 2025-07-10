'use client';

import { Home, Settings, LogOut } from 'lucide-react';
import { PlatformCard } from '@/shared/ui/components/platform-card';
import { useLogout } from '@/features/auth/model/auth-hooks';
import { useRouter } from 'next/navigation';

export const PlatformDashboard = () => {
  const logoutMutation = useLogout();
  const router = useRouter();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleNavigateHome = () => {
    router.push('/');
  };

  const handleSettings = () => {
    // TODO: Навигация к настройкам
    router.push('/platform/settings');
  };

  const cardData = [
    {
      icon: Home,
      title: 'Главная',
      description: 'Основная информация и статистика',
      content: 'Вернитесь на главную страницу или посмотрите общую статистику вашего аккаунта.',
      buttonText: 'Перейти',
      buttonVariant: 'outline' as const,
      onButtonClick: handleNavigateHome,
    },
    {
      icon: Settings,
      title: 'Настройки',
      description: 'Управление профилем и настройками',
      content: 'Настройте свой профиль, предпочтения и параметры безопасности.',
      buttonText: 'Настроить',
      buttonVariant: 'outline' as const,
      onButtonClick: handleSettings,
    },
    {
      icon: LogOut,
      title: 'Выход',
      description: 'Безопасный выход из системы',
      content: 'Завершите сеанс работы в системе и вернитесь на главную страницу.',
      buttonText: logoutMutation.isPending ? 'Выход...' : 'Выйти',
      buttonVariant: 'destructive' as const,
      onButtonClick: handleLogout,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardData.map((card, index) => (
        <PlatformCard
          key={index}
          icon={card.icon}
          title={card.title}
          description={card.description}
          content={card.content}
          buttonText={card.buttonText}
          buttonVariant={card.buttonVariant}
          onButtonClick={card.onButtonClick}
        />
      ))}
    </div>
  );
};
