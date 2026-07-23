// Backend (FastAPI) bilan gaplashuvchi qatlam.
// Backend ishlamayotgan bo'lsa har bir funksiya null qaytaradi —
// InboxView bu holatda mock (demo) rejimga o'tadi.

import type {
  Business,
  Conversation,
  InternalNote,
  Message,
  ReplyTemplate,
  Stats,
  TeamMember,
  WorkingHours,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function safeFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store", ...init });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // backend o'chiq — mock rejimga signal
  }
}

export function fetchConversations(): Promise<Conversation[] | null> {
  return safeFetch<Conversation[]>("/api/conversations");
}

export async function fetchMessages(
  conversationId: string,
): Promise<Message[] | null> {
  const messages = await safeFetch<Message[]>(
    `/api/conversations/${conversationId}/messages`,
  );
  if (!messages) return null;
  // Backend nisbiy media yo'lini beradi ("/api/media/...") — to'liq manzilga aylantiramiz
  return messages.map((m) =>
    m.mediaUrl && m.mediaUrl.startsWith("/")
      ? { ...m, mediaUrl: `${API_URL}${m.mediaUrl}` }
      : m,
  );
}

export function sendReply(
  conversationId: string,
  text: string,
): Promise<Message | null> {
  return safeFetch<Message>(`/api/conversations/${conversationId}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

export function markRead(conversationId: string): void {
  // Natijasi muhim emas — "fire and forget"
  void safeFetch(`/api/conversations/${conversationId}/read`, { method: "POST" });
}

export function assignConversation(
  conversationId: string,
  operatorId: string | null,
): Promise<{ ok: boolean } | null> {
  return safeFetch(`/api/conversations/${conversationId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operatorId }),
  });
}

export function fetchTemplates(): Promise<ReplyTemplate[] | null> {
  return safeFetch<ReplyTemplate[]>("/api/templates");
}

export function createTemplate(
  title: string,
  text: string,
): Promise<ReplyTemplate | null> {
  return safeFetch<ReplyTemplate>("/api/templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, text }),
  });
}

export function deleteTemplate(
  templateId: string,
): Promise<{ ok: boolean } | null> {
  return safeFetch(`/api/templates/${templateId}`, { method: "DELETE" });
}

export function fetchBusiness(): Promise<Business | null> {
  return safeFetch<Business>("/api/business");
}

export function updateBusiness(
  data: { name?: string; workingHours?: WorkingHours },
): Promise<Business | null> {
  return safeFetch<Business>("/api/business", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function fetchTeam(): Promise<TeamMember[] | null> {
  return safeFetch<TeamMember[]>("/api/team");
}

export function inviteTeamMember(
  email: string,
  fullName?: string,
): Promise<{ id: string; email: string } | null> {
  return safeFetch("/api/team/invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, fullName }),
  });
}

export function fetchNotes(
  conversationId: string,
): Promise<InternalNote[] | null> {
  return safeFetch<InternalNote[]>(
    `/api/conversations/${conversationId}/notes`,
  );
}

export function addNote(
  conversationId: string,
  text: string,
): Promise<InternalNote | null> {
  return safeFetch<InternalNote>(`/api/conversations/${conversationId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

export function fetchStats(): Promise<Stats | null> {
  return safeFetch<Stats>("/api/stats");
}

export function reportExportUrl(
  period: "week" | "month",
  format: "xlsx" | "docx",
): string {
  return `${API_URL}/api/reports/export?period=${period}&format=${format}`;
}
