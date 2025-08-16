# Фича уведомлений

## Описание

Фича уведомлений предоставляет полный функционал для работы с системными уведомлениями пользователей. Включает в себя отображение, фильтрацию, пагинацию, управление статусами и готовность к интеграции с WebSocket для real-time обновлений.

## Архитектура

### Структура файлов

```
src/features/notifications/
├── model/
│   ├── notifications-slice.ts      # Redux slice для состояния
│   ├── notifications-hooks.ts      # React Query хуки для API
│   └── index.ts                    # Экспорты модели
├── ui/
│   ├── notifications-section.tsx   # Компонент для встраивания
│   ├── notifications-page.tsx      # Полноценная страница
│   └── index.ts                    # Экспорты UI
└── index.ts                        # Главные экспорты фичи
```

### Компоненты

#### UI компоненты (shared/ui/components/)

- **NotificationFilters** - Фильтры для уведомлений с расширяемым интерфейсом
- **NotificationStats** - Статистика уведомлений с визуализацией
- **NotificationItem** - Отдельный элемент уведомления с действиями
- **Pagination** - Компонент пагинации для списков

#### Страницы

- **NotificationsPage** - Полноценная страница уведомлений с полным функционалом
- **NotificationsSection** - Компонент для встраивания в другие страницы

## Функциональность

### Основные возможности

1. **Отображение уведомлений**
   - Список с пагинацией
   - Фильтрация по типу, статусу, дате
   - Поиск по тексту
   - Сортировка

2. **Управление уведомлениями**
   - Отметить как прочитанное
   - Отметить все как прочитанные
   - Удаление уведомлений
   - Массовые операции с выбранными

3. **Файлы и вложения**
   - Скачивание файлов из уведомлений
   - Отображение информации о файлах

4. **Статистика**
   - Общее количество уведомлений
   - Количество непрочитанных
   - Распределение по типам и статусам

### WebSocket готовность

Фича готова к интеграции с WebSocket для real-time обновлений. В проекте уже есть хук `useWebSocket` в `src/shared/hooks/use-websocket.ts`, который можно использовать для интеграции:

```typescript
import { useWebSocket } from '@/shared/hooks';

const { isConnected, sendMessage } = useWebSocket({
  url: 'ws://localhost:8000/ws/notifications/',
  onMessage: data => {
    // Обработка новых уведомлений
    if (data.type === 'notification') {
      // Обновление состояния
    }
  },
});
```

## Использование

### Базовая страница уведомлений

```typescript
import { NotificationsPage } from '@/features/notifications';

export default function Notifications() {
  return <NotificationsPage />;
}
```

### Встраивание в другие страницы

```typescript
import { NotificationsSection } from '@/features/notifications';

export default function Dashboard() {
  return (
    <div>
      <h1>Дашборд</h1>
      <NotificationsSection />
    </div>
  );
}
```

### Использование хуков

```typescript
import { useNotifications, useMarkAsReadMutation } from '@/features/notifications';

function MyComponent() {
  const { notifications, unreadCount } = useNotifications();
  const markAsRead = useMarkAsReadMutation();

  const handleMarkAsRead = (id: number) => {
    markAsRead.mutate([id]);
  };

  return (
    <div>
      <p>Непрочитанных: {unreadCount}</p>
      {notifications.map(notification => (
        <div key={notification.id}>
          {notification.localized_title}
          <button onClick={() => handleMarkAsRead(notification.id)}>
            Прочитано
          </button>
        </div>
      ))}
    </div>
  );
}
```

## API интеграция

### Основные эндпоинты

- `GET /api/notifications/` - Список уведомлений с фильтрами
- `GET /api/notifications/{id}/` - Детальная информация
- `POST /api/notifications/mark-read/` - Отметить как прочитанное
- `POST /api/notifications/mark-all-read/` - Отметить все как прочитанные
- `DELETE /api/notifications/{id}/` - Удалить уведомление
- `GET /api/notifications/{id}/download/` - Скачать файл
- `GET /api/notifications/stats/` - Статистика

### Фильтры

Поддерживаемые параметры фильтрации:

- `search` - Поиск по тексту
- `notification_type` - Тип уведомления (info, success, warning, error, system)
- `status` - Статус (pending, sent, read, failed)
- `is_read` - Прочитано/не прочитано
- `date_from` / `date_to` - Диапазон дат
- `page_size` - Размер страницы
- `ordering` - Сортировка

## Состояние Redux

### Структура состояния

```typescript
interface NotificationState {
  notifications: NotificationList[];
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  filters: NotificationFilters;
  stats: NotificationStats | null;
}
```

### Actions

- `setNotifications` - Установить список уведомлений
- `addNotification` - Добавить новое уведомление
- `markAsRead` - Отметить как прочитанное
- `markAllAsRead` - Отметить все как прочитанные
- `removeNotification` - Удалить уведомление
- `setFilters` - Установить фильтры
- `setPage` - Установить страницу
- `setStats` - Установить статистику

## Расширение функциональности

### Добавление новых типов уведомлений

1. Обновите enum `NotificationType` в `types.ts`
2. Добавьте соответствующие иконки и цвета в компоненты
3. Обновите фильтры и статистику

### Добавление новых действий

1. Создайте новый API метод в `notification-api.ts`
2. Добавьте соответствующий хук в `notifications-hooks.ts`
3. Обновите UI компоненты

### Кастомизация UI

Все компоненты используют Tailwind CSS и поддерживают кастомизацию через props `className`.

## Производительность

- Используется React Query для кеширования API запросов
- Виртуализация списков для больших объемов данных
- Оптимизированные re-renders с помощью React.memo
- Lazy loading для изображений и файлов

## Тестирование

Для тестирования компонентов используйте:

```typescript
import { render, screen } from '@testing-library/react';
import { NotificationsPage } from '@/features/notifications';

test('renders notifications page', () => {
  render(<NotificationsPage />);
  expect(screen.getByText('Уведомления')).toBeInTheDocument();
});
```

## Будущие улучшения

- [ ] Push уведомления
- [ ] Email уведомления
- [ ] Группировка уведомлений
- [ ] Экспорт уведомлений
- [ ] Настройки уведомлений пользователя
- [ ] Темы оформления
- [ ] Мобильная оптимизация
- [ ] WebSocket интеграция для real-time обновлений
