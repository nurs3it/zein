import { Sidebar } from '@/widgets/sidebar';

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export const PlatformLayout = ({ children }: PlatformLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6 pt-20 lg:pt-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
