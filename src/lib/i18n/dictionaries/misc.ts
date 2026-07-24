import type { Dictionary } from "./common";

export const misc = {
  "misc.notFound.title": { uz: "Sahifa topilmadi", ru: "Страница не найдена", en: "Page not found" },
  "misc.notFound.text": {
    uz: "Qidirilayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.",
    ru: "Искомая страница не существует или была перемещена.",
    en: "The page you're looking for doesn't exist or may have moved.",
  },
  "misc.notFound.home": { uz: "Bosh sahifaga qaytish", ru: "На главную", en: "Back to home" },
  "misc.notFound.inbox": { uz: "Inbox'ga o'tish", ru: "Перейти в Inbox", en: "Go to inbox" },

  "misc.success.title": { uz: "To'lov Muvaffaqiyatli!", ru: "Оплата прошла успешно!", en: "Payment successful!" },
  "misc.success.subtitle": {
    uz: "Raxmat! Sizning obunangiz faollashtirildi.",
    ru: "Спасибо! Ваша подписка активирована.",
    en: "Thank you! Your subscription is now active.",
  },
  "misc.success.step1Title": { uz: "Akkauntingiz tayyorlandi", ru: "Ваш аккаунт готов", en: "Your account is ready" },
  "misc.success.step1Text": {
    uz: "Barcha xususiyatlar o'rnatildi va ishlatish uchun tayyor.",
    ru: "Все функции настроены и готовы к использованию.",
    en: "All features are set up and ready to use.",
  },
  "misc.success.step2Title": { uz: "Telegram botini ulang", ru: "Подключите Telegram-бота", en: "Connect your Telegram bot" },
  "misc.success.step2Text": {
    uz: "Sozlamalarda @BotFather'dan olingan tokenni kiriting — ishga tushirish uchun 1 daqiqa kifoya.",
    ru: "Введите в настройках токен, полученный от @BotFather — на запуск уйдёт 1 минута.",
    en: "Enter the token from @BotFather in settings — it takes just 1 minute to set up.",
  },
  "misc.success.step3Title": { uz: "Xabarlar oqib keladi", ru: "Сообщения начнут поступать", en: "Messages start flowing in" },
  "misc.success.step3Text": {
    uz: "Barcha mijoz xabarlari darhol inbox'ingizga tushadi. AI tahlil avtomatik ishlaydi.",
    ru: "Все сообщения клиентов сразу попадают в ваш inbox. AI-анализ работает автоматически.",
    en: "All customer messages land in your inbox instantly. AI analysis runs automatically.",
  },
  "misc.success.goInbox": { uz: "Inbox'ga o'tish", ru: "Перейти в Inbox", en: "Go to inbox" },
  "misc.success.goSettings": { uz: "Sozlamalar", ru: "Настройки", en: "Settings" },
  "misc.success.supportPrefix": {
    uz: "Biror savolingiz bo'lsa,",
    ru: "Если у вас есть вопросы, пишите на",
    en: "If you have any questions, email",
  },
  "misc.success.supportSuffix": {
    uz: "ga yozing.",
    ru: "",
    en: "",
  },

  "misc.onboarding.greeting": {
    uz: "👋 Salom, {{name}}! Boshlaymiz.",
    ru: "👋 Привет, {{name}}! Начнём.",
    en: "👋 Hi, {{name}}! Let's get started.",
  },
  "misc.onboarding.defaultName": { uz: "do'stim", ru: "друг", en: "there" },

  "misc.onboarding.task.channel.title": {
    uz: "Kanal ulang — xabarlarni bitta joyga yig'ing",
    ru: "Подключите канал — соберите сообщения в одном месте",
    en: "Connect a channel — gather messages in one place",
  },
  "misc.onboarding.task.channel.description": {
    uz: "Telegram, keyinroq WhatsApp va Instagram — mijozlar yozgan platformadan qat'i nazar, barcha xabarlar bitta inbox'ga tushadi.",
    ru: "Telegram, позже WhatsApp и Instagram — независимо от платформы, все сообщения попадают в единый inbox.",
    en: "Telegram, with WhatsApp and Instagram coming later — no matter the platform, every message lands in one inbox.",
  },
  "misc.onboarding.task.channel.cta": { uz: "Kanalni ulash", ru: "Подключить канал", en: "Connect channel" },

  "misc.onboarding.task.ai.title": {
    uz: "AI tahlil qanday ishlashini ko'ring",
    ru: "Посмотрите, как работает AI-анализ",
    en: "See how AI analysis works",
  },
  "misc.onboarding.task.ai.description": {
    uz: "Har bir xabarning kayfiyati (ijobiy/neytral/salbiy) va maqsadi (savol/shikoyat/buyurtma) avtomatik aniqlanadi, tayyor javob taklif qilinadi.",
    ru: "Настроение (позитив/нейтрально/негатив) и цель (вопрос/жалоба/заказ) каждого сообщения определяются автоматически, предлагается готовый ответ.",
    en: "Every message's sentiment (positive/neutral/negative) and intent (question/complaint/order) is detected automatically, with a suggested reply.",
  },
  "misc.onboarding.task.ai.cta": { uz: "Inbox'ni ochish", ru: "Открыть Inbox", en: "Open inbox" },

  "misc.onboarding.task.templates.title": {
    uz: "Tezkor javob shablonlarini sozlang",
    ru: "Настройте быстрые шаблоны ответов",
    en: "Set up quick reply templates",
  },
  "misc.onboarding.task.templates.description": {
    uz: "Ko'p so'raladigan savollarga (ish vaqti, narx, yetkazib berish) tayyor javoblar — jamoa bir xilda va tez javob beradi.",
    ru: "Готовые ответы на частые вопросы (часы работы, цена, доставка) — команда отвечает единообразно и быстро.",
    en: "Ready-made replies for common questions (hours, pricing, delivery) — the team responds consistently and fast.",
  },
  "misc.onboarding.task.templates.cta": { uz: "Sozlamalarga o'tish", ru: "Перейти в настройки", en: "Go to settings" },

  "misc.onboarding.task.team.title": {
    uz: "Jamoa a'zolarini taklif qiling",
    ru: "Пригласите участников команды",
    en: "Invite your team",
  },
  "misc.onboarding.task.team.description": {
    uz: "Operatorlarni qo'shib, suhbatlarni birga boshqaring. Bu funksiya hozircha tayyorlanmoqda.",
    ru: "Добавьте операторов и управляйте беседами вместе. Эта функция пока готовится.",
    en: "Add operators and manage conversations together. This feature is still in progress.",
  },

  "misc.onboarding.skipToInbox": { uz: "Inbox'ga o'tish →", ru: "Перейти в Inbox →", en: "Go to inbox →" },
  "misc.onboarding.resourcesTitle": { uz: "Resurslar", ru: "Ресурсы", en: "Resources" },
  "misc.onboarding.contactSupport": {
    uz: "Qo'llab-quvvatlash bilan bog'lanish",
    ru: "Связаться с поддержкой",
    en: "Contact support",
  },
  "misc.onboarding.viewDemo": { uz: "Jonli demoni ko'rish", ru: "Посмотреть живую демо", en: "See live demo" },
} satisfies Dictionary;
