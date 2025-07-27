import { ProtectedRoute } from '@/shared/ui/components/protected-route';
import { PlatformHeader } from '@/widgets/header';
import { PlatformLayout as Layout } from '@/shared/ui/layouts/platform-layout';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>
        <PlatformHeader />
        {children}
      </Layout>
    </ProtectedRoute>
  );
}
