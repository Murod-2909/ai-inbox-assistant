import type { Dictionary } from "./common";

export const nav = {
  "nav.inbox": { uz: "Xabarlar", ru: "Сообщения", en: "Messages" },
  "nav.channels": { uz: "Kanallar", ru: "Каналы", en: "Channels" },
  "nav.analytics": { uz: "Tahlil", ru: "Аналитика", en: "Analytics" },
  "nav.settings": { uz: "Sozlamalar", ru: "Настройки", en: "Settings" },
  "nav.logout": { uz: "Chiqish", ru: "Выйти", en: "Log out" },
  "nav.theme": { uz: "Tema almashtirish", ru: "Сменить тему", en: "Toggle theme" },
  "nav.defaultBusiness": { uz: "Demo biznes", ru: "Демо-бизнес", en: "Demo business" },
  "nav.planLabel": {
    uz: "{{plan}} tarif",
    ru: "Тариф «{{plan}}»",
    en: "{{plan}} plan",
  },
  "plan.free": { uz: "Bepul", ru: "Бесплатный", en: "Free" },
  "plan.start": { uz: "Start", ru: "Старт", en: "Start" },
  "plan.business": { uz: "Biznes", ru: "Бизнес", en: "Business" },
} satisfies Dictionary;
