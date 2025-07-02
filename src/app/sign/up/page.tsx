import { RegisterForm } from '@/features/auth/ui/register-form';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <RegisterForm />
    </div>
  );
}
