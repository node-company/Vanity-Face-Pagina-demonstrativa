"use client";

import { useState, useTransition } from "react";
import { updateLeadDetails } from "@/app/actions/lead-update";

export default function LeadTagsEditor({
  leadId,
  initial,
}: {
  leadId: string;
  initial: string[];
}) {
  const [tags, setTags] = useState(initial);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function commit(next: string[]) {
    setError(null);
    startTransition(async () => {
      const res = await updateLeadDetails({ leadId, tags: next });
      if (!res.ok) {
        setError(res.message ?? "Falhou.");
        setTags(initial);
      }
    });
  }

  function add() {
    const v = draft.trim();
    if (!v) return;
    if (tags.includes(v)) {
      setDraft("");
      return;
    }
    const next = [...tags, v];
    setTags(next);
    setDraft("");
    commit(next);
  }

  function remove(tag: string) {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    commit(next);
  }

  return (
    <div>
      <label className="eyebrow text-cream/55 mb-2 block">Tags</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.length === 0 && (
          <span className="text-cream/35 italic-soft text-sm">Sem tags ainda</span>
        )}
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => remove(tag)}
            className="group inline-flex items-center gap-2 px-2.5 py-1 text-[0.65rem] tracking-[0.16em] uppercase border border-cream/20 text-cream/80 hover:border-red-400/60 hover:text-red-300 transition-colors"
            title="Clique para remover"
          >
            {tag}
            <span className="text-cream/35 group-hover:text-red-300">×</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Adicionar tag e Enter"
          disabled={isPending}
          maxLength={40}
          className="flex-1 bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
        />
        <button
          type="button"
          onClick={add}
          disabled={isPending || !draft.trim()}
          className="btn-ghost text-[0.65rem] px-4 py-2 disabled:opacity-40"
        >
          Add
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-300/90">{error}</p>}
    </div>
  );
}
