"""Supabase (Postgres) drayveri — database.py bilan BIR XIL funksiya nomlari.

app/store.py qaysi drayverni ishlatishni .env ga qarab tanlaydi:
  SUPABASE_URL va SUPABASE_SERVICE_KEY bo'lsa -> shu modul,
  bo'lmasa -> database.py (SQLite).

Backend service_role kaliti bilan ishlaydi (RLS'ni chetlab o'tadi) —
bu webhook kabi "tizim" yozuvlari uchun to'g'ri yondashuv; frontend esa
anon kalit + Auth bilan faqat o'z biznesini ko'radi.

Eslatma: jadval nomlari schema.sql dagidek (reply_templates, internal_notes),
lekin funksiyalar database.py bilan bir xil natija (dict) qaytaradi,
shuning uchun main.py/ai.py ga o'zgartirish kerak emas.
"""

import os
from datetime import datetime, timezone
from typing import Optional

import httpx
from supabase import Client, ClientOptions, create_client

_client: Optional[Client] = None
_business_id: Optional[str] = None  # default biznes (hozircha single-tenant)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _sb() -> Client:
    """Supabase klientini qaytaradi (birinchi chaqiruvda yaratadi).

    httpx_client'ga retryli transport beramiz: ba'zi tarmoqlarda/eski
    LibreSSL bilan (macOS'ning tizim Python'ida keng tarqalgan) uzoq
    turgan keep-alive ulanishlar "ReadError: Resource temporarily
    unavailable" bilan tasodifiy uzilib qoladi — transport darajasidagi
    avtomatik retry buni sezilarli darajada kamaytiradi.
    """
    global _client
    if _client is None:
        transport = httpx.HTTPTransport(retries=3)
        _client = create_client(
            os.environ["SUPABASE_URL"],
            os.environ["SUPABASE_SERVICE_KEY"],
            options=ClientOptions(
                httpx_client=httpx.Client(transport=transport, timeout=30)
            ),
        )
    return _client


def _biz() -> str:
    """Default biznes ID (schema.sql 'Demo biznes'ni yaratadi)."""
    global _business_id
    if _business_id is None:
        rows = _sb().table("businesses").select("id").order("created_at").limit(1).execute().data
        if not rows:
            raise RuntimeError(
                "Supabase'da biznes topilmadi — avval schema.sql ni SQL Editor'da ishga tushiring"
            )
        _business_id = rows[0]["id"]
    return _business_id


def init_db() -> None:
    """Ulanishni tekshiradi. Jadvallar schema.sql orqali yaratilgan bo'lishi kerak."""
    _biz()
    print(f"[supabase] Ulandi, biznes ID: {_business_id}")


# ---------- O'qish ----------

def list_conversations() -> list:
    rows = (
        _sb().table("conversation_overview")
        .select("*")
        .order("last_message_at", desc=True)
        .execute()
        .data
    )
    return rows  # view ustun nomlari database.py chiqishi bilan bir xil


def list_messages(conversation_id: str) -> list:
    return (
        _sb().table("messages")
        .select("id, conversation_id, sender, text, sent_at, kind, media_file_id, media_url, transcript")
        .eq("conversation_id", conversation_id)
        .order("sent_at")
        .execute()
        .data
    )


def get_recent_messages(conversation_id: str, limit: int = 5) -> list:
    rows = (
        _sb().table("messages")
        .select("sender, text")
        .eq("conversation_id", conversation_id)
        .order("sent_at", desc=True)
        .limit(limit)
        .execute()
        .data
    )
    return list(reversed(rows))


def get_cached_analysis(message_id: str) -> Optional[dict]:
    rows = (
        _sb().table("analyses")
        .select("sentiment, intent, suggested_reply")
        .eq("message_id", message_id)
        .execute()
        .data
    )
    return rows[0] if rows else None


def get_telegram_chat_id(conversation_id: str) -> Optional[int]:
    rows = (
        _sb().table("conversations")
        .select("customers(telegram_chat_id)")
        .eq("id", conversation_id)
        .execute()
        .data
    )
    if rows and rows[0].get("customers"):
        return rows[0]["customers"]["telegram_chat_id"]
    return None


def get_customer_channel_info(conversation_id: str) -> Optional[dict]:
    """Javob yuborish uchun kanal turi va shu kanaldagi mijoz ID'sini topadi."""
    rows = (
        _sb().table("conversations")
        .select("customers(channel, telegram_chat_id, platform_user_id)")
        .eq("id", conversation_id)
        .execute()
        .data
    )
    if rows and rows[0].get("customers"):
        return rows[0]["customers"]
    return None


# ---------- Yozish ----------

def find_or_create_customer(telegram_chat_id: int, name: str, username: Optional[str]) -> dict:
    sb = _sb()
    existing = (
        sb.table("customers")
        .select("id, conversations(id)")
        .eq("telegram_chat_id", telegram_chat_id)
        .eq("business_id", _biz())
        .execute()
        .data
    )
    if existing and existing[0].get("conversations"):
        return {
            "customer_id": existing[0]["id"],
            "conversation_id": existing[0]["conversations"][0]["id"],
        }

    customer = (
        sb.table("customers")
        .insert({
            "business_id": _biz(),
            "name": name,
            "channel": "telegram",
            "username": username,
            "telegram_chat_id": telegram_chat_id,
        })
        .execute()
        .data[0]
    )
    conversation = (
        sb.table("conversations")
        .insert({
            "business_id": _biz(),
            "customer_id": customer["id"],
            "last_message": "",
            "last_message_at": now_iso(),
            "unread_count": 0,
        })
        .execute()
        .data[0]
    )
    return {"customer_id": customer["id"], "conversation_id": conversation["id"]}


def find_or_create_meta_customer(
    channel: str, platform_user_id: str, name: str, username: Optional[str]
) -> dict:
    """Facebook/Instagram'dan kelgan mijozni topadi, bo'lmasa yangi yaratadi."""
    sb = _sb()
    existing = (
        sb.table("customers")
        .select("id, conversations(id)")
        .eq("platform_user_id", platform_user_id)
        .eq("business_id", _biz())
        .execute()
        .data
    )
    if existing and existing[0].get("conversations"):
        return {
            "customer_id": existing[0]["id"],
            "conversation_id": existing[0]["conversations"][0]["id"],
        }

    customer = (
        sb.table("customers")
        .insert({
            "business_id": _biz(),
            "name": name,
            "channel": channel,
            "username": username,
            "platform_user_id": platform_user_id,
        })
        .execute()
        .data[0]
    )
    conversation = (
        sb.table("conversations")
        .insert({
            "business_id": _biz(),
            "customer_id": customer["id"],
            "last_message": "",
            "last_message_at": now_iso(),
            "unread_count": 0,
        })
        .execute()
        .data[0]
    )
    return {"customer_id": customer["id"], "conversation_id": conversation["id"]}


def add_message(
    conversation_id: str,
    sender: str,
    text: str,
    kind: str = "text",
    media_file_id: Optional[str] = None,
    media_url: Optional[str] = None,
    transcript: Optional[str] = None,
) -> dict:
    sb = _sb()
    message = (
        sb.table("messages")
        .insert({
            "business_id": _biz(),
            "conversation_id": conversation_id,
            "sender": sender,
            "text": text,
            "kind": kind,
            "media_file_id": media_file_id,
            "media_url": media_url,
            "transcript": transcript,
        })
        .execute()
        .data[0]
    )

    update = {"last_message": text, "last_message_at": message["sent_at"]}
    if sender == "customer":
        # unread_count'ni atomik oshirish uchun avval o'qib olamiz
        # (kichik hajmda yetarli; keyinchalik Postgres funksiyaga o'tkazsa bo'ladi)
        current = (
            sb.table("conversations").select("unread_count").eq("id", conversation_id)
            .execute().data[0]["unread_count"]
        )
        update["unread_count"] = current + 1
    else:
        update["unread_count"] = 0
    sb.table("conversations").update(update).eq("id", conversation_id).execute()

    return message


def save_analysis(message_id: str, conversation_id: str, analysis: dict, source: str) -> None:
    _sb().table("analyses").upsert({
        "message_id": message_id,
        "business_id": _biz(),
        "conversation_id": conversation_id,
        "sentiment": analysis["sentiment"],
        "intent": analysis["intent"],
        "suggested_reply": analysis["suggested_reply"],
        "source": source,
    }).execute()


def mark_read(conversation_id: str) -> None:
    _sb().table("conversations").update({"unread_count": 0}).eq("id", conversation_id).execute()


def assign_conversation(conversation_id: str, operator_id: Optional[str]) -> None:
    """Suhbatni operatorga tayinlaydi (operator_id=None — tayinlashni bekor qiladi)."""
    _sb().table("conversations").update(
        {"assigned_operator_id": operator_id}
    ).eq("id", conversation_id).execute()


# ---------- Shablonlar ----------

def list_templates() -> list:
    return (
        _sb().table("reply_templates")
        .select("id, title, text")
        .eq("business_id", _biz())
        .order("created_at")
        .execute()
        .data
    )


def create_template(title: str, text: str) -> dict:
    row = (
        _sb().table("reply_templates")
        .insert({"business_id": _biz(), "title": title, "text": text})
        .execute()
        .data[0]
    )
    return {"id": row["id"], "title": row["title"], "text": row["text"]}


def delete_template(template_id: str) -> None:
    _sb().table("reply_templates").delete().eq("id", template_id).execute()


# ---------- Ichki eslatmalar ----------

def list_notes(conversation_id: str) -> list:
    return (
        _sb().table("internal_notes")
        .select("id, author, text, created_at")
        .eq("conversation_id", conversation_id)
        .order("created_at")
        .execute()
        .data
    )


def add_note(conversation_id: str, author: str, text: str) -> dict:
    row = (
        _sb().table("internal_notes")
        .insert({
            "business_id": _biz(),
            "conversation_id": conversation_id,
            "author": author,
            "text": text,
        })
        .execute()
        .data[0]
    )
    return {
        "id": row["id"],
        "author": row["author"],
        "text": row["text"],
        "created_at": row["created_at"],
    }


# ---------- Statistika ----------

def get_stats() -> dict:
    """Barcha agregatlar Postgres'dagi get_stats() funksiyasida (schema.sql)."""
    return _sb().rpc("get_stats").execute().data


# ---------- Biznes profili ----------

def get_business() -> dict:
    row = (
        _sb().table("businesses")
        .select("name, working_hours, plan")
        .eq("id", _biz())
        .execute()
        .data[0]
    )
    return {
        "name": row["name"],
        "workingHours": row.get("working_hours"),
        "plan": row.get("plan", "free"),
    }


def update_business(name: Optional[str], working_hours: Optional[dict]) -> dict:
    update: dict = {}
    if name is not None:
        update["name"] = name
    if working_hours is not None:
        update["working_hours"] = working_hours
    if update:
        _sb().table("businesses").update(update).eq("id", _biz()).execute()
    return get_business()


def set_plan(plan: str) -> None:
    """Faqat Stripe webhook chaqiradi — foydalanuvchi o'zi to'g'ridan-to'g'ri o'zgartira olmaydi."""
    _sb().table("businesses").update({"plan": plan}).eq("id", _biz()).execute()


# ---------- Jamoa ----------

def list_team() -> list:
    rows = (
        _sb().table("operators")
        .select("id, full_name, role, status")
        .eq("business_id", _biz())
        .order("created_at")
        .execute()
        .data
    )
    return [
        {"id": r["id"], "fullName": r["full_name"], "role": r["role"], "status": r["status"]}
        for r in rows
    ]


def invite_team_member(email: str, full_name: Optional[str]) -> dict:
    """Supabase Admin API orqali haqiqiy taklif xati yuboradi.

    Havolani bosgach foydalanuvchi avtomatik sessiya bilan /inbox'ga tushadi
    (Supabase invite/magic-link standart xatti-harakati). operators jadvaliga
    yozuv schema.sql'dagi handle_new_user trigger orqali avtomatik qo'shiladi.
    """
    frontend_url = os.getenv("API_URL", "http://localhost:3000")
    result = _sb().auth.admin.invite_user_by_email(
        email,
        {"data": {"full_name": full_name or ""}, "redirect_to": f"{frontend_url}/inbox"},
    )
    return {"id": result.user.id, "email": result.user.email}
