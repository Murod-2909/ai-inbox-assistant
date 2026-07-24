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
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./MessagePanel.module.scss";

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
  const { t } = useLanguage();
  const { customer, analysis } = conversation;
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [templates, setTemplates] = useState<ReplyTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [notes, setNotes] = useState<InternalNote[] | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const sentimentLabels: Record<Sentiment, { text: string; className: string }> = {
    positive: { text: t("inbox.panel.sentimentPositive"), className: styles.badgePositive },
    neutral: { text: t("inbox.panel.sentimentNeutral"), className: styles.badgeNeutral },
    negative: { text: t("inbox.panel.sentimentNegative"), className: styles.badgeNegative },
  };

  const intentLabels: Record<Intent, string> = {
    question: t("inbox.panel.intentQuestion"),
    complaint: t("inbox.panel.intentComplaint"),
    order: t("inbox.panel.intentOrder"),
    feedback: t("inbox.panel.intentFeedback"),
    other: t("inbox.panel.intentOther"),
  };

  // Backend ishlamayotganda (demo rejim) ko'rinadigan standart shablonlar
  const FALLBACK_TEMPLATES: ReplyTemplate[] = [
    { id: "t1", title: t("inbox.fallbackTemplate1Title"), text: t("inbox.fallbackTemplate1Text") },
    { id: "t2", title: t("inbox.fallbackTemplate2Title"), text: t("inbox.fallbackTemplate2Text") },
    { id: "t3", title: t("inbox.fallbackTemplate3Title"), text: t("inbox.fallbackTemplate3Text") },
  ];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- FALLBACK_TEMPLATES faqat tilga bog'liq, cheksiz tsikl yaratmaydi
  }, [t]);

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
            aria-label={t("inbox.panel.back")}
          >
            ←
          </button>
          <div>
            <div className={styles.name}>{customer.name}</div>
            <div className={styles.meta}>
              <span className={styles.channel}>{t(`channel.${customer.channel}`)}</span>
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
                ? t("inbox.panel.assignedToMe")
                : conversation.assignedOperatorId
                  ? t("inbox.panel.assignedToOther")
                  : t("inbox.panel.assignToMe")}
            </button>
          )}
          <button
            className={`${styles.iconButton} ${showNotes ? styles.iconButtonActive : ""}`}
            onClick={toggleNotes}
            title={t("inbox.panel.notesToggleTitle")}
          >
            🗒
          </button>
        </div>
      </header>

      {showNotes && (
        <div className={styles.notesPanel}>
          <div className={styles.notesTitle}>{t("inbox.panel.notesHeader")}</div>
          {notes === null ? (
            <p className={styles.notesEmpty}>{t("inbox.panel.notesUnavailable")}</p>
          ) : notes.length === 0 ? (
            <p className={styles.notesEmpty}>{t("inbox.panel.notesEmpty")}</p>
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
                placeholder={t("inbox.panel.notePlaceholder")}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddNote();
                }}
              />
              <button onClick={handleAddNote} disabled={!noteDraft.trim()}>
                {t("common.add")}
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
            <span>{t("inbox.panel.aiSuggestion")}</span>
            <button
              className={styles.useButton}
              onClick={() => setDraft(analysis.suggestedReply)}
            >
              {t("inbox.panel.useSuggestion")}
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
          title={t("inbox.panel.templatesToggleTitle")}
        >
          ⚡
        </button>
        <textarea
          placeholder={t("inbox.panel.composerPlaceholder")}
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
          {sending ? t("common.sending") : t("common.send")}
        </button>
      </footer>
    </div>
  );
}
