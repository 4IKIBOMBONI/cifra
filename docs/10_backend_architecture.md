# 10. Backend-архитектура

## Стиль архитектуры

**Modular monolith** (модульный монолит) на FastAPI (Python).

Обоснование: для MVP монолит быстрее в разработке и деплое. Модульная структура позволяет при необходимости выделить отдельные сервисы в будущем.

## Ключевые слои

```
┌────────────────────────────────────────────────┐
│                   API Layer                     │
│        (FastAPI routers, validation)            │
├────────────────────────────────────────────────┤
│                 Service Layer                   │
│          (бизнес-логика, оркестрация)           │
├────────────────────────────────────────────────┤
│               Repository Layer                  │
│         (доступ к данным, SQLAlchemy)           │
├────────────────────────────────────────────────┤
│                  Data Layer                     │
│           (PostgreSQL, Redis, S3)               │
└────────────────────────────────────────────────┘
```

### API Layer
- FastAPI routers, сгруппированные по доменам.
- Pydantic-схемы для валидации запросов и ответов.
- Middleware: CORS, auth, audit log, rate limiting.
- Dependency injection для сервисов и репозиториев.

### Service Layer
- Бизнес-логика каждого модуля.
- Оркестрация между модулями (например, бронирование проверяет рейтинг).
- Генерация уведомлений.
- Управление транзакциями.

### Repository Layer
- SQLAlchemy ORM модели.
- Репозитории инкапсулируют запросы к БД.
- Абстракция от конкретной БД.

## Модули бэкенда

```
backend/
├── app/
│   ├── main.py                  # FastAPI app, middleware, startup
│   ├── config.py                # Настройки (pydantic-settings)
│   ├── database.py              # SQLAlchemy engine, session
│   ├── dependencies.py          # DI: get_db, get_current_user
│   │
│   ├── auth/                    # M01: Аутентификация
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   └── utils.py             # JWT, password hashing
│   │
│   ├── users/                   # M02: Пользователи
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── directions/              # M03: Направления
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── resources/               # M04: Ресурсы
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── locations/               # M05: Локации
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── booking/                 # M06: Бронирование
│   │   ├── router.py
│   │   ├── service.py           # Основная бизнес-логика
│   │   ├── schemas.py
│   │   ├── models.py            # Slot, Booking
│   │   └── repository.py
│   │
│   ├── teams/                   # M07: Команды
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── rating/                  # M08: Рейтинг
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── rewards/                 # M09: Награды
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── news/                    # M10: Новости
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── materials/               # M11: Материалы
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── campus_map/              # M12: Карта кампуса
│   │   ├── router.py
│   │   └── schemas.py           # Использует locations
│   │
│   ├── dksh/                    # M13: Профиль ДКШ
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── notifications/           # M16: Уведомления
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── analytics/               # M15: Аналитика
│   │   ├── router.py
│   │   ├── service.py
│   │   └── schemas.py
│   │
│   ├── audit/                   # M17: Журнал действий
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── middleware.py
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── export/                  # Выгрузки
│   │   ├── service.py           # Excel, PDF генерация
│   │   └── router.py
│   │
│   ├── telegram/                # Telegram-бот
│   │   ├── bot.py
│   │   └── handlers.py
│   │
│   └── uploads/                 # Загрузка файлов
│       ├── router.py
│       └── service.py
│
├── alembic/                     # Миграции
│   ├── versions/
│   └── env.py
│
├── tests/
│   ├── conftest.py
│   ├── test_auth/
│   ├── test_booking/
│   └── ...
│
├── alembic.ini
├── pyproject.toml
├── Dockerfile
└── .env.example
```

## Политика доступа

Реализуется через dependency injection:

```python
# dependencies.py
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # декодирует JWT, возвращает пользователя

def require_roles(*roles: str):
    async def checker(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(403, "Forbidden")
        return user
    return checker

# Использование в роутере:
@router.post("/slots")
async def create_slot(
    data: SlotCreate,
    user: User = Depends(require_roles("admin", "trainer"))
):
    ...
```

## Обработка уведомлений

1. При бизнес-событии (бронь, изменение рейтинга и т.д.) сервис вызывает `NotificationService.create(...)`.
2. Уведомление сохраняется в таблицу `notifications`.
3. Если событие критичное (неявка, блокировка) — дополнительно отправляется через Telegram-бот.
4. Фронтенд получает уведомления через polling (каждые 30 секунд) или при загрузке страницы.

## Работа с Telegram-ботом

- Бот реализуется на `python-telegram-bot`.
- Запускается как отдельный процесс (или в том же приложении через asyncio).
- Функции бота:
  - Приём заявок от школьников/гостей.
  - Отправка критичных уведомлений студентам (по telegram username из профиля).
  - Команда `/status` — проверка своего рейтинга.
  - Команда `/bookings` — ближайшие бронирования.
- Связь с основным приложением через общую БД.

## Аналитика

- Агрегационные SQL-запросы по основным таблицам.
- Кэширование тяжёлых запросов в Redis (TTL 5 минут).
- Метрики: количество пользователей, активность, посещаемость, загрузка, популярность, начисления.

## Выгрузки

- Excel: `openpyxl` — генерация .xlsx в памяти, отдача как streaming response.
- PDF: `reportlab` — генерация отчётов с таблицами и графиками.
- Эндпоинты: `GET /api/export/{entity}?format=xlsx|pdf&date_from=...&date_to=...`

## Audit Log

- Middleware перехватывает все мутирующие запросы (POST, PUT, PATCH, DELETE).
- Сохраняет: кто, что, когда, над чем, IP-адрес.
- Поле `details` хранит diff (старое/новое значение) через JSONB.
- Append-only: нет эндпоинтов для удаления/редактирования записей.

## Расширяемость

Добавление нового направления:
1. Админ создаёт Direction через API.
2. Добавляет Resources, привязывает к Location.
3. Генерирует Slots.
4. Всё работает без изменения кода.

Добавление нового модуля:
1. Создать папку в `app/`.
2. Определить models, schemas, repository, service, router.
3. Подключить router в `main.py`.
4. Создать миграцию через Alembic.
