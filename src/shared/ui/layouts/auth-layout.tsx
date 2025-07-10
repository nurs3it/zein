import { Brain } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: 'login' | 'register';
}

export const AuthLayout = ({ children, variant = 'login' }: AuthLayoutProps) => {
  const gradientClass =
    variant === 'login'
      ? 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'
      : 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800';

  return (
    <div className={`min-h-screen flex items-center justify-center ${gradientClass} p-4`}>
      <div className="w-full max-w-md space-y-8">
        {/* Logo Section */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Zein
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {variant === 'login' ? 'Добро пожаловать обратно' : 'Присоединяйтесь к нам'}
          </p>
        </div>

        {/* Form Content */}
        {children}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>&copy; 2024 Zein. Автоматизация образования с помощью ИИ.</p>
        </div>
      </div>
    </div>
  );
};
