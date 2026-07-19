# AI token sarfini optimallashtirish strategiyasi

Backend (FastAPI) qurilganda AI so'rovlari shu tamoyillar asosida yoziladi. Maqsad: har bir mijoz xabari uchun minimal token sarflab, sifatli tahlil olish.

## 1. Bir marta tahlil qil, keshla

- Har bir xabar tahlili (`sentiment`, `intent`, `suggestedReply`) Supabase'da **xabar ID'siga bog'lab saqlanadi** — frontend `types.ts` dagi `AiAnalysis` shunga mo'ljallangan.
- UI qayta yuklanganda yoki operator suhbatni qayta ochganda **hech qachon qayta so'rov yuborilmaydi** — tayyor tahlil bazadan o'qiladi.
- Tahlil faqat **yangi mijoz xabari** kelganda ishga tushadi; biznes javoblari tahlil qilinmaydi.

## 2. Arzon oldindan filtrlash (AI'siz)

AI chaqirishdan **oldin** oddiy Python heuristikalari ishlaydi:

- Juda qisqa xabarlar ("ok", "rahmat", "👍", stiker) — tahlilga yuborilmaydi, `intent: other / sentiment: neutral` avtomatik qo'yiladi.
- Salomlashishlar lug'at bilan aniqlanadi (regex/keyword ro'yxati).
- Bir mijoz ketma-ket bir nechta xabar yozsa — **debounce**: 30–60 soniya kutib, xabarlar bittaga birlashtirilib bitta so'rov yuboriladi.

## 3. Ikki pog'onali model

| Vazifa | Model | Sabab |
|---|---|---|
| Sentiment + intent klassifikatsiya | Kichik/tezkor model (masalan, Claude Haiku) | Oddiy klassifikatsiya, arzon token narxi |
| Javob generatsiyasi | Kattaroq model — faqat kerak bo'lganda | Sifat muhim, lekin har xabarga emas |

- Javob taklifi faqat operator suhbatni **ochganda** yoki xabar "shikoyat/salbiy" deb belgilanganda generatsiya qilinadi (lazy generation).
- Oddiy savollarga (ish vaqti, manzil) — AI o'rniga **shablon javoblar** bazasi ishlatiladi; AI faqat shablonga mos kelmaganda chaqiriladi.

## 4. Qisqa va samarali prompt

- System prompt qisqa va **o'zgarmas** — Claude API'ning **prompt caching** funksiyasi bilan keshga olinadi (o'zgarmas qism har so'rovda qayta hisoblanmaydi).
- Kontekstga **butun suhbat tarixi emas**, faqat oxirgi 3–5 xabar yuboriladi.
- Chiqish formati qattiq JSON schema bilan cheklanadi (`{"sentiment": "...", "intent": "..."}`) — ortiqcha matn generatsiya qilinmaydi.
- Biznes haqidagi ma'lumot (nomi, soha, ish vaqti) bitta qisqa blok sifatida keshlanadigan prompt qismiga kiradi.

## 5. Statistika — AI'siz

Tahlil sahifasidagi barcha ko'rsatkichlar (kayfiyat taqsimoti, murojaat turlari, hajm) saqlangan tahlil natijalaridan **SQL agregatsiya** bilan hisoblanadi — hech qanday qo'shimcha AI so'rovisiz.

## Kutilayotgan natija

Naiv yondashuvga nisbatan («har xabarga katta model, to'liq tarix bilan»):

- ~50–70% xabar umuman AI'ga bormaydi (filtr + shablon + debounce)
- Qolganlarning ko'pi arzon model bilan tahlil qilinadi
- Prompt caching kirish tokenlarining katta qismini 10x arzonlashtiradi
