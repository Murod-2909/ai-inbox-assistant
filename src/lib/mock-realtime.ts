// Supabase Realtime kelguncha yangi xabarlarni simulyatsiya qilish.
// Har bir event: qachon (delayMs), qaysi xabar va suhbatning yangilangan holati.

import type { Conversation, Message } from "./types";

export interface IncomingEvent {
  delayMs: number;
  message: Message;
  conversation: Conversation;
}

export const incomingEvents: IncomingEvent[] = [
  {
    delayMs: 8000,
    message: {
      id: "m101",
      conversationId: "c3",
      from: "customer",
      text: "Yaxshi ekan! Unda meni ro'yxatga qo'shib qo'ying, ertaga to'lovni amalga oshiraman 😊",
      sentAt: new Date().toISOString(),
    },
    conversation: {
      id: "c3",
      customer: { id: "u3", name: "Madina Rahimova", channel: "telegram", username: "@madina_r" },
      lastMessage:
        "Yaxshi ekan! Unda meni ro'yxatga qo'shib qo'ying, ertaga to'lovni amalga oshiraman 😊",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 1,
      analysis: {
        sentiment: "positive",
        intent: "order",
        suggestedReply:
          "Ajoyib, Madina! Sizni ro'yxatga qo'shdik. To'lov qilganingizdan so'ng chek rasmini yuborsangiz, joyingizni tasdiqlaymiz. Kutamiz! 🎉",
      },
    },
  },
  {
    delayMs: 16000,
    message: {
      id: "m102",
      conversationId: "c5",
      from: "customer",
      text: "Assalomu alaykum, sizlarda shanba kuni ham qabul bormi?",
      sentAt: new Date().toISOString(),
    },
    conversation: {
      id: "c5",
      customer: { id: "u5", name: "Nodira Yusupova", channel: "telegram", username: "@nodira_y" },
      lastMessage: "Assalomu alaykum, sizlarda shanba kuni ham qabul bormi?",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 1,
      analysis: {
        sentiment: "neutral",
        intent: "question",
        suggestedReply:
          "Assalomu alaykum, Nodira! Ha, shanba kunlari 10:00 dan 15:00 gacha qabul qilamiz. Oldindan yozilishni xohlaysizmi?",
      },
    },
  },
];
