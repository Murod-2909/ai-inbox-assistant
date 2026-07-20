"""AI tahlil moduli — docs/ai-strategy.md dagi token-tejash qoidalari shu yerda.

Uch pog'onali tizim:
1. pre_filter()     — AI'SIZ: qisqa/oddiy xabarlarni oddiy qoidalar bilan aniqlaydi (0 token)
2. Kesh             — xabar oldin tahlil qilingan bo'lsa, bazadan olinadi (0 token)
3. Claude Haiku     — klassifikatsiya (sentiment + intent) — arzon model
   Claude Opus      — javob taklifi faqat shikoyat/salbiy holatlarda kattaroq model bilan

API kaliti bo'lmasa, hammasi heuristika (qoidalar) bilan ishlaydi —
loyihani API'siz ham sinab ko'rish mumkin.
"""

import json
import os
import re
from typing import Optional

from app.store import db as database

# --- Sozlamalar ---
CLASSIFY_MODEL = "claude-haiku-4-5"   # arzon/tezkor — sentiment+intent uchun
REPLY_MODEL = "claude-opus-4-8"       # kuchli — murakkab javoblar uchun

VALID_SENTIMENTS = {"positive", "neutral", "negative"}
VALID_INTENTS = {"question", "complaint", "order", "feedback", "other"}

# Salomlashish/qisqa xabarlar lug'ati — bularga AI chaqirilmaydi (strategiya 2-band)
GREETINGS = {
    "salom", "assalomu alaykum", "assalom", "hello", "hi", "salom alaykum",
}
TRIVIAL = {"ok", "xop", "mayli", "rahmat", "raxmat", "tashakkur", "👍", "🙏", "yaxshi"}

# Kalit so'z ro'yxatlari — heuristik klassifikatsiya uchun (dict emas, set —
# chunki bizga faqat "bormi/yo'qmi" tekshiruvi kerak, set'da bu juda tez)
NEGATIVE_WORDS = {"yomon", "shikoyat", "kelmayapti", "ishlamayapti", "norozi", "qaytar", "aldov"}
POSITIVE_WORDS = {"rahmat", "zo'r", "ajoyib", "yoqdi", "tavsiya", "yaxshi ekan"}
QUESTION_WORDS = {"qancha", "narx", "qachon", "qayerda", "bormi", "mumkinmi", "?"}
ORDER_WORDS = {"buyurtma", "yozil", "band qil", "olmoqchi", "sotib", "ro'yxat"}


def pre_filter(text: str) -> Optional[dict]:
    """AI'siz oldindan filtrlash. Oddiy xabar bo'lsa tayyor tahlil qaytaradi,
    murakkab bo'lsa None — keyin AI'ga yuboriladi.
    """
    clean = text.strip().lower()

    # Juda qisqa yoki "ok/rahmat" turidagi xabarlar
    if len(clean) <= 3 or clean in TRIVIAL:
        return {
            "sentiment": "neutral",
            "intent": "other",
            "suggested_reply": "",  # bunday xabarga AI javobi shart emas
        }

    # Faqat salomlashish
    if clean in GREETINGS:
        return {
            "sentiment": "neutral",
            "intent": "other",
            "suggested_reply": "Assalomu alaykum! Xush kelibsiz, sizga qanday yordam bera olamiz?",
        }

    return None  # murakkab xabar — AI tahlili kerak


def heuristic_analysis(text: str) -> dict:
    """API kaliti yo'q bo'lganda ishlaydigan zaxira tahlil (oddiy kalit so'zlar bilan)."""
    clean = text.lower()

    def contains_any(words: set) -> bool:
        return any(word in clean for word in words)

    if contains_any(NEGATIVE_WORDS):
        sentiment = "negative"
    elif contains_any(POSITIVE_WORDS):
        sentiment = "positive"
    else:
        sentiment = "neutral"

    if contains_any(ORDER_WORDS):
        intent = "order"
    elif sentiment == "negative":
        intent = "complaint"
    elif contains_any(QUESTION_WORDS):
        intent = "question"
    elif sentiment == "positive":
        intent = "feedback"
    else:
        intent = "other"

    replies = {
        "complaint": "Noqulaylik uchun uzr so'raymiz. Muammoingizni batafsil yozsangiz, tezda hal qilamiz.",
        "question": "Savolingiz uchun rahmat! Hozir aniq ma'lumot bilan javob beramiz.",
        "order": "Buyurtmangizni qabul qildik! Tasdiqlash uchun tez orada bog'lanamiz.",
        "feedback": "Fikringiz uchun katta rahmat! Sizga xizmat qilganimizdan xursandmiz.",
        "other": "Xabaringizni oldik, tez orada javob beramiz.",
    }
    return {"sentiment": sentiment, "intent": intent, "suggested_reply": replies[intent]}


def _get_client():
    """Anthropic klientini qaytaradi, kalit bo'lmasa None."""
    if not os.getenv("ANTHROPIC_API_KEY"):
        return None
    import anthropic  # importni shu yerda qilamiz — kalit yo'q bo'lsa kutubxona shart emas

    return anthropic.Anthropic()


# System prompt QISQA va O'ZGARMAS — Claude prompt caching undan qayta foydalanadi
# (strategiya 4-band). O'zgaruvchan narsalar (xabarlar) keyin yuboriladi.
CLASSIFY_SYSTEM = (
    "Sen kichik biznes uchun mijoz xabarlarini tahlil qilasan. "
    "Har bir xabar uchun sentiment (positive/neutral/negative), "
    "intent (question/complaint/order/feedback/other) va "
    "o'zbek tilida qisqa, samimiy javob taklifini (suggested_reply) qaytar."
)

ANALYSIS_SCHEMA = {
    "type": "object",
    "properties": {
        "sentiment": {"type": "string", "enum": ["positive", "neutral", "negative"]},
        "intent": {"type": "string", "enum": ["question", "complaint", "order", "feedback", "other"]},
        "suggested_reply": {"type": "string"},
    },
    "required": ["sentiment", "intent", "suggested_reply"],
    "additionalProperties": False,
}


def claude_analysis(text: str, conversation_id: str) -> Optional[dict]:
    """Claude bilan tahlil. Kontekst — faqat oxirgi 5 ta xabar (token tejash)."""
    client = _get_client()
    if client is None:
        return None

    # Oxirgi xabarlarni qisqa matnga aylantiramiz
    recent = database.get_recent_messages(conversation_id, limit=5)
    history_lines = []
    for msg in recent:
        who = "Mijoz" if msg["sender"] == "customer" else "Biznes"
        history_lines.append(f"{who}: {msg['text']}")
    history = "\n".join(history_lines)

    try:
        response = client.messages.create(
            model=CLASSIFY_MODEL,
            max_tokens=512,
            system=[
                {
                    "type": "text",
                    "text": CLASSIFY_SYSTEM,
                    # prompt caching: o'zgarmas qism keshga olinadi
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            output_config={"format": {"type": "json_schema", "schema": ANALYSIS_SCHEMA}},
            messages=[
                {"role": "user", "content": f"Suhbat:\n{history}\n\nTahlil qilinadigan xabar: {text}"}
            ],
        )
        raw = next(block.text for block in response.content if block.type == "text")
        result = json.loads(raw)
    except Exception as error:  # tarmoq/kalit xatosi — heuristikaga qaytamiz
        print(f"[ai] Claude xatosi: {error}")
        return None

    # Model javobini tekshiramiz — noto'g'ri qiymat kelsa xavfsiz standartga tushiramiz
    if result.get("sentiment") not in VALID_SENTIMENTS:
        result["sentiment"] = "neutral"
    if result.get("intent") not in VALID_INTENTS:
        result["intent"] = "other"

    # Ikkinchi pog'ona: salbiy/shikoyat holatida javobni KUCHLI model qayta yozadi
    # (strategiya 3-band — "murakkabroqlarini kattaroq model bilan")
    if result["sentiment"] == "negative" or result["intent"] == "complaint":
        better_reply = _generate_reply_with_opus(client, history, text)
        if better_reply:
            result["suggested_reply"] = better_reply

    return result


def _generate_reply_with_opus(client, history: str, text: str) -> Optional[str]:
    """Nozik holatlar (shikoyat) uchun javobni kattaroq model bilan yozish."""
    try:
        response = client.messages.create(
            model=REPLY_MODEL,
            max_tokens=300,
            system=(
                "Sen kichik biznesning mijozlar bilan ishlash mutaxassisisan. "
                "Norozi mijozga o'zbek tilida qisqa, samimiy va muammoni hal qilishga "
                "yo'naltirilgan javob yoz. Faqat javob matnini qaytar."
            ),
            messages=[
                {"role": "user", "content": f"Suhbat:\n{history}\n\nMijozning xabari: {text}"}
            ],
        )
        return next((b.text for b in response.content if b.type == "text"), None)
    except Exception as error:
        print(f"[ai] Opus javob xatosi: {error}")
        return None


def analyze_message(message_id: str, conversation_id: str, text: str) -> dict:
    """Asosiy kirish nuqtasi. Tartib: kesh -> pre_filter -> Claude -> heuristika."""
    # 1. Kesh — bu xabar oldin tahlil qilinganmi?
    cached = database.get_cached_analysis(message_id)
    if cached:
        return cached

    # 2. AI'siz filtr — oddiy xabarlar
    result = pre_filter(text)
    source = "pre_filter"

    # 3. Claude (kalit bo'lsa)
    if result is None:
        result = claude_analysis(text, conversation_id)
        source = "claude"

    # 4. Zaxira — heuristika
    if result is None:
        result = heuristic_analysis(text)
        source = "heuristic"

    database.save_analysis(message_id, conversation_id, result, source)
    return result
