import type { Dictionary } from "./common";

export const checkout = {
  "checkout.title": { uz: "Tarif Tanlang", ru: "Выберите тариф", en: "Choose a plan" },
  "checkout.subtitle": {
    uz: "Sizning biznesingizga mos bo'lgan rejimni belgilang",
    ru: "Выберите план, который подходит вашему бизнесу",
    en: "Pick the plan that fits your business",
  },
  "checkout.free": { uz: "Bepul", ru: "Бесплатно", en: "Free" },
  "checkout.periodMonth": { uz: "/oy", ru: "/мес", en: "/mo" },
  "checkout.priceLabel": {
    uz: "{{amount}}K so'm",
    ru: "{{amount}}K сум",
    en: "{{amount}}K UZS",
  },
  "checkout.priceLabelMonthly": {
    uz: "{{amount}}K so'm/oy",
    ru: "{{amount}}K сум/мес",
    en: "{{amount}}K UZS/mo",
  },
  "checkout.selectFree": { uz: "Boshlash", ru: "Начать", en: "Get started" },
  "checkout.selectOther": { uz: "Tanlash", ru: "Выбрать", en: "Select" },
  "checkout.planHeading": {
    uz: "{{plan}} Tarifi",
    ru: "Тариф «{{plan}}»",
    en: "{{plan}} Plan",
  },
} satisfies Dictionary;
