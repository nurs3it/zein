import { AuthWrapper } from '@/shared/ui/components/auth-wrapper';
import { Header } from '@/widgets/header';
import { HomeHero } from '@/widgets/home-hero';
import { HomeFeatures } from '@/widgets/home-features';
import { HomeTargetAudience } from '@/widgets/home-target-audience';
import { HomeCTA } from '@/widgets/home-cta';
import { HomeFooter } from '@/widgets/home-footer';

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
