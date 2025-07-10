import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from './providers/app-providers';
import { DevSessionStatus, ApiDebug } from '@/widgets/dev-tools';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zein - ИИ для образования',
  description: 'Платформа для создания учебных материалов с помощью искусственного интеллекта',
  keywords: ['ИИ', 'образование', 'учителя', 'презентации', 'методички'],
  authors: [{ name: 'Zein Team' }],
  creator: 'Zein',
  openGraph: {
    title: 'Zein - ИИ для образования',
    description: 'Платформа для создания учебных материалов с помощью искусственного интеллекта',
    type: 'website',
    locale: 'ru_RU',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>
          <div className="min-h-screen">
            <DevSessionStatus />
            <ApiDebug />
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
