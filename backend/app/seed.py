"""
Скрипт для заполнения базы данных начальными данными.
Запуск: python -m app.seed
"""
import asyncio
import uuid
from datetime import date, time, timedelta, datetime

from app.auth.utils import hash_password
from app.database import async_session, engine, Base

# Импорт всех моделей
from app.users.models import User, VerificationRecord
from app.directions.models import Direction
from app.locations.models import Location
from app.resources.models import Resource
from app.rewards.models import Reward, RewardRequest
from app.news.models import NewsPost
from app.materials.models import Material
from app.booking.models import Slot, Booking
from app.teams.models import Team, TeamMember
from app.rating.models import RatingEvent
from app.notifications.models import Notification
from app.audit.models import AuditLog
from app.campus_map.models import MapPoint
from app.dksh.models import DkshProfile


async def create_tables():
    """Создать все таблицы в БД."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("  Таблицы созданы")


async def seed_data():
    """Заполнить БД начальными данными."""
    async with async_session() as db:
        # Проверяем, что БД пустая
        from sqlalchemy import select, func
        count = (await db.execute(select(func.count(User.id)))).scalar()
        if count and count > 0:
            print("  БД уже содержит данные. Пропускаем seed.")
            return

        # =============================================
        # 1. ПОЛЬЗОВАТЕЛИ
        # =============================================

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
            avatar_url=None,
        )
        db.add(admin)

        trainer = User(
            email="trainer@cifra.sgtu.ru",
            password_hash=hash_password("trainer123"),
            role="trainer",
            first_name="Сергей",
            last_name="Иванов",
            patronymic="Петрович",
            is_verified=True,
            is_active=True,
            rating_score=100,
            phone="+7 (999) 111-22-33",
            telegram="@trainer_ivanov",
            avatar_url=None,
        )
        db.add(trainer)

        trainer2 = User(
            email="trainer2@cifra.sgtu.ru",
            password_hash=hash_password("trainer123"),
            role="trainer",
            first_name="Ольга",
            last_name="Кузнецова",
            patronymic="Витальевна",
            is_verified=True,
            is_active=True,
            rating_score=80,
            phone="+7 (999) 222-33-44",
            telegram="@trainer_kuznetsova",
            avatar_url=None,
        )
        db.add(trainer2)

        # Студенты
        student1 = User(
            email="ivan@cifra.sgtu.ru",
            password_hash=hash_password("student123"),
            role="student",
            first_name="Иван",
            last_name="Иванов",
            patronymic="Иванович",
            student_id_number="2024001234",
            is_verified=True,
            is_active=True,
            rating_score=350,
            phone="+7 (900) 100-10-01",
            telegram="@ivan_ivanov",
            avatar_url=None,
        )
        student2 = User(
            email="maria@cifra.sgtu.ru",
            password_hash=hash_password("student123"),
            role="student",
            first_name="Мария",
            last_name="Петрова",
            patronymic="Сергеевна",
            student_id_number="2024005678",
            is_verified=True,
            is_active=True,
            rating_score=280,
            telegram="@masha_petrova",
            avatar_url=None,
        )
        student3 = User(
            email="alexey@cifra.sgtu.ru",
            password_hash=hash_password("student123"),
            role="student",
            first_name="Алексей",
            last_name="Сидоров",
            patronymic="Дмитриевич",
            student_id_number="2024009012",
            is_verified=True,
            is_active=True,
            rating_score=420,
            telegram="@alex_sid",
            avatar_url=None,
        )
        student4 = User(
            email="elena@cifra.sgtu.ru",
            password_hash=hash_password("student123"),
            role="student",
            first_name="Елена",
            last_name="Козлова",
            patronymic="Андреевна",
            student_id_number="2024003456",
            is_verified=True,
            is_active=True,
            rating_score=190,
            avatar_url=None,
        )
        student5 = User(
            email="dmitry@cifra.sgtu.ru",
            password_hash=hash_password("student123"),
            role="student",
            first_name="Дмитрий",
            last_name="Морозов",
            patronymic="Викторович",
            student_id_number="2024007890",
            is_verified=True,
            is_active=True,
            rating_score=510,
            telegram="@dima_moroz",
            avatar_url=None,
        )
        student6 = User(
            email="anna@cifra.sgtu.ru",
            password_hash=hash_password("student123"),
            role="student",
            first_name="Анна",
            last_name="Новикова",
            patronymic="Олеговна",
            student_id_number="2024002345",
            is_verified=True,
            is_active=True,
            rating_score=160,
            avatar_url=None,
        )
        student7 = User(
            email="nikita@cifra.sgtu.ru",
            password_hash=hash_password("student123"),
            role="student",
            first_name="Никита",
            last_name="Волков",
            patronymic="Романович",
            student_id_number="2024006789",
            is_verified=True,
            is_active=True,
            rating_score=600,
            telegram="@nikita_wolf",
            avatar_url=None,
        )
        student8 = User(
            email="olga@cifra.sgtu.ru",
            password_hash=hash_password("student123"),
            role="student",
            first_name="Ольга",
            last_name="Соколова",
            patronymic="Игоревна",
            student_id_number="2024004567",
            is_verified=True,
            is_active=True,
            rating_score=95,
            avatar_url=None,
        )

        students = [student1, student2, student3, student4, student5, student6, student7, student8]
        for s in students:
            db.add(s)

        # =============================================
        # 2. ЗАПИСИ ВЕРИФИКАЦИИ
        # =============================================

        verification_records = [
            VerificationRecord(first_name="Иван", last_name="Иванов", patronymic="Иванович", student_id_number="2024001234"),
            VerificationRecord(first_name="Мария", last_name="Петрова", patronymic="Сергеевна", student_id_number="2024005678"),
            VerificationRecord(first_name="Алексей", last_name="Сидоров", patronymic="Дмитриевич", student_id_number="2024009012"),
            VerificationRecord(first_name="Елена", last_name="Козлова", patronymic="Андреевна", student_id_number="2024003456"),
            VerificationRecord(first_name="Дмитрий", last_name="Морозов", patronymic="Викторович", student_id_number="2024007890"),
            VerificationRecord(first_name="Анна", last_name="Новикова", patronymic="Олеговна", student_id_number="2024002345"),
            VerificationRecord(first_name="Никита", last_name="Волков", patronymic="Романович", student_id_number="2024006789"),
            VerificationRecord(first_name="Ольга", last_name="Соколова", patronymic="Игоревна", student_id_number="2024004567"),
        ]
        for vr in verification_records:
            db.add(vr)

        # =============================================
        # 3. ЛОКАЦИИ
        # =============================================

        loc_main = Location(
            name="Фиджитал-центр, корпус 1",
            building="Корпус 1",
            floor=2,
            room="201",
            description="Основная площадка фиджитал-центра СГТУ. PlayStation, зона отдыха, переговорная.",
            map_x=0.5,
            map_y=0.3,
        )
        loc_gym = Location(
            name="Спортзал, корпус 3",
            building="Корпус 3",
            floor=1,
            room="101",
            description="Спортивный зал для лазертага и подвижных активностей. Площадь 200 кв.м.",
            map_x=0.7,
            map_y=0.6,
        )
        loc_lab = Location(
            name="Компьютерный класс, корпус 2",
            building="Корпус 2",
            floor=3,
            room="305",
            description="Компьютерный класс с 10 игровыми ПК. Мониторы 240 Hz, периферия уровня турниров.",
            map_x=0.3,
            map_y=0.5,
        )
        loc_drone = Location(
            name="Площадка дронов (открытая)",
            building="Двор",
            description="Открытая площадка для полётов дронов между корпусами 2 и 3. Сетка безопасности.",
            map_x=0.8,
            map_y=0.2,
        )
        loc_stream = Location(
            name="Стриминговая студия, корпус 1",
            building="Корпус 1",
            floor=2,
            room="205",
            description="Студия для стримов и записи контента. 2 камеры, хромакей, освещение.",
            map_x=0.55,
            map_y=0.35,
        )
        for loc in [loc_main, loc_gym, loc_lab, loc_drone, loc_stream]:
            db.add(loc)

        await db.flush()

        # =============================================
        # 4. НАПРАВЛЕНИЯ
        # =============================================

        dir_cyber = Direction(
            name="Киберспорт",
            slug="cybersport",
            description="Соревновательный гейминг: CS2, Dota 2, Valorant и другие дисциплины. Тренировки, разборы матчей, участие в турнирах университетской и региональной лиги.",
            icon="🎮",
            color="#6C5CE7",
            cover_image_url="/images/directions/cybersport.svg",
            default_slot_capacity=5,
            slot_durations=[60, 120],
            sort_order=1,
        )
        dir_laser = Direction(
            name="Лазертаг",
            slug="lasertag",
            description="Командная тактическая игра с лазерным оборудованием. Развивает командную работу, стратегическое мышление и физическую подготовку. Сценарии: захват флага, командный бой, VIP.",
            icon="🔫",
            color="#FF6B6B",
            cover_image_url="/images/directions/lasertag.svg",
            default_slot_capacity=10,
            slot_durations=[60, 120],
            sort_order=2,
        )
        dir_drones = Direction(
            name="Дроны",
            slug="drones",
            description="Пилотирование FPV-дронов, аэросъёмка, гонки. Обучение от базового управления до freestyle-трюков. Свои дроны и шлемы.",
            icon="🛸",
            color="#00D2D3",
            cover_image_url="/images/directions/drones.svg",
            default_slot_capacity=3,
            slot_durations=[30, 60],
            sort_order=3,
        )
        dir_ps = Direction(
            name="PlayStation",
            slug="playstation",
            description="PlayStation 5 — FIFA 25, Mortal Kombat 1, Gran Turismo 7, It Takes Two и другие хиты. Индивидуальные и парные сессии на большом экране.",
            icon="🕹️",
            color="#FECA57",
            cover_image_url="/images/directions/playstation.svg",
            default_slot_capacity=2,
            slot_durations=[30, 60],
            sort_order=4,
        )
        dir_pc = Direction(
            name="Компьютерные места",
            slug="computers",
            description="Игровые ПК для тренировок и свободной игры. RTX 4070, 32GB RAM, 240Hz мониторы. Периферия HyperX и Logitech.",
            icon="💻",
            color="#00B894",
            cover_image_url="/images/directions/computers.svg",
            default_slot_capacity=10,
            slot_durations=[60, 120],
            sort_order=5,
        )
        directions = [dir_cyber, dir_laser, dir_drones, dir_ps, dir_pc]
        for d in directions:
            db.add(d)

        await db.flush()

        # =============================================
        # 5. РЕСУРСЫ
        # =============================================

        resources = [
            # Киберспорт — ПК
            Resource(name="Игровой ПК #1 (CS2)", type="workstation", direction_id=dir_cyber.id, location_id=loc_lab.id, status="active", description="RTX 4070, i7-14700K, 32GB, 240Hz BenQ"),
            Resource(name="Игровой ПК #2 (CS2)", type="workstation", direction_id=dir_cyber.id, location_id=loc_lab.id, status="active", description="RTX 4070, i7-14700K, 32GB, 240Hz BenQ"),
            Resource(name="Игровой ПК #3 (Dota)", type="workstation", direction_id=dir_cyber.id, location_id=loc_lab.id, status="active", description="RTX 4070, i7-14700K, 32GB, 240Hz BenQ"),
            Resource(name="Игровой ПК #4 (Valorant)", type="workstation", direction_id=dir_cyber.id, location_id=loc_lab.id, status="active", description="RTX 4070, i7-14700K, 32GB, 240Hz BenQ"),
            Resource(name="Игровой ПК #5 (Универсальный)", type="workstation", direction_id=dir_cyber.id, location_id=loc_lab.id, status="active", description="RTX 4070, i7-14700K, 32GB, 240Hz BenQ"),
            # Лазертаг
            Resource(name="Арена лазертага", type="venue", direction_id=dir_laser.id, location_id=loc_gym.id, status="active", capacity=10, description="Площадка 200 кв.м с укрытиями и препятствиями"),
            Resource(name="Набор лазертаг (10 комплектов)", type="equipment", direction_id=dir_laser.id, location_id=loc_gym.id, status="active", description="10 жилетов + 10 бластеров Laserwar"),
            # Дроны
            Resource(name="DJI Mini 3 Pro", type="equipment", direction_id=dir_drones.id, location_id=loc_drone.id, status="active", description="Компактный дрон для аэросъёмки, 4K камера"),
            Resource(name="FPV Дрон #1 (BetaFPV)", type="equipment", direction_id=dir_drones.id, location_id=loc_drone.id, status="active", description="Гоночный FPV-дрон для тренировок"),
            Resource(name="FPV Дрон #2 (iFlight)", type="equipment", direction_id=dir_drones.id, location_id=loc_drone.id, status="active", description="FPV-дрон для freestyle"),
            Resource(name="FPV Шлем DJI Goggles 2", type="equipment", direction_id=dir_drones.id, location_id=loc_drone.id, status="active", description="Шлем для FPV-полётов"),
            # PlayStation
            Resource(name="PlayStation 5 #1 + TV 55\"", type="equipment", direction_id=dir_ps.id, location_id=loc_main.id, status="active", capacity=2, description="PS5 Digital + Samsung 55\" 4K"),
            Resource(name="PlayStation 5 #2 + TV 43\"", type="equipment", direction_id=dir_ps.id, location_id=loc_main.id, status="active", capacity=2, description="PS5 Disc + LG 43\" 4K"),
            # Компьютерные места
            Resource(name="Компьютерный класс (10 мест)", type="venue", direction_id=dir_pc.id, location_id=loc_lab.id, status="active", capacity=10, description="10 рабочих мест с игровыми ПК"),
            # На обслуживании
            Resource(name="FPV Дрон #3 (ремонт)", type="equipment", direction_id=dir_drones.id, location_id=loc_drone.id, status="maintenance", description="На замене моторов"),
        ]
        for r in resources:
            db.add(r)

        await db.flush()

        # =============================================
        # 6. НАГРАДЫ
        # =============================================

        rewards = [
            Reward(name="Фирменная футболка CIFRA", description="Чёрная футболка с логотипом CIFRA на груди и принтом на спине. Размеры: S, M, L, XL. Хлопок 100%.", cost_points=200, stock=20, is_active=True, photo_url="/images/rewards/tshirt.svg"),
            Reward(name="Стикерпак CIFRA", description="Набор из 10 фирменных стикеров с персонажами и мемами CIFRA.", cost_points=50, stock=50, is_active=True, photo_url="/images/rewards/stickers.svg"),
            Reward(name="Powerbank 10000 mAh", description="Портативная зарядка Xiaomi с гравировкой логотипа CIFRA.", cost_points=500, stock=5, is_active=True, photo_url="/images/rewards/powerbank.svg"),
            Reward(name="Игровой коврик для мыши XL", description="Коврик 800x300 мм с символикой CIFRA. Ткань + резиновая основа.", cost_points=150, stock=15, is_active=True, photo_url="/images/rewards/mousepad.svg"),
            Reward(name="Кружка CIFRA", description="Керамическая кружка 350 мл с логотипом. Можно в посудомойку.", cost_points=100, stock=30, is_active=True, photo_url="/images/rewards/mug.svg"),
            Reward(name="Худи CIFRA (лимитка)", description="Худи оверсайз с вышивкой CIFRA. Лимитированная серия, чёрный цвет.", cost_points=800, stock=3, is_active=True, photo_url="/images/rewards/hoodie.svg"),
            Reward(name="Ланъярд с карабином", description="Шнурок для бейджа/ключей с логотипом CIFRA.", cost_points=30, stock=100, is_active=True, photo_url="/images/rewards/lanyard.svg"),
        ]
        for r in rewards:
            db.add(r)

        await db.flush()

        # =============================================
        # 7. НОВОСТИ
        # =============================================

        news = [
            NewsPost(
                title="Платформа CIFRA запущена!",
                slug="cifra-launched",
                type="news",
                cover_image_url="/images/news/cifra-launch.svg",
                content="<p>Рады сообщить, что платформа <strong>CIFRA</strong> официально запущена! Теперь вы можете бронировать тренировки, участвовать в турнирах и зарабатывать баллы рейтинга.</p><p>Зарегистрируйтесь с помощью номера студенческого билета и начните прокачивать свой рейтинг!</p><h3>Что доступно:</h3><ul><li>Бронирование слотов по 5 направлениям</li><li>Рейтинговая система с таблицей лидеров</li><li>Магазин наград за баллы</li><li>Учебные материалы и инструкции</li></ul>",
                is_published=True,
                author_id=admin.id,
            ),
            NewsPost(
                title="Турнир по CS2 — Весенний кубок CIFRA",
                slug="cs2-spring-cup",
                type="announcement",
                direction_id=dir_cyber.id,
                cover_image_url="/images/news/cs2-cup.svg",
                content="<p>Приглашаем всех любителей CS2 на <strong>Весенний кубок CIFRA</strong>!</p><ul><li>Формат: 5v5, Single Elimination</li><li>Дата: 25 марта 2026</li><li>Место: Компьютерный класс, корпус 2</li><li>Приз: +100 баллов рейтинга победителям, +50 финалистам</li><li>Регистрация команд до 22 марта</li></ul><p>Собери команду из 5 человек и запишись через платформу!</p>",
                is_published=True,
                author_id=admin.id,
            ),
            NewsPost(
                title="Новое оборудование: FPV-шлемы DJI Goggles 2",
                slug="new-fpv-goggles",
                type="news",
                direction_id=dir_drones.id,
                cover_image_url="/images/news/fpv-goggles.svg",
                content="<p>В направлении <strong>Дроны</strong> появились новые FPV-шлемы <strong>DJI Goggles 2</strong>!</p><p>Теперь пилотирование стало ещё более иммерсивным — разрешение 1080p, низкая задержка, удобная посадка.</p><p>Приходите попробовать на ближайшей тренировке.</p>",
                is_published=True,
                author_id=admin.id,
            ),
            NewsPost(
                title="Итоги турнира по FIFA 25",
                slug="fifa25-results",
                type="result",
                direction_id=dir_ps.id,
                cover_image_url="/images/news/fifa25.svg",
                content="<p>Завершился турнир по <strong>FIFA 25</strong> на PlayStation!</p><h3>Результаты:</h3><ol><li>🥇 Никита Волков — 7 побед из 7</li><li>🥈 Дмитрий Морозов — 5 побед</li><li>🥉 Иван Иванов — 4 победы</li></ol><p>Поздравляем победителей! Баллы рейтинга уже начислены.</p>",
                is_published=True,
                author_id=admin.id,
            ),
            NewsPost(
                title="График работы на праздничные дни",
                slug="holiday-schedule",
                type="announcement",
                cover_image_url="/images/news/holiday.svg",
                content="<p>Уважаемые участники!</p><p>В период с 8 по 10 марта фиджитал-центр работает по сокращённому графику:</p><ul><li>8 марта — выходной</li><li>9 марта — 12:00–18:00</li><li>10 марта — обычный режим</li></ul><p>Бронирование слотов на эти даты уже открыто.</p>",
                is_published=True,
                author_id=admin.id,
            ),
            NewsPost(
                title="Набор в команду по Dota 2",
                slug="dota2-team-recruitment",
                type="announcement",
                direction_id=dir_cyber.id,
                cover_image_url="/images/news/dota2.svg",
                content="<p>Формируем университетскую команду по <strong>Dota 2</strong> для участия в Студенческой Киберспортивной Лиге!</p><h3>Требования:</h3><ul><li>Ранг: не ниже Archon</li><li>Готовность тренироваться 3 раза в неделю</li><li>Командная дисциплина</li></ul><p>Заявки принимаются до конца месяца. Обращайтесь к тренеру Сергею Петровичу.</p>",
                is_published=True,
                author_id=admin.id,
            ),
            # Дополнительные новости
            NewsPost(
                title="VR-день в фиджитал-центре: погружение в виртуальную реальность",
                slug="vr-day-event",
                type="news",
                cover_image_url="/images/news/vr-day.svg",
                content="<p>В минувшую субботу в фиджитал-центре прошёл <strong>VR-день</strong>!</p><p>Участники попробовали VR-шлемы, поиграли в Beat Saber и Half-Life: Alyx, а также познакомились с образовательными VR-приложениями.</p><p>Более 40 студентов приняли участие в мероприятии. Фотоотчёт уже в нашей группе ВКонтакте!</p>",
                is_published=True,
                author_id=admin.id,
            ),
            NewsPost(
                title="Студенческая лига по Counter-Strike 2 — 15 ноября",
                slug="cs2-student-league",
                type="announcement",
                direction_id=dir_cyber.id,
                cover_image_url="/images/news/cs2-league.svg",
                content="<p>СГТУ принимает участие в <strong>Студенческой лиге по Counter-Strike 2</strong>!</p><h3>Детали:</h3><ul><li>Формат: 5v5, BO3</li><li>Карты: Mirage, Inferno, Anubis</li><li>Приз: +150 баллов рейтинга для MVP</li></ul><p>Трансляция матчей будет вестись из стриминговой студии. Болельщики приветствуются!</p>",
                is_published=True,
                author_id=admin.id,
            ),
            NewsPost(
                title="Открытый день дронов — полётные тесты для новичков",
                slug="drone-open-day",
                type="announcement",
                direction_id=dir_drones.id,
                cover_image_url="/images/news/drone-day.svg",
                content="<p>Приглашаем на <strong>Открытый день дронов</strong>! Если вы давно хотели попробовать управлять квадрокоптером — это ваш шанс.</p><ul><li>Мини-лекция по безопасности полётов</li><li>Тестовые полёты на DJI Mini 3 Pro</li><li>FPV-симулятор для начинающих</li><li>Показательные полёты от опытных пилотов</li></ul><p>Мероприятие бесплатное. Регистрация на платформе.</p>",
                is_published=True,
                author_id=admin.id,
            ),
            NewsPost(
                title="Лазертаг-турнир: Битва факультетов",
                slug="lasertag-faculty-battle",
                type="announcement",
                direction_id=dir_laser.id,
                cover_image_url="/images/news/lasertag-battle.svg",
                content="<p>Межфакультетский турнир по <strong>лазертагу</strong> состоится 28 марта!</p><h3>Формат:</h3><ul><li>Команды по 5 человек от каждого факультета</li><li>Сценарии: захват флага, командный бой, VIP-защита</li><li>Победители получат +80 баллов рейтинга</li></ul><p>Запись команд через капитанов. Дедлайн — 25 марта.</p>",
                is_published=True,
                author_id=admin.id,
            ),
            NewsPost(
                title="Итоги недели: топ-3 игрока по посещаемости",
                slug="weekly-top-players",
                type="result",
                cover_image_url="/images/news/weekly-top.svg",
                content="<p>Подводим итоги прошедшей недели!</p><h3>Самые активные участники:</h3><ol><li>🥇 Никита Волков — 12 посещений</li><li>🥈 Алексей Сидоров — 10 посещений</li><li>🥉 Дмитрий Морозов — 9 посещений</li></ol><p>Каждому начислены бонусные баллы. Продолжайте в том же духе!</p>",
                is_published=True,
                author_id=admin.id,
            ),
            NewsPost(
                title="Совместный проект с ДКШ: цифровое наставничество",
                slug="dksh-digital-mentoring",
                type="news",
                cover_image_url="/images/news/dksh-mentor.svg",
                content="<p>CIFRA запускает совместную программу с <strong>Добровольной Кибершколой (ДКШ)</strong>!</p><p>Лучшие студенты платформы смогут стать наставниками для школьников, обучая их основам киберспорта, дронов и IT-технологий.</p><h3>Преимущества участия:</h3><ul><li>+50 баллов рейтинга за каждое занятие</li><li>Сертификат наставника</li><li>Опыт преподавания и работы с подростками</li></ul><p>Подробности — в разделе ДКШ на платформе или <a href='https://vk.com/digitalschool' target='_blank'>в группе ВКонтакте</a>.</p>",
                is_published=True,
                author_id=admin.id,
            ),
        ]
        for n in news:
            db.add(n)

        # =============================================
        # 8. МАТЕРИАЛЫ
        # =============================================

        materials = [
            Material(
                title="Правила пользования фиджитал-центром",
                type="instruction",
                content="<h2>Общие правила</h2><ol><li>Бережно относитесь к оборудованию</li><li>Приходите вовремя на забронированные слоты</li><li>Соблюдайте чистоту и порядок</li><li>Следуйте указаниям тренера</li><li>При неисправности оборудования — сообщите тренеру</li></ol><h2>Правила бронирования</h2><ul><li>Бронирование открывается за 7 дней до даты</li><li>Отмена бронирования — не позднее чем за 2 часа</li><li>3 неявки без предупреждения — временная блокировка</li></ul>",
                author_id=admin.id,
                is_published=True,
            ),
            Material(
                title="Как начать играть в CS2",
                type="lecture",
                direction_id=dir_cyber.id,
                content="<h2>Введение в CS2</h2><p>Counter-Strike 2 — тактический шутер от Valve. В этом гайде мы разберём основы для новичков.</p><h3>Управление</h3><p>WASD — движение, мышь — прицеливание, ЛКМ — стрельба, пробел — прыжок, Ctrl — присед.</p><h3>Экономика</h3><p>В начале раунда нужно покупать оружие. Пистолетный раунд — играем с пистолетом. При выигрыше — покупаем винтовки (AK-47, M4A4). При проигрыше — экономим.</p><h3>Позиции</h3><p>Изучите карту Mirage для начала. Запомните callout-позиции: A-site, B-site, Mid, Connector, Palace.</p>",
                author_id=admin.id,
                is_published=True,
            ),
            Material(
                title="Инструкция по управлению DJI Mini 3 Pro",
                type="instruction",
                direction_id=dir_drones.id,
                content="<h2>Подготовка к полёту</h2><ol><li>Зарядите аккумулятор дрона и пульта</li><li>Установите и проверьте пропеллеры (маркировка A/B)</li><li>Откалибруйте компас, если приложение просит</li><li>Убедитесь, что зона полёта безопасна (нет людей, проводов)</li></ol><h2>Первый полёт</h2><ol><li>Включите пульт, затем дрон</li><li>Дождитесь подключения GPS (10+ спутников)</li><li>Взлёт: потяните оба стика вниз-внутрь или нажмите кнопку взлёта</li><li>Набор высоты: левый стик вверх</li><li>Повороты: левый стик влево/вправо</li></ol>",
                author_id=admin.id,
                is_published=True,
            ),
            Material(
                title="Тактики лазертага: базовый курс",
                type="lecture",
                direction_id=dir_laser.id,
                content="<h2>Основы командной тактики</h2><h3>Роли в команде</h3><ul><li><strong>Штурмовик</strong> — идёт первым, быстро захватывает позиции</li><li><strong>Поддержка</strong> — прикрывает штурмовика, контролирует фланги</li><li><strong>Снайпер</strong> — работает на дальних дистанциях</li></ul><h3>Сценарий: Захват флага</h3><p>Команда делится на атаку (3 человека) и защиту (2 человека). Атакующие обходят с двух сторон, защитники удерживают позицию у флага.</p>",
                author_id=admin.id,
                is_published=True,
            ),
            Material(
                title="Памятка: рейтинговая система CIFRA",
                type="memo",
                content="<h2>Как работает рейтинг</h2><table><tr><th>Действие</th><th>Баллы</th></tr><tr><td>Посещение тренировки</td><td>+10</td></tr><tr><td>Неявка без предупреждения</td><td>-20</td></tr><tr><td>Поздняя отмена (менее 2 часов)</td><td>-5</td></tr><tr><td>Победа в турнире</td><td>+100</td></tr><tr><td>Финалист турнира</td><td>+50</td></tr><tr><td>Участие в турнире</td><td>+20</td></tr><tr><td>Достижение (первое бронирование, 10 посещений и т.д.)</td><td>+15–50</td></tr></table><p>Баллы можно обменять на мерч в магазине наград.</p>",
                author_id=admin.id,
                is_published=True,
            ),
        ]
        for m in materials:
            db.add(m)

        # =============================================
        # 9. СЛОТЫ НА 14 ДНЕЙ
        # =============================================

        today = date.today()
        all_slots = []

        for day_offset in range(14):
            current_date = today + timedelta(days=day_offset)
            if current_date.weekday() >= 6:  # Пропускаем воскресенье
                continue

            # Киберспорт — 5 слотов в день
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
                all_slots.append(slot)

            # Лазертаг — 3 слота в день
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
                all_slots.append(slot)

            # Дроны — 3 слота в день
            for hour in [10, 12, 15]:
                slot = Slot(
                    direction_id=dir_drones.id,
                    resource_id=resources[7].id,
                    trainer_id=trainer2.id,
                    date=current_date,
                    start_time=time(hour, 0),
                    end_time=time(hour, 30),
                    duration_minutes=30,
                    type="individual",
                    capacity=3,
                )
                db.add(slot)
                all_slots.append(slot)

            # PlayStation — с 10 до 20, каждые 30 минут
            for hour in [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]:
                slot = Slot(
                    direction_id=dir_ps.id,
                    resource_id=resources[11].id,
                    date=current_date,
                    start_time=time(hour, 0),
                    end_time=time(hour, 30),
                    duration_minutes=30,
                    type="individual",
                    capacity=2,
                )
                db.add(slot)
                all_slots.append(slot)

            # Компьютерные места — 5 слотов в день
            for hour in [9, 11, 13, 15, 17]:
                slot = Slot(
                    direction_id=dir_pc.id,
                    resource_id=resources[13].id,
                    date=current_date,
                    start_time=time(hour, 0),
                    end_time=time(hour + 2, 0),
                    duration_minutes=120,
                    type="open",
                    capacity=10,
                )
                db.add(slot)
                all_slots.append(slot)

        await db.flush()

        # =============================================
        # 10. КОМАНДЫ
        # =============================================

        team1 = Team(
            name="CyberWolves",
            direction_id=dir_cyber.id,
            captain_id=student3.id,
        )
        team2 = Team(
            name="LaserStrike",
            direction_id=dir_laser.id,
            captain_id=student1.id,
        )
        team3 = Team(
            name="DroneRacers",
            direction_id=dir_drones.id,
            captain_id=student5.id,
        )
        for t in [team1, team2, team3]:
            db.add(t)

        await db.flush()

        # Участники команд
        team_members = [
            # CyberWolves
            TeamMember(team_id=team1.id, user_id=student3.id, role="captain", status="accepted"),
            TeamMember(team_id=team1.id, user_id=student5.id, role="member", status="accepted"),
            TeamMember(team_id=team1.id, user_id=student7.id, role="member", status="accepted"),
            TeamMember(team_id=team1.id, user_id=student1.id, role="member", status="accepted"),
            TeamMember(team_id=team1.id, user_id=student2.id, role="member", status="invited"),
            # LaserStrike
            TeamMember(team_id=team2.id, user_id=student1.id, role="captain", status="accepted"),
            TeamMember(team_id=team2.id, user_id=student2.id, role="member", status="accepted"),
            TeamMember(team_id=team2.id, user_id=student4.id, role="member", status="accepted"),
            TeamMember(team_id=team2.id, user_id=student6.id, role="member", status="accepted"),
            TeamMember(team_id=team2.id, user_id=student8.id, role="member", status="invited"),
            # DroneRacers
            TeamMember(team_id=team3.id, user_id=student5.id, role="captain", status="accepted"),
            TeamMember(team_id=team3.id, user_id=student3.id, role="member", status="accepted"),
            TeamMember(team_id=team3.id, user_id=student7.id, role="member", status="invited"),
        ]
        for tm in team_members:
            db.add(tm)

        # =============================================
        # 11. БРОНИРОВАНИЯ
        # =============================================

        # Берём слоты на сегодня и завтра
        today_slots = [s for s in all_slots if s.date == today]
        tomorrow_slots = [s for s in all_slots if s.date == today + timedelta(days=1)]

        bookings = []

        # Бронирования на сегодня
        if len(today_slots) >= 5:
            bookings.extend([
                Booking(slot_id=today_slots[0].id, user_id=student1.id, status="confirmed"),
                Booking(slot_id=today_slots[0].id, user_id=student3.id, status="confirmed"),
                Booking(slot_id=today_slots[0].id, user_id=student5.id, status="confirmed"),
                Booking(slot_id=today_slots[1].id, user_id=student2.id, status="confirmed"),
                Booking(slot_id=today_slots[1].id, user_id=student7.id, status="confirmed"),
                Booking(slot_id=today_slots[2].id, user_id=student4.id, status="confirmed"),
                Booking(slot_id=today_slots[3].id, user_id=student6.id, status="confirmed"),
                Booking(slot_id=today_slots[3].id, user_id=student8.id, status="confirmed"),
            ])
            # Обновим счётчики
            today_slots[0].current_count = 3
            today_slots[1].current_count = 2
            today_slots[2].current_count = 1
            today_slots[3].current_count = 2

        # Бронирования на завтра
        if len(tomorrow_slots) >= 3:
            bookings.extend([
                Booking(slot_id=tomorrow_slots[0].id, user_id=student1.id, status="confirmed"),
                Booking(slot_id=tomorrow_slots[0].id, user_id=student2.id, status="confirmed"),
                Booking(slot_id=tomorrow_slots[1].id, user_id=student5.id, status="confirmed"),
                Booking(slot_id=tomorrow_slots[2].id, user_id=student7.id, status="confirmed"),
            ])
            tomorrow_slots[0].current_count = 2
            tomorrow_slots[1].current_count = 1
            tomorrow_slots[2].current_count = 1

        # Отменённое бронирование
        if len(today_slots) >= 5:
            bookings.append(
                Booking(slot_id=today_slots[4].id, user_id=student4.id, status="cancelled", cancellation_reason="Не могу прийти, заболел")
            )

        for b in bookings:
            db.add(b)

        await db.flush()

        # =============================================
        # 12. РЕЙТИНГОВЫЕ СОБЫТИЯ
        # =============================================

        rating_events = [
            # Иван (350)
            RatingEvent(user_id=student1.id, event_type="attendance", points=10, balance_after=310, reason="Посещение тренировки по киберспорту"),
            RatingEvent(user_id=student1.id, event_type="attendance", points=10, balance_after=320, reason="Посещение тренировки по лазертагу"),
            RatingEvent(user_id=student1.id, event_type="tournament", points=20, balance_after=340, reason="Участие в турнире по CS2"),
            RatingEvent(user_id=student1.id, event_type="achievement", points=10, balance_after=350, reason="Достижение: 10 посещений"),

            # Мария (280)
            RatingEvent(user_id=student2.id, event_type="attendance", points=10, balance_after=260, reason="Посещение тренировки по PlayStation"),
            RatingEvent(user_id=student2.id, event_type="attendance", points=10, balance_after=270, reason="Посещение тренировки по киберспорту"),
            RatingEvent(user_id=student2.id, event_type="achievement", points=15, balance_after=285, reason="Достижение: первое бронирование"),
            RatingEvent(user_id=student2.id, event_type="no_show", points=-5, balance_after=280, reason="Неявка на тренировку 05.03"),

            # Алексей (420)
            RatingEvent(user_id=student3.id, event_type="tournament", points=100, balance_after=350, reason="Победа в турнире по CS2 (зимний кубок)"),
            RatingEvent(user_id=student3.id, event_type="attendance", points=10, balance_after=360, reason="Посещение тренировки"),
            RatingEvent(user_id=student3.id, event_type="attendance", points=10, balance_after=370, reason="Посещение тренировки"),
            RatingEvent(user_id=student3.id, event_type="tournament", points=50, balance_after=420, reason="Финалист турнира по Dota 2"),

            # Дмитрий (510)
            RatingEvent(user_id=student5.id, event_type="attendance", points=10, balance_after=460, reason="Посещение тренировки по дронам"),
            RatingEvent(user_id=student5.id, event_type="tournament", points=100, balance_after=510, reason="Победа в гонке дронов"),
            RatingEvent(user_id=student5.id, event_type="reward_spend", points=-50, balance_after=460, reason="Обмен на стикерпак"),
            RatingEvent(user_id=student5.id, event_type="attendance", points=10, balance_after=470, reason="Посещение тренировки"),
            RatingEvent(user_id=student5.id, event_type="achievement", points=40, balance_after=510, reason="Достижение: 20 посещений"),

            # Никита (600)
            RatingEvent(user_id=student7.id, event_type="tournament", points=100, balance_after=500, reason="Победа в турнире по FIFA 25"),
            RatingEvent(user_id=student7.id, event_type="tournament", points=50, balance_after=550, reason="Финалист турнира по CS2"),
            RatingEvent(user_id=student7.id, event_type="attendance", points=10, balance_after=560, reason="Посещение тренировки"),
            RatingEvent(user_id=student7.id, event_type="achievement", points=40, balance_after=600, reason="Достижение: 30 посещений"),
        ]
        for re in rating_events:
            db.add(re)

        # =============================================
        # 13. ЗАЯВКИ НА НАГРАДЫ
        # =============================================

        reward_requests = [
            RewardRequest(user_id=student5.id, reward_id=rewards[1].id, status="issued", points_spent=50, processed_by=admin.id),
            RewardRequest(user_id=student7.id, reward_id=rewards[0].id, status="issued", points_spent=200, processed_by=admin.id),
            RewardRequest(user_id=student3.id, reward_id=rewards[4].id, status="pending", points_spent=100),
            RewardRequest(user_id=student1.id, reward_id=rewards[3].id, status="pending", points_spent=150),
        ]
        for rr in reward_requests:
            db.add(rr)

        # =============================================
        # 14. УВЕДОМЛЕНИЯ
        # =============================================

        notifications = [
            Notification(user_id=student1.id, type="booking_confirmed", title="Бронирование подтверждено", message="Вы записаны на тренировку по киберспорту сегодня в 10:00.", is_read=True),
            Notification(user_id=student1.id, type="team_invite", title="Приглашение в команду", message="Вас пригласили в команду CyberWolves. Примите или отклоните приглашение.", is_read=True),
            Notification(user_id=student1.id, type="rating_change", title="Рейтинг обновлён", message="Вам начислено +10 баллов за посещение тренировки. Текущий рейтинг: 350.", is_read=False),
            Notification(user_id=student2.id, type="booking_confirmed", title="Бронирование подтверждено", message="Вы записаны на тренировку по киберспорту сегодня в 12:00.", is_read=False),
            Notification(user_id=student2.id, type="team_invite", title="Приглашение в команду", message="Капитан команды CyberWolves приглашает вас. Присоединяйтесь!", is_read=False),
            Notification(user_id=student3.id, type="reward_ready", title="Награда готова к выдаче", message="Ваша заявка на кружку CIFRA рассматривается.", is_read=False),
            Notification(user_id=student3.id, type="announcement", title="Турнир по CS2", message="Не пропустите Весенний кубок CIFRA по CS2! Регистрация до 22 марта.", is_read=True),
            Notification(user_id=student5.id, type="rating_change", title="Рейтинг обновлён", message="Вам начислено +100 баллов за победу в гонке дронов! Текущий рейтинг: 510.", is_read=True),
            Notification(user_id=student7.id, type="reward_ready", title="Награда выдана", message="Футболка CIFRA готова! Заберите у администратора в корпусе 1, каб. 201.", is_read=False),
            Notification(user_id=student4.id, type="booking_cancelled", title="Бронирование отменено", message="Ваше бронирование на сегодня было отменено.", is_read=True),
            Notification(user_id=student8.id, type="team_invite", title="Приглашение в команду", message="Капитан команды LaserStrike приглашает вас присоединиться!", is_read=False),
            # Системные уведомления
            Notification(user_id=student1.id, type="system", title="Обновление платформы", message="Платформа CIFRA обновлена! Теперь доступна карта кампуса и Telegram-бот.", is_read=False),
            Notification(user_id=student5.id, type="system", title="Обновление платформы", message="Платформа CIFRA обновлена! Теперь доступна карта кампуса и Telegram-бот.", is_read=False),
        ]
        for n in notifications:
            db.add(n)

        # =============================================
        # 15. ЖУРНАЛ АУДИТА
        # =============================================

        audit_logs = [
            AuditLog(user_id=admin.id, action="create", entity_type="direction", details={"name": "Киберспорт"}, ip_address="127.0.0.1"),
            AuditLog(user_id=admin.id, action="create", entity_type="direction", details={"name": "Лазертаг"}, ip_address="127.0.0.1"),
            AuditLog(user_id=admin.id, action="create", entity_type="news", details={"title": "Платформа CIFRA запущена!"}, ip_address="127.0.0.1"),
            AuditLog(user_id=admin.id, action="create", entity_type="reward", details={"name": "Фирменная футболка CIFRA"}, ip_address="127.0.0.1"),
            AuditLog(user_id=admin.id, action="update", entity_type="user", details={"action": "Выдал награду Никите Волкову"}, ip_address="127.0.0.1"),
            AuditLog(user_id=admin.id, action="create", entity_type="slot", details={"action": "Сгенерировал слоты на неделю"}, ip_address="127.0.0.1"),
        ]
        for al in audit_logs:
            db.add(al)

        # =============================================
        # 16. ТОЧКИ НА КАРТЕ КАМПУСА
        # =============================================

        map_points = [
            MapPoint(name="Корпус 1 (главный)", description="Фиджитал-центр, PlayStation, стриминговая студия", point_type="building", x=0.5, y=0.3, location_id=loc_main.id, icon="building", color="#6C5CE7", is_active=True),
            MapPoint(name="Корпус 2", description="Компьютерный класс, игровые ПК", point_type="building", x=0.3, y=0.5, location_id=loc_lab.id, icon="building", color="#00B894", is_active=True),
            MapPoint(name="Корпус 3 (спортзал)", description="Лазертаг, спортивные активности", point_type="sport", x=0.7, y=0.6, location_id=loc_gym.id, icon="trophy", color="#FF6B6B", is_active=True),
            MapPoint(name="Площадка дронов", description="Открытая площадка для полётов FPV-дронов", point_type="sport", x=0.8, y=0.2, location_id=loc_drone.id, icon="plane", color="#00D2D3", is_active=True),
            MapPoint(name="Вход (главный)", description="Главный вход на территорию кампуса", point_type="entrance", x=0.5, y=0.9, icon="door-open", color="#636E72", is_active=True),
            MapPoint(name="Вход (боковой)", description="Боковой вход со стороны парковки", point_type="entrance", x=0.1, y=0.5, icon="door-open", color="#636E72", is_active=True),
            MapPoint(name="Столовая", description="Столовая кампуса, работает 9:00–17:00", point_type="food", x=0.4, y=0.7, icon="utensils", color="#FECA57", is_active=True),
            MapPoint(name="Кофейня", description="Кофейня у корпуса 1", point_type="food", x=0.55, y=0.4, icon="coffee", color="#E17055", is_active=True),
            MapPoint(name="Библиотека", description="Научная библиотека СГТУ", point_type="library", x=0.2, y=0.3, icon="book-open", color="#0984E3", is_active=True),
            MapPoint(name="Парковка", description="Парковка для студентов и сотрудников", point_type="parking", x=0.1, y=0.8, icon="car", color="#636E72", is_active=True),
            MapPoint(name="Стриминговая студия", description="Студия для стримов, 2 камеры, хромакей", point_type="building", x=0.55, y=0.35, location_id=loc_stream.id, icon="video", color="#A29BFE", is_active=True),
        ]
        for mp in map_points:
            db.add(mp)

        # =============================================
        # 17. ПРОФИЛИ ДКШ
        # =============================================

        dksh_profiles = [
            DkshProfile(
                user_id=student3.id,
                about="Увлекаюсь киберспортом с 2020 года. Капитан университетской команды по CS2. Хочу развивать киберспорт в СГТУ и помогать новичкам.",
                skills=["Лидерство", "Стратегическое мышление", "CS2", "Dota 2", "Организация турниров"],
                interests=["Киберспорт", "Стриминг", "Маркетинг"],
                achievements=["Победитель зимнего кубка CIFRA по CS2", "Финалист регионального турнира по Dota 2"],
                directions=["cybersport"],
                experience="Организовал 3 внутренних турнира. Веду тренировки для новичков по CS2.",
                contact_telegram="@alex_sid",
                is_active=True,
            ),
            DkshProfile(
                user_id=student5.id,
                about="Пилот дронов, участник FPV-гонок. Хочу развивать направление дронов в университете и обучать безопасным полётам.",
                skills=["FPV-пилотирование", "Аэросъёмка", "Ремонт дронов", "3D-печать запчастей"],
                interests=["Дроны", "Робототехника", "Видеомонтаж"],
                achievements=["Победитель гонки дронов CIFRA", "Сертификат пилота БПЛА"],
                directions=["drones"],
                experience="Пилотирую дроны 2 года. Снял несколько рекламных роликов для университета.",
                contact_telegram="@dima_moroz",
                contact_vk="https://vk.com/dima_moroz",
                is_active=True,
            ),
            DkshProfile(
                user_id=student7.id,
                about="Играю в FIFA профессионально. Хочу организовать регулярную лигу по FIFA в университете.",
                skills=["FIFA", "PlayStation", "Организация мероприятий", "Контент-создание"],
                interests=["PlayStation", "Стриминг", "Спортивные симуляторы"],
                achievements=["Победитель турнира по FIFA 25", "Финалист турнира по CS2"],
                directions=["playstation", "cybersport"],
                experience="Организовал 2 турнира по FIFA. Веду стримы на Twitch.",
                contact_telegram="@nikita_wolf",
                is_active=True,
            ),
        ]
        for dp in dksh_profiles:
            db.add(dp)

        # =============================================
        # СОХРАНЕНИЕ
        # =============================================

        await db.commit()

        print("  Данные загружены:")
        print("   👤 Админ: admin@cifra.sgtu.ru / admin123")
        print("   👤 Тренер 1: trainer@cifra.sgtu.ru / trainer123")
        print("   👤 Тренер 2: trainer2@cifra.sgtu.ru / trainer123")
        print("   👤 8 студентов: ivan/maria/alexey/elena/dmitry/anna/nikita/olga@cifra.sgtu.ru / student123")
        print("   📋 8 записей верификации")
        print("   📍 5 локаций")
        print("   🎯 5 направлений")
        print("   🖥️  15 ресурсов (1 на обслуживании)")
        print("   🎁 7 наград")
        print("   📰 12 новостей")
        print("   📚 5 материалов")
        print("   📅 Слоты на 14 дней вперёд")
        print("   👥 3 команды с участниками")
        print("   📋 12+ бронирований")
        print("   ⭐ 21 рейтинговое событие")
        print("   🔔 13 уведомлений")
        print("   📝 6 записей аудита")
        print("   🗺️  11 точек на карте")
        print("   📄 3 анкеты ДКШ")
        print("   🏆 4 заявки на награды")


async def main():
    print("🚀 Создание таблиц...")
    await create_tables()
    print("📦 Загрузка начальных данных...")
    await seed_data()
    print("🎉 Готово!")


if __name__ == "__main__":
    asyncio.run(main())
