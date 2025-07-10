# API Setup Guide

## 🔧 Текущая конфигурация

Приложение настроено для **прямых запросов** к API.

### Основные настройки

- **Режим**: Прямые запросы к API
- **URL**: `http://oneki.kz:8002/api`
- **Timeout**: 30 секунд
- **Credentials**: Отключены

## 🌐 Настройка окружения

### Environment переменные

Создайте файл `.env.local` для переопределения URL (опционально):

```bash
# URL вашего API (по умолчанию используется http://oneki.kz:8002/api)
NEXT_PUBLIC_API_URL=http://your-api-server.com:8002/api

# Режим разработки
NODE_ENV=development
```

## 🚫 Решение CORS проблем

### На стороне сервера (рекомендуется)

Добавьте в ваш Django/FastAPI сервер:

```python
# Django
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-domain.com",
]

# FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔍 Отладка

### Использование ApiDebug

В development режиме доступен компонент ApiDebug (левый нижний угол):

- **Тест соединения**: Проверка доступности API
- **Время отклика**: Измерение скорости
- **Детали ошибок**: Подробная информация о проблемах

### Логирование

Все API запросы логируются в консоль браузера:

```bash
[API] GET /health { baseURL: "http://oneki.kz:8002/api", headers: {...} }
[API] Response 200: { status: "ok" }
```

## 📁 Структура файлов

```
src/
├── shared/config/
│   ├── api-config.ts       # Основная конфигурация API
│   └── axios.ts            # Настройки axios клиента
└── widgets/dev-tools/
    └── ui/api-debug.tsx    # Компонент для отладки API
```

## ✅ Проверка работы

1. Убедитесь что сервер запущен на `http://oneki.kz:8002`
2. Откройте приложение на `http://localhost:3000`
3. Используйте ApiDebug для тестирования соединения
4. Проверьте консоль браузера на ошибки

## 🔧 Возможные проблемы

### CORS ошибки

- Настройте CORS на сервере для домена `http://localhost:3000`
- Убедитесь что сервер отвечает на preflight запросы (OPTIONS)

### Таймауты

- Проверьте доступность сервера `http://oneki.kz:8002`
- Увеличьте timeout в `api-config.ts` при необходимости

### Проблемы авторизации

- Проверьте что токены сохраняются в cookies
- Убедитесь что сервер принимает Bearer токены
