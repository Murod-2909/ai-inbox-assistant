// Domen turlari — keyinchalik Supabase jadvallariga mos keladi

export type Channel = "telegram" | "whatsapp" | "instagram";

export type Sentiment = "positive" | "neutral" | "negative";

export type Intent =
  | "question" // savol (narx, ish vaqti, mavjudlik)
  | "complaint" // shikoyat
  | "order" // buyurtma / yozilish
  | "feedback" // fikr-mulohaza
  | "other";

export interface Customer {
  id: string;
  name: string;
  channel: Channel;
  username?: string;
}

export type MessageKind = "text" | "photo" | "voice" | "video" | "sticker";

export interface Message {
  id: string;
  conversationId: string;
  from: "customer" | "business";
  text: string;
  sentAt: string; // ISO
  kind?: MessageKind; // yo'q bo'lsa "text" deb qabul qilinadi
  mediaUrl?: string | null; // rasm/video/audio manzili (backend proxy yoki demo URL)
  transcript?: string | null; // ovozli xabarning matnga aylantirilgani (STT)
}

export interface AiAnalysis {
  sentiment: Sentiment;
  intent: Intent;
  suggestedReply: string;
}

export interface Conversation {
  id: string;
  customer: Customer;
  lastMessage: string;
  lastMessageAt: string; // ISO
  unreadCount: number;
  analysis?: AiAnalysis;
}

// Tezkor javob shabloni (operator bir bosishda qo'yadi)
export interface ReplyTemplate {
  id: string;
  title: string;
  text: string;
}

// Ichki eslatma — operatorlar orasida, mijoz ko'rmaydi
export interface InternalNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

// Tahlil sahifasi statistikasi (backend /api/stats)
export interface Stats {
  todayMessages: number;
  unanswered: number;
  avgResponseMinutes: number | null;
  sentiment: { positive: number; neutral: number; negative: number };
  intents: { intent: string; count: number }[];
  week: Record<string, number>; // "YYYY-MM-DD" -> xabarlar soni
}
