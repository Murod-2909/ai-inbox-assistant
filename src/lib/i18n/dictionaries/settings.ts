import type { Dictionary } from "./common";

export const settings = {
  "settings.title": { uz: "Sozlamalar", ru: "Настройки", en: "Settings" },
  "settings.subtitle": {
    uz: "Biznes profili, javob shablonlari va jamoa a'zolarini boshqaring.",
    ru: "Управляйте профилем бизнеса, шаблонами ответов и участниками команды.",
    en: "Manage your business profile, reply templates, and team members.",
  },
  "settings.tab.profile": { uz: "Profil", ru: "Профиль", en: "Profile" },
  "settings.tab.templates": { uz: "Shablonlar", ru: "Шаблоны", en: "Templates" },
  "settings.tab.team": { uz: "Jamoa", ru: "Команда", en: "Team" },

  "settings.profile.currentPlan": { uz: "Joriy tarif", ru: "Текущий тариф", en: "Current plan" },
  "settings.profile.upgradeLink": {
    uz: "Tarifni yangilash →",
    ru: "Изменить тариф →",
    en: "Upgrade plan →",
  },
  "settings.profile.businessName": { uz: "Biznes nomi", ru: "Название бизнеса", en: "Business name" },
  "settings.profile.businessNamePlaceholder": {
    uz: "Masalan, Gulzor Gullar Do'koni",
    ru: "Например, Магазин цветов «Гулзор»",
    en: "e.g. Gulzor Flower Shop",
  },
  "settings.profile.workingHours": { uz: "Ish vaqti", ru: "Часы работы", en: "Working hours" },
  "settings.profile.workingHoursHint": {
    uz: "Yoqilsa, ko'rsatilgan oraliqdan tashqarida kelgan xabarlarga avtomatik javob yuboriladi.",
    ru: "Если включено, на сообщения вне указанного времени будет отправляться автоответ.",
    en: "When enabled, messages outside the given hours get an automatic reply.",
  },
  "settings.profile.start": { uz: "Boshlanishi", ru: "Начало", en: "Start" },
  "settings.profile.end": { uz: "Tugashi", ru: "Конец", en: "End" },
  "settings.profile.autoReplyMessage": {
    uz: "Avtomatik javob matni",
    ru: "Текст автоответа",
    en: "Auto-reply message",
  },
  "settings.profile.savedNote": { uz: "Saqlandi ✓", ru: "Сохранено ✓", en: "Saved ✓" },

  "settings.templates.newTitle": { uz: "Yangi shablon", ru: "Новый шаблон", en: "New template" },
  "settings.templates.titlePlaceholder": {
    uz: "Sarlavha (masalan, Salomlashuv)",
    ru: "Заголовок (например, Приветствие)",
    en: "Title (e.g. Greeting)",
  },
  "settings.templates.textPlaceholder": {
    uz: "Javob matni...",
    ru: "Текст ответа...",
    en: "Reply text...",
  },
  "settings.templates.existingTitle": {
    uz: "Mavjud shablonlar",
    ru: "Существующие шаблоны",
    en: "Existing templates",
  },
  "settings.templates.empty": {
    uz: "Hali shablon qo'shilmagan.",
    ru: "Шаблоны ещё не добавлены.",
    en: "No templates added yet.",
  },

  "settings.team.inviteTitle": {
    uz: "Jamoaga taklif qilish",
    ru: "Пригласить в команду",
    en: "Invite to team",
  },
  "settings.team.usage": {
    uz: "{{count}}/{{limit}} operator",
    ru: "{{count}}/{{limit}} оператора",
    en: "{{count}}/{{limit}} operators",
  },
  "settings.team.limitReached": {
    uz: "Joriy tarifingizda operator limiti to'ldi.",
    ru: "Лимит операторов на вашем тарифе исчерпан.",
    en: "Your current plan's operator limit has been reached.",
  },
  "settings.team.upgradeLink": {
    uz: "Tarifni yangilang →",
    ru: "Обновите тариф →",
    en: "Upgrade your plan →",
  },
  "settings.team.emailPlaceholder": {
    uz: "email@misol.com",
    ru: "email@example.com",
    en: "email@example.com",
  },
  "settings.team.namePlaceholder": {
    uz: "Ismi (ixtiyoriy)",
    ru: "Имя (необязательно)",
    en: "Name (optional)",
  },
  "settings.team.inviteButton": { uz: "Taklif yuborish", ru: "Отправить приглашение", en: "Send invite" },
  "settings.team.inviteSuccess": {
    uz: "{{email}} manziliga taklif yuborildi ✓",
    ru: "Приглашение отправлено на {{email}} ✓",
    en: "Invite sent to {{email}} ✓",
  },
  "settings.team.inviteError": {
    uz: "Taklif yuborilmadi. Email manzilni tekshiring yoki keyinroq urinib ko'ring.",
    ru: "Не удалось отправить приглашение. Проверьте email или попробуйте позже.",
    en: "Couldn't send the invite. Check the email or try again later.",
  },
  "settings.team.membersTitle": { uz: "Jamoa a'zolari", ru: "Участники команды", en: "Team members" },
  "settings.team.onlyYou": {
    uz: "Hozircha faqat siz bor ekansiz.",
    ru: "Пока в команде только вы.",
    en: "It's just you on the team so far.",
  },
  "settings.team.demoOnly": {
    uz: "Jamoa funksiyasi faqat Supabase ulanganda ishlaydi. Hozircha demo rejimda ishlayapsiz.",
    ru: "Функция команды работает только при подключённом Supabase. Сейчас вы в демо-режиме.",
    en: "The team feature only works when Supabase is connected. You're currently in demo mode.",
  },
  "settings.team.role.owner": { uz: "Egasi", ru: "Владелец", en: "Owner" },
  "settings.team.role.operator": { uz: "Operator", ru: "Оператор", en: "Operator" },
  "settings.team.status.available": { uz: "Faol", ru: "На месте", en: "Available" },
  "settings.team.status.busy": { uz: "Band", ru: "Занят", en: "Busy" },
  "settings.team.status.offline": { uz: "Oflayn", ru: "Не в сети", en: "Offline" },
} satisfies Dictionary;
