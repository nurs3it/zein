import { cn } from '@/lib/utils';
import Head from 'next/head';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const PageWrapper = ({ children, className, title, description }: PageWrapperProps) => {
  return (
    <div className={cn('min-h-screen', className)}>
      {title && (
        <Head>
          <title>{title} - Zein</title>
          {description && <meta name="description" content={description} />}
        </Head>
      )}
      {children}
    </div>
  );
};
