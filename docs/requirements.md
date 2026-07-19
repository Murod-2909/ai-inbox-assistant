# AI Inbox Assistant — To'liq loyiha talablari va holat

Oxirgi yangilanish: 2026-07-17

**Asosiy g'oya:** kichik bizneslar (do'kon, klinika, salon, o'quv markazi) uchun mijozlar xabarlarini (Telegram, keyin WhatsApp/Instagram) bitta dashboard'ga yig'ib, AI yordamida tahlil qiladigan va javob taklif qiladigan tizim.

**Stack:** Next.js + TypeScript + SCSS · FastAPI/Python · Supabase (Postgres + Realtime + RLS) · Claude API

Holat belgilari: ✅ tayyor · 🔶 qisman · ⏳ rejada

## 1. Asosiy funksiyalar (MVP — Bosqich 1)

- ✅ Telegram xabarlari unified inbox'da (webhook → baza → UI)
- 🔶 Real-time yangilanish — hozircha 4 soniyalik polling; Supabase Realtime'ga o'tiladi
- ✅ AI tahlil (sentiment, intent) + javob taklifi, operator tasdig'i bilan yuborish

## 2. Media qo'llab-quvvatlash

- ✅ MVP: mijozdan kelgan rasm / video / ovozli xabar / stikerni dashboard'da ko'rish-eshitish
- 🔶 Ovozli xabar transkripsiyasi — arxitektura tayyor (`transcript` maydoni), STT provayder (Whisper) ulanishi kerak
- ⏳ V2: operator media yuborishi (Supabase Storage kerak)

## 3. Login / Logout (Autentifikatsiya)

- ⏳ Email + parol, Google OAuth (Supabase Auth orqali — Supabase ulangach)
- ⏳ Parol tiklash, sign up oqimi
- ⏳ Logout, "meni eslab qol", token muddati
- ⏳ Ko'p qurilma sessiyalari va masofadan chiqarish

## 4. AI qo'shimchalar

- ✅ Avtomatik teglash (intent: buyurtma/shikoyat/savol/fikr) — `backend/app/ai.py`
- ⏳ Avtomatik tarjima
- 🔶 Smart FAQ / Knowledge Base — javob shablonlari bazasi tayyor, AI'ga ulash keyin
- 🔶 Kayfiyat trendi — real taqsimot Tahlil sahifasida; vaqt bo'yicha trend chizig'i keyin

## 5. Jamoa/operator qulayliklari

- ⏳ Xabarlarni operatorlarga taqsimlash (Auth bilan birga keladi)
- ✅ Ichki eslatmalar — 🗒 tugma, suhbat ichida, mijoz ko'rmaydi
- ⏳ Operator band/bo'sh holati (Auth bilan birga)
- ✅ Tezkor javob shablonlari — ⚡ tugma, bazada saqlanadi (`/api/templates`)

## 6. Biznes egasi qulayliklari

- ✅ Statistika dashboard — `/api/stats`: real SQL agregatsiya (bugungi xabarlar, javob kutayotganlar, o'rtacha javob vaqti, sentiment/intent taqsimoti, haftalik hajm)
- ⏳ CRM-lite mijoz tarixi
- ⏳ Ish vaqtidan tashqari avtomatik javob
- ⏳ Excel/PDF eksport

## 7. Texnik/UX

- ✅ Dark/Light mode (tizimga ergashadi + qo'lda almashtirish)
- ✅ Yangi xabarda ovozli signal
- 🔶 Klaviatura: Enter — yuborish, Shift+Enter — yangi qator; qolgan yorliqlar rejada
- ⏳ Push/browser notification

## 8. Xavfsizlik

- ✅ API kalitlar faqat backend `.env` da
- 🔶 Supabase RLS — siyosatlar yozilgan (`backend/supabase/schema.sql`), Supabase ulangach faollashadi
- ⏳ JWT auth va sessiya xavfsizligi
- ⏳ Audit log · 2FA · Rate limiting

## 9. Umumiy

- ✅ Zamonaviy responsive dizayn
- ✅ AI token optimallashtirish (kesh, AI'siz filtr, qisqa promptlar, 2 pog'onali model) — `docs/ai-strategy.md`

## Keyingi navbat (tavsiya etilgan tartib)

1. **Supabase'ga o'tish** — hisob ochib URL/kalitlarni `.env` ga qo'shish → `schema.sql` ni ishga tushirish → `database.py` ni almashtirish → Realtime subscription (polling o'rniga)
2. **Auth** — Supabase Auth (email+parol, Google), login/signup sahifalari, RLS faollashuvi
3. **STT** — ovozli xabarlar uchun Whisper API
4. **Operator qulayliklari** — shablonlar, taqsimlash, ichki eslatmalar
