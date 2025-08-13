import { AuthWrapper } from '@/shared/ui';
import { Header, HomeHero, HomeFeatures, HomeTargetAudience, HomeCTA, HomeFooter } from '@/widgets';

// Клиентский компонент с аутентификацией
const AuthenticatedHomePage = () => {
  return (
    <AuthWrapper>
      <Header />
      <HomeHero />
      <HomeFeatures />
      <HomeTargetAudience />
      <HomeCTA />
      <HomeFooter />
    </AuthWrapper>
  );
};

// Основная страница (SSR)
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AuthenticatedHomePage />
    </div>
  );
}
