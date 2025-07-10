'use client';

import { SessionStatus } from '@/shared/ui/components/session-status';

export const DevSessionStatus = () => {
  // Показываем только в development режиме
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
      <SessionStatus showDetails showUserInfo />
    </div>
  );
};
