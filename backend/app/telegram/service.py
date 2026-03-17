import logging

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.booking.models import Booking, Slot
from app.config import settings
from app.telegram.models import TelegramUser
from app.users.models import User

logger = logging.getLogger(__name__)

TELEGRAM_API_URL = "https://api.telegram.org/bot{token}"


class TelegramService:

    def __init__(self, db: AsyncSession):
        self.db = db
        self.token = settings.TELEGRAM_BOT_TOKEN
        self.api_url = TELEGRAM_API_URL.format(token=self.token)

    async def send_message(self, chat_id: int, text: str) -> bool:
        if not self.token:
            logger.warning("Telegram bot token not configured, skipping message")
            return False

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/sendMessage",
                    json={
                        "chat_id": chat_id,
                        "text": text,
                        "parse_mode": "HTML",
                    },
                    timeout=10.0,
                )
                if response.status_code == 200:
                    return True
                logger.error(f"Telegram API error: {response.status_code} {response.text}")
                return False
        except Exception as e:
            logger.error(f"Failed to send telegram message: {e}")
            return False

    async def notify_booking_confirmed(self, user: User, slot: Slot) -> bool:
        tg_user = await self._get_telegram_user(user.id)
        if not tg_user:
            return False

        text = (
            f"<b>Бронирование подтверждено</b>\n\n"
            f"Дата: {slot.date.isoformat()}\n"
            f"Время: {slot.start_time.strftime('%H:%M')}–{slot.end_time.strftime('%H:%M')}\n"
            f"Продолжительность: {slot.duration_minutes} мин."
        )
        return await self.send_message(tg_user.chat_id, text)

    async def notify_rating_change(self, user: User, points: int, reason: str) -> bool:
        tg_user = await self._get_telegram_user(user.id)
        if not tg_user:
            return False

        sign = "+" if points > 0 else ""
        text = (
            f"<b>Изменение рейтинга</b>\n\n"
            f"Баллы: {sign}{points}\n"
            f"Причина: {reason}\n"
            f"Текущий рейтинг: {user.rating_score}"
        )
        return await self.send_message(tg_user.chat_id, text)

    async def handle_update(self, update: dict) -> None:
        message = update.get("message")
        if not message:
            return

        chat_id = message.get("chat", {}).get("id")
        text = message.get("text", "").strip()
        username = message.get("from", {}).get("username")

        if not chat_id or not text:
            return

        if text == "/start":
            await self._handle_start(chat_id, username)
        elif text == "/status":
            await self._handle_status(chat_id)
        elif text == "/bookings":
            await self._handle_bookings(chat_id)
        else:
            await self.send_message(
                chat_id,
                "Доступные команды:\n/start — привязка аккаунта\n/status — статус и рейтинг\n/bookings — мои бронирования",
            )

    async def _handle_start(self, chat_id: int, username: str | None) -> None:
        result = await self.db.execute(
            select(TelegramUser).where(TelegramUser.chat_id == chat_id)
        )
        tg_user = result.scalar_one_or_none()

        if tg_user:
            await self.send_message(
                chat_id,
                "Ваш аккаунт уже привязан к системе CIFRA. Используйте /status для проверки.",
            )
            return

        await self.send_message(
            chat_id,
            "Добро пожаловать в бот CIFRA!\n\n"
            "Для привязки аккаунта укажите ваш Telegram-username в профиле на сайте CIFRA, "
            "а затем отправьте команду /start ещё раз.",
        )

        # Try to find user by telegram username
        if username:
            result = await self.db.execute(
                select(User).where(User.telegram == f"@{username}")
            )
            user = result.scalar_one_or_none()
            if not user:
                result = await self.db.execute(
                    select(User).where(User.telegram == username)
                )
                user = result.scalar_one_or_none()

            if user:
                tg_user = TelegramUser(
                    user_id=user.id,
                    chat_id=chat_id,
                    username=username,
                )
                self.db.add(tg_user)
                await self.db.flush()
                await self.send_message(
                    chat_id,
                    f"Аккаунт успешно привязан! Привет, {user.first_name}!\n"
                    f"Используйте /status для просмотра информации.",
                )

    async def _handle_status(self, chat_id: int) -> None:
        tg_user = await self._get_telegram_user_by_chat(chat_id)
        if not tg_user:
            await self.send_message(chat_id, "Аккаунт не привязан. Используйте /start.")
            return

        result = await self.db.execute(select(User).where(User.id == tg_user.user_id))
        user = result.scalar_one_or_none()
        if not user:
            await self.send_message(chat_id, "Пользователь не найден в системе.")
            return

        text = (
            f"<b>Статус аккаунта</b>\n\n"
            f"Имя: {user.first_name} {user.last_name}\n"
            f"Email: {user.email}\n"
            f"Роль: {user.role}\n"
            f"Рейтинг: {user.rating_score}\n"
            f"Верифицирован: {'Да' if user.is_verified else 'Нет'}"
        )
        await self.send_message(chat_id, text)

    async def _handle_bookings(self, chat_id: int) -> None:
        tg_user = await self._get_telegram_user_by_chat(chat_id)
        if not tg_user:
            await self.send_message(chat_id, "Аккаунт не привязан. Используйте /start.")
            return

        result = await self.db.execute(
            select(Booking)
            .where(Booking.user_id == tg_user.user_id, Booking.status == "confirmed")
            .order_by(Booking.created_at.desc())
            .limit(5)
        )
        bookings = result.scalars().all()

        if not bookings:
            await self.send_message(chat_id, "У вас нет активных бронирований.")
            return

        lines = ["<b>Ваши бронирования</b>\n"]
        for b in bookings:
            slot = b.slot
            if slot:
                lines.append(
                    f"• {slot.date.isoformat()} "
                    f"{slot.start_time.strftime('%H:%M')}–{slot.end_time.strftime('%H:%M')} "
                    f"({b.status})"
                )
        await self.send_message(chat_id, "\n".join(lines))

    async def _get_telegram_user(self, user_id) -> TelegramUser | None:
        result = await self.db.execute(
            select(TelegramUser).where(
                TelegramUser.user_id == user_id,
                TelegramUser.is_active == True,
            )
        )
        return result.scalar_one_or_none()

    async def _get_telegram_user_by_chat(self, chat_id: int) -> TelegramUser | None:
        result = await self.db.execute(
            select(TelegramUser).where(
                TelegramUser.chat_id == chat_id,
                TelegramUser.is_active == True,
            )
        )
        return result.scalar_one_or_none()
