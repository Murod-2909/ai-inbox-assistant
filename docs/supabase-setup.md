# Supabase'ni ulash — qadam-baqadam yo'riqnoma

Kod tomoni to'liq tayyor: kalitlarni kiritishingiz bilan backend Postgres'ga, frontend esa Realtime + haqiqiy Auth'ga o'tadi. Kalitlarsiz hammasi avvalgidek (SQLite + demo) ishlayveradi.

## 1. Loyiha ochish

1. [supabase.com](https://supabase.com) da ro'yxatdan o'ting (bepul tarif yetarli)
2. **New project** → nom bering (masalan `ai-inbox`), kuchli database parol tanlang, mintaqa sifatida yaqinini (masalan `ap-southeast-1` Singapur) tanlang
3. Loyiha tayyor bo'lishini kuting (~2 daqiqa)

## 2. Sxemani ishga tushirish

1. Chap menyudan **SQL Editor** ni oching
2. [backend/supabase/schema.sql](../backend/supabase/schema.sql) faylining butun matnini nusxalab qo'ying va **Run** bosing
3. "Success" chiqsa — jadvallar, RLS siyosatlari, `Demo biznes`, shablonlar, view va statistika funksiyasi yaratildi

## 3. Kalitlarni olish

**Project Settings → API** bo'limida uchta narsa bor:

| Nima | Qayerga yoziladi | Maxfiymi? |
|---|---|---|
| Project URL | ikkala `.env` ga | yo'q |
| `anon` / `public` key | frontend `.env.local` ga | yo'q (RLS himoya qiladi) |
| `service_role` key | **faqat** backend `.env` ga | **HA — hech qachon frontend'ga emas!** |

## 4. Env fayllarni to'ldirish

```bash
# backend/.env  (backend/.env.example dan nusxalang)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOi...   # service_role

# .env.local  (loyiha ildizida, .env.local.example dan nusxalang)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...   # anon
```

Keyin ikkala serverni qayta ishga tushiring. Backend logida `[store] Baza rejimi: Supabase` chiqishi kerak; `http://localhost:8000/health` ham `"store": "supabase"` qaytaradi.

## 5. Google OAuth (ixtiyoriy)

1. Supabase: **Authentication → Providers → Google** ni yoqing
2. [Google Cloud Console](https://console.cloud.google.com) da OAuth client yarating (turi: Web application)
3. Redirect URI sifatida Supabase ko'rsatgan `https://xxxx.supabase.co/auth/v1/callback` ni kiriting
4. Client ID va Secret'ni Supabase'dagi Google provider sozlamalariga qo'ying

Email tasdiqlash matnlarini **Authentication → Email Templates** da o'zbekchalashtirish mumkin.

## 6. Tekshirish

1. `/signup` da ro'yxatdan o'ting — pochtaga haqiqiy tasdiqlash xati keladi
2. Havolani bosib, `/login` orqali kiring — sidebar pastida ismingiz va chiqish (⎋) tugmasi paydo bo'ladi
3. Telegram webhook'ni sinang (curl bilan) — xabar endi Supabase'ga yoziladi va **Realtime orqali brauzerda darhol** (pollingsiz) paydo bo'ladi
4. Supabase dashboard → **Table Editor** da ma'lumotlarni ko'rishingiz mumkin

## Nima qayerda hal qilinadi (arxitektura)

- **Backend** `service_role` kaliti bilan yozadi/o'qiydi (webhook — tizim ishi, RLS chetlab o'tiladi)
- **Frontend** `anon` kalit + foydalanuvchi sessiyasi bilan ishlaydi — RLS har bir biznes faqat o'z ma'lumotini ko'rishini ta'minlaydi
- **Realtime** frontend'da o'zgarish signali sifatida ishlatiladi: signal kelganda ma'lumot backend API'dan qayta o'qiladi
- Hozircha barcha yangi foydalanuvchilar `Demo biznes`ga bog'lanadi (single-tenant); ko'p bizneslilik keyingi bosqichda
