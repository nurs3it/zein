import { ProtectedRoute } from '@/shared/ui/components/protected-route';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
