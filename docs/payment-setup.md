# Stripe To'lov Integratsiyasi

Narxlar uchun to'lov — Stripe orqali ishlaydi. Buyurtma va obuna boshqaruvi.

## Setup

### 1. Stripe Akkaunt Yaratish

1. [stripe.com](https://stripe.com) ga kirish
2. Akkaunt yaratish (business/individual)
3. **Dashboard → API keys** dan:
   - **Publishable Key** (pk_test_...)
   - **Secret Key** (sk_test_...)

### 2. Environment Variables

**Backend (.env):**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
API_URL=http://localhost:3000  # return_url uchun
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Stripe Price IDs

Checkout'da har bir tarif uchun Stripe Price ID kerak:

1. Dashboard → Products → Create product
2. Har tarif uchun:
   - **Start:** 149,000 so'm/oy → `price_start_...`
   - **Business:** 349,000 so'm/oy → `price_business_...`

3. Price ID'larni checkout.module.tsx'da yangilang:
```typescript
stripePriceId: "price_start_...",
```

## Flow

```
Landing (Narxlar) 
    ↓
[Boshlash] tugmasi → /checkout
    ↓
Plan Selector
    ↓
[Tanlash] → POST /api/checkout
    ↓
Backend: Stripe Session yaratadi
    ↓
Frontend: EmbeddedCheckout ko'rsatadi
    ↓
Kart raqamini, expiry, CVC kiriting
    ↓
Stripe: To'lovni tekshiradi
    ↓
Success Page → /success
    ↓
Inbox'ga o'tish → /inbox
```

## Tarif Narxlar

| Tarif | Narxi | Xususiyatlar |
|-------|-------|------------|
| **Bepul** | 0 so'm | 1 operator, Telegram, 100 AI/oy, asosiy stats |
| **Start** | 149,000 so'm/oy | 3 operator, media, cheksiz AI, templates, full stats |
| **Business** | 349,000 so'm/oy | Cheksiz operator, WhatsApp+Instagram (tez), CRM, auto-replies, priority support |

## Webhook (Advanced)

Production'da Stripe webhooks:
```bash
POST /api/stripe/webhook
```

Events:
- `customer.subscription.created` — yangi obuna
- `customer.subscription.updated` — tarif o'zgartirildi
- `customer.subscription.deleted` — obuna bekor qilindi

## Test Mode

Hozir test mode'da:
```
Card: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
```

Production'da test kartalar ishlamaydi — haqiqiy to'lov ishlaydi.

## Database Schema Update

`businesses` jadvalga qo'shish mumkin:
```sql
ALTER TABLE businesses ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE businesses ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE businesses ADD COLUMN subscription_status TEXT;
```

## Xavfsizlik

- Secret Key aslo frontend'da chiqmasin (maxfiy!)
- HTTPS ishlatamiz (production)
- Webhook signature tekshiring (`stripe.Webhook.constructEvent`)
- Rate limiting qo'shing (brute-force'dan himoya)

## Support

Payment muammolari:
- [Stripe Docs](https://stripe.com/docs)
- [Stripe Dashboard](https://dashboard.stripe.com)
- Test kartalar: https://stripe.com/docs/testing
