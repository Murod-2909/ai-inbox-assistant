import type { Dictionary } from "./common";

export const analytics = {
  "analytics.title": { uz: "Tahlil", ru: "Аналитика", en: "Analytics" },
  "analytics.subtitle.live": {
    uz: "Jonli ko'rsatkichlar — bazadagi haqiqiy ma'lumotlardan",
    ru: "Данные в реальном времени — из базы данных",
    en: "Live metrics — from real database data",
  },
  "analytics.subtitle.mock": {
    uz: "Namunaviy ma'lumotlar (backend ulanmagan)",
    ru: "Демонстрационные данные (бэкенд не подключён)",
    en: "Sample data (backend not connected)",
  },

  "analytics.export.weekExcel": { uz: "Haftalik (Excel)", ru: "Недельный (Excel)", en: "Weekly (Excel)" },
  "analytics.export.weekWord": { uz: "Haftalik (Word)", ru: "Недельный (Word)", en: "Weekly (Word)" },
  "analytics.export.monthExcel": { uz: "Oylik (Excel)", ru: "Месячный (Excel)", en: "Monthly (Excel)" },
  "analytics.export.monthWord": { uz: "Oylik (Word)", ru: "Месячный (Word)", en: "Monthly (Word)" },

  "analytics.card.todayMessages": { uz: "Bugungi xabarlar", ru: "Сообщения сегодня", en: "Today's messages" },
  "analytics.card.unanswered": { uz: "Javob kutmoqda", ru: "Ждут ответа", en: "Awaiting reply" },
  "analytics.card.avgResponse": {
    uz: "O'rtacha javob vaqti",
    ru: "Среднее время ответа",
    en: "Avg. response time",
  },
  "analytics.card.avgResponseUnit": { uz: "daq", ru: "мин", en: "min" },
  "analytics.card.aiAnalyses": { uz: "AI tahlillar", ru: "AI-анализов", en: "AI analyses" },

  "analytics.sentiment.title": { uz: "Mijozlar kayfiyati", ru: "Настроение клиентов", en: "Customer sentiment" },
  "analytics.sentiment.positive": { uz: "Ijobiy", ru: "Позитив", en: "Positive" },
  "analytics.sentiment.neutral": { uz: "Neytral", ru: "Нейтрально", en: "Neutral" },
  "analytics.sentiment.negative": { uz: "Salbiy", ru: "Негатив", en: "Negative" },

  "analytics.intent.title": { uz: "Murojaat turlari", ru: "Типы обращений", en: "Inquiry types" },
  "analytics.intent.question": { uz: "Savol", ru: "Вопрос", en: "Question" },
  "analytics.intent.order": { uz: "Buyurtma", ru: "Заказ", en: "Order" },
  "analytics.intent.feedback": { uz: "Fikr", ru: "Отзыв", en: "Feedback" },
  "analytics.intent.complaint": { uz: "Shikoyat", ru: "Жалоба", en: "Complaint" },
  "analytics.intent.other": { uz: "Boshqa", ru: "Другое", en: "Other" },

  "analytics.week.title": {
    uz: "Haftalik xabarlar hajmi",
    ru: "Объём сообщений за неделю",
    en: "Weekly message volume",
  },

  "analytics.day.sun": { uz: "Ya", ru: "Вс", en: "Su" },
  "analytics.day.mon": { uz: "Du", ru: "Пн", en: "Mo" },
  "analytics.day.tue": { uz: "Se", ru: "Вт", en: "Tu" },
  "analytics.day.wed": { uz: "Cho", ru: "Ср", en: "We" },
  "analytics.day.thu": { uz: "Pa", ru: "Чт", en: "Th" },
  "analytics.day.fri": { uz: "Ju", ru: "Пт", en: "Fr" },
  "analytics.day.sat": { uz: "Sha", ru: "Сб", en: "Sa" },
} satisfies Dictionary;
