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

export type InboxFilter = "all" | "mine" | "unassigned";

interface Props {
  conversations: Conversation[];
  selectedId: string;
  flashId: string | null;
  onSelect: (id: string) => void;
  filter: InboxFilter;
  onFilterChange: (filter: InboxFilter) => void;
  filterCounts: Record<InboxFilter, number>;
  showFilters: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const FILTER_TABS: { key: InboxFilter; label: string }[] = [
  { key: "all", label: "Barchasi" },
  { key: "mine", label: "Mening" },
  { key: "unassigned", label: "Tayinlanmagan" },
];

export default function ConversationList({
  conversations,
  selectedId,
  flashId,
  onSelect,
  filter,
  onFilterChange,
  filterCounts,
  showFilters,
  searchQuery,
  onSearchChange,
}: Props) {
  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <h2>Xabarlar</h2>
        <span className={styles.count}>{conversations.length}</span>
      </div>

      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          placeholder="Qidirish..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className={styles.searchClear}
            onClick={() => onSearchChange("")}
            aria-label="Tozalash"
          >
            ✕
          </button>
        )}
      </div>

      {showFilters && (
        <div className={styles.filters}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.filterTab} ${
                filter === tab.key ? styles.filterTabActive : ""
              }`}
              onClick={() => onFilterChange(tab.key)}
            >
              {tab.label}
              <span className={styles.filterCount}>{filterCounts[tab.key]}</span>
            </button>
          ))}
        </div>
      )}

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

        {conversations.length === 0 && (
          <p className={styles.filterEmpty}>
            {searchQuery
              ? `"${searchQuery}" bo'yicha hech narsa topilmadi`
              : filter === "mine"
                ? "Sizga tayinlangan suhbat yo'q"
                : filter === "unassigned"
                  ? "Tayinlanmagan suhbat yo'q"
                  : "Suhbat yo'q"}
          </p>
        )}
      </div>
    </div>
  );
}
