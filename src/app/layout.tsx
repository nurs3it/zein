import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from './providers/app-providers';
import { SessionStatus } from '@/shared/ui/components/session-status';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zein - ИИ для образования',
  description: 'Платформа для создания учебных материалов с помощью искусственного интеллекта',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>
          <div className="min-h-screen">
            <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
              <SessionStatus showDetails showUserInfo />
            </div>
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
