# 9. Структура данных

## СУБД: PostgreSQL 16

Выбор обоснован: надёжность, поддержка JSONB, отличная производительность, широкая экосистема, бесплатна.

## Таблицы

### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'guest', 'trainer', 'admin')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    patronymic VARCHAR(100),
    student_id_number VARCHAR(50) UNIQUE,
    avatar_url VARCHAR(500),
    telegram VARCHAR(100),
    phone VARCHAR(20),
    rating_score INTEGER NOT NULL DEFAULT 50,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_rating ON users(rating_score);
CREATE INDEX idx_users_email ON users(email);
```

### verification_records
```sql
CREATE TABLE verification_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    patronymic VARCHAR(100),
    student_id_number VARCHAR(50) NOT NULL UNIQUE
);

CREATE INDEX idx_verification_student_id ON verification_records(student_id_number);
CREATE INDEX idx_verification_names ON verification_records(last_name, first_name);
```

### directions
```sql
CREATE TABLE directions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL UNIQUE,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(7),
    cover_image_url VARCHAR(500),
    default_slot_capacity INTEGER NOT NULL DEFAULT 1,
    slot_durations JSONB NOT NULL DEFAULT '[30, 60, 120]',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### resources
```sql
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    direction_id UUID NOT NULL REFERENCES directions(id),
    location_id UUID REFERENCES locations(id),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('equipment', 'venue', 'workstation')),
    description TEXT,
    photo_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'decommissioned')),
    capacity INTEGER,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_resources_direction ON resources(direction_id);
CREATE INDEX idx_resources_location ON resources(location_id);
CREATE INDEX idx_resources_status ON resources(status);
```

### locations
```sql
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    building VARCHAR(100),
    floor INTEGER,
    room VARCHAR(50),
    description TEXT,
    photo_url VARCHAR(500),
    map_x REAL,
    map_y REAL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### slots
```sql
CREATE TABLE slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    direction_id UUID NOT NULL REFERENCES directions(id),
    resource_id UUID REFERENCES resources(id),
    trainer_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (30, 60, 120)),
    type VARCHAR(20) NOT NULL DEFAULT 'individual' CHECK (type IN ('individual', 'team', 'open')),
    capacity INTEGER NOT NULL DEFAULT 1,
    current_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'full', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT slots_time_check CHECK (start_time < end_time),
    CONSTRAINT slots_count_check CHECK (current_count <= capacity),
    CONSTRAINT slots_unique_resource_time UNIQUE (resource_id, date, start_time)
);

CREATE INDEX idx_slots_direction ON slots(direction_id);
CREATE INDEX idx_slots_date ON slots(date);
CREATE INDEX idx_slots_status ON slots(status);
CREATE INDEX idx_slots_trainer ON slots(trainer_id);
CREATE INDEX idx_slots_direction_date ON slots(direction_id, date);
```

### bookings
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id UUID NOT NULL REFERENCES slots(id),
    user_id UUID NOT NULL REFERENCES users(id),
    team_id UUID REFERENCES teams(id),
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
    attended BOOLEAN,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT bookings_unique_user_slot UNIQUE (slot_id, user_id)
);

CREATE INDEX idx_bookings_slot ON bookings(slot_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);
```

### teams
```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    direction_id UUID NOT NULL REFERENCES directions(id),
    captain_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_teams_captain ON teams(captain_id);
CREATE INDEX idx_teams_direction ON teams(direction_id);
```

### team_members
```sql
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('captain', 'member')),
    status VARCHAR(20) NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined')),
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT team_members_unique UNIQUE (team_id, user_id)
);

CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_status ON team_members(status);
```

### rating_events
```sql
CREATE TABLE rating_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN (
        'attendance', 'no_show', 'late_cancel', 'violation',
        'tournament', 'achievement', 'manual', 'reward_spend'
    )),
    points INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    reason VARCHAR(500) NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rating_events_user ON rating_events(user_id);
CREATE INDEX idx_rating_events_type ON rating_events(event_type);
CREATE INDEX idx_rating_events_created ON rating_events(created_at);
```

### rewards
```sql
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    photo_url VARCHAR(500),
    cost_points INTEGER NOT NULL CHECK (cost_points > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### reward_requests
```sql
CREATE TABLE reward_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    reward_id UUID NOT NULL REFERENCES rewards(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'issued', 'rejected')),
    points_spent INTEGER NOT NULL,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reward_requests_user ON reward_requests(user_id);
CREATE INDEX idx_reward_requests_status ON reward_requests(status);
```

### news_posts
```sql
CREATE TABLE news_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('news', 'announcement', 'result')),
    direction_id UUID REFERENCES directions(id),
    content TEXT NOT NULL,
    cover_image_url VARCHAR(500),
    event_date TIMESTAMPTZ,
    event_location_id UUID REFERENCES locations(id),
    related_announcement_id UUID REFERENCES news_posts(id),
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    author_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_news_type ON news_posts(type);
CREATE INDEX idx_news_published ON news_posts(is_published, published_at DESC);
CREATE INDEX idx_news_direction ON news_posts(direction_id);
```

### materials
```sql
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('instruction', 'lecture', 'memo', 'video', 'pdf', 'link')),
    direction_id UUID REFERENCES directions(id),
    content TEXT,
    file_url VARCHAR(500),
    external_url VARCHAR(500),
    video_url VARCHAR(500),
    author_id UUID NOT NULL REFERENCES users(id),
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_materials_type ON materials(type);
CREATE INDEX idx_materials_direction ON materials(direction_id);
```

### dksh_profiles
```sql
CREATE TABLE dksh_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    about TEXT,
    skills JSONB DEFAULT '[]',
    interests JSONB DEFAULT '[]',
    achievements JSONB DEFAULT '[]',
    directions JSONB DEFAULT '[]',
    experience TEXT,
    contact_telegram VARCHAR(100),
    contact_vk VARCHAR(200),
    contact_phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'booking_confirmed', 'booking_cancelled', 'rating_change',
        'team_invite', 'reward_ready', 'announcement', 'system'
    )),
    title VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
```

### audit_logs
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
```

## Рекомендации по хранению истории изменений

1. **Рейтинг**: полная история через `rating_events` (append-only). Текущий баланс — денормализован в `users.rating_score` для производительности.
2. **Бронирования**: статусы и временные метки (cancelled_at) фиксируют жизненный цикл.
3. **Награды**: `reward_requests` хранит полную историю заявок.
4. **Контент**: `updated_at` на изменяемых сущностях. Полная версионность не нужна в MVP.

## Audit Log

- Таблица `audit_logs` — append-only, записи не удаляются и не редактируются.
- Логируются все CUD-операции (Create, Update, Delete) над основными сущностями.
- Поле `details` (JSONB) хранит diff: `{ "old": {...}, "new": {...} }`.
- Реализуется через middleware на бэкенде (автоматически при каждом запросе к мутирующим эндпоинтам).
- Рекомендация: партиционирование по месяцам при росте данных (через pg_partman).
