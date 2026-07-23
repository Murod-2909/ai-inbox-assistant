"""SQLite baza bilan ishlash.

Hozircha SQLite ishlatamiz — o'rnatish talab qilmaydi, bitta fayl.
Supabase (Postgres)ga o'tganda faqat shu modul almashtiriladi,
qolgan kod o'zgarmaydi — modullarga bo'lishning foydasi shu.

Python tushunchalari:
- sqlite3.Row — qator ustunlariga nomi bo'yicha murojaat qilish imkonini beradi,
  biz uni dict() bilan oddiy lug'atga aylantiramiz.
- Har bir funksiya bitta ish qiladi va dict yoki list qaytaradi.
"""

import json
import os
import sqlite3
import uuid
from datetime import datetime, timezone
from typing import Optional

DATABASE_PATH = os.getenv("DATABASE_PATH", "inbox.db")


def get_connection() -> sqlite3.Connection:
    """Bazaga ulanish ochadi. row_factory=Row — natijalarni lug'atga o'xshatib beradi."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def now_iso() -> str:
    """Hozirgi vaqt ISO formatda (masalan '2026-07-17T12:00:00+00:00')."""
    return datetime.now(timezone.utc).isoformat()


def new_id() -> str:
    """Takrorlanmas ID yaratadi (uuid4 — tasodifiy 32 belgili satr)."""
    return uuid.uuid4().hex


def init_db() -> None:
    """Jadvallarni yaratadi (agar hali yo'q bo'lsa) va demo ma'lumot qo'shadi."""
    conn = get_connection()
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            channel TEXT NOT NULL DEFAULT 'telegram',
            username TEXT,
            telegram_chat_id INTEGER UNIQUE,
            -- Facebook/Instagram foydalanuvchi ID'si (PSID/IGSID) — Telegram'dan
            -- farqli, matn sifatida keladi, shuning uchun alohida ustun
            platform_user_id TEXT UNIQUE
        );

        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            customer_id TEXT NOT NULL REFERENCES customers(id),
            last_message TEXT NOT NULL DEFAULT '',
            last_message_at TEXT NOT NULL,
            unread_count INTEGER NOT NULL DEFAULT 0,
            assigned_operator_id TEXT
        );

        -- kind: text | photo | voice | video | sticker
        -- media_file_id: Telegram'dagi fayl ID (media proxy orqali yuklab olinadi)
        -- media_url: to'g'ridan-to'g'ri URL (demo/sinov uchun)
        -- transcript: ovozli xabarning matnga aylantirilgan varianti (STT)
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL REFERENCES conversations(id),
            sender TEXT NOT NULL CHECK (sender IN ('customer', 'business')),
            text TEXT NOT NULL,
            sent_at TEXT NOT NULL,
            kind TEXT NOT NULL DEFAULT 'text',
            media_file_id TEXT,
            media_url TEXT,
            transcript TEXT
        );

        -- AI tahlil keshi: har bir xabar FAQAT BIR MARTA tahlil qilinadi
        -- (docs/ai-strategy.md, 1-band). message_id — kesh kaliti.
        CREATE TABLE IF NOT EXISTS analyses (
            message_id TEXT PRIMARY KEY REFERENCES messages(id),
            conversation_id TEXT NOT NULL,
            sentiment TEXT NOT NULL,
            intent TEXT NOT NULL,
            suggested_reply TEXT NOT NULL,
            source TEXT NOT NULL DEFAULT 'heuristic',
            created_at TEXT NOT NULL
        );

        -- Tezkor javob shablonlari (operator bir bosishda ishlatadi)
        CREATE TABLE IF NOT EXISTS templates (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        -- Ichki eslatmalar: operatorlar orasidagi izohlar, mijoz ko'rmaydi
        CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL REFERENCES conversations(id),
            author TEXT NOT NULL DEFAULT 'Operator',
            text TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        -- Biznes sozlamalari: kalit-qiymat, qiymat JSON satr sifatida saqlanadi
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        """
    )
    conn.commit()
    _ensure_new_columns(conn)
    seed_demo_data(conn)
    conn.close()


def _ensure_new_columns(conn: sqlite3.Connection) -> None:
    """Eski baza faylida yangi ustunlar bo'lmasa qo'shadi (oddiy migratsiya).

    SQLite'da "ustun bormi?" tekshiruvi o'rniga ALTER TABLE'ni sinab ko'ramiz —
    ustun allaqachon mavjud bo'lsa xato beradi, biz uni e'tiborsiz qoldiramiz.
    """
    new_columns = [
        "ALTER TABLE messages ADD COLUMN kind TEXT NOT NULL DEFAULT 'text'",
        "ALTER TABLE messages ADD COLUMN media_file_id TEXT",
        "ALTER TABLE messages ADD COLUMN media_url TEXT",
        "ALTER TABLE messages ADD COLUMN transcript TEXT",
    ]
    for statement in new_columns:
        try:
            conn.execute(statement)
        except sqlite3.OperationalError:
            pass  # ustun allaqachon bor
    conn.commit()


def seed_templates(conn: sqlite3.Connection) -> None:
    """Boshlang'ich javob shablonlari (bo'sh bo'lsagina qo'shiladi)."""
    count = conn.execute("SELECT COUNT(*) FROM templates").fetchone()[0]
    if count > 0:
        return
    defaults = [
        ("Salomlashish", "Assalomu alaykum! Xush kelibsiz, sizga qanday yordam bera olamiz?"),
        ("Ish vaqti", "Ish vaqtimiz: dushanba–shanba, 9:00 dan 18:00 gacha."),
        ("Kutish", "Xabaringizni oldik! Mutaxassisimiz tez orada javob beradi."),
        ("Rahmat", "Murojaatingiz uchun rahmat! Yana savollaringiz bo'lsa, bemalol yozing."),
    ]
    for title, text in defaults:
        conn.execute(
            "INSERT INTO templates (id, title, text, created_at) VALUES (?, ?, ?, ?)",
            (new_id(), title, text, now_iso()),
        )
    conn.commit()


def seed_demo_data(conn: sqlite3.Connection) -> None:
    """Baza bo'sh bo'lsa, frontend'dagi mock'larga o'xshash demo ma'lumot qo'shadi."""
    seed_templates(conn)
    count = conn.execute("SELECT COUNT(*) FROM customers").fetchone()[0]
    if count > 0:
        return  # allaqachon ma'lumot bor — hech narsa qilmaymiz

    demo = [
        # (ism, username, xabar matni, sentiment, intent, javob taklifi)
        (
            "Dilnoza Karimova", "@dilnoza_k",
            "Assalomu alaykum, ertaga soat 15:00 ga yozilsam bo'ladimi?",
            "neutral", "order",
            "Assalomu alaykum, Dilnoza! Albatta, ertaga 15:00 bo'sh. Sizni yozib qo'ydik. 😊",
        ),
        (
            "Jasur Toshpo'latov", "@jasur_t",
            "Buyurtmam 3 kundan beri kelmayapti, bu qanaqasi?!",
            "negative", "complaint",
            "Jasur aka, noqulaylik uchun uzr. Buyurtma raqamingizni yuborsangiz, hoziroq tekshiramiz.",
        ),
        (
            "Madina Rahimova", "@madina_r",
            "Kursning narxi qancha? To'lovni bo'lib to'lasa bo'ladimi?",
            "neutral", "question",
            "Assalomu alaykum, Madina! Kurs narxi oyiga 800 000 so'm, 2 qismga bo'lib to'lash mumkin.",
        ),
        (
            "Otabek Nazarov", "@otabek_n",
            "Xizmatingiz juda yoqdi, rahmat! Do'stlarimga ham tavsiya qilaman 👍",
            "positive", "feedback",
            "Otabek aka, iliq so'zlaringiz uchun katta rahmat! Yana kutib qolamiz! 🙌",
        ),
    ]

    for name, username, text, sentiment, intent, reply in demo:
        customer_id = new_id()
        conversation_id = new_id()
        message_id = new_id()
        sent_at = now_iso()

        conn.execute(
            "INSERT INTO customers (id, name, channel, username) VALUES (?, ?, 'telegram', ?)",
            (customer_id, name, username),
        )
        conn.execute(
            "INSERT INTO conversations (id, customer_id, last_message, last_message_at, unread_count)"
            " VALUES (?, ?, ?, ?, 1)",
            (conversation_id, customer_id, text, sent_at),
        )
        conn.execute(
            "INSERT INTO messages (id, conversation_id, sender, text, sent_at)"
            " VALUES (?, ?, 'customer', ?, ?)",
            (message_id, conversation_id, text, sent_at),
        )
        conn.execute(
            "INSERT INTO analyses (message_id, conversation_id, sentiment, intent, suggested_reply, source, created_at)"
            " VALUES (?, ?, ?, ?, ?, 'seed', ?)",
            (message_id, conversation_id, sentiment, intent, reply, now_iso()),
        )

    conn.commit()


# ---------- O'qish funksiyalari ----------

def list_conversations() -> list:
    """Barcha suhbatlar, oxirgi xabari eng yangi bo'lganlari birinchi."""
    conn = get_connection()
    rows = conn.execute(
        """
        SELECT c.id, c.last_message, c.last_message_at, c.unread_count,
               c.assigned_operator_id,
               cu.id AS customer_id, cu.name, cu.channel, cu.username,
               a.sentiment, a.intent, a.suggested_reply
        FROM conversations c
        JOIN customers cu ON cu.id = c.customer_id
        -- Suhbatning ENG OXIRGI tahlili (xabar vaqti bo'yicha)
        LEFT JOIN analyses a ON a.message_id = (
            SELECT m.id FROM messages m
            JOIN analyses an ON an.message_id = m.id
            WHERE m.conversation_id = c.id
            ORDER BY m.sent_at DESC LIMIT 1
        )
        ORDER BY c.last_message_at DESC
        """
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def list_messages(conversation_id: str) -> list:
    """Bitta suhbatning barcha xabarlari, eski birinchi."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, conversation_id, sender, text, sent_at,"
        " kind, media_file_id, media_url, transcript FROM messages"
        " WHERE conversation_id = ? ORDER BY sent_at ASC",
        (conversation_id,),
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_recent_messages(conversation_id: str, limit: int = 5) -> list:
    """AI uchun kontekst: faqat oxirgi N ta xabar (token tejash — butun tarix emas)."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT sender, text FROM messages WHERE conversation_id = ?"
        " ORDER BY sent_at DESC LIMIT ?",
        (conversation_id, limit),
    ).fetchall()
    conn.close()
    return [dict(row) for row in reversed(rows)]  # eskidan yangiga tartiblab qaytaramiz


def get_cached_analysis(message_id: str) -> Optional[dict]:
    """Kesh tekshiruvi: bu xabar oldin tahlil qilinganmi?"""
    conn = get_connection()
    row = conn.execute(
        "SELECT sentiment, intent, suggested_reply FROM analyses WHERE message_id = ?",
        (message_id,),
    ).fetchone()
    conn.close()
    return dict(row) if row else None


# ---------- Yozish funksiyalari ----------

def find_or_create_customer(telegram_chat_id: int, name: str, username: Optional[str]) -> dict:
    """Telegram'dan kelgan mijozni topadi, bo'lmasa yangi yaratadi.

    Qaytaradi: {"customer_id": ..., "conversation_id": ...}
    """
    conn = get_connection()
    row = conn.execute(
        "SELECT cu.id AS customer_id, c.id AS conversation_id"
        " FROM customers cu JOIN conversations c ON c.customer_id = cu.id"
        " WHERE cu.telegram_chat_id = ?",
        (telegram_chat_id,),
    ).fetchone()

    if row:
        conn.close()
        return dict(row)

    customer_id = new_id()
    conversation_id = new_id()
    conn.execute(
        "INSERT INTO customers (id, name, channel, username, telegram_chat_id)"
        " VALUES (?, ?, 'telegram', ?, ?)",
        (customer_id, name, username, telegram_chat_id),
    )
    conn.execute(
        "INSERT INTO conversations (id, customer_id, last_message, last_message_at, unread_count)"
        " VALUES (?, ?, '', ?, 0)",
        (conversation_id, customer_id, now_iso()),
    )
    conn.commit()
    conn.close()
    return {"customer_id": customer_id, "conversation_id": conversation_id}


def find_or_create_meta_customer(
    channel: str, platform_user_id: str, name: str, username: Optional[str]
) -> dict:
    """Facebook/Instagram'dan kelgan mijozni topadi, bo'lmasa yangi yaratadi.

    find_or_create_customer'ning Meta uchun varianti — Telegram funksiyasi
    o'zgarishsiz qoladi (mavjud botlarni buzmaslik uchun).
    """
    conn = get_connection()
    row = conn.execute(
        "SELECT cu.id AS customer_id, c.id AS conversation_id"
        " FROM customers cu JOIN conversations c ON c.customer_id = cu.id"
        " WHERE cu.platform_user_id = ?",
        (platform_user_id,),
    ).fetchone()

    if row:
        conn.close()
        return dict(row)

    customer_id = new_id()
    conversation_id = new_id()
    conn.execute(
        "INSERT INTO customers (id, name, channel, username, platform_user_id)"
        " VALUES (?, ?, ?, ?, ?)",
        (customer_id, name, channel, username, platform_user_id),
    )
    conn.execute(
        "INSERT INTO conversations (id, customer_id, last_message, last_message_at, unread_count)"
        " VALUES (?, ?, '', ?, 0)",
        (conversation_id, customer_id, now_iso()),
    )
    conn.commit()
    conn.close()
    return {"customer_id": customer_id, "conversation_id": conversation_id}


def add_message(
    conversation_id: str,
    sender: str,
    text: str,
    kind: str = "text",
    media_file_id: Optional[str] = None,
    media_url: Optional[str] = None,
    transcript: Optional[str] = None,
) -> dict:
    """Xabarni saqlaydi va suhbatning 'oxirgi xabar' maydonlarini yangilaydi."""
    conn = get_connection()
    message_id = new_id()
    sent_at = now_iso()
    conn.execute(
        "INSERT INTO messages (id, conversation_id, sender, text, sent_at,"
        " kind, media_file_id, media_url, transcript) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (message_id, conversation_id, sender, text, sent_at,
         kind, media_file_id, media_url, transcript),
    )
    # Mijozdan kelgan xabar unread sonini oshiradi, biznes javobi 0 ga tushiradi
    if sender == "customer":
        conn.execute(
            "UPDATE conversations SET last_message = ?, last_message_at = ?,"
            " unread_count = unread_count + 1 WHERE id = ?",
            (text, sent_at, conversation_id),
        )
    else:
        conn.execute(
            "UPDATE conversations SET last_message = ?, last_message_at = ?, unread_count = 0"
            " WHERE id = ?",
            (text, sent_at, conversation_id),
        )
    conn.commit()
    conn.close()
    return {"id": message_id, "conversation_id": conversation_id, "sender": sender,
            "text": text, "sent_at": sent_at, "kind": kind,
            "media_file_id": media_file_id, "media_url": media_url,
            "transcript": transcript}


def save_analysis(message_id: str, conversation_id: str, analysis: dict, source: str) -> None:
    """Tahlil natijasini keshga yozadi (INSERT OR REPLACE — mavjud bo'lsa yangilaydi)."""
    conn = get_connection()
    conn.execute(
        "INSERT OR REPLACE INTO analyses"
        " (message_id, conversation_id, sentiment, intent, suggested_reply, source, created_at)"
        " VALUES (?, ?, ?, ?, ?, ?, ?)",
        (message_id, conversation_id, analysis["sentiment"], analysis["intent"],
         analysis["suggested_reply"], source, now_iso()),
    )
    conn.commit()
    conn.close()


def mark_read(conversation_id: str) -> None:
    """Operator suhbatni ochganda unread sonini 0 ga tushiradi."""
    conn = get_connection()
    conn.execute("UPDATE conversations SET unread_count = 0 WHERE id = ?", (conversation_id,))
    conn.commit()
    conn.close()


def assign_conversation(conversation_id: str, operator_id: Optional[str]) -> None:
    """Suhbatni operatorga tayinlaydi (operator_id=None — tayinlashni bekor qiladi)."""
    conn = get_connection()
    conn.execute(
        "UPDATE conversations SET assigned_operator_id = ? WHERE id = ?",
        (operator_id, conversation_id),
    )
    conn.commit()
    conn.close()


# ---------- Shablonlar ----------

def list_templates() -> list:
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, title, text FROM templates ORDER BY created_at ASC"
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def create_template(title: str, text: str) -> dict:
    conn = get_connection()
    template_id = new_id()
    conn.execute(
        "INSERT INTO templates (id, title, text, created_at) VALUES (?, ?, ?, ?)",
        (template_id, title, text, now_iso()),
    )
    conn.commit()
    conn.close()
    return {"id": template_id, "title": title, "text": text}


def delete_template(template_id: str) -> None:
    conn = get_connection()
    conn.execute("DELETE FROM templates WHERE id = ?", (template_id,))
    conn.commit()
    conn.close()


# ---------- Ichki eslatmalar ----------

def list_notes(conversation_id: str) -> list:
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, author, text, created_at FROM notes"
        " WHERE conversation_id = ? ORDER BY created_at ASC",
        (conversation_id,),
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def add_note(conversation_id: str, author: str, text: str) -> dict:
    conn = get_connection()
    note_id = new_id()
    created_at = now_iso()
    conn.execute(
        "INSERT INTO notes (id, conversation_id, author, text, created_at) VALUES (?, ?, ?, ?, ?)",
        (note_id, conversation_id, author, text, created_at),
    )
    conn.commit()
    conn.close()
    return {"id": note_id, "author": author, "text": text, "created_at": created_at}


# ---------- Statistika (Tahlil sahifasi uchun) ----------

def get_stats() -> dict:
    """Tahlil sahifasi uchun agregatlar — hammasi SQL bilan, AI'siz
    (docs/ai-strategy.md 5-band: statistika saqlangan tahlillardan hisoblanadi).
    """
    conn = get_connection()

    today = datetime.now(timezone.utc).date().isoformat()  # 'YYYY-MM-DD'
    today_messages = conn.execute(
        "SELECT COUNT(*) FROM messages WHERE sender='customer' AND sent_at LIKE ?",
        (today + "%",),
    ).fetchone()[0]

    unanswered = conn.execute(
        "SELECT COUNT(*) FROM conversations WHERE unread_count > 0"
    ).fetchone()[0]

    sentiment_rows = conn.execute(
        "SELECT sentiment, COUNT(*) AS n FROM analyses GROUP BY sentiment"
    ).fetchall()
    sentiment = {"positive": 0, "neutral": 0, "negative": 0}
    for row in sentiment_rows:
        sentiment[row["sentiment"]] = row["n"]

    intent_rows = conn.execute(
        "SELECT intent, COUNT(*) AS n FROM analyses GROUP BY intent ORDER BY n DESC"
    ).fetchall()
    intents = [{"intent": row["intent"], "count": row["n"]} for row in intent_rows]

    # Oxirgi 7 kun: mijoz xabarlari soni kun bo'yicha
    week_rows = conn.execute(
        "SELECT substr(sent_at, 1, 10) AS day, COUNT(*) AS n FROM messages"
        " WHERE sender='customer' AND sent_at >= date('now', '-6 days')"
        " GROUP BY day ORDER BY day ASC"
    ).fetchall()
    week = {row["day"]: row["n"] for row in week_rows}

    # O'rtacha javob vaqti (daqiqa): biznes javobi bilan undan oldingi
    # mijoz xabari orasidagi farqlarning o'rtachasi
    pairs = conn.execute(
        """
        SELECT m.sent_at AS reply_at,
               (SELECT MAX(prev.sent_at) FROM messages prev
                WHERE prev.conversation_id = m.conversation_id
                  AND prev.sender = 'customer' AND prev.sent_at < m.sent_at) AS asked_at
        FROM messages m WHERE m.sender = 'business'
        """
    ).fetchall()
    diffs = []
    for row in pairs:
        if row["asked_at"]:
            try:
                reply_time = datetime.fromisoformat(row["reply_at"])
                asked_time = datetime.fromisoformat(row["asked_at"])
                diffs.append((reply_time - asked_time).total_seconds() / 60)
            except ValueError:
                pass
    avg_response = round(sum(diffs) / len(diffs), 1) if diffs else None

    conn.close()
    return {
        "todayMessages": today_messages,
        "unanswered": unanswered,
        "avgResponseMinutes": avg_response,
        "sentiment": sentiment,
        "intents": intents,
        "week": week,
    }


def get_telegram_chat_id(conversation_id: str) -> Optional[int]:
    """Javob yuborish uchun suhbat egasining Telegram chat ID'sini topadi."""
    conn = get_connection()
    row = conn.execute(
        "SELECT cu.telegram_chat_id FROM conversations c"
        " JOIN customers cu ON cu.id = c.customer_id WHERE c.id = ?",
        (conversation_id,),
    ).fetchone()
    conn.close()
    return row["telegram_chat_id"] if row else None


def get_customer_channel_info(conversation_id: str) -> Optional[dict]:
    """Javob yuborish uchun kanal turi va shu kanaldagi mijoz ID'sini topadi.

    /api/conversations/{id}/reply shu funksiya orqali qaysi platformaga
    (Telegram/Facebook/Instagram) yuborishni aniqlaydi.
    """
    conn = get_connection()
    row = conn.execute(
        "SELECT cu.channel, cu.telegram_chat_id, cu.platform_user_id"
        " FROM conversations c JOIN customers cu ON cu.id = c.customer_id"
        " WHERE c.id = ?",
        (conversation_id,),
    ).fetchone()
    conn.close()
    return dict(row) if row else None


# ---------- Biznes profili ----------
# settings jadvali kalit-qiymat: 'business_name' -> oddiy satr,
# 'working_hours' -> JSON satr sifatida saqlanadi.

def get_business() -> dict:
    conn = get_connection()
    rows = conn.execute(
        "SELECT key, value FROM settings WHERE key IN ('business_name', 'working_hours')"
    ).fetchall()
    conn.close()
    values = {r["key"]: r["value"] for r in rows}
    return {
        "name": values.get("business_name", "Demo biznes"),
        "workingHours": json.loads(values["working_hours"]) if "working_hours" in values else None,
    }


def update_business(name: Optional[str], working_hours: Optional[dict]) -> dict:
    conn = get_connection()
    if name is not None:
        conn.execute(
            "INSERT INTO settings (key, value) VALUES ('business_name', ?)"
            " ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            (name,),
        )
    if working_hours is not None:
        conn.execute(
            "INSERT INTO settings (key, value) VALUES ('working_hours', ?)"
            " ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            (json.dumps(working_hours),),
        )
    conn.commit()
    conn.close()
    return get_business()


# ---------- Jamoa ----------
# SQLite (demo/lokal) rejimida haqiqiy autentifikatsiya yo'q — bitta
# "operator" bilan ishlaydi, shuning uchun jamoa funksiyasi mazmunsiz.
# Supabase ulanganda supabase_db.py'dagi haqiqiy variant ishlaydi.

def list_team() -> list:
    return []


def invite_team_member(email: str, full_name: Optional[str]) -> dict:
    raise RuntimeError("Jamoa funksiyasi faqat Supabase ulanganda ishlaydi")
