"""
Скрипт для заполнения базы данных начальными данными.
Запуск: python -m app.seed
"""
import asyncio
import uuid

from app.auth.utils import hash_password
from app.database import async_session, engine, Base

# Импорт всех моделей
from app.users.models import User, VerificationRecord
from app.directions.models import Direction
from app.locations.models import Location
from app.resources.models import Resource
from app.rewards.models import Reward
from app.news.models import NewsPost
from app.materials.models import Material


async def create_tables():
    """Создать все таблицы в БД."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Таблицы созданы")


async def seed_data():
    """Заполнить БД начальными данными."""
    async with async_session() as db:
        # Проверяем, что БД пустая
        from sqlalchemy import select, func
        count = (await db.execute(select(func.count(User.id)))).scalar()
        if count and count > 0:
            print("⚠️  БД уже содержит данные. Пропускаем seed.")
            return

        # === 1. Администратор ===
        admin = User(
            email="admin@cifra.sgtu.ru",
            password_hash=hash_password("admin123"),
            role="admin",
            first_name="Админ",
            last_name="Платформы",
            patronymic="CIFRA",
            is_verified=True,
            is_active=True,
            rating_score=100,
        )
        db.add(admin)

        # === 2. Тренер ===
        trainer = User(
            email="trainer@cifra.sgtu.ru",
            password_hash=hash_password("trainer123"),
            role="trainer",
            first_name="Тренер",
            last_name="Иванов",
            patronymic="Петрович",
            is_verified=True,
            is_active=True,
            rating_score=100,
        )
        db.add(trainer)

        # === 3. Тестовые записи верификации студентов ===
        verification_records = [
            VerificationRecord(
                first_name="Иван",
                last_name="Иванов",
                patronymic="Иванович",
                student_id_number="2024001234",
            ),
            VerificationRecord(
                first_name="Мария",
                last_name="Петрова",
                patronymic="Сергеевна",
                student_id_number="2024005678",
            ),
            VerificationRecord(
                first_name="Алексей",
                last_name="Сидоров",
                patronymic="Дмитриевич",
                student_id_number="2024009012",
            ),
        ]
        for vr in verification_records:
            db.add(vr)

        # === 4. Локации ===
        loc_main = Location(
            name="Фиджитал-центр, корпус 1",
            building="Корпус 1",
            floor=2,
            room="201",
            description="Основная площадка фиджитал-центра СГТУ",
            map_x=0.5,
            map_y=0.3,
        )
        loc_gym = Location(
            name="Спортзал, корпус 3",
            building="Корпус 3",
            floor=1,
            room="101",
            description="Спортивный зал для лазертага и подвижных активностей",
            map_x=0.7,
            map_y=0.6,
        )
        loc_lab = Location(
            name="Компьютерный класс, корпус 2",
            building="Корпус 2",
            floor=3,
            room="305",
            description="Компьютерный класс с игровыми ПК",
            map_x=0.3,
            map_y=0.5,
        )
        loc_drone = Location(
            name="Площадка дронов (открытая)",
            building="Двор",
            description="Открытая площадка для полётов дронов",
            map_x=0.8,
            map_y=0.2,
        )
        for loc in [loc_main, loc_gym, loc_lab, loc_drone]:
            db.add(loc)

        await db.flush()

        # === 5. Направления ===
        dir_cyber = Direction(
            name="Киберспорт",
            slug="cybersport",
            description="Соревновательный гейминг: CS2, Dota 2, Valorant и другие дисциплины. Тренировки, разборы матчей, участие в турнирах.",
            icon="🎮",
            color="#6C5CE7",
            default_slot_capacity=5,
            slot_durations=[60, 120],
            sort_order=1,
        )
        dir_laser = Direction(
            name="Лазертаг",
            slug="lasertag",
            description="Командная тактическая игра с лазерным оборудованием. Развивает командную работу, стратегическое мышление и физическую подготовку.",
            icon="🔫",
            color="#FF6B6B",
            default_slot_capacity=10,
            slot_durations=[60, 120],
            sort_order=2,
        )
        dir_drones = Direction(
            name="Дроны",
            slug="drones",
            description="Пилотирование FPV-дронов, аэросъёмка, гонки. Обучение основам управления и техобслуживания.",
            icon="🛸",
            color="#00D2D3",
            default_slot_capacity=3,
            slot_durations=[30, 60],
            sort_order=3,
        )
        dir_ps = Direction(
            name="PlayStation",
            slug="playstation",
            description="PlayStation 5 — FIFA, Mortal Kombat, Gran Turismo и другие игры. Индивидуальные и командные сессии.",
            icon="🕹️",
            color="#FECA57",
            default_slot_capacity=2,
            slot_durations=[30, 60],
            sort_order=4,
        )
        dir_pc = Direction(
            name="Компьютерные места",
            slug="computers",
            description="Игровые ПК для тренировок и свободной игры. Периферия профессионального уровня.",
            icon="💻",
            color="#00B894",
            default_slot_capacity=10,
            slot_durations=[60, 120],
            sort_order=5,
        )
        for d in [dir_cyber, dir_laser, dir_drones, dir_ps, dir_pc]:
            db.add(d)

        await db.flush()

        # === 6. Ресурсы ===
        resources = [
            Resource(name="Игровой ПК #1", type="workstation", direction_id=dir_cyber.id, location_id=loc_lab.id, status="active"),
            Resource(name="Игровой ПК #2", type="workstation", direction_id=dir_cyber.id, location_id=loc_lab.id, status="active"),
            Resource(name="Игровой ПК #3", type="workstation", direction_id=dir_cyber.id, location_id=loc_lab.id, status="active"),
            Resource(name="Игровой ПК #4", type="workstation", direction_id=dir_cyber.id, location_id=loc_lab.id, status="active"),
            Resource(name="Игровой ПК #5", type="workstation", direction_id=dir_cyber.id, location_id=loc_lab.id, status="active"),
            Resource(name="Арена лазертага", type="venue", direction_id=dir_laser.id, location_id=loc_gym.id, status="active", capacity=10),
            Resource(name="Набор лазертаг (10 комплектов)", type="equipment", direction_id=dir_laser.id, location_id=loc_gym.id, status="active"),
            Resource(name="DJI Mini 3 Pro", type="equipment", direction_id=dir_drones.id, location_id=loc_drone.id, status="active"),
            Resource(name="FPV Дрон #1", type="equipment", direction_id=dir_drones.id, location_id=loc_drone.id, status="active"),
            Resource(name="FPV Дрон #2", type="equipment", direction_id=dir_drones.id, location_id=loc_drone.id, status="active"),
            Resource(name="PlayStation 5 #1", type="equipment", direction_id=dir_ps.id, location_id=loc_main.id, status="active", capacity=2),
            Resource(name="PlayStation 5 #2", type="equipment", direction_id=dir_ps.id, location_id=loc_main.id, status="active", capacity=2),
            Resource(name="Компьютерный класс", type="venue", direction_id=dir_pc.id, location_id=loc_lab.id, status="active", capacity=10),
        ]
        for r in resources:
            db.add(r)

        # === 7. Награды ===
        rewards = [
            Reward(name="Фирменная футболка CIFRA", description="Чёрная футболка с логотипом CIFRA. Размеры: S, M, L, XL.", cost_points=200, stock=20, is_active=True),
            Reward(name="Стикерпак CIFRA", description="Набор из 10 фирменных стикеров.", cost_points=50, stock=50, is_active=True),
            Reward(name="Powerbank 10000 mAh", description="Портативная зарядка с логотипом CIFRA.", cost_points=500, stock=5, is_active=True),
            Reward(name="Игровой коврик для мыши", description="Коврик 800x300 мм с символикой CIFRA.", cost_points=150, stock=15, is_active=True),
            Reward(name="Кружка CIFRA", description="Керамическая кружка 350 мл.", cost_points=100, stock=30, is_active=True),
        ]
        for r in rewards:
            db.add(r)

        # === 8. Новости ===
        news = [
            NewsPost(
                title="Платформа CIFRA запущена!",
                slug="cifra-launched",
                type="news",
                content="<p>Рады сообщить, что платформа <strong>CIFRA</strong> официально запущена! Теперь вы можете бронировать тренировки, участвовать в турнирах и зарабатывать баллы.</p><p>Зарегистрируйтесь с помощью номера студенческого билета и начните прокачивать свой рейтинг!</p>",
                is_published=True,
                author_id=admin.id,
            ),
            NewsPost(
                title="Турнир по CS2 — Весенний кубок CIFRA",
                slug="cs2-spring-cup",
                type="announcement",
                direction_id=dir_cyber.id,
                content="<p>Приглашаем всех любителей CS2 на <strong>Весенний кубок CIFRA</strong>!</p><ul><li>Формат: 5v5</li><li>Дата: скоро</li><li>Место: Компьютерный класс, корпус 2</li><li>Приз: +100 баллов рейтинга победителям</li></ul><p>Собери команду и запишись!</p>",
                is_published=True,
                author_id=admin.id,
            ),
        ]
        for n in news:
            db.add(n)

        # === 9. Материалы ===
        materials = [
            Material(
                title="Правила пользования фиджитал-центром",
                type="instruction",
                content="<h2>Общие правила</h2><ol><li>Бережно относитесь к оборудованию</li><li>Приходите вовремя на забронированные слоты</li><li>Соблюдайте чистоту и порядок</li><li>Следуйте указаниям тренера</li><li>При неисправности оборудования — сообщите тренеру</li></ol>",
                author_id=admin.id,
                is_published=True,
            ),
            Material(
                title="Как начать играть в CS2",
                type="lecture",
                direction_id=dir_cyber.id,
                content="<h2>Введение в CS2</h2><p>Counter-Strike 2 — тактический шутер от Valve. В этом гайде мы разберём основы для новичков: управление, экономика, базовые стратегии.</p>",
                author_id=admin.id,
                is_published=True,
            ),
            Material(
                title="Инструкция по управлению DJI Mini 3 Pro",
                type="instruction",
                direction_id=dir_drones.id,
                content="<h2>Подготовка к полёту</h2><ol><li>Зарядите аккумулятор</li><li>Проверьте пропеллеры</li><li>Откалибруйте компас</li><li>Убедитесь, что зона полёта безопасна</li></ol>",
                author_id=admin.id,
                is_published=True,
            ),
        ]
        for m in materials:
            db.add(m)

        # === 10. Тестовые слоты на ближайшие дни ===
        from datetime import date, time, timedelta
        from app.booking.models import Slot

        today = date.today()
        for day_offset in range(7):  # На неделю вперёд
            current_date = today + timedelta(days=day_offset)
            if current_date.weekday() >= 6:  # Пропускаем воскресенье
                continue

            # Слоты киберспорта
            for hour in [10, 12, 14, 16, 18]:
                slot = Slot(
                    direction_id=dir_cyber.id,
                    resource_id=resources[0].id,
                    trainer_id=trainer.id,
                    date=current_date,
                    start_time=time(hour, 0),
                    end_time=time(hour + 2, 0),
                    duration_minutes=120,
                    type="open",
                    capacity=5,
                )
                db.add(slot)

            # Слоты лазертага
            for hour in [11, 14, 17]:
                slot = Slot(
                    direction_id=dir_laser.id,
                    resource_id=resources[5].id,
                    trainer_id=trainer.id,
                    date=current_date,
                    start_time=time(hour, 0),
                    end_time=time(hour + 1, 0),
                    duration_minutes=60,
                    type="team",
                    capacity=10,
                )
                db.add(slot)

            # Слоты дронов
            for hour in [10, 12, 15]:
                slot = Slot(
                    direction_id=dir_drones.id,
                    resource_id=resources[7].id,
                    date=current_date,
                    start_time=time(hour, 0),
                    end_time=time(hour, 30),
                    duration_minutes=30,
                    type="individual",
                    capacity=3,
                )
                db.add(slot)

            # Слоты PlayStation
            for hour in [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]:
                slot = Slot(
                    direction_id=dir_ps.id,
                    resource_id=resources[10].id,
                    date=current_date,
                    start_time=time(hour, 0),
                    end_time=time(hour, 30),
                    duration_minutes=30,
                    type="individual",
                    capacity=2,
                )
                db.add(slot)

            # Слоты компьютерных мест
            for hour in [9, 11, 13, 15, 17]:
                slot = Slot(
                    direction_id=dir_pc.id,
                    resource_id=resources[12].id,
                    date=current_date,
                    start_time=time(hour, 0),
                    end_time=time(hour + 2, 0),
                    duration_minutes=120,
                    type="open",
                    capacity=10,
                )
                db.add(slot)

        await db.commit()

        print("✅ Данные загружены:")
        print("   👤 Админ: admin@cifra.sgtu.ru / admin123")
        print("   👤 Тренер: trainer@cifra.sgtu.ru / trainer123")
        print("   📋 3 записи верификации студентов")
        print("   📍 4 локации")
        print("   🎯 5 направлений")
        print("   🖥️  13 ресурсов")
        print("   🎁 5 наград")
        print("   📰 2 новости")
        print("   📚 3 материала")
        print("   📅 Слоты на 7 дней вперёд")
        print()
        print("   Тестовые студенты для регистрации:")
        print("   • Иванов Иван Иванович — 2024001234")
        print("   • Петрова Мария Сергеевна — 2024005678")
        print("   • Сидоров Алексей Дмитриевич — 2024009012")


async def main():
    print("🚀 Создание таблиц...")
    await create_tables()
    print("📦 Загрузка начальных данных...")
    await seed_data()
    print("🎉 Готово!")


if __name__ == "__main__":
    asyncio.run(main())
