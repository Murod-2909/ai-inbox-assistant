"use client";

import type { Conversation, Sentiment } from "@/lib/types";
import styles from "./ConversationList.module.scss";

const sentimentDot: Record<Sentiment, string> = {
  positive: styles.dotPositive,
  neutral: styles.dotNeutral,
  negative: styles.dotNegative,
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  conversations: Conversation[];
  selectedId: string;
  flashId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  conversations,
  selectedId,
  flashId,
  onSelect,
}: Props) {
  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <h2>Xabarlar</h2>
        <span className={styles.count}>{conversations.length}</span>
      </div>

      <div className={styles.items}>
        {conversations.map((conv) => (
          <button
            key={conv.id}
            className={`${styles.item} ${
              conv.id === selectedId ? styles.selected : ""
            } ${conv.id === flashId ? styles.flash : ""}`}
            onClick={() => onSelect(conv.id)}
          >
            <div className={styles.avatar}>
              {conv.customer.name.charAt(0)}
              {conv.analysis && (
                <span
                  className={`${styles.dot} ${sentimentDot[conv.analysis.sentiment]}`}
                />
              )}
            </div>
            <div className={styles.body}>
              <div className={styles.top}>
                <span className={styles.name}>{conv.customer.name}</span>
                <span className={styles.time}>
                  {formatTime(conv.lastMessageAt)}
                </span>
              </div>
              <div className={styles.bottom}>
                <span className={styles.preview}>{conv.lastMessage}</span>
                {conv.unreadCount > 0 && (
                  <span className={styles.unread}>{conv.unreadCount}</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
