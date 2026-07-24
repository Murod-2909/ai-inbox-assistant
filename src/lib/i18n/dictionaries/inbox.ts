import type { Dictionary } from "./common";

export const inbox = {
  "inbox.demoBanner": {
    uz: "Demo rejim — backend ulanmagan (namunaviy ma'lumotlar)",
    ru: "Демо-режим — бэкенд не подключён (демонстрационные данные)",
    en: "Demo mode — backend not connected (sample data)",
  },
  "inbox.notifBanner": {
    uz: "🔔 Yangi xabarlar uchun bildirishnomalarni yoqish",
    ru: "🔔 Включить уведомления о новых сообщениях",
    en: "🔔 Enable notifications for new messages",
  },
  "inbox.selectConversation": { uz: "Suhbat tanlang", ru: "Выберите чат", en: "Select a conversation" },
  "inbox.header.title": { uz: "Xabarlar", ru: "Сообщения", en: "Messages" },

  "inbox.search.placeholder": { uz: "Qidirish...", ru: "Поиск...", en: "Search..." },
  "inbox.search.clear": { uz: "Tozalash", ru: "Очистить", en: "Clear" },
  "inbox.search.noResults": {
    uz: "\"{{query}}\" bo'yicha hech narsa topilmadi",
    ru: "По запросу «{{query}}» ничего не найдено",
    en: "No results for \"{{query}}\"",
  },

  "inbox.filter.all": { uz: "Barchasi", ru: "Все", en: "All" },
  "inbox.filter.mine": { uz: "Mening", ru: "Мои", en: "Mine" },
  "inbox.filter.unassigned": { uz: "Tayinlanmagan", ru: "Не назначено", en: "Unassigned" },
  "inbox.filter.emptyMine": {
    uz: "Sizga tayinlangan suhbat yo'q",
    ru: "Вам не назначено ни одного чата",
    en: "No conversations assigned to you",
  },
  "inbox.filter.emptyUnassigned": {
    uz: "Tayinlanmagan suhbat yo'q",
    ru: "Нет неназначенных чатов",
    en: "No unassigned conversations",
  },
  "inbox.filter.emptyAll": { uz: "Suhbat yo'q", ru: "Чатов нет", en: "No conversations" },

  "inbox.empty.title": { uz: "Hozircha suhbat yo'q", ru: "Пока нет чатов", en: "No conversations yet" },
  "inbox.empty.text": {
    uz: "Kanal ulanishi bilan mijozlaringiz yozgan xabarlar shu yerda avtomatik paydo bo'ladi.",
    ru: "После подключения канала сообщения от клиентов будут появляться здесь автоматически.",
    en: "Once you connect a channel, messages from your customers will appear here automatically.",
  },
  "inbox.empty.cta": { uz: "Kanal ulash", ru: "Подключить канал", en: "Connect a channel" },

  "inbox.panel.back": { uz: "Orqaga", ru: "Назад", en: "Back" },
  "inbox.panel.sentimentPositive": { uz: "😊 Ijobiy", ru: "😊 Позитив", en: "😊 Positive" },
  "inbox.panel.sentimentNeutral": { uz: "😐 Neytral", ru: "😐 Нейтрально", en: "😐 Neutral" },
  "inbox.panel.sentimentNegative": { uz: "😠 Salbiy", ru: "😠 Негатив", en: "😠 Negative" },
  "inbox.panel.intentQuestion": { uz: "❓ Savol", ru: "❓ Вопрос", en: "❓ Question" },
  "inbox.panel.intentComplaint": { uz: "⚠️ Shikoyat", ru: "⚠️ Жалоба", en: "⚠️ Complaint" },
  "inbox.panel.intentOrder": { uz: "🛒 Buyurtma", ru: "🛒 Заказ", en: "🛒 Order" },
  "inbox.panel.intentFeedback": { uz: "💬 Fikr", ru: "💬 Отзыв", en: "💬 Feedback" },
  "inbox.panel.intentOther": { uz: "📋 Boshqa", ru: "📋 Другое", en: "📋 Other" },
  "inbox.panel.assignedToMe": { uz: "✓ Menga tayinlangan", ru: "✓ Назначено мне", en: "✓ Assigned to me" },
  "inbox.panel.assignedToOther": {
    uz: "Boshqa operatorga tayinlangan",
    ru: "Назначено другому оператору",
    en: "Assigned to another operator",
  },
  "inbox.panel.assignToMe": { uz: "Menga tayinlash", ru: "Назначить мне", en: "Assign to me" },
  "inbox.panel.notesToggleTitle": {
    uz: "Ichki eslatmalar (mijoz ko'rmaydi)",
    ru: "Внутренние заметки (клиент не видит)",
    en: "Internal notes (customer can't see)",
  },
  "inbox.panel.notesHeader": {
    uz: "Ichki eslatmalar — faqat operatorlar ko'radi",
    ru: "Внутренние заметки — видны только операторам",
    en: "Internal notes — visible only to operators",
  },
  "inbox.panel.notesUnavailable": {
    uz: "Eslatmalar uchun backend kerak (demo rejimda mavjud emas)",
    ru: "Для заметок нужен бэкенд (недоступно в демо-режиме)",
    en: "Notes require a backend (unavailable in demo mode)",
  },
  "inbox.panel.notesEmpty": { uz: "Hozircha eslatma yo'q", ru: "Пока нет заметок", en: "No notes yet" },
  "inbox.panel.notePlaceholder": {
    uz: "Eslatma yozing...",
    ru: "Напишите заметку...",
    en: "Write a note...",
  },
  "inbox.panel.aiSuggestion": { uz: "✨ AI javob taklifi", ru: "✨ Предложение AI", en: "✨ AI suggested reply" },
  "inbox.panel.useSuggestion": { uz: "Ishlatish", ru: "Использовать", en: "Use" },
  "inbox.panel.templatesToggleTitle": {
    uz: "Tezkor javob shablonlari",
    ru: "Быстрые шаблоны ответов",
    en: "Quick reply templates",
  },
  "inbox.panel.composerPlaceholder": {
    uz: "Javob yozing...",
    ru: "Напишите ответ...",
    en: "Write a reply...",
  },

  "inbox.fallbackTemplate1Title": { uz: "Salomlashish", ru: "Приветствие", en: "Greeting" },
  "inbox.fallbackTemplate1Text": {
    uz: "Assalomu alaykum! Xush kelibsiz, sizga qanday yordam bera olamiz?",
    ru: "Здравствуйте! Добро пожаловать, чем можем помочь?",
    en: "Hello! Welcome, how can we help you?",
  },
  "inbox.fallbackTemplate2Title": { uz: "Ish vaqti", ru: "Часы работы", en: "Working hours" },
  "inbox.fallbackTemplate2Text": {
    uz: "Ish vaqtimiz: dushanba–shanba, 9:00 dan 18:00 gacha.",
    ru: "Наши часы работы: пн–сб, с 9:00 до 18:00.",
    en: "Our working hours: Mon–Sat, 9am to 6pm.",
  },
  "inbox.fallbackTemplate3Title": { uz: "Kutish", ru: "Ожидание", en: "Please wait" },
  "inbox.fallbackTemplate3Text": {
    uz: "Xabaringizni oldik! Mutaxassisimiz tez orada javob beradi.",
    ru: "Мы получили ваше сообщение! Наш специалист скоро ответит.",
    en: "We received your message! Our team will reply shortly.",
  },

  "inbox.welcome.close": { uz: "Yopish", ru: "Закрыть", en: "Close" },
  "inbox.welcome.title": {
    uz: "Xush kelibsiz, AI Inbox Assistant'ga! 🎉",
    ru: "Добро пожаловать в AI Inbox Assistant! 🎉",
    en: "Welcome to AI Inbox Assistant! 🎉",
  },
  "inbox.welcome.subtitle": {
    uz: "Barcha mijoz xabarlaringiz endi bitta joyda — AI tahlili va tayyor javob takliflari bilan.",
    ru: "Все сообщения ваших клиентов теперь в одном месте — с AI-анализом и готовыми ответами.",
    en: "All your customer messages are now in one place — with AI analysis and suggested replies.",
  },
  "inbox.welcome.cta": { uz: "Ishga tushirish", ru: "Начать", en: "Get started" },
  "inbox.welcome.demoQuestion": {
    uz: "Buyurtmam qachon yetib keladi?",
    ru: "Когда придёт мой заказ?",
    en: "When will my order arrive?",
  },
  "inbox.welcome.demoReply": {
    uz: "✨ \"Buyurtmangiz ertaga yetkaziladi — kuzatuv raqamini yubordim!\"",
    ru: "✨ «Ваш заказ будет доставлен завтра — я отправил номер отслеживания!»",
    en: "✨ \"Your order will be delivered tomorrow — I've sent you the tracking number!\"",
  },
} satisfies Dictionary;
