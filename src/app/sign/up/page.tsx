import { RegisterForm } from '@/features/auth/ui/register-form';
import { AuthLayout } from '@/shared/ui/layouts/auth-layout';

export default function SignUpPage() {
  return (
    <AuthLayout variant="register">
      <RegisterForm />
    </AuthLayout>
  );
}
