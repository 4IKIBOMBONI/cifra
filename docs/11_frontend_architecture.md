# 11. Frontend-архитектура

## Фреймворк: React 18 + TypeScript + Vite

## Структура приложения

```
frontend/
├── public/
│   ├── campus-map.svg           # SVG-карта кампуса
│   └── favicon.svg
│
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root component, routing
│   ├── vite-env.d.ts
│   │
│   ├── api/                     # API-клиент
│   │   ├── client.ts            # Axios instance, interceptors
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── directions.ts
│   │   ├── booking.ts
│   │   ├── teams.ts
│   │   ├── rating.ts
│   │   ├── rewards.ts
│   │   ├── news.ts
│   │   ├── materials.ts
│   │   ├── dksh.ts
│   │   ├── notifications.ts
│   │   ├── admin.ts
│   │   └── export.ts
│   │
│   ├── store/                   # Zustand stores
│   │   ├── authStore.ts         # Авторизация, текущий пользователь
│   │   ├── notificationStore.ts # Уведомления
│   │   └── uiStore.ts           # UI-состояние (sidebar, modals)
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useBooking.ts
│   │   ├── useRating.ts
│   │   └── useNotifications.ts
│   │
│   ├── pages/                   # Страницы (по роутам)
│   │   ├── Home/
│   │   │   └── HomePage.tsx
│   │   ├── Auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── Directions/
│   │   │   ├── DirectionsPage.tsx
│   │   │   └── DirectionDetailPage.tsx
│   │   ├── Schedule/
│   │   │   ├── SchedulePage.tsx
│   │   │   └── SlotDetailPage.tsx
│   │   ├── Teams/
│   │   │   ├── TeamsPage.tsx
│   │   │   ├── TeamDetailPage.tsx
│   │   │   └── CreateTeamPage.tsx
│   │   ├── Rating/
│   │   │   └── RatingPage.tsx
│   │   ├── Rewards/
│   │   │   ├── RewardsPage.tsx
│   │   │   └── RewardDetailPage.tsx
│   │   ├── News/
│   │   │   ├── NewsPage.tsx
│   │   │   └── NewsDetailPage.tsx
│   │   ├── Materials/
│   │   │   ├── MaterialsPage.tsx
│   │   │   └── MaterialDetailPage.tsx
│   │   ├── Map/
│   │   │   └── CampusMapPage.tsx
│   │   ├── Profile/
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── EditProfilePage.tsx
│   │   │   ├── BookingsPage.tsx
│   │   │   ├── NotificationsPage.tsx
│   │   │   └── DkshProfilePage.tsx
│   │   └── Admin/
│   │       ├── AdminLayout.tsx
│   │       ├── DashboardPage.tsx
│   │       ├── UsersPage.tsx
│   │       ├── DirectionsAdminPage.tsx
│   │       ├── ResourcesPage.tsx
│   │       ├── LocationsPage.tsx
│   │       ├── SlotsPage.tsx
│   │       ├── NewsAdminPage.tsx
│   │       ├── MaterialsAdminPage.tsx
│   │       ├── RewardsAdminPage.tsx
│   │       ├── RatingAdminPage.tsx
│   │       ├── DkshAdminPage.tsx
│   │       ├── AnalyticsPage.tsx
│   │       └── AuditLogPage.tsx
│   │
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Базовые UI-компоненты
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── TagInput.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   ├── layout/              # Layout компоненты
│   │   │   ├── Header.tsx
│   │   │   ├── MobileTabBar.tsx
│   │   │   ├── Sidebar.tsx      # Админ-панель
│   │   │   ├── BurgerMenu.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageLayout.tsx
│   │   │
│   │   ├── domain/              # Доменные компоненты
│   │   │   ├── SlotCard.tsx
│   │   │   ├── DirectionCard.tsx
│   │   │   ├── NewsCard.tsx
│   │   │   ├── RewardCard.tsx
│   │   │   ├── MaterialCard.tsx
│   │   │   ├── TeamCard.tsx
│   │   │   ├── BookingCard.tsx
│   │   │   ├── RatingBadge.tsx
│   │   │   ├── LeaderboardRow.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   ├── ScheduleTimeline.tsx
│   │   │   ├── ScheduleWeekGrid.tsx
│   │   │   └── CampusMapViewer.tsx
│   │   │
│   │   └── guards/              # Route guards
│   │       ├── AuthGuard.tsx
│   │       ├── RoleGuard.tsx
│   │       └── GuestGuard.tsx
│   │
│   ├── styles/                  # Стили
│   │   ├── globals.css          # CSS reset, CSS variables
│   │   ├── tokens.css           # Design tokens
│   │   └── animations.css       # Анимации
│   │
│   ├── types/                   # TypeScript типы
│   │   ├── user.ts
│   │   ├── direction.ts
│   │   ├── booking.ts
│   │   ├── team.ts
│   │   ├── rating.ts
│   │   ├── reward.ts
│   │   ├── news.ts
│   │   ├── material.ts
│   │   ├── notification.ts
│   │   └── api.ts               # Generic API response types
│   │
│   └── utils/                   # Утилиты
│       ├── constants.ts
│       ├── format.ts            # Форматирование дат, чисел
│       ├── validation.ts        # Правила валидации форм
│       └── helpers.ts
│
├── index.html
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── package.json
├── Dockerfile
└── .env.example
```

## Роутинг

React Router v6 с lazy loading:

```tsx
<Routes>
  {/* Public */}
  <Route path="/auth/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
  <Route path="/auth/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />

  {/* All authenticated */}
  <Route element={<AuthGuard />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/directions" element={<DirectionsPage />} />
    <Route path="/directions/:slug" element={<DirectionDetailPage />} />
    <Route path="/schedule" element={<SchedulePage />} />
    <Route path="/schedule/:slotId" element={<SlotDetailPage />} />
    <Route path="/news" element={<NewsPage />} />
    <Route path="/news/:newsId" element={<NewsDetailPage />} />
    <Route path="/materials" element={<MaterialsPage />} />
    <Route path="/materials/:materialId" element={<MaterialDetailPage />} />
    <Route path="/map" element={<CampusMapPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/profile/notifications" element={<NotificationsPage />} />
  </Route>

  {/* Students only */}
  <Route element={<RoleGuard roles={['student']} />}>
    <Route path="/teams" element={<TeamsPage />} />
    <Route path="/rating" element={<RatingPage />} />
    <Route path="/rewards" element={<RewardsPage />} />
    <Route path="/profile/dksh" element={<DkshProfilePage />} />
  </Route>

  {/* Admin */}
  <Route element={<RoleGuard roles={['admin']} />}>
    <Route path="/admin/*" element={<AdminLayout />} />
  </Route>
</Routes>
```

## Состояние

- **Zustand** — глобальное состояние (auth, уведомления, UI).
- **React Query (TanStack Query)** — серверное состояние (кэширование, рефетчинг, пагинация).
- **React Hook Form** — состояние форм.

Обоснование: Zustand минималистичен и не требует boilerplate. React Query решает все задачи работы с серверными данными.

## Работа с API

```typescript
// api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Попытка обновить токен
      // Если не удалось — logout
    }
    return Promise.reject(error);
  }
);
```

## Роли и Guards

```tsx
// AuthGuard — редирект на /auth/login если не авторизован
// RoleGuard — редирект на / если роль не подходит
// GuestGuard — редирект на / если уже авторизован
```

Guards реализованы как wrapper-компоненты с `<Outlet />`.

## Формы

React Hook Form + Zod для валидации:

```tsx
const schema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});
```

## Таблицы

TanStack Table для админ-панели:
- Серверная пагинация и сортировка.
- Фильтры.
- Выделение строк.
- Экспорт.

## Адаптивность

Tailwind CSS breakpoints:
- `sm`: 640px (мобильные)
- `md`: 768px (планшеты)
- `lg`: 1024px (десктоп)
- `xl`: 1280px (широкий десктоп)

Подход: mobile-first. Базовые стили — для мобильных, расширяются для десктопа.

Ключевые адаптивные решения:
- Навигация: таб-бар + бургер на мобильных, горизонтальная панель на десктопе.
- Сетки: 1 колонка → 2 → 3 при увеличении ширины.
- Таблицы: карточный вид на мобильных, табличный на десктопе.
- Модалки: полноэкранные на мобильных, центрированные на десктопе.

## Дизайн-система

### Цветовая палитра
- Primary: `#6C5CE7` (фиолетовый — энергичный, молодёжный)
- Secondary: `#00D2D3` (бирюзовый — свежий, технологичный)
- Accent: `#FECA57` (жёлтый — внимание, награды)
- Success: `#00B894`
- Warning: `#FDCB6E`
- Error: `#FF6B6B`
- Background: `#0F0F1A` (тёмный фон для геймифицированного ощущения)
- Surface: `#1A1A2E`
- Text: `#FFFFFF` (основной), `#A0A0B8` (вторичный)

### Типографика
- Заголовки: Inter Bold / Black
- Текст: Inter Regular / Medium
- Акценты: Space Grotesk (для рейтинга, баллов, чисел)

### Компоненты
- Скруглённые углы (12–16px) — мягкий, современный вид.
- Gradient-акценты на кнопках и hero-блоках.
- Микроанимации: hover-эффекты, появление элементов, счётчик баллов.
- Glassmorphism для карточек (backdrop-blur).
- Неоновые акценты для геймификации (glow-эффекты на рейтинге).

### Подход к геймификации в UI
1. **Рейтинг как визуальный элемент**: всегда виден в шапке, цветовая индикация уровня.
2. **Анимация начисления баллов**: при получении баллов — анимированное всплывающее число (+10).
3. **Прогресс-бары**: до следующего уровня лимита бронирований.
4. **Лидерборд**: позиция пользователя подсвечена, анимация при изменении позиции.
5. **Достижения**: бейджи в профиле (визуальные, без сложной логики на старте).
6. **Цветовые уровни рейтинга**: красный → жёлтый → зелёный → фиолетовый (элитный).
