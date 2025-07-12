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
        {children}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>&copy; 2024 Zein. Автоматизация образования с помощью ИИ.</p>
        </div>
      </div>
    </div>
  );
};
