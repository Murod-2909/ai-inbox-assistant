// Vaqtinchalik mock ma'lumotlar — backend (FastAPI + Supabase) tayyor bo'lgach olib tashlanadi

import type { Conversation, Message } from "./types";

export const mockConversations: Conversation[] = [
  {
    id: "c1",
    customer: { id: "u1", name: "Dilnoza Karimova", channel: "telegram", username: "@dilnoza_k" },
    lastMessage: "Assalomu alaykum, ertaga soat 15:00 ga yozilsam bo'ladimi?",
    lastMessageAt: "2026-07-17T10:42:00Z",
    unreadCount: 2,
    analysis: {
      sentiment: "neutral",
      intent: "order",
      suggestedReply:
        "Assalomu alaykum, Dilnoza! Albatta, ertaga 15:00 bo'sh. Sizni yozib qo'ydik — ismingiz va telefon raqamingizni tasdiqlab yuborsangiz kifoya. 😊",
    },
  },
  {
    id: "c2",
    customer: { id: "u2", name: "Jasur Toshpo'latov", channel: "telegram", username: "@jasur_t" },
    lastMessage: "Buyurtmam 3 kundan beri kelmayapti, bu qanaqasi?!",
    lastMessageAt: "2026-07-17T09:15:00Z",
    unreadCount: 1,
    analysis: {
      sentiment: "negative",
      intent: "complaint",
      suggestedReply:
        "Jasur aka, noqulaylik uchun uzr so'raymiz. Buyurtma raqamingizni yuborsangiz, hoziroq holatini tekshirib, aniq javob beramiz.",
    },
  },
  {
    id: "c3",
    customer: { id: "u3", name: "Madina Rahimova", channel: "telegram", username: "@madina_r" },
    lastMessage: "Kursning narxi qancha? To'lovni bo'lib to'lasa bo'ladimi?",
    lastMessageAt: "2026-07-16T18:30:00Z",
    unreadCount: 0,
    analysis: {
      sentiment: "neutral",
      intent: "question",
      suggestedReply:
        "Assalomu alaykum, Madina! Kurs narxi oyiga 800 000 so'm. Ha, 2 qismga bo'lib to'lash imkoniyati bor. Batafsil ma'lumot uchun qo'ng'iroq qilsak maylimi?",
    },
  },
  {
    id: "c4",
    customer: { id: "u4", name: "Otabek Nazarov", channel: "telegram", username: "@otabek_n" },
    lastMessage: "Xizmatingiz juda yoqdi, rahmat! Do'stlarimga ham tavsiya qilaman 👍",
    lastMessageAt: "2026-07-16T14:05:00Z",
    unreadCount: 0,
    analysis: {
      sentiment: "positive",
      intent: "feedback",
      suggestedReply:
        "Otabek aka, iliq so'zlaringiz uchun katta rahmat! Sizga xizmat qilganimizdan xursandmiz. Yana kutib qolamiz! 🙌",
    },
  },
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    conversationId: "c1",
    from: "customer",
    text: "Assalomu alaykum!",
    sentAt: "2026-07-17T10:40:00Z",
  },
  {
    id: "m2",
    conversationId: "c1",
    from: "customer",
    text: "Assalomu alaykum, ertaga soat 15:00 ga yozilsam bo'ladimi?",
    sentAt: "2026-07-17T10:42:00Z",
  },
  {
    id: "m3",
    conversationId: "c2",
    from: "customer",
    text: "Buyurtmam 3 kundan beri kelmayapti, bu qanaqasi?!",
    sentAt: "2026-07-17T09:15:00Z",
  },
  {
    id: "m4",
    conversationId: "c3",
    from: "customer",
    text: "Kursning narxi qancha? To'lovni bo'lib to'lasa bo'ladimi?",
    sentAt: "2026-07-16T18:30:00Z",
  },
  {
    id: "m5",
    conversationId: "c3",
    from: "business",
    text: "Assalomu alaykum! Hozir ma'lumot yuboramiz.",
    sentAt: "2026-07-16T18:35:00Z",
  },
  {
    id: "m6",
    conversationId: "c4",
    from: "customer",
    text: "Xizmatingiz juda yoqdi, rahmat! Do'stlarimga ham tavsiya qilaman 👍",
    sentAt: "2026-07-16T14:05:00Z",
  },
];

export function getMessages(conversationId: string): Message[] {
  return mockMessages.filter((m) => m.conversationId === conversationId);
}
