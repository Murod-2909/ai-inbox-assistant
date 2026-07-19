# Backend — FastAPI (Python)

AI Inbox Assistant'ning server qismi. Telegram webhook'ini qabul qiladi, xabarlarni bazaga yozadi, AI tahlilini boshqaradi va frontend'ga API beradi.

## Ishga tushirish

```bash
cd backend

# 1. Virtual muhit (loyihaning o'z kutubxonalar "xonasi")
python3 -m venv .venv
source .venv/bin/activate

# 2. Kutubxonalarni o'rnatish
pip install -r requirements.txt

# 3. Sozlamalar (ixtiyoriy — kalitsiz ham ishlaydi)
cp .env.example .env

# 4. Serverni ishga tushirish
uvicorn app.main:app --reload --port 8000
```

Keyin oching: http://localhost:8000/docs — barcha endpointlarning interaktiv hujjati.

## Modullar (har biri bitta vazifa)

| Fayl | Vazifasi | O'rganiladigan Python tushunchalari |
|---|---|---|
| `app/main.py` | API endpointlar, CORS | dekoratorlar (`@app.get`), funksiyalar |
| `app/database.py` | SQLite bilan ishlash | dict, list, funksiyalar, SQL |
| `app/ai.py` | 3 pog'onali AI tahlil | set, Optional, exception (try/except) |
| `app/telegram.py` | Webhook parse + javob yuborish | dict.get(), httpx |
| `app/schemas.py` | Ma'lumot shakllari | class, Pydantic |

## AI token tejash — kodda qayerda?

`docs/ai-strategy.md` dagi har bir qoida `app/ai.py` da amalga oshirilgan:

1. **Kesh** — `analyze_message()` avval `analyses` jadvalini tekshiradi; bitta xabar hech qachon ikki marta tahlil qilinmaydi.
2. **AI'siz filtr** — `pre_filter()`: "ok", "rahmat", salomlashishlar AI'ga bormaydi (0 token).
3. **Ikki pog'onali model** — klassifikatsiya `claude-haiku-4-5` (arzon), shikoyat javobi `claude-opus-4-8` (kuchli).
4. **Qisqa prompt** — kontekstga faqat oxirgi 5 ta xabar; system prompt o'zgarmas va `cache_control` bilan keshlanadi; chiqish qattiq JSON schema bilan cheklangan.
5. **Zaxira** — API kaliti yo'q bo'lsa `heuristic_analysis()` (oddiy kalit so'zlar) ishlaydi — loyiha kalitsiz ham to'liq sinaladi.

## Telegram webhook'ni sinash (lokal)

Haqiqiy Telegram hali ulanmagan bo'lsa ham, webhook'ni curl bilan sinash mumkin:

```bash
curl -X POST http://localhost:8000/telegram/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": {"chat": {"id": 111, "first_name": "Test", "username": "test_user"}, "text": "Narxi qancha?"}}'
```

Keyin frontend'ni yangilasangiz, "Test" mijozning xabari inbox'da paydo bo'ladi.

Haqiqiy bot uchun: token olib `.env` ga yozing, serverni internetga chiqaring (masalan ngrok) va webhook o'rnating:

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<domen>/telegram/webhook"
```
