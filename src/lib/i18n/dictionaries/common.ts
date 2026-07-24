import type { Locale } from "../locale";

export type Translations = Record<Locale, string>;
export type Dictionary = Record<string, Translations>;

export const common = {
  "common.save": { uz: "Saqlash", ru: "Сохранить", en: "Save" },
  "common.saving": { uz: "Saqlanmoqda...", ru: "Сохранение...", en: "Saving..." },
  "common.saved": { uz: "Saqlandi", ru: "Сохранено", en: "Saved" },
  "common.cancel": { uz: "Bekor qilish", ru: "Отмена", en: "Cancel" },
  "common.delete": { uz: "O'chirish", ru: "Удалить", en: "Delete" },
  "common.loading": { uz: "Yuklanmoqda...", ru: "Загрузка...", en: "Loading..." },
  "common.send": { uz: "Yuborish", ru: "Отправить", en: "Send" },
  "common.sending": { uz: "Yuborilmoqda...", ru: "Отправка...", en: "Sending..." },
  "common.back": { uz: "Orqaga", ru: "Назад", en: "Back" },
  "common.add": { uz: "Qo'shish", ru: "Добавить", en: "Add" },
  "common.adding": { uz: "Qo'shilmoqda...", ru: "Добавление...", en: "Adding..." },
  "common.close": { uz: "Yopish", ru: "Закрыть", en: "Close" },

  "channel.telegram": { uz: "Telegram", ru: "Telegram", en: "Telegram" },
  "channel.whatsapp": { uz: "WhatsApp", ru: "WhatsApp", en: "WhatsApp" },
  "channel.instagram": { uz: "Instagram", ru: "Instagram", en: "Instagram" },
  "channel.facebook": { uz: "Facebook", ru: "Facebook", en: "Facebook" },
} satisfies Dictionary;
