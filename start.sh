#!/bin/bash

# ===========================================
#  CIFRA — Скрипт запуска (MacOS)
# ===========================================

set -e

echo ""
echo "🚀 CIFRA — Запуск платформы"
echo "==========================="
echo ""

# Проверяем Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не найден!"
    echo ""
    echo "Установите Docker Desktop:"
    echo "  brew install --cask docker"
    echo ""
    echo "Затем откройте Docker Desktop и дождитесь запуска."
    exit 1
fi

if ! docker info &> /dev/null 2>&1; then
    echo "❌ Docker не запущен!"
    echo ""
    echo "Откройте Docker Desktop (Cmd+Space → Docker → Enter)"
    echo "Дождитесь, пока иконка кита перестанет анимироваться."
    exit 1
fi

echo "✅ Docker найден и запущен"

# Создаём .env если нет
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Создан backend/.env"
fi

# Запускаем контейнеры
echo ""
echo "📦 Запуск контейнеров (первый раз — 3-10 минут)..."
docker compose up -d --build

# Ждём, пока БД будет готова
echo ""
echo "⏳ Ожидание запуска базы данных..."
sleep 5
for i in {1..30}; do
    if docker compose exec -T db pg_isready -U cifra &> /dev/null; then
        echo "✅ База данных готова"
        break
    fi
    sleep 2
done

# Заполняем БД
echo ""
echo "📦 Заполнение базы данных..."
docker compose exec -T backend python -m app.seed

echo ""
echo "========================================="
echo "🎉 CIFRA запущена!"
echo "========================================="
echo ""
echo "🌐 Сайт:            http://localhost:5173"
echo "📡 API (Swagger):    http://localhost:8000/api/docs"
echo ""
echo "👤 Админ:            admin@cifra.sgtu.ru / admin123"
echo "👤 Тренер:           trainer@cifra.sgtu.ru / trainer123"
echo ""
echo "📋 Тестовые студенты для регистрации:"
echo "   Иванов Иван Иванович — 2024001234"
echo "   Петрова Мария Сергеевна — 2024005678"
echo "   Сидоров Алексей Дмитриевич — 2024009012"
echo ""
echo "Чтобы остановить:  docker compose down"
echo "Чтобы перезапустить: docker compose up -d"
echo ""
