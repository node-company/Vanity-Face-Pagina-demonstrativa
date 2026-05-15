"use client";

import { useState, useTransition } from "react";
import { updateLeadStage } from "@/app/actions/lead-update";
import { STAGE_LABELS, STAGE_ORDER, type Stage } from "@/lib/supabase/types";

export default function LeadStageEditor({
  leadId,
  current,
}: {
  leadId: string;
  current: Stage;
}) {
  const [stage, setStage] = useState<Stage>(current);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStage = e.target.value as Stage;
    setStage(newStage);
    setError(null);
    startTransition(async () => {
      const res = await updateLeadStage({ leadId, stage: newStage });
      if (!res.ok) {
        setError(res.message ?? "Falhou.");
        setStage(current);
      }
    });
  }

  return (
    <div>
      <label className="eyebrow text-cream/55 mb-2 block">Estágio</label>
      <select
        value={stage}
        onChange={handleChange}
        disabled={isPending}
        className="w-full bg-navy border border-cream/15 text-cream py-2 px-3 text-sm disabled:opacity-60"
      >
        {STAGE_ORDER.map((s) => (
          <option key={s} value={s}>
            {STAGE_LABELS[s]}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-xs text-red-300/90">{error}</p>}
    </div>
  );
}
