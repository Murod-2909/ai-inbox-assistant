"""FastAPI ilovasi — barcha API endpointlar shu yerda.

Ishga tushirish (backend papkasida):
  uvicorn app.main:app --reload --port 8000

Keyin http://localhost:8000/docs da avtomatik hujjatlarni ko'rishingiz mumkin.
"""

from dotenv import load_dotenv

load_dotenv()  # .env faylidagi sozlamalarni os.getenv() orqali o'qiladigan qilamiz

import os  # noqa: E402

import httpx  # noqa: E402
from fastapi import FastAPI, HTTPException  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from fastapi.responses import Response  # noqa: E402

from app import ai, database, telegram  # noqa: E402
from app.schemas import NoteRequest, ReplyRequest, TemplateRequest  # noqa: E402

app = FastAPI(title="AI Inbox Assistant API", version="0.1.0")

# CORS: frontend (localhost:3000) boshqa portda ishlaydi, brauzer ruxsat so'raydi
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    """Server ishga tushganda baza jadvallarini tayyorlaymiz."""
    database.init_db()


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


# ---------- Frontend uchun API ----------

def _row_to_conversation(row: dict) -> dict:
    """Bazadan kelgan tekis qatorni frontend kutadigan ichma-ich JSON'ga aylantiradi."""
    conversation = {
        "id": row["id"],
        "customer": {
            "id": row["customer_id"],
            "name": row["name"],
            "channel": row["channel"],
            "username": row["username"],
        },
        "lastMessage": row["last_message"],
        "lastMessageAt": row["last_message_at"],
        "unreadCount": row["unread_count"],
        "analysis": None,
    }
    if row.get("sentiment"):
        conversation["analysis"] = {
            "sentiment": row["sentiment"],
            "intent": row["intent"],
            "suggestedReply": row["suggested_reply"],
        }
    return conversation


@app.get("/api/conversations")
def get_conversations() -> list:
    return [_row_to_conversation(row) for row in database.list_conversations()]


def _media_url_for(row: dict) -> str:
    """Xabar uchun media manzilini tanlaydi.

    - media_url to'g'ridan-to'g'ri berilgan bo'lsa (demo) — o'shani,
    - aks holda bizning proxy'mizni ("/api/media/<file_id>") qaytaradi.
      Frontend "/" bilan boshlangan yo'lga backend manzilini qo'shadi.
    """
    if row.get("media_url"):
        return row["media_url"]
    if row.get("media_file_id"):
        return f"/api/media/{row['media_file_id']}"
    return ""


@app.get("/api/conversations/{conversation_id}/messages")
def get_messages(conversation_id: str) -> list:
    rows = database.list_messages(conversation_id)
    return [
        {
            "id": row["id"],
            "conversationId": row["conversation_id"],
            "from": row["sender"],
            "text": row["text"],
            "sentAt": row["sent_at"],
            "kind": row.get("kind") or "text",
            "mediaUrl": _media_url_for(row) or None,
            "transcript": row.get("transcript"),
        }
        for row in rows
    ]


@app.get("/api/media/{file_id}")
def media_proxy(file_id: str) -> Response:
    """Telegram'dagi faylni brauzerga uzatadi (bot token maxfiy qoladi).

    Oqim: getFile -> file_path -> faylni yuklab olib, xuddi o'zidek qaytarish.
    """
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    file_path = telegram.get_file_path(file_id)
    if not token or not file_path:
        raise HTTPException(status_code=404, detail="Media topilmadi (token yo'q yoki fayl eskirgan)")

    try:
        upstream = httpx.get(
            f"https://api.telegram.org/file/bot{token}/{file_path}", timeout=30
        )
        upstream.raise_for_status()
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Telegram'dan yuklab bo'lmadi")

    content_type = upstream.headers.get("content-type", "application/octet-stream")
    return Response(content=upstream.content, media_type=content_type)


@app.post("/api/conversations/{conversation_id}/read")
def read_conversation(conversation_id: str) -> dict:
    """Operator suhbatni ochdi — unread belgini tozalaymiz."""
    database.mark_read(conversation_id)
    return {"ok": True}


@app.post("/api/conversations/{conversation_id}/reply")
def reply(conversation_id: str, body: ReplyRequest) -> dict:
    """Operator javobi: bazaga yozamiz va (token bo'lsa) Telegram'ga yuboramiz."""
    messages = database.list_messages(conversation_id)
    if not messages:
        raise HTTPException(status_code=404, detail="Suhbat topilmadi")

    saved = database.add_message(conversation_id, "business", body.text)

    chat_id = database.get_telegram_chat_id(conversation_id)
    delivered = telegram.send_message(chat_id, body.text) if chat_id else False

    return {
        "id": saved["id"],
        "conversationId": conversation_id,
        "from": "business",
        "text": saved["text"],
        "sentAt": saved["sent_at"],
        "delivered": delivered,
    }


# ---------- Javob shablonlari ----------

@app.get("/api/templates")
def get_templates() -> list:
    return database.list_templates()


@app.post("/api/templates")
def create_template(body: TemplateRequest) -> dict:
    return database.create_template(body.title, body.text)


@app.delete("/api/templates/{template_id}")
def delete_template(template_id: str) -> dict:
    database.delete_template(template_id)
    return {"ok": True}


# ---------- Ichki eslatmalar ----------

@app.get("/api/conversations/{conversation_id}/notes")
def get_notes(conversation_id: str) -> list:
    return [
        {
            "id": row["id"],
            "author": row["author"],
            "text": row["text"],
            "createdAt": row["created_at"],
        }
        for row in database.list_notes(conversation_id)
    ]


@app.post("/api/conversations/{conversation_id}/notes")
def create_note(conversation_id: str, body: NoteRequest) -> dict:
    saved = database.add_note(conversation_id, body.author, body.text)
    return {
        "id": saved["id"],
        "author": saved["author"],
        "text": saved["text"],
        "createdAt": saved["created_at"],
    }


# ---------- Statistika ----------

@app.get("/api/stats")
def get_stats() -> dict:
    return database.get_stats()


# ---------- Telegram webhook ----------

@app.post("/telegram/webhook")
def telegram_webhook(update: dict) -> dict:
    """Telegram'dan yangi xabar keldi: saqlaymiz va AI tahlilini ishga tushiramiz."""
    parsed = telegram.parse_update(update)
    if parsed is None:
        return {"ok": True}  # bizga tegishli bo'lmagan update — jimgina qabul qilamiz

    ids = database.find_or_create_customer(
        telegram_chat_id=parsed["chat_id"],
        name=parsed["name"],
        username=parsed["username"],
    )

    # Ovozli xabar: STT (hozircha stub — telegram.transcribe_voice ga qarang)
    transcript = parsed["transcript"]
    if parsed["kind"] == "voice" and not transcript:
        transcript = telegram.transcribe_voice(parsed["media_file_id"])

    message = database.add_message(
        ids["conversation_id"],
        "customer",
        parsed["text"],
        kind=parsed["kind"],
        media_file_id=parsed["media_file_id"],
        media_url=parsed["media_url"],
        transcript=transcript,
    )

    # AI tahlil faqat haqiqiy matn bo'lsa (token tejash: stikerga AI chaqirilmaydi).
    # Ovozli xabarda transkript bo'lsa, o'shani tahlil qilamiz.
    ai_text = parsed["ai_text"] or transcript
    if ai_text:
        ai.analyze_message(message["id"], ids["conversation_id"], ai_text)

    return {"ok": True}
