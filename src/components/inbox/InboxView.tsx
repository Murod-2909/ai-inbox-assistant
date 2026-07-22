"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Conversation, Message } from "@/lib/types";
import * as api from "@/lib/api";
import { mockConversations, mockMessages } from "@/lib/mock-data";
import { incomingEvents } from "@/lib/mock-realtime";
import { playNewMessageSound } from "@/lib/sound";
import { supabase } from "@/lib/supabase";
import { WelcomeModal } from "@/components/WelcomeModal";
import ConversationList from "./ConversationList";
import MessagePanel from "./MessagePanel";
import styles from "./InboxView.module.scss";

// Backend ishlayotganda API'dan, ishlamasa mock ma'lumotlardan foydalanamiz
type Mode = "loading" | "backend" | "mock";

const POLL_INTERVAL_MS = 4000; // Supabase Realtime qo'shilgunga qadar oddiy polling

export default function InboxView() {
  const [mode, setMode] = useState<Mode>("loading");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [flashId, setFlashId] = useState<string | null>(null);

  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  // Oxirgi ko'rilgan holat — yangi xabar kelganini aniqlash (flash effekti) uchun
  const lastSeenRef = useRef<Map<string, string>>(new Map());

  const applyConversations = useCallback((fresh: Conversation[]) => {
    // Qaysi suhbatda yangi MIJOZ xabari paydo bo'ldi? Yorqinlik + ovozli signal.
    for (const conv of fresh) {
      const prev = lastSeenRef.current.get(conv.id);
      if (prev && prev !== conv.lastMessageAt && conv.unreadCount > 0) {
        setFlashId(conv.id);
        setTimeout(() => setFlashId(null), 1400);
        playNewMessageSound();
      }
      lastSeenRef.current.set(conv.id, conv.lastMessageAt);
    }
    setConversations(fresh);
  }, []);

  // Birinchi yuklash: backend bormi?
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const fromApi = await api.fetchConversations();
      if (cancelled) return;

      if (fromApi) {
        setMode("backend");
        applyConversations(fromApi);
        if (fromApi.length > 0) setSelectedId(fromApi[0].id);
      } else {
        setMode("mock");
        setConversations(mockConversations);
        setMessages(mockMessages);
        if (mockConversations.length > 0) setSelectedId(mockConversations[0].id);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [applyConversations]);

  // Backend rejim: yangilanishlarni olish.
  // Supabase ulangan bo'lsa — Realtime obuna (bazadagi har bir o'zgarish
  // darhol keladi, polling shart emas); bo'lmasa — 4 soniyalik polling.
  useEffect(() => {
    if (mode !== "backend") return;

    async function refresh() {
      const fresh = await api.fetchConversations();
      if (fresh) applyConversations(fresh);
      const current = selectedIdRef.current;
      if (current) {
        const freshMessages = await api.fetchMessages(current);
        if (freshMessages) setMessages(freshMessages);
      }
    }

    if (supabase) {
      console.log("[realtime] subscribing to inbox changes");
      const channel = supabase
        .channel("inbox-changes", { config: { broadcast: { self: true } } })
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          (payload) => {
            console.log("[realtime] message change:", payload.eventType);
            refresh();
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "conversations" },
          (payload) => {
            console.log("[realtime] conversation change:", payload.eventType);
            refresh();
          },
        )
        .subscribe((status, err) => {
          console.log(`[realtime] subscription status: ${status}`, err);
          if (status === "SUBSCRIBED") {
            console.log("[realtime] ✓ Supabase Realtime active (no polling)");
          }
        });
      return () => {
        console.log("[realtime] unsubscribing");
        supabase?.removeChannel(channel);
      };
    }

    // Supabase yo'q bo'lsa polling (SQLite rejimida)
    console.log("[polling] Supabase not available, using 4s polling");
    const timer = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [mode, applyConversations]);

  // Backend rejim: tanlangan suhbat o'zgarganda xabarlarini yuklaymiz
  useEffect(() => {
    if (mode !== "backend" || !selectedId) return;
    api.fetchMessages(selectedId).then((fresh) => {
      if (fresh) setMessages(fresh);
    });
  }, [mode, selectedId]);

  // Mock rejim: real-time simulyatsiyasi (backend yo'qligida demo uchun)
  useEffect(() => {
    if (mode !== "mock") return;

    const timers = incomingEvents.map((event) =>
      setTimeout(() => {
        setMessages((prev) => [...prev, event.message]);
        setConversations((prev) => {
          const exists = prev.some((c) => c.id === event.conversation.id);
          const isOpen = selectedIdRef.current === event.conversation.id;
          const updated: Conversation = {
            ...event.conversation,
            unreadCount: isOpen ? 0 : event.conversation.unreadCount,
          };
          return exists
            ? prev.map((c) => (c.id === updated.id ? updated : c))
            : [...prev, updated];
        });
        setFlashId(event.conversation.id);
        setTimeout(() => setFlashId(null), 1400);
        playNewMessageSound();
      }, event.delayMs),
    );
    return () => timers.forEach(clearTimeout);
  }, [mode]);

  const sorted = [...conversations].sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );
  const selected = conversations.find((c) => c.id === selectedId);

  function handleSelect(id: string) {
    setSelectedId(id);
    setPanelOpen(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
    if (mode === "backend") api.markRead(id);
  }

  async function handleSend(text: string) {
    if (!selected) return;

    if (mode === "backend") {
      const saved = await api.sendReply(selected.id, text);
      if (saved) {
        setMessages((prev) => [...prev, saved]);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selected.id
              ? { ...c, lastMessage: text, lastMessageAt: saved.sentAt }
              : c,
          ),
        );
      }
      return;
    }

    // Mock rejim: xabarni lokal qo'shamiz
    const local: Message = {
      id: `local-${Date.now()}`,
      conversationId: selected.id,
      from: "business",
      text,
      sentAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, local]);
  }

  if (mode === "loading") {
    return <div className={styles.loading}>Yuklanmoqda...</div>;
  }

  return (
    <div className={styles.wrapper}>
      <WelcomeModal />
      {mode === "mock" && (
        <div className={styles.demoBanner}>
          Demo rejim — backend ulanmagan (namunaviy ma&apos;lumotlar)
        </div>
      )}
      <div className={styles.inbox}>
        <div
          className={`${styles.listPane} ${panelOpen ? styles.hideOnMobile : ""}`}
        >
          <ConversationList
            conversations={sorted}
            selectedId={selectedId}
            flashId={flashId}
            onSelect={handleSelect}
          />
        </div>
        <div
          className={`${styles.panelPane} ${panelOpen ? "" : styles.hideOnMobile}`}
        >
          {selected ? (
            <MessagePanel
              conversation={selected}
              messages={messages.filter(
                (m) => m.conversationId === selected.id,
              )}
              onBack={() => setPanelOpen(false)}
              onSend={handleSend}
            />
          ) : (
            <div className={styles.empty}>Suhbat tanlang</div>
          )}
        </div>
      </div>
    </div>
  );
}
