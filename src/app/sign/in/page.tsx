import { LoginForm } from '@/features/auth/ui/login-form';
import { AuthLayout } from '@/shared/ui/layouts/auth-layout';

export default function SignInPage() {
  return (
    <AuthLayout variant="login">
      <LoginForm />
    </AuthLayout>
  );
}
