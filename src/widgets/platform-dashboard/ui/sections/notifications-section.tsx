import { NotificationsSection as BaseNotificationsSection } from '@/features/notifications/ui/notifications-section';

export const NotificationsSection = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Уведомления</h2>
      <BaseNotificationsSection />
    </div>
  );
};
