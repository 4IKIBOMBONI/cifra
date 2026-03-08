# 8. Доменная модель

## Сущности и связи

### User (Пользователь)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| email | string | да | Уникальный |
| password_hash | string | да | bcrypt |
| role | enum | да | student, guest, trainer, admin |
| first_name | string | да | Имя |
| last_name | string | да | Фамилия |
| patronymic | string | нет | Отчество |
| student_id_number | string | нет | Номер студенческого билета (для студентов) |
| avatar_url | string | нет | URL аватара |
| telegram | string | нет | Telegram username |
| phone | string | нет | Телефон |
| rating_score | integer | да | Текущий рейтинг. Default: 50 |
| is_active | boolean | да | Активен / заблокирован. Default: true |
| is_verified | boolean | да | Верифицирован. Default: false |
| created_at | timestamp | да | |
| updated_at | timestamp | да | |

**Связи**: → Bookings (1:N), → Teams (N:M), → RatingHistory (1:N), → RewardRequests (1:N), → DkshProfile (1:1), → Notifications (1:N)

**Статусы**: active, blocked
**Ограничения**: email уникален, student_id_number уникален (nullable)

---

### VerificationRecord (Запись верификации)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| first_name | string | да | |
| last_name | string | да | |
| patronymic | string | нет | |
| student_id_number | string | да | Уникальный |

**Назначение**: справочная таблица для верификации студентов при регистрации. Заполняется из данных ВУЗа.

---

### Direction (Направление)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| name | string | да | Уникальное название |
| slug | string | да | URL-slug, уникальный |
| description | text | нет | Описание |
| icon | string | нет | Иконка (имя или URL) |
| color | string | нет | HEX-цвет |
| cover_image_url | string | нет | Обложка |
| default_slot_capacity | integer | да | Вместимость по умолчанию |
| slot_durations | jsonb | да | Доступные длительности [30, 60, 120] |
| is_active | boolean | да | Default: true |
| sort_order | integer | да | Порядок отображения |
| created_at | timestamp | да | |

**Связи**: → Resources (1:N), → Slots (1:N), → Materials (N:M), → News (N:M)

---

### Resource (Ресурс / оборудование / площадка)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| direction_id | UUID | да | FK → Direction |
| location_id | UUID | нет | FK → Location |
| name | string | да | |
| type | enum | да | equipment, venue, workstation |
| description | text | нет | |
| photo_url | string | нет | |
| status | enum | да | active, maintenance, decommissioned |
| capacity | integer | нет | Переопределение вместимости направления |
| metadata | jsonb | нет | Дополнительные параметры (модель, серийный номер и т.д.) |
| created_at | timestamp | да | |
| updated_at | timestamp | да | |

**Связи**: → Direction (N:1), → Location (N:1), → Slots (1:N)

---

### Location (Локация)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| name | string | да | |
| building | string | нет | Корпус |
| floor | integer | нет | Этаж |
| room | string | нет | Кабинет |
| description | text | нет | |
| photo_url | string | нет | |
| map_x | float | нет | Координата X на карте |
| map_y | float | нет | Координата Y на карте |
| is_active | boolean | да | Default: true |
| created_at | timestamp | да | |

**Связи**: → Resources (1:N)

---

### Slot (Слот бронирования)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| direction_id | UUID | да | FK → Direction |
| resource_id | UUID | нет | FK → Resource |
| trainer_id | UUID | нет | FK → User (trainer) |
| date | date | да | Дата |
| start_time | time | да | Время начала |
| end_time | time | да | Время окончания |
| duration_minutes | integer | да | 30, 60, 120 |
| type | enum | да | individual, team, open |
| capacity | integer | да | Макс. участников |
| current_count | integer | да | Текущее кол-во записанных. Default: 0 |
| status | enum | да | available, full, in_progress, completed, cancelled |
| created_at | timestamp | да | |

**Связи**: → Direction (N:1), → Resource (N:1), → Bookings (1:N)
**Ограничения**: start_time < end_time, current_count ≤ capacity, уникальность (resource_id, date, start_time)

---

### Booking (Бронирование)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| slot_id | UUID | да | FK → Slot |
| user_id | UUID | да | FK → User |
| team_id | UUID | нет | FK → Team (для командных) |
| status | enum | да | confirmed, cancelled, completed, no_show |
| attended | boolean | нет | Подтверждение посещения тренером |
| cancelled_at | timestamp | нет | |
| cancellation_reason | string | нет | |
| created_at | timestamp | да | |

**Связи**: → Slot (N:1), → User (N:1), → Team (N:1)
**Ограничения**: уникальность (slot_id, user_id)

---

### Team (Команда)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| name | string | да | |
| direction_id | UUID | да | FK → Direction |
| captain_id | UUID | да | FK → User |
| created_at | timestamp | да | |

**Связи**: → Direction (N:1), → TeamMembers (1:N), → Bookings (1:N)

---

### TeamMember (Участник команды)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| team_id | UUID | да | FK → Team |
| user_id | UUID | да | FK → User |
| role | enum | да | captain, member |
| status | enum | да | invited, accepted, declined |
| joined_at | timestamp | нет | |
| created_at | timestamp | да | |

**Ограничения**: уникальность (team_id, user_id)

---

### RatingEvent (Событие рейтинга)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| user_id | UUID | да | FK → User |
| event_type | enum | да | attendance, no_show, late_cancel, violation, tournament, achievement, manual, reward_spend |
| points | integer | да | ±значение |
| balance_after | integer | да | Баланс после изменения |
| reason | string | да | Текстовое описание |
| related_entity_type | string | нет | booking, tournament, reward и т.д. |
| related_entity_id | UUID | нет | |
| created_by | UUID | нет | FK → User (кто начислил) |
| created_at | timestamp | да | |

**Связи**: → User (N:1)

---

### Reward (Награда)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| name | string | да | |
| description | text | нет | |
| photo_url | string | нет | |
| cost_points | integer | да | Стоимость в баллах |
| stock | integer | да | Остаток. Default: 0 |
| is_active | boolean | да | Default: true |
| created_at | timestamp | да | |
| updated_at | timestamp | да | |

---

### RewardRequest (Заявка на награду)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| user_id | UUID | да | FK → User |
| reward_id | UUID | да | FK → Reward |
| status | enum | да | pending, issued, rejected |
| points_spent | integer | да | |
| processed_by | UUID | нет | FK → User (admin) |
| processed_at | timestamp | нет | |
| created_at | timestamp | да | |

---

### NewsPost (Новость / анонс)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| title | string | да | |
| slug | string | да | Уникальный |
| type | enum | да | news, announcement, result |
| direction_id | UUID | нет | FK → Direction |
| content | text | да | Rich text (HTML/Markdown) |
| cover_image_url | string | нет | |
| event_date | timestamp | нет | Дата турнира (для анонсов) |
| event_location_id | UUID | нет | FK → Location |
| related_announcement_id | UUID | нет | FK → NewsPost (связь результата с анонсом) |
| is_published | boolean | да | Default: false |
| published_at | timestamp | нет | |
| author_id | UUID | да | FK → User |
| created_at | timestamp | да | |
| updated_at | timestamp | да | |

---

### Material (Учебный материал)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| title | string | да | |
| type | enum | да | instruction, lecture, memo, video, pdf, link |
| direction_id | UUID | нет | FK → Direction |
| content | text | нет | Текстовый контент |
| file_url | string | нет | URL файла |
| external_url | string | нет | Внешняя ссылка |
| video_url | string | нет | URL видео |
| author_id | UUID | да | FK → User |
| is_published | boolean | да | Default: true |
| created_at | timestamp | да | |
| updated_at | timestamp | да | |

---

### DkshProfile (Профиль кандидата ДКШ)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| user_id | UUID | да | FK → User, уникальный |
| about | text | нет | О себе (до 500 символов) |
| skills | jsonb | нет | Массив навыков |
| interests | jsonb | нет | Массив интересов |
| achievements | jsonb | нет | Массив достижений |
| directions | jsonb | нет | Массив направлений |
| experience | text | нет | Опыт |
| contact_telegram | string | нет | |
| contact_vk | string | нет | |
| contact_phone | string | нет | |
| is_active | boolean | да | Default: true |
| created_at | timestamp | да | |
| updated_at | timestamp | да | |

---

### Notification (Уведомление)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| user_id | UUID | да | FK → User |
| type | enum | да | booking_confirmed, booking_cancelled, rating_change, team_invite, reward_ready, announcement, system |
| title | string | да | |
| message | text | да | |
| is_read | boolean | да | Default: false |
| related_entity_type | string | нет | |
| related_entity_id | UUID | нет | |
| created_at | timestamp | да | |

---

### AuditLog (Журнал действий)
**MVP**: да

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | да | PK |
| user_id | UUID | нет | FK → User (кто выполнил) |
| action | string | да | Тип действия (user.create, booking.cancel, rating.adjust и т.д.) |
| entity_type | string | да | Тип сущности |
| entity_id | UUID | нет | ID сущности |
| details | jsonb | нет | Дополнительные данные (старое/новое значение) |
| ip_address | string | нет | |
| created_at | timestamp | да | |

**Ограничения**: записи не редактируются и не удаляются (append-only).

---

## Сущности, зарезервированные на будущее

| Сущность | Описание | Когда понадобится |
|----------|----------|-------------------|
| Permission | Гранулярные права доступа | При введении сложных ролей |
| RolePermission | Связь ролей и прав | При введении сложных ролей |
| Tournament | Турнир как отдельная сущность | При автоматической турнирной системе |
| TournamentMatch | Матч турнира | При автоматической турнирной системе |
| Certificate | Сертификат за обучение | При введении тестов и сертификации |
| Payment | Оплата | При введении платёжной системы |

## Расширяемость

- Новые направления добавляются через `Direction` без изменения схемы.
- Новые типы ресурсов — через enum `Resource.type` или JSONB-метаданные.
- Разделение рейтинга и баллов: `RatingEvent.event_type` уже различает типы; в будущем можно разделить на `rating_score` (репутация) и `points_balance` (валюта) в таблице `User`.
- JSONB-поля (`metadata`, `skills`, `interests`) обеспечивают гибкость без миграций.
