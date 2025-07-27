import { Button } from '@/components/ui/button';
import { Bell, Grid3X3, User } from 'lucide-react';
import Link from 'next/link';

const navigationItems = [
  { id: 'overview', to: '/platform', label: 'Обзор', icon: Grid3X3 },
  { id: 'user-info', to: '/platform/profile', label: 'Профиль', icon: User },
  { id: 'notifications', to: '/platform/notifications', label: 'Уведомления', icon: Bell },
];

export const PlatformHeader = () => {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm sticky top-4 z-10 mb-4">
      {navigationItems.map(item => {
        const Icon = item.icon;
        return (
          <Button key={item.id} variant="ghost" size="sm" asChild className="gap-2">
            <Link href={item.to}>
              <span className="w-4 h-4">
                <Icon className="h-4 w-4" />
              </span>
              {item.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
};
