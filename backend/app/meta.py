"""Meta (Facebook Messenger + Instagram DM) bilan ishlash.

Muhim texnik nuqta: Instagram Business akkaunt har doim bitta Facebook
Page'ga ulangan bo'ladi va IKKALASI HAM bitta Page Access Token bilan
ishlaydi — shuning uchun bu yerda ikkita alohida integratsiya emas,
bitta Meta App + bitta Page ulanishi orqali ikkala kanal ham yoqiladi.

Meta webhook'lari deyarli bir xil formatda keladi, faqat tashqi
"object" maydoni farq qiladi:
  - "page"      -> Facebook Messenger xabari
  - "instagram" -> Instagram DM

Ikki yo'nalish:
1. KIRUVCHI: Meta bizning /webhook/meta manzilimizga POST yuboradi
   (webhook Meta App sozlamalarida ro'yxatdan o'tkazilishi kerak).
2. CHIQUVCHI: biz Graph API'ning /me/messages endpointiga so'rov
   yuboramiz (Page Access Token bilan autentifikatsiya).

Webhook sozlash (Meta App tayyor bo'lgach, docs/meta-setup.md'ga qarang):
  Callback URL: https://<sizning-domen>/webhook/meta
  Verify Token: .env dagi META_VERIFY_TOKEN bilan bir xil bo'lishi kerak

Lokal sinash uchun ngrok kabi tunnel xizmati kerak (Telegram'dagidek).
"""

import os
from typing import Optional

import httpx

GRAPH_API_VERSION = "v21.0"
GRAPH_API_BASE = f"https://graph.facebook.com/{GRAPH_API_VERSION}"


def verify_webhook(mode: Optional[str], token: Optional[str], challenge: Optional[str]) -> Optional[str]:
    """Meta webhook ro'yxatdan o'tish so'rovini tekshiradi (GET /webhook/meta).

    Meta App sozlamalarida "Verify and Save" bosilganda shu funksiya chaqiriladi.
    Token mos kelsa challenge qaytariladi (Meta buni talab qiladi), aks holda None.
    """
    expected = os.getenv("META_VERIFY_TOKEN")
    if mode == "subscribe" and expected and token == expected:
        return challenge
    return None


def _parse_messaging_event(entry_id: str, platform: str, event: dict) -> Optional[dict]:
    """Bitta 'messaging' voqeasini bizga kerakli formatga o'giradi.

    Meta bir nechta voqea turini yuboradi (xabar, "read", "delivery" va h.k.) —
    bizga faqat matnli xabar ("message") kerak, qolganini o'tkazib yuboramiz.
    """
    message = event.get("message")
    if not message or message.get("is_echo"):
        # is_echo — biznes o'zi yuborgan xabarning nusxasi, qayta saqlamaymiz
        return None

    text = message.get("text")
    if not text:
        return None  # hozircha faqat matn qo'llab-quvvatlanadi (rasm/ovoz keyingi bosqichda)

    return {
        "platform": platform,  # "facebook" | "instagram"
        "page_id": entry_id,
        "sender_id": event["sender"]["id"],
        "text": text,
    }


def parse_webhook_event(body: dict) -> list[dict]:
    """Meta webhook POST tanasidan barcha xabarlarni ajratib oladi.

    Bitta so'rovda bir nechta entry/xabar kelishi mumkin, shuning uchun
    ro'yxat qaytaramiz (Telegram'da har doim bitta update, farqi shu).
    """
    object_type = body.get("object")
    if object_type == "page":
        platform = "facebook"
    elif object_type == "instagram":
        platform = "instagram"
    else:
        return []  # bizga tegishli bo'lmagan webhook turi

    results = []
    for entry in body.get("entry", []):
        entry_id = entry.get("id", "")
        for event in entry.get("messaging", []):
            parsed = _parse_messaging_event(entry_id, platform, event)
            if parsed:
                results.append(parsed)
    return results


def send_message(recipient_id: str, text: str, page_access_token: Optional[str] = None) -> bool:
    """Mijozga Messenger yoki Instagram orqali javob yuboradi.

    Ikkala kanal ham bir xil Graph API endpointidan foydalanadi —
    qaysi platformaligini emas, qaysi Page tokenini ishlatishni bilish kifoya.
    """
    token = page_access_token or os.getenv("FACEBOOK_PAGE_ACCESS_TOKEN")
    if not token:
        print("[meta] FACEBOOK_PAGE_ACCESS_TOKEN yo'q — yuborish o'tkazib yuborildi (dev rejim)")
        return False

    try:
        response = httpx.post(
            f"{GRAPH_API_BASE}/me/messages",
            params={"access_token": token},
            json={"recipient": {"id": recipient_id}, "message": {"text": text}},
            timeout=10,
        )
        response.raise_for_status()
        return True
    except httpx.HTTPError as error:
        print(f"[meta] Yuborishda xato: {error}")
        return False
