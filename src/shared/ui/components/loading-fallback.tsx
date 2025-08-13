import { LoadingScreen } from '@/shared/ui/base/loading-screen';

interface LoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LoadingFallback = ({
  message = 'Загрузка...',
  size = 'md',
  fullScreen = true,
}: LoadingFallbackProps) => {
  if (fullScreen) {
    return <LoadingScreen message={message} />;
  }

  const sizeClasses = {
    sm: 'h-32',
    md: 'h-64',
    lg: 'h-96',
  };

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};
