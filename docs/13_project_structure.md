# 13. Структура проекта

## Структура репозитория (monorepo)

```
cifra/
├── docs/                        # Документация проекта
│   ├── 01_product_concept.md
│   ├── 02_mvp_boundaries.md
│   ├── ...
│   └── api/                     # API-документация (auto-generated)
│
├── backend/                     # Backend (Python/FastAPI)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app
│   │   ├── config.py            # Settings
│   │   ├── database.py          # DB connection
│   │   ├── dependencies.py      # DI
│   │   │
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── schemas.py
│   │   │   └── utils.py
│   │   │
│   │   ├── users/
│   │   │   ├── __init__.py
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── schemas.py
│   │   │   ├── models.py
│   │   │   └── repository.py
│   │   │
│   │   ├── directions/
│   │   ├── resources/
│   │   ├── locations/
│   │   ├── booking/
│   │   ├── teams/
│   │   ├── rating/
│   │   ├── rewards/
│   │   ├── news/
│   │   ├── materials/
│   │   ├── campus_map/
│   │   ├── dksh/
│   │   ├── notifications/
│   │   ├── analytics/
│   │   ├── audit/
│   │   ├── export/
│   │   ├── telegram/
│   │   └── uploads/
│   │
│   ├── alembic/
│   │   ├── versions/
│   │   ├── env.py
│   │   └── script.py.mako
│   │
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_auth/
│   │   ├── test_booking/
│   │   ├── test_rating/
│   │   └── ...
│   │
│   ├── uploads/                 # Локальное хранилище файлов
│   ├── alembic.ini
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                    # Frontend (React/TypeScript)
│   ├── public/
│   │   ├── campus-map.svg
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── layout/
│   │   │   ├── domain/
│   │   │   └── guards/
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── index.html
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── nginx/                       # Nginx конфигурация
│   └── nginx.conf
│
├── docker-compose.yml           # Локальная разработка
├── docker-compose.prod.yml      # Продакшен
├── .github/
│   └── workflows/
│       ├── ci.yml               # Lint + test
│       └── deploy.yml           # Build + deploy
│
├── .gitignore
├── .editorconfig
└── README.md
```

## Naming conventions

### Python (backend)
- Файлы и папки: `snake_case` (`booking/service.py`)
- Классы: `PascalCase` (`BookingService`)
- Функции и переменные: `snake_case` (`create_booking`)
- Константы: `UPPER_SNAKE_CASE` (`MAX_SLOTS_PER_WEEK`)
- Модели SQLAlchemy: `PascalCase` единственное число (`User`, `Slot`, `Booking`)
- Таблицы в БД: `snake_case` множественное число (`users`, `slots`, `bookings`)
- Pydantic-схемы: `PascalCase` с суффиксом (`UserCreate`, `UserResponse`, `UserUpdate`)

### TypeScript (frontend)
- Файлы компонентов: `PascalCase` (`SlotCard.tsx`)
- Файлы утилит/хуков: `camelCase` (`useAuth.ts`, `format.ts`)
- Компоненты: `PascalCase` (`<SlotCard />`)
- Функции и переменные: `camelCase` (`createBooking`)
- Типы и интерфейсы: `PascalCase` (`User`, `Booking`, `ApiResponse<T>`)
- Константы: `UPPER_SNAKE_CASE` (`API_BASE_URL`)
- CSS-классы: Tailwind utility classes (без BEM)

### API endpoints
- Формат: `kebab-case` для путей, `snake_case` для параметров
- Версионирование: `/api/v1/...`
- Ресурсы: множественное число (`/api/v1/users`, `/api/v1/bookings`)
- Вложенность максимум 2 уровня (`/api/v1/teams/:id/members`)

## Деление по доменам

Каждый доменный модуль (directions, booking, rating и т.д.) содержит:
1. `models.py` — SQLAlchemy модели (таблицы)
2. `schemas.py` — Pydantic-схемы (входные/выходные данные API)
3. `repository.py` — методы работы с БД (CRUD, фильтрация)
4. `service.py` — бизнес-логика
5. `router.py` — HTTP-эндпоинты

Модули взаимодействуют через сервисы (не через прямой доступ к чужим репозиториям):
```
booking/service.py → rating/service.py  (проверка лимита)
booking/service.py → notifications/service.py  (уведомление)
```

## Подготовка к расширению

1. **Новое направление**: только данные в БД, код не меняется.
2. **Новый модуль**: создать папку в `app/`, реализовать 5 файлов, подключить router в `main.py`.
3. **Новый тип ресурса**: добавить значение в enum и обработку в metadata.
4. **Разделение монолита**: каждый модуль самодостаточен и может быть выделен в микросервис.
5. **Мобильное приложение**: API уже готов, фронт может быть заменён на React Native.
