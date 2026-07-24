export type Locale = "uz" | "ru" | "en";

export const LOCALES: Locale[] = ["uz", "ru", "en"];

export const DEFAULT_LOCALE: Locale = "uz";

export const LOCALE_LABEL: Record<Locale, string> = {
  uz: "O'zbekcha",
  ru: "Русский",
  en: "English",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  uz: "UZ",
  ru: "RU",
  en: "EN",
};

export const STORAGE_KEY = "ai-inbox-locale";
