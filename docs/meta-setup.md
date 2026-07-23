# Facebook Messenger va Instagram DM ulash

Ikkalasi ham **bitta Meta App** va **bitta Facebook Page** orqali ishlaydi —
Instagram Business akkaunt Page'ga ulangan bo'ladi va bir xil Page Access
Token bilan xabar oladi/yuboradi. Shuning uchun bu yerda ikkita alohida
integratsiya emas, bitta sozlash jarayoni bor.

Telegram'dan farqi: bot tokeni 1 daqiqada, bepul va tasdiqlashsiz olinadi.
Meta esa App yaratish, Page ulash va (ba'zi ruxsatlar uchun) **App Review**
jarayonini talab qiladi — bu bir necha kun cho'zilishi mumkin.

## 1. Meta App yaratish

1. [developers.facebook.com](https://developers.facebook.com) ga kiring (Facebook hisobingiz bilan)
2. **My Apps → Create App**
3. App turi: **Business**
4. App nomini kiriting (masalan `AI Inbox Assistant`), davom eting

## 2. Messenger va Instagram mahsulotlarini qo'shish

1. App dashboardida **Add Product** bo'limidan:
   - **Messenger** ni qo'shing
   - **Instagram** ni qo'shing (Instagram Graph API)

## 3. Facebook Page'ni ulash

1. Sizda Facebook Page bo'lishi kerak (yo'q bo'lsa — Facebook'da yangi Page yarating, bepul)
2. Instagram Business/Creator akkauntingizni shu Page'ga ulang:
   - Instagram ilovasida: **Sozlamalar → Akkaunt turi va vositalar → Biznesga o'tish**
   - Keyin **Sozlamalar → Biznes → Bog'langan hisoblar** orqali Facebook Page bilan bog'lang
3. Meta App dashboardida **Messenger → Settings** bo'limiga o'ting
4. **Access Tokens** ostida Page'ingizni tanlang → **Generate Token**
5. Chiqqan tokenni nusxalang (bu — **Page Access Token**, uzoq muddatli qilib sozlash tavsiya etiladi)

## 4. Webhook sozlash

1. Meta App dashboardida **Messenger → Settings → Webhooks** bo'limiga o'ting
2. **Add Callback URL**:
   - **Callback URL**: `https://<sizning-domen>/webhook/meta`
   - **Verify Token**: o'zingiz o'ylab topgan istalgan satr (masalan `mening-maxfiy-tokenim`) — buni `backend/.env` dagi `META_VERIFY_TOKEN` bilan **bir xil** qiling
3. **Verify and Save** bosing — agar backend ishlab turgan bo'lsa va token mos kelsa, Meta darhol tasdiqlaydi
4. Quyida **Webhook Fields** ro'yxatidan `messages` ni yoqing (Page uchun ham, Instagram uchun ham)

Lokal test uchun (production domen hali yo'q bo'lsa) — Telegram'dagidek ngrok kerak:
```bash
ngrok http 8000
# Chiqqan https://xxxx.ngrok.io manzilini Callback URL sifatida ishlating
```

## 5. Kalitlarni backend'ga qo'shish

```bash
# backend/.env
META_VERIFY_TOKEN=mening-maxfiy-tokenim   # 4-qadamdagi bilan bir xil
FACEBOOK_PAGE_ACCESS_TOKEN=EAAxxxxx...    # 3-qadamda olingan token
```

Backend'ni qayta ishga tushiring — tayyor. Endi Facebook Messenger yoki
Instagram'ga yozilgan xabarlar `/inbox`'ga tushadi, javoblar esa
`FACEBOOK_PAGE_ACCESS_TOKEN` orqali yuboriladi.

## 6. App Review (production uchun, ixtiyoriy — testda shart emas)

Test rejimida (App **Development** holatida) faqat App'ga **Test User** yoki
**Roles** sifatida qo'shilgan odamlar bilan yozishib ko'rishingiz mumkin —
bu haqiqiy mijozlar bilan ishlash uchun yetarli emas.

Barcha foydalanuvchilar bilan ishlash uchun Meta'dan quyidagi ruxsatlarni
so'rash kerak bo'ladi:
- `pages_messaging` (Facebook Messenger uchun)
- `instagram_manage_messages` (Instagram DM uchun)

**App Review** so'rovida Meta sizdan so'raydi:
- Foydalanish holatini ko'rsatuvchi qisqa video (screencast)
- Maxfiylik siyosati URL'i (Privacy Policy)
- Nima uchun bu ruxsat kerakligini yozma tushuntirish

Bu jarayon bir necha kundan bir necha haftagacha davom etishi mumkin —
shuning uchun avval test rejimida ishga tushirib ko'rish tavsiya etiladi.

## Texnik arxitektura

```
Mijoz Instagram'da yoki Messenger'da yozadi
    ↓
Meta serverlari POST yuboradi: /webhook/meta
    ↓
Backend: meta.parse_webhook_event()
    "object": "page" -> Facebook, "object": "instagram" -> Instagram
    ↓
database.find_or_create_meta_customer() — mijoz + suhbat yaratadi/topadi
    ↓
database.add_message() + ai.analyze_message() — Telegram bilan bir xil oqim
    ↓
Frontend /inbox'da darhol ko'rinadi (Realtime)

Operator javob yozadi
    ↓
POST /api/conversations/{id}/reply
    ↓
Backend customer.channel'ga qarab: telegram.send_message() yoki meta.send_message()
    ↓
Mijoz javobni Instagram/Messenger'da oladi
```

## Muammolarni bartaraf etish

**Webhook "Verify and Save" xato beradi:**
- `META_VERIFY_TOKEN` backend'da va Meta App sozlamalarida bir xilligini tekshiring
- Backend ishga tushganini tekshiring: `curl http://localhost:8000/health`
- Callback URL'ga to'g'ridan-to'g'ri GET so'rov yuborib ko'ring (Meta yuboradigan format bilan):
  ```bash
  curl "https://<domen>/webhook/meta?hub.mode=subscribe&hub.verify_token=<TOKEN>&hub.challenge=test123"
  # "test123" qaytishi kerak
  ```

**Xabar kelmayapti:**
- Webhook Fields'da `messages` yoqilganini tekshiring
- App **Roles** bo'limida sizning Instagram/Facebook akkauntingiz Test User sifatida qo'shilganini tekshiring (Development rejimida)

**Javob yuborilmayapti:**
- `FACEBOOK_PAGE_ACCESS_TOKEN` to'g'ri va muddati o'tmaganligini tekshiring (qisqa muddatli tokenlar ~1-2 soatda tugaydi — uzoq muddatli tokenga almashtiring)
