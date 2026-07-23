"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import type { ReplyTemplate } from "@/lib/types";
import styles from "./TemplatesTab.module.scss";

export function TemplatesTab() {
  const [templates, setTemplates] = useState<ReplyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [creating, setCreating] = useState(false);

  function load() {
    api.fetchTemplates().then((list) => {
      setTemplates(list ?? []);
      setLoading(false);
    });
  }

  useEffect(load, []);

  async function handleCreate() {
    if (!title.trim() || !text.trim()) return;
    setCreating(true);
    const created = await api.createTemplate(title.trim(), text.trim());
    setCreating(false);
    if (created) {
      setTemplates((prev) => [...prev, created]);
      setTitle("");
      setText("");
    }
  }

  async function handleDelete(id: string) {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    await api.deleteTemplate(id);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h3>Yangi shablon</h3>
        <div className={styles.form}>
          <input
            placeholder="Sarlavha (masalan, Salomlashuv)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            rows={3}
            placeholder="Javob matni..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleCreate}
            disabled={creating || !title.trim() || !text.trim()}
          >
            {creating ? "Qo'shilmoqda..." : "Qo'shish"}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <h3>Mavjud shablonlar</h3>
        {loading && <p className={styles.hint}>Yuklanmoqda...</p>}
        {!loading && templates.length === 0 && (
          <p className={styles.hint}>Hali shablon qo&apos;shilmagan.</p>
        )}
        <ul className={styles.list}>
          {templates.map((t) => (
            <li key={t.id} className={styles.item}>
              <div>
                <strong>{t.title}</strong>
                <p>{t.text}</p>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(t.id)}
                aria-label="O'chirish"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
