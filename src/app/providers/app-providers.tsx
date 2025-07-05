'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { store } from '@/shared/store';
import { queryClient } from '@/shared/config/query-client';
import { ErrorBoundary } from '@/shared/ui/components/error-boundary';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <div suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
              <Toaster richColors position="top-right" />
            </QueryClientProvider>
          </Provider>
        </ThemeProvider>
      </div>
    </ErrorBoundary>
  );
};
