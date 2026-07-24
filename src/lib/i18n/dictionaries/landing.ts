import type { Dictionary } from "./common";

export const landing = {
  "landing.nav.features": { uz: "Xususiyatlar", ru: "Возможности", en: "Features" },
  "landing.nav.how": { uz: "Qanday ishlaydi", ru: "Как это работает", en: "How it works" },
  "landing.nav.pricing": { uz: "Narxlar", ru: "Тарифы", en: "Pricing" },
  "landing.nav.faq": { uz: "FAQ", ru: "Вопросы", en: "FAQ" },
  "landing.nav.login": { uz: "Kirish", ru: "Войти", en: "Log in" },
  "landing.nav.signup": { uz: "Bepul boshlash", ru: "Начать бесплатно", en: "Start free" },

  "landing.hero.title1": {
    uz: "Barcha mijoz xabarlari.",
    ru: "Все сообщения клиентов.",
    en: "Every customer message.",
  },
  "landing.hero.title2": {
    uz: "Bitta joyda. AI bilan.",
    ru: "В одном месте. С AI.",
    en: "One place. With AI.",
  },
  "landing.hero.subtitle": {
    uz: "Do'kon, klinika, salon yoki o'quv markazi uchun: Telegram xabarlarini yagona inbox'ga yig'ing, AI tahlili va tayyor javob takliflari bilan mijozlarga 3 barobar tez javob bering.",
    ru: "Для магазина, клиники, салона или учебного центра: собирайте сообщения Telegram в единый inbox и отвечайте клиентам в 3 раза быстрее благодаря AI-анализу и готовым ответам.",
    en: "For shops, clinics, salons, or education centers: gather Telegram messages into one inbox and reply to customers 3x faster with AI analysis and suggested replies.",
  },
  "landing.hero.ctaPrimary": { uz: "Bepul boshlash", ru: "Начать бесплатно", en: "Start free" },
  "landing.hero.ctaSecondary": {
    uz: "Jonli demo ko'rish",
    ru: "Посмотреть демо",
    en: "See live demo",
  },
  "landing.hero.note": {
    uz: "Karta talab qilinmaydi · 5 daqiqada ulanish",
    ru: "Карта не требуется · Подключение за 5 минут",
    en: "No card required · Set up in 5 minutes",
  },

  "landing.preview.customer1Name": { uz: "Dilnoza K.", ru: "Дилноза К.", en: "Dilnoza K." },
  "landing.preview.customer1Msg": {
    uz: "Ertaga 15:00 ga yozilsam...",
    ru: "Можно записаться на завтра в 15:00...",
    en: "Can I book for tomorrow at 3pm...",
  },
  "landing.preview.customer2Name": { uz: "Jasur T.", ru: "Жасур Т.", en: "Jasur T." },
  "landing.preview.customer2Msg": {
    uz: "Buyurtmam kelmayapti!",
    ru: "Мой заказ не приходит!",
    en: "My order hasn't arrived!",
  },
  "landing.preview.customer3Name": { uz: "Madina R.", ru: "Мадина Р.", en: "Madina R." },
  "landing.preview.customer3Msg": {
    uz: "Narxi qancha?",
    ru: "Сколько это стоит?",
    en: "How much does it cost?",
  },
  "landing.preview.sentimentNegative": { uz: "😠 Salbiy", ru: "😠 Негатив", en: "😠 Negative" },
  "landing.preview.complaint": { uz: "⚠️ Shikoyat", ru: "⚠️ Жалоба", en: "⚠️ Complaint" },
  "landing.preview.bubble": {
    uz: "Buyurtmam 3 kundan beri kelmayapti!",
    ru: "Мой заказ не приходит уже 3 дня!",
    en: "My order hasn't arrived in 3 days!",
  },
  "landing.preview.suggestion": {
    uz: "✨ AI taklifi: \"Uzr so'raymiz! Buyurtma raqamingizni yuboring, hoziroq tekshiramiz.\"",
    ru: "✨ Предложение AI: «Приносим извинения! Отправьте номер заказа, мы сразу проверим».",
    en: "✨ AI suggestion: \"Sorry about that! Send your order number and we'll check right away.\"",
  },

  "landing.audience.title": {
    uz: "Sohangizga moslashtirilgan",
    ru: "Адаптировано под вашу сферу",
    en: "Tailored to your industry",
  },
  "landing.industry.shops.title": { uz: "Do'konlar", ru: "Магазины", en: "Shops" },
  "landing.industry.shops.subtitle": {
    uz: "Mahsulot va buyurtma savollari",
    ru: "Вопросы о товарах и заказах",
    en: "Product and order questions",
  },
  "landing.industry.shops.detail": {
    uz: "Narx, mavjudlik va yetkazib berish holati haqidagi savollarga AI darhol javob taklif qiladi — siz faqat tasdiqlaysiz.",
    ru: "AI сразу предлагает ответ на вопросы о цене, наличии и доставке — вам остаётся лишь подтвердить.",
    en: "AI instantly suggests replies to price, availability, and delivery questions — you just approve them.",
  },
  "landing.industry.clinics.title": { uz: "Klinikalar", ru: "Клиники", en: "Clinics" },
  "landing.industry.clinics.subtitle": {
    uz: "Navbat va konsultatsiya so'rovlari",
    ru: "Запись на приём и консультации",
    en: "Appointment and consultation requests",
  },
  "landing.industry.clinics.detail": {
    uz: "Bemorlarning yozilish va ish vaqti haqidagi murojaatlari avtomatik tartiblanadi, shoshilinch xabarlar ajratib ko'rsatiladi.",
    ru: "Обращения пациентов о записи и графике работы автоматически упорядочиваются, срочные сообщения выделяются.",
    en: "Patient requests about booking and hours are sorted automatically, with urgent messages flagged.",
  },
  "landing.industry.salons.title": { uz: "Salonlar", ru: "Салоны", en: "Salons" },
  "landing.industry.salons.subtitle": {
    uz: "Yozilish va bandlik savollari",
    ru: "Вопросы о записи и занятости",
    en: "Booking and availability questions",
  },
  "landing.industry.salons.detail": {
    uz: "Mijozlar bo'sh vaqtlarni so'raganda, tayyor javob shablonlari bilan bir necha soniyada javob bering.",
    ru: "Когда клиенты спрашивают о свободном времени, отвечайте за секунды готовыми шаблонами.",
    en: "When customers ask about open slots, reply in seconds with ready-made templates.",
  },
  "landing.industry.education.title": {
    uz: "O'quv markazlari",
    ru: "Учебные центры",
    en: "Education centers",
  },
  "landing.industry.education.subtitle": {
    uz: "Kurs va ro'yxatga olish savollari",
    ru: "Вопросы о курсах и записи",
    en: "Course and enrollment questions",
  },
  "landing.industry.education.detail": {
    uz: "Kurs narxi, jadvali va ro'yxatdan o'tish bo'yicha takroriy savollarni AI hal qiladi, murakkab holatlar operatorga qoladi.",
    ru: "AI решает повторяющиеся вопросы о цене курса, расписании и записи, сложные случаи остаются оператору.",
    en: "AI handles repetitive questions about course price, schedule, and enrollment, leaving complex cases to operators.",
  },

  "landing.channels.title": {
    uz: "Mijozlaringiz qayerda bo'lsa — siz ham o'sha yerdasiz",
    ru: "Где ваши клиенты — там и вы",
    en: "Wherever your customers are, you're there too",
  },
  "landing.channels.telegram": { uz: "Telegram", ru: "Telegram", en: "Telegram" },
  "landing.channels.whatsapp": { uz: "WhatsApp", ru: "WhatsApp", en: "WhatsApp" },
  "landing.channels.instagram": { uz: "Instagram", ru: "Instagram", en: "Instagram" },
  "landing.channels.active": { uz: "Faol", ru: "Активен", en: "Active" },
  "landing.channels.soon": { uz: "Tez orada", ru: "Скоро", en: "Coming soon" },

  "landing.features.title": {
    uz: "Kichik jamoa uchun katta imkoniyatlar",
    ru: "Большие возможности для небольшой команды",
    en: "Big capabilities for a small team",
  },
  "landing.features.inbox.title": { uz: "Yagona inbox", ru: "Единый inbox", en: "Unified inbox" },
  "landing.features.inbox.text": {
    uz: "Telegram (keyin WhatsApp, Instagram) xabarlari bitta oynada — hech narsa e'tibordan chetda qolmaydi.",
    ru: "Сообщения Telegram (позже WhatsApp, Instagram) в одном окне — ничего не потеряется.",
    en: "Telegram messages (WhatsApp and Instagram next) in one window — nothing slips through.",
  },
  "landing.features.ai.title": { uz: "AI tahlil", ru: "AI-анализ", en: "AI analysis" },
  "landing.features.ai.text": {
    uz: "Har bir xabarning kayfiyati va maqsadi (savol, buyurtma, shikoyat) avtomatik aniqlanadi.",
    ru: "Настроение и цель (вопрос, заказ, жалоба) каждого сообщения определяются автоматически.",
    en: "Every message's sentiment and intent (question, order, complaint) is detected automatically.",
  },
  "landing.features.suggestion.title": {
    uz: "Javob taklifi",
    ru: "Предложение ответа",
    en: "Reply suggestions",
  },
  "landing.features.suggestion.text": {
    uz: "AI mijozga mos javob taklif qiladi — operator bir bosishda tasdiqlab yuboradi.",
    ru: "AI предлагает подходящий ответ клиенту — оператор отправляет его в один клик.",
    en: "AI suggests a fitting reply — the operator sends it with one click.",
  },
  "landing.features.media.title": { uz: "Media va ovoz", ru: "Медиа и голос", en: "Media and voice" },
  "landing.features.media.text": {
    uz: "Rasm, video, stiker va ovozli xabarlar dashboard'da ochiladi; ovoz matnga aylanadi.",
    ru: "Фото, видео, стикеры и голосовые сообщения открываются в дашборде; голос переводится в текст.",
    en: "Photos, videos, stickers, and voice messages open right in the dashboard; voice is transcribed to text.",
  },
  "landing.features.stats.title": { uz: "Jonli statistika", ru: "Статистика в реальном времени", en: "Live statistics" },
  "landing.features.stats.text": {
    uz: "Javob tezligi, kayfiyat va murojaat turlari bo'yicha real vaqtdagi hisobotlar.",
    ru: "Отчёты в реальном времени по скорости ответа, настроению и типам обращений.",
    en: "Real-time reports on response speed, sentiment, and inquiry types.",
  },
  "landing.features.templates.title": {
    uz: "Tezkor shablonlar",
    ru: "Быстрые шаблоны",
    en: "Quick templates",
  },
  "landing.features.templates.text": {
    uz: "Ko'p so'raladigan savollarga tayyor javoblar — jamoa bir xilda va tez javob beradi.",
    ru: "Готовые ответы на частые вопросы — команда отвечает единообразно и быстро.",
    en: "Ready-made replies for frequent questions — the team responds consistently and fast.",
  },

  "landing.how.title": {
    uz: "3 qadamda ishga tushiring",
    ru: "Запуск за 3 шага",
    en: "Get started in 3 steps",
  },
  "landing.how.step1.title": { uz: "Botni ulang", ru: "Подключите бота", en: "Connect your bot" },
  "landing.how.step1.text": {
    uz: "@BotFather'dan olingan tokenni kiriting — 1 daqiqada tayyor.",
    ru: "Введите токен, полученный от @BotFather — готово за 1 минуту.",
    en: "Enter the token from @BotFather — ready in 1 minute.",
  },
  "landing.how.step2.title": {
    uz: "Xabarlar oqib keladi",
    ru: "Сообщения начинают поступать",
    en: "Messages start flowing in",
  },
  "landing.how.step2.text": {
    uz: "Mijozlaringiz yozgan har bir xabar darhol inbox'ingizga tushadi.",
    ru: "Каждое сообщение от клиента сразу попадает в ваш inbox.",
    en: "Every message from your customers lands in your inbox instantly.",
  },
  "landing.how.step3.title": {
    uz: "AI bilan javob bering",
    ru: "Отвечайте с помощью AI",
    en: "Reply with AI",
  },
  "landing.how.step3.text": {
    uz: "Tahlil va tayyor javob taklifini ko'rib, bir bosishda yuboring.",
    ru: "Посмотрите анализ и готовый ответ, отправьте в один клик.",
    en: "Review the analysis and suggested reply, then send with one click.",
  },

  "landing.pricing.title": {
    uz: "Oddiy va oshkora narxlar",
    ru: "Простые и прозрачные тарифы",
    en: "Simple, transparent pricing",
  },
  "landing.pricing.note": {
    uz: "Narxlar dastlabki — rasmiy ishga tushishda aniqlashtiriladi",
    ru: "Цены предварительные — уточнятся при официальном запуске",
    en: "Prices are preliminary — will be finalized at official launch",
  },

  "landing.faq.title": {
    uz: "Ko'p so'raladigan savollar",
    ru: "Часто задаваемые вопросы",
    en: "Frequently asked questions",
  },
  "landing.faq.q1": {
    uz: "Ulanish uchun texnik bilim kerakmi?",
    ru: "Нужны ли технические знания для подключения?",
    en: "Do I need technical skills to connect?",
  },
  "landing.faq.a1": {
    uz: "Yo'q. Telegram'da @BotFather orqali bot yaratib, tokenni tizimga kiritasiz — qolganini biz qilamiz. Butun jarayon 5 daqiqadan oshmaydi.",
    ru: "Нет. Создайте бота через @BotFather в Telegram и введите токен в систему — остальное сделаем мы. Весь процесс занимает не более 5 минут.",
    en: "No. Create a bot via @BotFather on Telegram and enter the token — we handle the rest. The whole process takes under 5 minutes.",
  },
  "landing.faq.q2": {
    uz: "AI mijozga o'zi javob yuboradimi?",
    ru: "AI сам отвечает клиенту?",
    en: "Does the AI reply to customers on its own?",
  },
  "landing.faq.a2": {
    uz: "Yo'q — AI faqat taklif qiladi. Har bir javob operator tasdiqlagandan keyingina yuboriladi. Ish vaqtidan tashqarida esa ixtiyoriy avto-javobni yoqishingiz mumkin.",
    ru: "Нет — AI только предлагает. Каждый ответ отправляется только после подтверждения оператором. Вне рабочего времени можно включить автоответ.",
    en: "No — AI only suggests. Every reply is sent only after operator approval. You can optionally enable auto-replies outside working hours.",
  },
  "landing.faq.q3": {
    uz: "Qaysi kanallar qo'llab-quvvatlanadi?",
    ru: "Какие каналы поддерживаются?",
    en: "Which channels are supported?",
  },
  "landing.faq.a3": {
    uz: "Hozir Telegram to'liq ishlaydi. WhatsApp va Instagram Direct integratsiyalari ustida ishlayapmiz — tez orada qo'shiladi.",
    ru: "Сейчас полностью работает Telegram. Мы работаем над интеграцией WhatsApp и Instagram Direct — скоро добавим.",
    en: "Telegram fully works today. We're working on WhatsApp and Instagram Direct integrations — coming soon.",
  },
  "landing.faq.q4": {
    uz: "Ma'lumotlarim xavfsizmi?",
    ru: "Безопасны ли мои данные?",
    en: "Is my data secure?",
  },
  "landing.faq.a4": {
    uz: "Har bir biznes faqat o'z ma'lumotlarini ko'radi (satr darajasidagi himoya — RLS), API kalitlar serverda saqlanadi va mijoz ma'lumotlari uchinchi tomonga berilmaydi.",
    ru: "Каждый бизнес видит только свои данные (защита на уровне строк — RLS), API-ключи хранятся на сервере, данные клиентов третьим лицам не передаются.",
    en: "Each business sees only its own data (row-level security — RLS), API keys are stored server-side, and customer data is never shared with third parties.",
  },

  "landing.finalCta.title": {
    uz: "Mijozlaringizni kuttirmang",
    ru: "Не заставляйте клиентов ждать",
    en: "Don't keep your customers waiting",
  },
  "landing.finalCta.text": {
    uz: "Bugun ulaning — birinchi xabarlar 5 daqiqada inbox'ingizda.",
    ru: "Подключитесь сегодня — первые сообщения будут в inbox через 5 минут.",
    en: "Connect today — your first messages will be in your inbox in 5 minutes.",
  },

  "landing.footer.tagline": {
    uz: "Kichik bizneslar uchun AI yordamchili mijozlar inbox'i.",
    ru: "AI-помощник для входящих сообщений малого бизнеса.",
    en: "An AI-assisted customer inbox for small businesses.",
  },
  "landing.footer.product": { uz: "Mahsulot", ru: "Продукт", en: "Product" },
  "landing.footer.liveDemo": { uz: "Jonli demo", ru: "Живая демо", en: "Live demo" },
  "landing.footer.account": { uz: "Hisob", ru: "Аккаунт", en: "Account" },
  "landing.footer.signup": { uz: "Ro'yxatdan o'tish", ru: "Регистрация", en: "Sign up" },
  "landing.footer.resetPassword": {
    uz: "Parolni tiklash",
    ru: "Восстановить пароль",
    en: "Reset password",
  },
  "landing.footer.rights": {
    uz: "barcha huquqlar himoyalangan",
    ru: "все права защищены",
    en: "all rights reserved",
  },
} satisfies Dictionary;
