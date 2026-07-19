# AI Inbox Assistant

Kichik bizneslar (do'kon, klinika, salon, o'quv markazi) uchun mijozlar xabarlarini bitta dashboard'ga yig'ib, AI yordamida tahlil qiladigan (sentiment, intent) va javob taklif qiladigan tizim.

## Stack

- **Frontend:** Next.js (App Router) + TypeScript + SCSS modullar
- **Backend:** FastAPI (Python) — keyingi bosqichda
- **Database / Realtime:** Supabase (Postgres + Realtime + RLS)
- **AI:** OpenAI yoki Claude API — xabar tahlili va javob generatsiyasi

## Dizayn tamoyillari

- **Toza va intuitiv UI** — operator uchun tezkor ish oqimi, ortiqcha element yo'q
- **Real-time silliqlik** — yangi xabar animatsiya bilan keladi (hozircha simulyatsiya, keyin Supabase Realtime)
- **Responsive** — mobil ekranda sidebar pastki navigatsiyaga, inbox bitta panelga aylanadi
- **Light/dark rejim** — tizim sozlamasiga ergashadi, qo'lda ham almashtiriladi (sidebar pastida)
- **AI token tejash** — strategiya [docs/ai-strategy.md](docs/ai-strategy.md) da: keshlash, arzon model bilan oldindan filtrlash, qisqa promptlar

To'liq talablar ro'yxati va joriy holat: [docs/requirements.md](docs/requirements.md)

## Bosqichlar (roadmap)

1. ✅ **Frontend skeleton** — dashboard layout, inbox UI, Telegram ulanish UI, dark mode, responsive, tahlil sahifasi
2. ✅ **Backend (FastAPI)** — Telegram webhook, SQLite baza, REST API ([backend/README.md](backend/README.md))
3. ✅ **AI tahlil** — 3 pog'onali: kesh → AI'siz filtr → Claude (Haiku klassifikatsiya + Opus javob); kalitsiz heuristika bilan ishlaydi
4. ✅ **Media** — rasm/video/ovoz/stiker inbox'da ko'rinadi; media proxy (token maxfiy qoladi); STT arxitekturasi tayyor; yangi xabarda ovozli signal
5. ⏳ **Supabase** — sxema va RLS tayyor ([backend/supabase/schema.sql](backend/supabase/schema.sql)), hisob ochilgach ulanadi; Realtime polling o'rnini oladi
6. ⏳ **Auth** (Supabase Auth), **operator qulayliklari**, **WhatsApp / Instagram**

## Ishga tushirish

```bash
# 1. Backend (birinchi terminal)
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 2. Frontend (ikkinchi terminal)
npm install
npm run dev
```

Brauzerda [http://localhost:3000](http://localhost:3000) oching — avtomatik `/inbox` ga yo'naltiradi.
Backend ishlamasa, frontend avtomatik **demo rejimga** o'tadi (namunaviy ma'lumotlar bilan).

## Struktura

```
src/
  app/
    (dashboard)/       # sidebar'li umumiy layout
      inbox/           # xabarlar (asosiy sahifa)
      channels/        # Telegram/WhatsApp/Instagram ulanish
      analytics/       # tahlil (placeholder)
      settings/        # sozlamalar (placeholder)
  components/          # UI komponentlar (SCSS modullar bilan)
  lib/                 # turlar va mock ma'lumotlar
  styles/              # SCSS o'zgaruvchilar (design tokens)
```

Hozircha barcha ma'lumotlar `src/lib/mock-data.ts` dan keladi — backend tayyor bo'lgach real API'ga almashtiriladi.
