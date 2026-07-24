"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import type { ReplyTemplate } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./TemplatesTab.module.scss";

export function TemplatesTab() {
  const { t } = useLanguage();
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
        <h3>{t("settings.templates.newTitle")}</h3>
        <div className={styles.form}>
          <input
            placeholder={t("settings.templates.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            rows={3}
            placeholder={t("settings.templates.textPlaceholder")}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleCreate}
            disabled={creating || !title.trim() || !text.trim()}
          >
            {creating ? t("common.adding") : t("common.add")}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <h3>{t("settings.templates.existingTitle")}</h3>
        {loading && <p className={styles.hint}>{t("common.loading")}</p>}
        {!loading && templates.length === 0 && (
          <p className={styles.hint}>{t("settings.templates.empty")}</p>
        )}
        <ul className={styles.list}>
          {templates.map((tpl) => (
            <li key={tpl.id} className={styles.item}>
              <div>
                <strong>{tpl.title}</strong>
                <p>{tpl.text}</p>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(tpl.id)}
                aria-label={t("common.delete")}
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
