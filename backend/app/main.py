"""FastAPI ilovasi — barcha API endpointlar shu yerda.

Ishga tushirish (backend papkasida):
  uvicorn app.main:app --reload --port 8000

Keyin http://localhost:8000/docs da avtomatik hujjatlarni ko'rishingiz mumkin.
"""

from dotenv import load_dotenv

load_dotenv()  # .env faylidagi sozlamalarni os.getenv() orqali o'qiladigan qilamiz

import os  # noqa: E402
from datetime import datetime, time as dtime  # noqa: E402
from typing import Literal, Optional  # noqa: E402

import httpx  # noqa: E402
from fastapi import FastAPI, HTTPException, Query, Request  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from fastapi.responses import Response  # noqa: E402

import stripe  # noqa: E402

from app import ai, meta, reports, telegram  # noqa: E402
from app.store import SUPABASE_ENABLED, db as database  # noqa: E402
from app.schemas import (  # noqa: E402
    AssignRequest,
    BusinessUpdateRequest,
    InviteRequest,
    NoteRequest,
    ReplyRequest,
    TemplateRequest,
)

# Stripe setup
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

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
    """Server ishga tushganda bazani tayyorlaymiz (SQLite yoki Supabase)."""
    database.init_db()
    print(f"[store] Baza rejimi: {'Supabase' if SUPABASE_ENABLED else 'SQLite (lokal)'}")


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "store": "supabase" if SUPABASE_ENABLED else "sqlite"}


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
        "assignedOperatorId": row.get("assigned_operator_id"),
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


@app.post("/api/conversations/{conversation_id}/assign")
def assign_conversation(conversation_id: str, body: AssignRequest) -> dict:
    """Suhbatni operatorga tayinlaydi/bekor qiladi ("Mening"/"Tayinlanmagan" filtri uchun)."""
    database.assign_conversation(conversation_id, body.operatorId)
    return {"ok": True}


@app.post("/api/conversations/{conversation_id}/reply")
def reply(conversation_id: str, body: ReplyRequest) -> dict:
    """Operator javobi: bazaga yozamiz va mos platformaga (Telegram/Facebook/
    Instagram) yuboramiz — qaysi biriga yuborishni mijozning kanali aniqlaydi."""
    messages = database.list_messages(conversation_id)
    if not messages:
        raise HTTPException(status_code=404, detail="Suhbat topilmadi")

    saved = database.add_message(conversation_id, "business", body.text)

    channel_info = database.get_customer_channel_info(conversation_id)
    delivered = False
    if channel_info:
        if channel_info.get("channel") == "telegram" and channel_info.get("telegram_chat_id"):
            delivered = telegram.send_message(channel_info["telegram_chat_id"], body.text)
        elif channel_info.get("channel") in ("facebook", "instagram") and channel_info.get("platform_user_id"):
            delivered = meta.send_message(channel_info["platform_user_id"], body.text)

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


# ---------- Biznes profili ----------

@app.get("/api/business")
def get_business() -> dict:
    biz = database.get_business()
    biz["operatorLimit"] = PLAN_LIMITS.get(biz.get("plan", "free"), 1)
    return biz


@app.put("/api/business")
def update_business(body: BusinessUpdateRequest) -> dict:
    working_hours = body.workingHours.model_dump() if body.workingHours else None
    return database.update_business(body.name, working_hours)


# ---------- Jamoa ----------
# Faqat Supabase ulanganda ma'noga ega — SQLite (demo) rejimida haqiqiy
# autentifikatsiya yo'q, shuning uchun aniq xato bilan rad etamiz.

@app.get("/api/team")
def get_team() -> list:
    if not SUPABASE_ENABLED:
        raise HTTPException(status_code=501, detail="Jamoa funksiyasi faqat Supabase ulanganda ishlaydi")
    return database.list_team()


@app.post("/api/team/invite")
def invite_team(body: InviteRequest) -> dict:
    if not SUPABASE_ENABLED:
        raise HTTPException(status_code=501, detail="Jamoa funksiyasi faqat Supabase ulanganda ishlaydi")

    plan = database.get_business().get("plan", "free")
    limit = PLAN_LIMITS.get(plan, 1)
    if limit is not None and len(database.list_team()) >= limit:
        raise HTTPException(
            status_code=403,
            detail=(
                f"'{plan}' tarifida operator limiti {limit} taga yetdi. "
                "Ko'proq operator qo'shish uchun tarifni yangilang."
            ),
        )

    try:
        return database.invite_team_member(body.email, body.fullName)
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"Taklif yuborishda xato: {error}")


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


# ---------- Hisobotlar (Excel/Word export) ----------

@app.get("/api/reports/export")
def export_report(
    period: Literal["week", "month"] = "week",
    format: Literal["xlsx", "docx"] = "xlsx",  # noqa: A002
) -> Response:
    data = database.get_report_data(period)
    business_name = database.get_business().get("name", "Biznes")

    if format == "xlsx":
        content = reports.build_xlsx(data, business_name)
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    else:
        content = reports.build_docx(data, business_name)
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    filename = f"hisobot-{period}.{format}"
    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ---------- To'lov (Stripe) ----------

PRICING = {
    "start": {
        "name": "Start Tarifi",
        "price": 14900000,  # UZS tiyinlarda (149,000 so'm)
        "description": "O'sib borayotgan bizneslar uchun",
    },
    "business": {
        "name": "Biznes Tarifi",
        "price": 34900000,  # UZS tiyinlarda (349,000 so'm)
        "description": "Katta jamoa uchun",
    },
}

# Tarif bo'yicha operator soni chegarasi — None = cheksiz.
PLAN_LIMITS = {"free": 1, "start": 3, "business": None}


@app.post("/api/checkout")
async def create_checkout(body: dict) -> dict:
    """Stripe checkout session yaratadi (Embedded Checkout uchun)."""
    plan = body.get("plan")
    if plan not in PRICING:
        raise HTTPException(status_code=400, detail="Noto'g'ri tarif")

    if not stripe.api_key:
        raise HTTPException(
            status_code=500, detail="Stripe'ni configurelamagan (STRIPE_SECRET_KEY yo'q)"
        )

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "uzs",
                        "product_data": {
                            "name": PRICING[plan]["name"],
                            "description": PRICING[plan]["description"],
                        },
                        "unit_amount": PRICING[plan]["price"],
                        "recurring": {"interval": "month", "interval_count": 1},
                    },
                    "quantity": 1,
                }
            ],
            mode="subscription",
            ui_mode="embedded",
            metadata={"plan": plan},
            return_url=f"{os.getenv('API_URL', 'http://localhost:3000')}/success",
        )
        return {"clientSecret": session.client_secret}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=500, detail=f"Stripe xatosi: {str(e)}")


@app.post("/webhook/stripe")
async def stripe_webhook(request: Request) -> dict:
    """To'lov muvaffaqiyatli o'tgach, biznesning tarifini yangilaydi.

    Stripe Dashboard'da webhook endpoint sifatida ro'yxatdan o'tkazilishi va
    STRIPE_WEBHOOK_SECRET .env'ga qo'yilishi kerak (imzoni tekshirish uchun —
    aks holda istalgan kishi soxta so'rov yuborib tarifni o'zgartira oladi).
    """
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    if not webhook_secret:
        raise HTTPException(status_code=500, detail="STRIPE_WEBHOOK_SECRET sozlanmagan")

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Noto'g'ri webhook imzosi")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        plan = (session.get("metadata") or {}).get("plan")
        if plan in PRICING:
            database.set_plan(plan)
            print(f"[stripe] Tarif yangilandi: {plan}")

    return {"ok": True}


def _is_within_working_hours(working_hours: Optional[dict]) -> bool:
    """Ish vaqti yoqilmagan bo'lsa — cheklov yo'q, doim "ish vaqti" hisoblanadi."""
    if not working_hours or not working_hours.get("enabled"):
        return True
    now = datetime.now().time()
    start = dtime.fromisoformat(working_hours["start"])
    end = dtime.fromisoformat(working_hours["end"])
    return start <= now <= end


def _maybe_send_away_message(conversation_id: str, channel: str, recipient: object) -> None:
    """Ish vaqtidan tashqarida kelgan xabarga avtomatik javob yuboradi
    (throttlingsiz — MVP: har bir xabar uchun, ko'p bo'lsa keyinroq cheklash mumkin)."""
    business = database.get_business()
    working_hours = business.get("workingHours")
    if _is_within_working_hours(working_hours):
        return

    away_text = working_hours["message"]
    delivered = (
        telegram.send_message(recipient, away_text)
        if channel == "telegram"
        else meta.send_message(recipient, away_text)
    )
    if delivered:
        database.add_message(conversation_id, "business", away_text)


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

    _maybe_send_away_message(ids["conversation_id"], "telegram", parsed["chat_id"])

    return {"ok": True}


# ---------- Meta webhook (Facebook Messenger + Instagram DM) ----------
# Ikkalasi ham bitta Meta App + bitta webhook URL orqali ishlaydi.

@app.get("/webhook/meta")
def meta_webhook_verify(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge"),
) -> Response:
    """Meta App sozlamalarida webhook ro'yxatdan o'tkazilganda chaqiriladi."""
    challenge = meta.verify_webhook(hub_mode, hub_verify_token, hub_challenge)
    if challenge is None:
        raise HTTPException(status_code=403, detail="Verify token mos kelmadi")
    return Response(content=challenge, media_type="text/plain")


@app.post("/webhook/meta")
def meta_webhook(update: dict) -> dict:
    """Facebook Messenger yoki Instagram'dan yangi xabar keldi."""
    events = meta.parse_webhook_event(update)
    for event in events:
        ids = database.find_or_create_meta_customer(
            channel=event["platform"],
            platform_user_id=event["sender_id"],
            name=f"{event['platform'].capitalize()} foydalanuvchi",
            username=None,
        )
        message = database.add_message(ids["conversation_id"], "customer", event["text"])
        ai.analyze_message(message["id"], ids["conversation_id"], event["text"])
        _maybe_send_away_message(ids["conversation_id"], event["platform"], event["sender_id"])

    return {"ok": True}
