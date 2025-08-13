'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/base/card';
import { Button } from '@/shared/ui/base/button';
import { Badge } from '@/shared/ui/base/badge';
import { API_CONFIG } from '@/shared/config/api-config';
import { apiClient } from '@/shared/config/axios';
import { Activity, AlertCircle, CheckCircle, Settings, ExternalLink } from 'lucide-react';

export const ApiDebug = () => {
  const [testResult, setTestResult] = useState<{
    status: string;
    error?: string;
    time?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    responseData?: any;
  }>({ status: 'not_tested' });

  // Показываем только в development режиме
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const testApiConnection = async () => {
    setTestResult({ status: 'testing' });
    const startTime = Date.now();

    try {
      const response = await apiClient.get('/health');
      const endTime = Date.now();
      setTestResult({
        status: 'success',
        time: endTime - startTime,
        responseData: response.data,
      });
    } catch (error) {
      setTestResult({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'testing':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'testing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            API Debug
          </CardTitle>
          <CardDescription className="text-xs">Прямое подключение к API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-1">
              <strong>URL:</strong>
              <span className="truncate">{API_CONFIG.API_URL}</span>
              <ExternalLink className="h-3 w-3 text-gray-500" />
            </div>
            <div>
              <strong>Режим:</strong> {API_CONFIG.getMode()}
              {API_CONFIG.isUsingProxy() && <span className="text-green-600">📡 Прокси</span>}
            </div>
            <div>
              <strong>Timeout:</strong> 30s
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Статус:</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(testResult.status)}>
                  {getStatusIcon(testResult.status)}
                  {testResult.status}
                  {testResult.time && ` (${testResult.time}ms)`}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={testApiConnection}
                  disabled={testResult.status === 'testing'}
                >
                  {testResult.status === 'testing' ? 'Тест...' : 'Тест'}
                </Button>
              </div>
            </div>
          </div>

          {testResult.error && (
            <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              <strong>Ошибка:</strong> {testResult.error}
            </div>
          )}

          {testResult.responseData && (
            <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <strong>Ответ:</strong> {JSON.stringify(testResult.responseData, null, 2)}
            </div>
          )}

          <div className="text-xs text-gray-500 border-t pt-2">
            <div>💡 Решение проблем:</div>
            {API_CONFIG.isUsingProxy() ? (
              <>
                <div>✅ Прокси активен - Mixed Content решен</div>
                <div>🔄 Все запросы идут через /api/proxy/</div>
                <div>📡 HTTPS → Next.js → HTTP Backend</div>
              </>
            ) : (
              <>
                <div>1. Проверьте настройки сервера</div>
                <div>2. Убедитесь что бэкенд доступен</div>
                <div>3. Обновите URL в переменных окружения</div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
