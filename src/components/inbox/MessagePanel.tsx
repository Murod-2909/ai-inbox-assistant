"use client";

import { useEffect, useRef, useState } from "react";
import type {
  Conversation,
  InternalNote,
  Intent,
  Message,
  ReplyTemplate,
  Sentiment,
} from "@/lib/types";
import * as api from "@/lib/api";
import styles from "./MessagePanel.module.scss";

// Backend ishlamayotganda (demo rejim) ko'rinadigan standart shablonlar
const FALLBACK_TEMPLATES: ReplyTemplate[] = [
  { id: "t1", title: "Salomlashish", text: "Assalomu alaykum! Xush kelibsiz, sizga qanday yordam bera olamiz?" },
  { id: "t2", title: "Ish vaqti", text: "Ish vaqtimiz: dushanba–shanba, 9:00 dan 18:00 gacha." },
  { id: "t3", title: "Kutish", text: "Xabaringizni oldik! Mutaxassisimiz tez orada javob beradi." },
];

const sentimentLabels: Record<Sentiment, { text: string; className: string }> = {
  positive: { text: "😊 Ijobiy", className: styles.badgePositive },
  neutral: { text: "😐 Neytral", className: styles.badgeNeutral },
  negative: { text: "😠 Salbiy", className: styles.badgeNegative },
};

const intentLabels: Record<Intent, string> = {
  question: "❓ Savol",
  complaint: "⚠️ Shikoyat",
  order: "🛒 Buyurtma",
  feedback: "💬 Fikr",
  other: "📋 Boshqa",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageContent({ message: msg }: { message: Message }) {
  // Media turi bo'yicha mos element: rasm, video, audio pleyer yoki stiker.
  // Media yuklanmasa (masalan, bot token yo'q) matnli tavsif baribir ko'rinadi.
  switch (msg.kind) {
    case "photo":
      return (
        <>
          {msg.mediaUrl && (
            /* eslint-disable-next-line @next/next/no-img-element -- media proxy'dan keladi */
            <img className={styles.mediaImage} src={msg.mediaUrl} alt={msg.text} />
          )}
          <p>{msg.text}</p>
        </>
      );
    case "video":
      return (
        <>
          {msg.mediaUrl && (
            <video className={styles.mediaVideo} src={msg.mediaUrl} controls />
          )}
          <p>{msg.text}</p>
        </>
      );
    case "voice":
      return (
        <>
          {msg.mediaUrl && (
            <audio className={styles.mediaAudio} src={msg.mediaUrl} controls />
          )}
          <p>{msg.text}</p>
          {msg.transcript && (
            <p className={styles.transcript}>📝 {msg.transcript}</p>
          )}
        </>
      );
    case "sticker":
      return <p className={styles.sticker}>{msg.text}</p>;
    default:
      return <p>{msg.text}</p>;
  }
}

interface Props {
  conversation: Conversation;
  messages: Message[];
  onBack: () => void;
  onSend: (text: string) => Promise<void> | void;
  currentOperatorId: string | null;
  onAssignToggle: () => void;
}

export default function MessagePanel({
  conversation,
  messages,
  onBack,
  onSend,
  currentOperatorId,
  onAssignToggle,
}: Props) {
  const { customer, analysis } = conversation;
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [templates, setTemplates] = useState<ReplyTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [notes, setNotes] = useState<InternalNote[] | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Boshqa suhbatga o'tilganda yozilayotgan matn va eslatmalar holatini tozalaymiz
  useEffect(() => {
    setDraft("");
    setShowNotes(false);
    setNotes(null);
    setShowTemplates(false);
  }, [conversation.id]);

  // Shablonlarni bir marta yuklaymiz; backend bo'lmasa standart ro'yxat
  useEffect(() => {
    api.fetchTemplates().then((fresh) => {
      setTemplates(fresh ?? FALLBACK_TEMPLATES);
    });
  }, []);

  async function toggleNotes() {
    const next = !showNotes;
    setShowNotes(next);
    if (next && notes === null) {
      setNotes(await api.fetchNotes(conversation.id));
    }
  }

  async function handleAddNote() {
    const text = noteDraft.trim();
    if (!text) return;
    const saved = await api.addNote(conversation.id, text);
    if (saved) {
      setNotes((prev) => [...(prev ?? []), saved]);
      setNoteDraft("");
    }
  }

  async function handleSend() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await onSend(text);
      setDraft("");
    } finally {
      setSending(false);
    }
  }

  // Yangi xabar kelganda pastga silliq scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backButton}
            onClick={onBack}
            aria-label="Orqaga"
          >
            ←
          </button>
          <div>
            <div className={styles.name}>{customer.name}</div>
            <div className={styles.meta}>
              <span className={styles.channel}>Telegram</span>
              {customer.username && <span>{customer.username}</span>}
            </div>
          </div>
        </div>
        <div className={styles.badges}>
          {analysis && (
            <>
              <span
                className={`${styles.badge} ${sentimentLabels[analysis.sentiment].className}`}
              >
                {sentimentLabels[analysis.sentiment].text}
              </span>
              <span className={styles.badge}>
                {intentLabels[analysis.intent]}
              </span>
            </>
          )}
          {currentOperatorId && (
            <button
              className={`${styles.assignButton} ${
                conversation.assignedOperatorId === currentOperatorId
                  ? styles.assignButtonActive
                  : ""
              }`}
              onClick={onAssignToggle}
            >
              {conversation.assignedOperatorId === currentOperatorId
                ? "✓ Menga tayinlangan"
                : conversation.assignedOperatorId
                  ? "Boshqa operatorga tayinlangan"
                  : "Menga tayinlash"}
            </button>
          )}
          <button
            className={`${styles.iconButton} ${showNotes ? styles.iconButtonActive : ""}`}
            onClick={toggleNotes}
            title="Ichki eslatmalar (mijoz ko'rmaydi)"
          >
            🗒
          </button>
        </div>
      </header>

      {showNotes && (
        <div className={styles.notesPanel}>
          <div className={styles.notesTitle}>
            Ichki eslatmalar — faqat operatorlar ko&apos;radi
          </div>
          {notes === null ? (
            <p className={styles.notesEmpty}>
              Eslatmalar uchun backend kerak (demo rejimda mavjud emas)
            </p>
          ) : notes.length === 0 ? (
            <p className={styles.notesEmpty}>Hozircha eslatma yo&apos;q</p>
          ) : (
            <ul className={styles.notesList}>
              {notes.map((note) => (
                <li key={note.id}>
                  <strong>{note.author}:</strong> {note.text}
                  <span className={styles.noteTime}>
                    {formatTime(note.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {notes !== null && (
            <div className={styles.noteForm}>
              <input
                type="text"
                placeholder="Eslatma yozing..."
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddNote();
                }}
              />
              <button onClick={handleAddNote} disabled={!noteDraft.trim()}>
                Qo&apos;shish
              </button>
            </div>
          )}
        </div>
      )}

      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.bubble} ${
              msg.from === "business" ? styles.outgoing : styles.incoming
            } ${msg.kind === "sticker" ? styles.stickerBubble : ""}`}
          >
            <MessageContent message={msg} />
            <span className={styles.time}>{formatTime(msg.sentAt)}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {analysis && (
        <div className={styles.suggestion}>
          <div className={styles.suggestionHeader}>
            <span>✨ AI javob taklifi</span>
            <button
              className={styles.useButton}
              onClick={() => setDraft(analysis.suggestedReply)}
            >
              Ishlatish
            </button>
          </div>
          <p className={styles.suggestionText}>{analysis.suggestedReply}</p>
        </div>
      )}

      {showTemplates && (
        <div className={styles.templateList}>
          {templates.map((template) => (
            <button
              key={template.id}
              className={styles.templateItem}
              onClick={() => {
                setDraft(template.text);
                setShowTemplates(false);
              }}
            >
              <strong>{template.title}</strong>
              <span>{template.text}</span>
            </button>
          ))}
        </div>
      )}

      <footer className={styles.composer}>
        <button
          className={`${styles.iconButton} ${showTemplates ? styles.iconButtonActive : ""}`}
          onClick={() => setShowTemplates((prev) => !prev)}
          title="Tezkor javob shablonlari"
        >
          ⚡
        </button>
        <textarea
          placeholder="Javob yozing..."
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter — yuborish, Shift+Enter — yangi qator
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          className={styles.sendButton}
          disabled={!draft.trim() || sending}
          onClick={handleSend}
        >
          {sending ? "Yuborilmoqda..." : "Yuborish"}
        </button>
      </footer>
    </div>
  );
}
