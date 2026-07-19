"""Telegram Bot API bilan ishlash.

Ikki yo'nalish:
1. KIRUVCHI: Telegram bizning /telegram/webhook manzilimizga POST yuboradi
   (buning uchun botga webhook o'rnatilishi kerak — pastdagi izohga qarang).
2. CHIQUVCHI: biz Telegram'ning sendMessage API'siga so'rov yuboramiz.

Webhook o'rnatish (bot token olingandan keyin, terminalda bir marta):
  curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<sizning-domen>/telegram/webhook"

Lokal kompyuterda sinash uchun ngrok kabi tunnel xizmati kerak bo'ladi,
chunki Telegram faqat internetdagi https manzilga yubora oladi.
"""

import os
from typing import Optional

import httpx


def _parse_media(message: dict) -> Optional[dict]:
    """Xabardagi media turini aniqlaydi va {kind, file_id, text} qaytaradi.

    Telegram media tuzilishlari (qisqartirilgan):
      photo:   "photo": [{file_id, width...}, ...]  — o'lchamlar ro'yxati, oxirgisi eng katta
      voice:   "voice": {file_id, duration}
      video:   "video": {file_id, duration}
      sticker: "sticker": {file_id, emoji}
    """
    caption = message.get("caption", "")

    if "photo" in message:
        sizes = message["photo"]
        return {"kind": "photo", "file_id": sizes[-1]["file_id"],
                "text": caption or "📷 Rasm"}
    if "voice" in message:
        return {"kind": "voice", "file_id": message["voice"]["file_id"],
                "text": caption or "🎤 Ovozli xabar"}
    if "video" in message:
        return {"kind": "video", "file_id": message["video"]["file_id"],
                "text": caption or "🎬 Video"}
    if "sticker" in message:
        emoji = message["sticker"].get("emoji", "🙂")
        return {"kind": "sticker", "file_id": message["sticker"]["file_id"],
                "text": emoji}
    return None


def parse_update(update: dict) -> Optional[dict]:
    """Telegram'dan kelgan JSON (update)dan bizga kerakli qismlarni ajratib oladi.

    Matnli xabar tuzilishi (qisqartirilgan):
    {
      "message": {
        "chat": {"id": 123456, "first_name": "Dilnoza", "username": "dilnoza_k"},
        "text": "Salom!"
      }
    }
    .get() ishlatamiz — kalit bo'lmasa xato bermasdan None qaytaradi.

    Lokal sinov uchun qo'shimcha (haqiqiy Telegram'da bo'lmaydi):
      "x_demo_url"        — media uchun to'g'ridan-to'g'ri URL
      "x_demo_transcript" — ovozli xabarning "tayyor" transkripti
    """
    message = update.get("message")
    if not message:
        return None  # bu boshqa turdagi update (masalan, tahrirlangan xabar) — o'tkazib yuboramiz

    chat = message.get("chat", {})
    chat_id = chat.get("id")
    if not chat_id:
        return None

    text = message.get("text")
    media = _parse_media(message)
    if not text and not media:
        return None  # qo'llab-quvvatlanmaydigan tur (masalan, lokatsiya)

    first_name = chat.get("first_name", "")
    last_name = chat.get("last_name", "")
    name = (first_name + " " + last_name).strip() or "Nomsiz mijoz"
    username = chat.get("username")

    result = {
        "chat_id": chat_id,
        "name": name,
        "username": "@" + username if username else None,
        "text": text or media["text"],
        "kind": media["kind"] if media else "text",
        "media_file_id": media["file_id"] if media else None,
        "media_url": message.get("x_demo_url"),          # faqat lokal sinov uchun
        "transcript": message.get("x_demo_transcript"),  # faqat lokal sinov uchun
        # AI tahlil uchun "haqiqiy matn": matn > izoh (caption) > transkript
        "ai_text": text or message.get("caption") or message.get("x_demo_transcript"),
    }
    return result


def transcribe_voice(file_id: str) -> Optional[str]:
    """Ovozli xabarni matnga aylantirish (Speech-to-Text).

    TODO: STT provayderi ulanadi (masalan, OpenAI Whisper API):
      1. get_file_path(file_id) bilan audioni yuklab olish
      2. Whisper'ga yuborib matn olish
    Hozircha None — UI'da faqat audio pleyer ko'rinadi, transkript bo'lmaydi.
    """
    return None


def get_file_path(file_id: str) -> Optional[str]:
    """Telegram getFile API'dan faylning serverdagi yo'lini oladi.

    Media proxy (main.py dagi /api/media/...) shu yo'l orqali faylni yuklab
    brauzerga uzatadi — bot token hech qachon frontend'ga chiqmaydi.
    """
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        return None
    try:
        response = httpx.get(
            f"https://api.telegram.org/bot{token}/getFile",
            params={"file_id": file_id},
            timeout=10,
        )
        response.raise_for_status()
        return response.json()["result"]["file_path"]
    except (httpx.HTTPError, KeyError) as error:
        print(f"[telegram] getFile xatosi: {error}")
        return None


def send_message(chat_id: int, text: str) -> bool:
    """Mijozga Telegram orqali javob yuboradi. Token yo'q bo'lsa shunchaki o'tkazib yuboradi."""
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        print("[telegram] TELEGRAM_BOT_TOKEN yo'q — yuborish o'tkazib yuborildi (dev rejim)")
        return False

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    try:
        response = httpx.post(url, json={"chat_id": chat_id, "text": text}, timeout=10)
        response.raise_for_status()
        return True
    except httpx.HTTPError as error:
        print(f"[telegram] Yuborishda xato: {error}")
        return False
