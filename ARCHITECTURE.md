# Архитектура Feature-Sliced Design (FSD)

## Структура проекта

```
src/
├── app/                    # App layer - инициализация приложения
│   ├── api/               # API роуты Next.js
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Корневой layout
│   ├── page.tsx           # Главная страница
│   ├── platform/          # Страницы платформы
│   └── sign/              # Страницы аутентификации
├── entities/              # Entities layer - бизнес-сущности
│   ├── user/              # Сущность пользователя
│   │   ├── api/           # API для работы с пользователем
│   │   ├── model/         # Типы и интерфейсы
│   │   └── index.ts       # Публичный API
│   └── notification/      # Сущность уведомлений
│       ├── api/           # API для работы с уведомлениями
│       ├── model/         # Типы и интерфейсы
│       └── index.ts       # Публичный API
├── features/              # Features layer - пользовательские сценарии
│   ├── auth/              # Функциональность аутентификации
│   │   ├── api/           # API аутентификации
│   │   ├── model/         # Redux slice и хуки
│   │   ├── ui/            # UI компоненты
│   │   └── index.ts       # Публичный API
│   └── notifications/     # Функциональность уведомлений
│       ├── api/           # API уведомлений
│       ├── model/         # Redux slice и хуки
│       ├── ui/            # UI компоненты
│       └── index.ts       # Публичный API
├── widgets/               # Widgets layer - композитные блоки
│   ├── header/            # Виджет заголовка
│   ├── sidebar/           # Виджет боковой панели
│   ├── platform-dashboard/ # Виджет дашборда
│   ├── home-hero/         # Виджет главной страницы
│   └── index.ts           # Публичный API
└── shared/                # Shared layer - переиспользуемый код
    ├── ui/                # UI компоненты
    │   ├── base/          # Базовые UI компоненты
    │   ├── components/    # Композитные UI компоненты
    │   └── layouts/       # Layout компоненты
    ├── api/               # Общие API утилиты
    ├── config/            # Конфигурация
    ├── store/             # Redux store
    ├── types/             # Общие типы
    ├── hooks/             # Общие хуки
    ├── lib/               # Утилиты
    └── constants/         # Константы
```

## Принципы архитектуры

### 1. Слои (Layers)

- **App** - инициализация приложения, роутинг, глобальные стили
- **Entities** - бизнес-сущности (User, Notification, etc.)
- **Features** - пользовательские сценарии (Auth, Notifications, etc.)
- **Widgets** - композитные блоки интерфейса
- **Shared** - переиспользуемый код

### 2. Правила зависимостей

- Каждый слой может зависеть только от слоев ниже себя
- App → Widgets → Features → Entities → Shared
- Запрещены циклические зависимости

### 3. Структура слайса

Каждый слайс содержит:

```
slice/
├── api/           # API методы
├── model/         # Бизнес-логика, типы, хуки
├── ui/            # UI компоненты
└── index.ts       # Публичный API
```

### 4. Публичный API

Каждый слайс экспортирует только необходимые части через `index.ts`:

```typescript
// ✅ Правильно
export { LoginForm } from './ui/login-form';
export { useAuth } from './model/auth-hooks';

// ❌ Неправильно
export * from './ui';
export * from './model';
```

## Примеры использования

### Импорт из entities

```typescript
import { User } from '@/entities/user';
import { notificationApi } from '@/entities/notification';
```

### Импорт из features

```typescript
import { LoginForm, useAuth } from '@/features/auth';
import { NotificationsSection } from '@/features/notifications';
```

### Импорт из widgets

```typescript
import { Header, PlatformDashboard } from '@/widgets';
```

### Импорт из shared

```typescript
import { Button, Card } from '@/shared/ui/base';
import { AuthWrapper } from '@/shared/ui';
import { store } from '@/shared/store';
```

## Лучшие практики

1. **Изоляция слайсов** - каждый слайс должен быть независимым
2. **Минимальный публичный API** - экспортируйте только необходимое
3. **Типизация** - используйте TypeScript для всех интерфейсов
4. **Тестирование** - каждый слайс должен быть покрыт тестами
5. **Документация** - документируйте публичный API каждого слайса

## Миграция

При рефакторинге существующего кода:

1. Определите границы слайсов
2. Переместите код в соответствующие слои
3. Обновите импорты
4. Создайте публичные API
5. Удалите старые файлы
6. Обновите документацию
