# Как запустить CIFRA на MacBook (M3 Pro)

## Шаг 1: Установить необходимые программы

Откройте **Terminal** (Cmd+Space → введите "Terminal" → Enter).

### 1.1 Установить Homebrew (менеджер пакетов для Mac)

Скопируйте эту команду целиком и вставьте в терминал:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Терминал попросит ввести пароль от Mac — введите его (символы не отображаются, это нормально). Нажмите Enter. Дождитесь завершения (может занять 2-5 минут).

**ВАЖНО:** После установки Homebrew скопируйте и выполните эти две команды:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Проверьте, что Homebrew работает:

```bash
brew --version
```

Должно показать что-то вроде `Homebrew 4.x.x`.

---

### 1.2 Установить Docker Desktop

```bash
brew install --cask docker
```

После установки:
1. Откройте **Docker Desktop** (Cmd+Space → "Docker" → Enter)
2. Примите лицензионное соглашение
3. Дождитесь, пока Docker запустится (иконка кита в верхней панели перестанет анимироваться)
4. В правом нижнем углу Docker Desktop должно быть написано "Docker Desktop is running"

Проверьте:

```bash
docker --version
docker compose version
```

---

### 1.3 Установить Git (если ещё нет)

```bash
brew install git
```

Проверьте:

```bash
git --version
```

---

### 1.4 Установить Node.js (для фронтенда)

```bash
brew install node@20
```

Проверьте:

```bash
node --version
npm --version
```

---

### 1.5 Установить Python 3.12 (для бэкенда)

```bash
brew install python@3.12
```

Проверьте:

```bash
python3 --version
```

---

## Шаг 2: Скачать проект

### 2.1 Перейдите в папку, где хотите хранить проект

```bash
cd ~/Desktop
```

(Проект появится на Рабочем столе. Можете выбрать другую папку.)

### 2.2 Склонируйте репозиторий

```bash
git clone https://github.com/4IKIBOMBONI/cifra.git
cd cifra
git checkout claude/system-architecture-design-wlSrQ
```

Если клонирование не работает (приватный репозиторий), скачайте ZIP:
1. Откройте https://github.com/4IKIBOMBONI/cifra в браузере
2. Зелёная кнопка "Code" → "Download ZIP"
3. Распакуйте на Рабочий стол
4. В терминале: `cd ~/Desktop/cifra`

---

## Шаг 3: Запустить проект

### Способ А: Через Docker (самый простой — 1 команда)

Убедитесь, что Docker Desktop запущен (иконка кита вверху экрана).

```bash
cd ~/Desktop/cifra
cp backend/.env.example backend/.env
docker compose up -d
```

Дождитесь, пока скачаются образы и запустятся контейнеры (первый раз — 3-10 минут).

Проверьте, что всё работает:

```bash
docker compose ps
```

Должно показать 4 контейнера со статусом "running": db, redis, backend, frontend.

Затем создайте таблицы в БД и первого админа:

```bash
docker compose exec backend python -m app.seed
```

**Готово! Откройте в браузере:**
- 🌐 **Сайт:** http://localhost:5173
- 📡 **API документация:** http://localhost:8000/api/docs

**Логин админа:**
- Email: `admin@cifra.sgtu.ru`
- Пароль: `admin123`

**Тестовый студент** (для проверки регистрации):
- ФИО: Иванов Иван Иванович
- Номер студбилета: 2024001234

---

### Способ Б: Без Docker (вручную — если Docker не хочет работать)

#### Б.1 Установить PostgreSQL и Redis

```bash
brew install postgresql@16 redis
brew services start postgresql@16
brew services start redis
```

Создать базу данных:

```bash
createdb cifra
psql cifra -c "CREATE USER cifra WITH PASSWORD 'cifra_password';"
psql cifra -c "GRANT ALL PRIVILEGES ON DATABASE cifra TO cifra;"
psql cifra -c "ALTER DATABASE cifra OWNER TO cifra;"
```

#### Б.2 Запустить бэкенд

Откройте **первый** терминал:

```bash
cd ~/Desktop/cifra/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic revision --autogenerate -m "initial"
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

Терминал должен показать: `Uvicorn running on http://0.0.0.0:8000`

#### Б.3 Запустить фронтенд

Откройте **второй** терминал (Cmd+T для новой вкладки):

```bash
cd ~/Desktop/cifra/frontend
npm install
npm run dev
```

Терминал покажет: `Local: http://localhost:5173/`

**Готово! Откройте http://localhost:5173 в браузере.**

---

## Шаг 4: Как остановить

### Docker:

```bash
cd ~/Desktop/cifra
docker compose down
```

### Без Docker:

Нажмите Ctrl+C в каждом терминале, затем:

```bash
brew services stop postgresql@16
brew services stop redis
```

---

## Шаг 5: Как запустить снова (после перезагрузки Mac)

### Docker:

```bash
cd ~/Desktop/cifra
docker compose up -d
```

### Без Docker:

```bash
brew services start postgresql@16
brew services start redis

# Терминал 1:
cd ~/Desktop/cifra/backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Терминал 2:
cd ~/Desktop/cifra/frontend
npm run dev
```

---

## Частые проблемы

### "docker: command not found"
→ Откройте Docker Desktop вручную (через Launchpad) и подождите 30 секунд.

### "port 5432 already in use"
→ Остановите локальный PostgreSQL: `brew services stop postgresql@16`

### "npm: command not found"
→ Закройте и откройте терминал заново. Или: `brew link node@20`

### "pip: command not found"
→ Используйте `pip3` вместо `pip`.

### Бэкенд не подключается к БД
→ Проверьте файл `backend/.env` — там должен быть правильный DATABASE_URL.

### Фронтенд показывает ошибки API
→ Убедитесь, что бэкенд запущен (http://localhost:8000/api/health должен отвечать).
