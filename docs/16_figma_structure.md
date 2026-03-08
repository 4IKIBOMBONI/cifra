# 16. Структура Figma-прототипа

## Страницы в Figma

```
📁 CIFRA — Design System
├── 📄 Cover                     # Обложка проекта
├── 📄 Design Tokens             # Все токены
├── 📄 UI Kit                    # Компоненты
├── 📄 Icons                     # Набор иконок
│
├── 📄 Auth                      # Авторизация
├── 📄 Home                      # Главная
├── 📄 Directions                # Направления
├── 📄 Schedule & Booking        # Расписание и бронирование
├── 📄 Teams                     # Команды
├── 📄 Rating                    # Рейтинг и баллы
├── 📄 Rewards                   # Награды
├── 📄 News                      # Новости и турниры
├── 📄 Materials                 # Материалы
├── 📄 Campus Map                # Карта кампуса
├── 📄 Profile                   # Профиль
├── 📄 DKSh                      # Анкета ДКШ
├── 📄 Notifications             # Уведомления
│
├── 📄 Admin — Dashboard         # Админ: дашборд
├── 📄 Admin — Tables            # Админ: типовые таблицы
├── 📄 Admin — Forms             # Админ: типовые формы
├── 📄 Admin — Analytics         # Админ: аналитика
├── 📄 Admin — Audit Log         # Админ: журнал действий
│
└── 📄 Mobile Screens            # Мобильные версии всех ключевых экранов
```

## Набор экранов

### Auth (4 экрана)
1. Login — десктоп
2. Register — десктоп (форма с верификацией)
3. Register — ошибка верификации (с кнопкой Telegram)
4. Forgot Password

### Home (2 экрана)
1. Главная — десктоп
2. Главная — мобильная

### Directions (3 экрана)
1. Каталог направлений — сетка
2. Страница направления (описание + расписание + ресурсы)
3. Пустое состояние

### Schedule & Booking (6 экранов)
1. Расписание — вид «день»
2. Расписание — вид «неделя»
3. Карточка слота (свободный, с кнопкой «Записаться»)
4. Карточка слота (записан, с кнопкой «Отменить»)
5. Карточка слота (заполнен)
6. Ошибка: рейтинг/лимит

### Teams (4 экрана)
1. Список команд
2. Создание команды
3. Страница команды (с участниками)
4. Приглашение (уведомление)

### Rating (3 экрана)
1. Рейтинг — мой балл + прогресс-бар
2. Лидерборд
3. Правила начисления

### Rewards (3 экрана)
1. Каталог наград
2. Карточка награды (доступна / недоступна)
3. Мои заявки

### News (3 экрана)
1. Лента новостей (с фильтрами)
2. Статья / новость
3. Анонс турнира

### Materials (2 экрана)
1. Каталог материалов
2. Страница материала (текст / PDF / видео)

### Campus Map (2 экрана)
1. Карта с маркерами
2. Попап локации

### Profile (4 экрана)
1. Профиль — основная информация
2. Редактирование профиля
3. Мои бронирования (табы: предстоящие / прошедшие)
4. Уведомления

### DKSh (2 экрана)
1. Анкета — заполнение/редактирование
2. Анкета — превью (как видит админ)

### Admin (8 экранов)
1. Дашборд (виджеты + мини-графики)
2. Таблица пользователей (с фильтрами, поиском)
3. Карточка пользователя (детали + действия)
4. Генератор слотов (форма)
5. Создание новости/анонса (форма с rich text)
6. Управление наградами (таблица + форма)
7. Аналитика (графики, метрики, выгрузки)
8. Журнал действий (таблица)

### Mobile (10 экранов)
1. Главная (мобильная)
2. Расписание (мобильное — только вид «день»)
3. Карточка слота (мобильная — кнопка внизу)
4. Рейтинг (мобильный)
5. Награды (мобильные)
6. Новости (мобильные)
7. Профиль (мобильный)
8. Навигация: таб-бар
9. Навигация: бургер-меню (выезжающее)
10. Карта кампуса (мобильная — full screen + bottom sheet)

## Компоненты UI Kit

### Базовые
- Button (primary, secondary, ghost, danger) × (sm, md, lg) × (default, hover, active, disabled, loading)
- Input (text, email, password, search) × (default, focus, error, disabled)
- Textarea
- Select / Dropdown
- Checkbox
- Radio
- Toggle / Switch
- DatePicker
- TagInput (с автокомплитом)
- FileUpload (drag & drop)

### Навигация
- Header (десктоп)
- MobileTabBar
- BurgerMenu
- Sidebar (админ)
- Breadcrumbs
- Tabs (horizontal)
- Pagination

### Данные
- Card (базовая)
- DirectionCard
- SlotCard
- NewsCard
- RewardCard
- MaterialCard
- BookingCard
- TeamCard
- Table (с сортировкой, пагинацией)
- LeaderboardRow

### Фидбек
- Toast (success, error, warning, info)
- Modal (sm, md, lg)
- BottomSheet (мобильный)
- EmptyState
- Skeleton (line, card, table row)
- Badge (статус, тип, направление)
- ProgressBar

### Геймификация
- RatingBadge (число + уровень + цвет)
- PointsAnimation (+10 всплывающее)
- LevelProgressBar (до следующего уровня)
- AchievementBadge

### Доменные
- Avatar (с fallback на инициалы)
- NotificationItem (прочитано / не прочитано)
- SlotTimeline (вертикальный таймлайн дня)
- WeekGrid (сетка недели)
- CampusMapMarker (маркер на карте)

## Токены

### Цвета
```
--color-primary: #6C5CE7
--color-primary-light: #A29BFE
--color-primary-dark: #5141C9
--color-secondary: #00D2D3
--color-secondary-light: #55E6C1
--color-accent: #FECA57
--color-success: #00B894
--color-warning: #FDCB6E
--color-error: #FF6B6B
--color-bg: #0F0F1A
--color-surface: #1A1A2E
--color-surface-elevated: #252540
--color-border: #2D2D4A
--color-text-primary: #FFFFFF
--color-text-secondary: #A0A0B8
--color-text-muted: #6B6B80
```

### Типографика
```
--font-heading: 'Inter', sans-serif
--font-body: 'Inter', sans-serif
--font-accent: 'Space Grotesk', sans-serif

--text-h1: 700 32px/40px var(--font-heading)
--text-h2: 700 24px/32px var(--font-heading)
--text-h3: 600 20px/28px var(--font-heading)
--text-h4: 600 16px/24px var(--font-heading)
--text-body: 400 14px/20px var(--font-body)
--text-body-lg: 400 16px/24px var(--font-body)
--text-small: 400 12px/16px var(--font-body)
--text-caption: 500 10px/14px var(--font-body)
--text-rating: 700 28px/32px var(--font-accent)
```

### Отступы
```
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 24px
--spacing-2xl: 32px
--spacing-3xl: 48px
--spacing-4xl: 64px
```

### Скругления
```
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
--radius-full: 9999px
```

### Тени
```
--shadow-sm: 0 2px 4px rgba(0,0,0,0.3)
--shadow-md: 0 4px 12px rgba(0,0,0,0.4)
--shadow-lg: 0 8px 24px rgba(0,0,0,0.5)
--shadow-glow-primary: 0 0 20px rgba(108,92,231,0.3)
--shadow-glow-secondary: 0 0 20px rgba(0,210,211,0.3)
```

## Варианты состояний (по компонентам)

| Компонент | Состояния |
|-----------|-----------|
| Button | default, hover, active, disabled, loading |
| Input | default, focus, filled, error, disabled |
| Card | default, hover, selected |
| SlotCard | available, partial, full, past |
| Badge | по цветам направлений + статусы |
| Toast | success, error, warning, info |
| NotificationItem | unread, read |
| BookingCard | confirmed, completed, cancelled, no_show |
| RewardCard | available, unavailable, out_of_stock |
| RatingBadge | red (< 30), yellow (30–70), green (70+), purple (100+) |
