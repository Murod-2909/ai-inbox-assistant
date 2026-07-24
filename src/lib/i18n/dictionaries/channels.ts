import type { Dictionary } from "./common";

export const channels = {
  "channels.title": { uz: "Kanallar", ru: "Каналы", en: "Channels" },
  "channels.subtitle": {
    uz: "Mijozlar yozadigan platformalarni ulang — barcha xabarlar bitta joyga tushadi.",
    ru: "Подключите платформы, где пишут клиенты — все сообщения будут в одном месте.",
    en: "Connect the platforms your customers message you on — everything lands in one place.",
  },
  "channels.status.connected": { uz: "Ulangan", ru: "Подключено", en: "Connected" },
  "channels.status.connecting": { uz: "Ulanmoqda...", ru: "Подключение...", en: "Connecting..." },
  "channels.status.disconnected": { uz: "Ulanmagan", ru: "Не подключено", en: "Not connected" },
  "channels.status.soon": { uz: "Tez orada", ru: "Скоро", en: "Coming soon" },
  "channels.connectButton": { uz: "Ulash", ru: "Подключить", en: "Connect" },

  "channels.telegram.step1": {
    uz: "Telegram'da @BotFather ga yozing",
    ru: "Напишите @BotFather в Telegram",
    en: "Message @BotFather on Telegram",
  },
  "channels.telegram.step2": {
    uz: "/newbot buyrug'i bilan yangi bot yarating",
    ru: "Создайте нового бота командой /newbot",
    en: "Create a new bot with the /newbot command",
  },
  "channels.telegram.step3": {
    uz: "Berilgan bot tokenini quyiga joylashtiring",
    ru: "Вставьте полученный токен бота ниже",
    en: "Paste the bot token you receive below",
  },
  "channels.telegram.tokenPlaceholder": {
    uz: "Bot token (masalan: 123456:ABC-DEF...)",
    ru: "Токен бота (например: 123456:ABC-DEF...)",
    en: "Bot token (e.g. 123456:ABC-DEF...)",
  },
  "channels.telegram.connectedText": {
    uz: "✅ Bot muvaffaqiyatli ulandi. Yangi xabarlar Xabarlar bo'limiga tusha boshlaydi.",
    ru: "✅ Бот успешно подключён. Новые сообщения будут появляться в разделе «Сообщения».",
    en: "✅ Bot connected successfully. New messages will start appearing in the Messages section.",
  },

  "channels.facebook.title": { uz: "Facebook Messenger", ru: "Facebook Messenger", en: "Facebook Messenger" },
  "channels.facebook.step1": {
    uz: "developers.facebook.com'da App yarating",
    ru: "Создайте приложение на developers.facebook.com",
    en: "Create an app at developers.facebook.com",
  },
  "channels.facebook.step2": {
    uz: "Facebook Page'ingizni ulang",
    ru: "Подключите вашу Facebook Page",
    en: "Connect your Facebook Page",
  },
  "channels.facebook.step3": {
    uz: "Page Access Token'ni quyiga joylashtiring",
    ru: "Вставьте Page Access Token ниже",
    en: "Paste the Page Access Token below",
  },
  "channels.facebook.tokenPlaceholder": {
    uz: "Page Access Token",
    ru: "Page Access Token",
    en: "Page Access Token",
  },
  "channels.facebook.docsHint": {
    uz: "Batafsil qo'llanma: docs/meta-setup.md",
    ru: "Подробная инструкция: docs/meta-setup.md",
    en: "Detailed guide: docs/meta-setup.md",
  },
  "channels.facebook.connectedText": {
    uz: "✅ Facebook Page ulandi. Messenger xabarlari Xabarlar bo'limiga tusha boshlaydi.",
    ru: "✅ Facebook Page подключена. Сообщения Messenger будут появляться в разделе «Сообщения».",
    en: "✅ Facebook Page connected. Messenger messages will start appearing in the Messages section.",
  },

  "channels.instagram.connectedText": {
    uz: "✅ Instagram Facebook Page orqali avtomatik ulandi. DM xabarlari Xabarlar bo'limiga tusha boshlaydi.",
    ru: "✅ Instagram автоматически подключён через Facebook Page. Сообщения DM будут появляться в разделе «Сообщения».",
    en: "✅ Instagram was auto-connected via your Facebook Page. DMs will start appearing in the Messages section.",
  },
  "channels.instagram.notConnectedText": {
    uz: "Instagram Business akkaunt doim Facebook Page'ga ulangan bo'ladi — shuning uchun alohida ulanish shart emas. Facebook Messenger kartasida ulang, Instagram ham avtomatik yoqiladi.",
    ru: "Аккаунт Instagram Business всегда привязан к Facebook Page — отдельное подключение не требуется. Подключите через карточку Facebook Messenger, и Instagram включится автоматически.",
    en: "An Instagram Business account is always linked to a Facebook Page, so no separate connection is needed. Connect via the Facebook Messenger card and Instagram activates automatically.",
  },

  "channels.whatsapp.soon": {
    uz: "WhatsApp Business API integratsiyasi keyingi bosqichda qo'shiladi.",
    ru: "Интеграция WhatsApp Business API будет добавлена на следующем этапе.",
    en: "WhatsApp Business API integration will be added in a future phase.",
  },
} satisfies Dictionary;
