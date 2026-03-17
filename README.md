# CIFRA — Платформа фиджитал-центра СГТУ

## Что это такое

**CIFRA** — веб-платформа для управления фиджитал-центром Саратовского государственного технического университета (СГТУ). Фиджитал-центр — это пространство, где студенты могут заниматься киберспортом, лазертагом, управлять дронами, играть на PlayStation и использовать игровые компьютеры.

Платформа решает следующие задачи:
- Бронирование тренировочных слотов по направлениям
- Рейтинговая система мотивации студентов
- Магазин наград за баллы рейтинга
- Управление командами для командных активностей
- Публикация новостей и учебных материалов
- Программа ДКШН (кадровый резерв)
- Администрирование всех процессов центра

---

## Функциональность

### Для студентов

| Функция | Описание |
|---------|----------|
| **Регистрация и верификация** | Регистрация по email, проверка по ФИО и номеру студенческого билета (сверка с базой деканата) |
| **Бронирование слотов** | Выбор направления, даты и времени; запись на тренировку. Типы: индивидуальные, командные, открытые |
| **Расписание** | Просмотр расписания занятий по направлениям с фильтрацией по дням и направлениям |
| **Рейтинг** | Начисление/списание баллов за посещение, неявку, турниры, достижения. Таблица лидеров |
| **Магазин наград** | Обмен баллов рейтинга на мерч (футболки, стикеры, кружки и т.д.) |
| **Команды** | Создание команды, приглашение участников, командная запись на слоты |
| **Новости** | Лента новостей центра: анонсы турниров, результаты, объявления |
| **Материалы** | Учебные материалы: инструкции, лекции, памятки, видео |
| **Карта кампуса** | Интерактивная карта с расположением корпусов и площадок центра |
| **Уведомления** | Оповещения о бронированиях, изменениях рейтинга, приглашениях в команды |
| **Профиль ДКШН** | Анкета для программы «Действующий кадровый школьный наставник» |
| **Telegram-бот** | Уведомления в Telegram, просмотр бронирований через бота |

### Для администраторов

| Функция | Описание |
|---------|----------|
| **Панель управления** | Дашборд со статистикой: количество пользователей, бронирований, популярные направления |
| **Управление пользователями** | Список пользователей, фильтрация, смена ролей, блокировка |
| **Управление направлениями** | CRUD направлений (киберспорт, лазертаг, дроны и т.д.) |
| **Управление локациями** | Корпуса, аудитории, площадки |
| **Управление ресурсами** | Оборудование, помещения, рабочие станции — привязка к направлениям и локациям |
| **Управление слотами** | Генерация и ручное создание слотов на выбранные даты |
| **Управление новостями** | Создание и публикация новостей и анонсов |
| **Управление материалами** | Загрузка учебных материалов |
| **Управление наградами** | Каталог наград, обработка заявок на выдачу |
| **Рейтинг** | Ручное начисление/списание баллов, просмотр истории |
| **ДКШН** | Просмотр и управление анкетами кандидатов |
| **Аналитика** | Дашборд с графиками: загрузка по направлениям, динамика бронирований |
| **Журнал аудита** | Лог действий администраторов (кто, когда, что сделал) |
| **Экспорт данных** | Выгрузка бронирований, пользователей, рейтинга в Excel и PDF |

### Для тренеров

| Функция | Описание |
|---------|----------|
| **Назначение на слоты** | Тренер привязывается к слотам, виден в расписании |
| **Просмотр записавшихся** | Список студентов, записанных на слот |

---

## Направления фиджитал-центра

1. **Киберспорт** — CS2, Dota 2, Valorant. Командные и индивидуальные тренировки, участие в турнирах
2. **Лазертаг** — Командная тактическая игра в спортзале. Развивает командную работу
3. **Дроны** — Пилотирование FPV-дронов, аэросъёмка, гонки
4. **PlayStation** — PS5: FIFA, Mortal Kombat, Gran Turismo
5. **Компьютерные места** — Игровые ПК профессионального уровня для свободной игры и тренировок

---

## Технологический стек

### Backend

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Python** | 3.12 | Язык программирования |
| **FastAPI** | >= 0.109 | Веб-фреймворк (асинхронный, REST API) |
| **SQLAlchemy** | >= 2.0 | ORM для работы с базой данных (async) |
| **PostgreSQL** | 16 | Основная база данных |
| **Redis** | 7 | Кеширование и очереди |
| **Alembic** | >= 1.13 | Миграции базы данных |
| **Pydantic** | >= 2.5 | Валидация данных и схемы |
| **python-jose** | >= 3.3 | JWT-аутентификация |
| **passlib + bcrypt** | 4.0.1 | Хеширование паролей |
| **openpyxl** | >= 3.1 | Генерация Excel-файлов |
| **reportlab** | >= 4.0 | Генерация PDF-файлов |
| **httpx** | >= 0.26 | HTTP-клиент (Telegram API) |
| **Uvicorn** | >= 0.27 | ASGI-сервер |

### Frontend

| Технология | Версия | Назначение |
|------------|--------|------------|
| **React** | 18.3 | UI-библиотека |
| **TypeScript** | 5.3 | Типизированный JavaScript |
| **Vite** | 5.0 | Сборщик и dev-сервер |
| **Tailwind CSS** | 3.4 | Утилитарный CSS-фреймворк |
| **React Router** | 6.22 | Маршрутизация (SPA) |
| **TanStack React Query** | 5.17 | Управление серверным состоянием и кеширование |
| **Zustand** | 4.5 | Управление глобальным состоянием (auth store) |
| **Axios** | 1.6 | HTTP-клиент |
| **React Hook Form + Zod** | 7.49 / 3.22 | Формы и валидация |
| **Recharts** | 2.10 | Графики и диаграммы (аналитика) |
| **Lucide React** | 0.312 | Иконки |
| **date-fns** | 3.3 | Работа с датами |
| **react-hot-toast** | 2.4 | Уведомления (toast) |
| **react-zoom-pan-pinch** | 3.3 | Масштабирование карты |

### Инфраструктура

| Технология | Назначение |
|------------|------------|
| **Docker** + **Docker Compose** | Контейнеризация всех сервисов |
| **Nginx** | Реверс-прокси и раздача статики (production) |
| **Let's Encrypt** | SSL-сертификаты (production) |

---

## Архитектура

```
cifra/
├── backend/                    # Python FastAPI API
│   ├── app/
│   │   ├── main.py             # Точка входа, регистрация роутеров
│   │   ├── config.py           # Настройки (env-переменные)
│   │   ├── database.py         # Подключение к PostgreSQL (async)
│   │   ├── seed.py             # Заполнение БД тестовыми данными
│   │   ├── auth/               # Аутентификация (login, register, JWT)
│   │   ├── users/              # Пользователи и верификация
│   │   ├── directions/         # Направления (киберспорт, дроны и т.д.)
│   │   ├── locations/          # Локации (корпуса, аудитории)
│   │   ├── resources/          # Ресурсы (оборудование, ПК)
│   │   ├── booking/            # Слоты и бронирования
│   │   ├── teams/              # Команды и участники
│   │   ├── rating/             # Рейтинговая система
│   │   ├── rewards/            # Награды и заявки
│   │   ├── news/               # Новости и анонсы
│   │   ├── materials/          # Учебные материалы
│   │   ├── dksh/               # Программа ДКШН
│   │   ├── notifications/      # Уведомления пользователей
│   │   ├── analytics/          # Аналитика и статистика
│   │   ├── audit/              # Журнал аудита
│   │   ├── uploads/            # Загрузка файлов
│   │   ├── campus_map/         # Карта кампуса
│   │   ├── export/             # Экспорт в Excel/PDF
│   │   └── telegram/           # Telegram-бот
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── App.tsx             # Маршрутизация (44 маршрута)
│   │   ├── api/                # API-клиент (Axios + interceptors)
│   │   ├── types/              # TypeScript-типы
│   │   ├── stores/             # Zustand stores (auth)
│   │   ├── components/
│   │   │   ├── ui/             # UI-компоненты (Button, Card, Input, Modal...)
│   │   │   ├── layout/         # Layouts (Header, PageLayout, AdminLayout)
│   │   │   └── guards/         # Route guards (Auth, Role, Guest)
│   │   ├── pages/
│   │   │   ├── Home/           # Главная страница
│   │   │   ├── Auth/           # Вход и регистрация
│   │   │   ├── Directions/     # Направления
│   │   │   ├── Schedule/       # Расписание
│   │   │   ├── News/           # Новости
│   │   │   ├── Materials/      # Материалы
│   │   │   ├── Map/            # Карта кампуса
│   │   │   ├── Rating/         # Рейтинг
│   │   │   ├── Profile/        # Профиль, бронирования, уведомления
│   │   │   ├── Rewards/        # Магазин наград
│   │   │   ├── Teams/          # Команды
│   │   │   └── Admin/          # Панель администратора (12 страниц)
│   │   └── styles/             # Глобальные стили
│   ├── package.json
│   ├── Dockerfile
│   ├── tailwind.config.ts
│   └── vite.config.ts
├── docker-compose.yml          # Dev-окружение
├── docker-compose.prod.yml     # Production-окружение
└── README.md                   # Этот файл
```

---

## Модель данных (15 таблиц)

| Таблица | Описание | Ключевые поля |
|---------|----------|---------------|
| **users** | Пользователи | email, role (student/trainer/admin), rating_score, is_verified |
| **verification_records** | База студенческих билетов | first_name, last_name, student_id_number |
| **directions** | Направления | name, slug, icon, color, slot_durations |
| **locations** | Локации | name, building, floor, room, map_x/y |
| **resources** | Ресурсы | name, type (equipment/venue/workstation), direction_id, location_id |
| **slots** | Тренировочные слоты | direction_id, resource_id, trainer_id, date, start/end_time, type, capacity |
| **bookings** | Бронирования | slot_id, user_id, team_id, status, attended |
| **teams** | Команды | name, direction_id, captain_id |
| **team_members** | Участники команд | team_id, user_id, role, status |
| **rating_events** | История рейтинга | user_id, event_type, points, balance_after |
| **rewards** | Каталог наград | name, cost_points, stock |
| **reward_requests** | Заявки на награды | user_id, reward_id, status, points_spent |
| **news_posts** | Новости | title, slug, type, content, direction_id |
| **materials** | Учебные материалы | title, type, content, direction_id, file_url |
| **dksh_profiles** | Анкеты ДКШН | user_id, skills, interests, achievements |
| **notifications** | Уведомления | user_id, type, title, message, is_read |
| **audit_logs** | Журнал действий | user_id, action, entity_type, details |
| **map_points** | Точки на карте | name, point_type, x/y, location_id |
| **telegram_users** | Telegram-привязки | user_id, chat_id, username |

---

## API-эндпоинты (19 модулей)

| Модуль | Префикс | Основные операции |
|--------|---------|-------------------|
| **auth** | `/api/v1/auth` | POST /register, POST /login, POST /refresh |
| **users** | `/api/v1/users` | GET / (список), GET /:id, PATCH /:id |
| **directions** | `/api/v1/directions` | CRUD, GET /:slug |
| **locations** | `/api/v1/locations` | CRUD |
| **resources** | `/api/v1/resources` | CRUD |
| **booking** | `/api/v1` | GET /slots, POST /slots/generate, POST /bookings, GET /bookings/my |
| **teams** | `/api/v1/teams` | CRUD, POST /:id/invite, POST /:id/respond |
| **rating** | `/api/v1/rating` | GET /leaderboard, GET /my, POST /events |
| **rewards** | `/api/v1/rewards` | GET /, POST /request, GET /requests/my |
| **news** | `/api/v1/news` | CRUD, GET /:slug |
| **materials** | `/api/v1/materials` | CRUD |
| **dksh** | `/api/v1/dksh` | GET /my, PUT /my, GET /candidates |
| **notifications** | `/api/v1/notifications` | GET /, PATCH /:id/read |
| **analytics** | `/api/v1/analytics` | GET /dashboard, GET /bookings |
| **audit** | `/api/v1/audit` | GET / |
| **uploads** | `/api/v1/uploads` | POST / |
| **campus_map** | `/api/v1/campus-map` | CRUD /points |
| **export** | `/api/v1/export` | GET /bookings/excel, /users/excel, /rating/excel, /bookings/pdf |
| **telegram** | `/api/v1/telegram` | POST /webhook, POST /send |

Документация API доступна по адресу:
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

---

## Роли пользователей

| Роль | Доступ |
|------|--------|
| **student** | Бронирование, рейтинг, награды, команды, материалы, новости, профиль |
| **trainer** | Всё что student + назначение на слоты, просмотр записавшихся |
| **admin** | Полный доступ: управление пользователями, контентом, ресурсами, экспорт, аналитика, аудит |

---

## Инструкция по развёртыванию

### Вариант 1: Docker Compose (рекомендуется)

Самый простой способ — всё запускается одной командой.

**Требования:**
- Docker >= 20.10
- Docker Compose >= 2.0

**Шаги:**

```bash
# 1. Клонировать репозиторий
git clone https://github.com/4IKIBOMBONI/cifra.git
cd cifra

# 2. Запустить все сервисы (PostgreSQL, Redis, Backend, Frontend)
docker compose up -d

# 3. Дождаться запуска (1-2 минуты на первый раз)
docker compose logs -f backend
# Когда увидите "Uvicorn running on http://0.0.0.0:8000" — готово

# 4. Открыть в браузере
# Frontend: http://localhost:5173
# Backend API docs: http://localhost:8000/api/docs
```

При первом запуске автоматически:
- Создаётся база данных PostgreSQL
- Создаются все таблицы
- Загружаются тестовые данные (seed)

**Остановка:**
```bash
docker compose down          # Остановить (данные сохранятся)
docker compose down -v       # Остановить и удалить данные
```

---

### Вариант 2: Ручной запуск (для разработки)

**Требования:**
- Python 3.12+
- Node.js 20+
- PostgreSQL 16
- Redis 7

#### Шаг 1: База данных

```bash
# Установить и запустить PostgreSQL, затем:
sudo -u postgres psql -c "CREATE USER cifra WITH PASSWORD 'cifra_password';"
sudo -u postgres psql -c "CREATE DATABASE cifra OWNER cifra;"

# Или запустить только БД и Redis через Docker:
docker compose up -d db redis
```

#### Шаг 2: Backend

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate         # Linux/Mac
# venv\Scripts\activate          # Windows

# Установить зависимости
pip install -r requirements.txt

# Скопировать и настроить конфигурацию
cp .env.example .env
# Отредактировать .env при необходимости

# Запустить сервер
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

При запуске автоматически создадутся таблицы и загрузятся тестовые данные.

#### Шаг 3: Frontend

```bash
cd frontend

# Установить зависимости
npm install

# Скопировать конфигурацию
cp .env.example .env
# В .env: VITE_API_URL=http://localhost:8000/api/v1

# Запустить dev-сервер
npm run dev
```

Frontend будет доступен на `http://localhost:5173`.

---

### Вариант 3: Production (docker-compose.prod.yml)

```bash
# 1. Создать .env в корне проекта
cat > .env << 'EOF'
DB_PASSWORD=your_strong_password_here
JWT_SECRET_KEY=your_random_secret_key_64_chars
CORS_ORIGINS=https://your-domain.ru
TELEGRAM_BOT_TOKEN=your_bot_token
EOF

# 2. Настроить nginx/nginx.conf для вашего домена

# 3. Запустить
docker compose -f docker-compose.prod.yml up -d
```

Production-конфигурация включает:
- Nginx в качестве реверс-прокси
- 4 worker-процесса Uvicorn
- Let's Encrypt SSL
- Без hot-reload и debug-режима

---

## Тестовые данные

При первом запуске в базу загружаются тестовые данные:

### Учётные записи

| Роль | Email | Пароль |
|------|-------|--------|
| Администратор | `admin@cifra.sgtu.ru` | `admin123` |
| Тренер | `trainer@cifra.sgtu.ru` | `trainer123` |
| Студент | `ivan@cifra.sgtu.ru` | `student123` |
| Студент | `maria@cifra.sgtu.ru` | `student123` |
| Студент | `alexey@cifra.sgtu.ru` | `student123` |
| Студент | `elena@cifra.sgtu.ru` | `student123` |
| Студент | `dmitry@cifra.sgtu.ru` | `student123` |
| Студент | `anna@cifra.sgtu.ru` | `student123` |
| Студент | `nikita@cifra.sgtu.ru` | `student123` |
| Студент | `olga@cifra.sgtu.ru` | `student123` |

### Контент

- 5 направлений (киберспорт, лазертаг, дроны, PlayStation, компьютерные места)
- 4 локации (3 корпуса + открытая площадка)
- 13 единиц оборудования
- 5 наград в магазине
- 6 новостей и анонсов
- 5 учебных материалов
- Слоты на 7 дней вперёд по всем направлениям
- 2 команды с участниками
- Бронирования от тестовых студентов
- История рейтинга и уведомления
- Точки на карте кампуса

### Регистрация новых студентов

Для регистрации нового аккаунта введите ФИО и номер студенческого:

| ФИО | Номер студенческого |
|-----|---------------------|
| Иванов Иван Иванович | 2024001234 |
| Петрова Мария Сергеевна | 2024005678 |
| Сидоров Алексей Дмитриевич | 2024009012 |
| Козлова Елена Андреевна | 2024003456 |
| Морозов Дмитрий Викторович | 2024007890 |
| Новикова Анна Олеговна | 2024002345 |
| Волков Никита Романович | 2024006789 |
| Соколова Ольга Игоревна | 2024004567 |

---

## Переменные окружения

### Backend (.env)

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `DATABASE_URL` | `postgresql+asyncpg://cifra:cifra_password@localhost:5432/cifra` | Строка подключения к PostgreSQL |
| `REDIS_URL` | `redis://localhost:6379/0` | Строка подключения к Redis |
| `JWT_SECRET_KEY` | `change-me-in-production` | Секретный ключ для JWT-токенов |
| `JWT_ALGORITHM` | `HS256` | Алгоритм JWT |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `15` | Время жизни access-токена (минуты) |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Время жизни refresh-токена (дни) |
| `DEBUG` | `true` | Режим отладки |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Разрешённые домены для CORS |
| `UPLOAD_DIR` | `./uploads` | Директория для загруженных файлов |
| `MAX_UPLOAD_SIZE_MB` | `10` | Максимальный размер файла (МБ) |
| `TELEGRAM_BOT_TOKEN` | — | Токен Telegram-бота |
| `TELEGRAM_SUPPORT_CHAT_ID` | — | Chat ID поддержки в Telegram |

### Frontend (.env)

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `VITE_API_URL` | `/api/v1` | URL бэкенда |

---

## Полезные команды

```bash
# Логи backend
docker compose logs -f backend

# Пересоздать таблицы (сброс данных)
docker compose down -v && docker compose up -d

# Пересборка после изменений
docker compose up -d --build

# Зайти в контейнер backend
docker compose exec backend bash

# Подключиться к PostgreSQL
docker compose exec db psql -U cifra -d cifra

# Запустить seed вручную
docker compose exec backend python -m app.seed
```
