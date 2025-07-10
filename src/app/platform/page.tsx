import { PlatformLayout } from '@/shared/ui/layouts/platform-layout';
import { PlatformHeader } from '@/widgets/platform-header';
import { PlatformDashboard } from '@/widgets/platform-dashboard';

export default function PlatformPage() {
  return (
    <PlatformLayout>
      <PlatformHeader />
      <PlatformDashboard />
    </PlatformLayout>
  );
}
