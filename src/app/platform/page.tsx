import { PlatformLayout } from '@/shared/ui/layouts/platform-layout';
import { PlatformDashboard } from '@/widgets/platform-dashboard';

export default function PlatformPage() {
  return (
    <PlatformLayout>
      <PlatformDashboard />
    </PlatformLayout>
  );
}
