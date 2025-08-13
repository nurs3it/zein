'use client';

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button } from '@/shared/ui/base/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card';
import { Badge } from '@/shared/ui/base/badge';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { AppError, ErrorInfo } from '@/shared/types';

interface ErrorFallbackProps {
  error: AppError;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReload = () => {
    window.location.reload();
  };

  const errorCode = error.code || 'UNKNOWN_ERROR';
  const statusCode = error.statusCode || 500;
  const timestamp = error.timestamp || new Date().toISOString();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Упс! Что-то пошло не так
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="destructive" className="font-mono">
              {errorCode}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Status: {statusCode}
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              {new Date(timestamp).toLocaleString()}
            </Badge>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
              Сообщение об ошибке:
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-white dark:bg-gray-900 p-2 rounded border">
              {error.message || 'Неизвестная ошибка'}
            </p>
          </div>

          {error.stack && (
            <div className="border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full justify-between"
              >
                <span>Технические детали</span>
                {showDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {showDetails && (
                <div className="mt-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-40 font-mono">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button onClick={resetErrorBoundary} className="flex-1 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Попробовать снова
          </Button>
          <Button
            variant="outline"
            onClick={handleReload}
            className="flex-1 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Перезагрузить страницу
          </Button>
          <Button
            variant="secondary"
            onClick={handleGoHome}
            className="flex-1 flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            На главную
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback: Fallback = ErrorFallback,
  onError,
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Создаем расширенную ошибку
    const appError: AppError = {
      ...error,
      timestamp: new Date().toISOString(),
      code: 'BOUNDARY_ERROR',
    };

    // Вызываем пользовательский обработчик ошибок
    if (onError) {
      onError(appError, {
        componentStack: errorInfo.componentStack || undefined,
        errorBoundary: true,
      });
    }

    // В реальном приложении здесь можно отправить ошибку в систему мониторинга
    // например, Sentry, LogRocket, или собственную систему
  };

  return (
    <ReactErrorBoundary FallbackComponent={Fallback} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  );
};
