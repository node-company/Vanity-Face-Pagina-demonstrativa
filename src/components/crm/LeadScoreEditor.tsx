"use client";

import { useState, useTransition } from "react";
import { updateLeadDetails } from "@/app/actions/lead-update";
import { scoreBand, SCORE_BAND_LABEL } from "@/lib/leads";
import { cn } from "@/lib/cn";

export default function LeadScoreEditor({
  leadId,
  autoScore,
  manualScore,
}: {
  leadId: string;
  autoScore: number;
  manualScore: number | null;
}) {
  const [value, setValue] = useState<number | null>(manualScore);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const effective = value ?? autoScore;
  const band = scoreBand(effective);
  const tone =
    band === "hot"
      ? "text-gold"
      : band === "warm"
        ? "text-cream"
        : "text-mist-soft";

  function save(next: number | null) {
    setError(null);
    startTransition(async () => {
      const res = await updateLeadDetails({ leadId, manual_score: next });
      if (!res.ok) setError(res.message ?? "Falhou.");
      else setEditing(false);
    });
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="eyebrow text-cream/55">Score</label>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="text-[0.6rem] tracking-[0.22em] uppercase text-cream/55 hover:text-gold"
        >
          {editing ? "fechar" : "ajustar"}
        </button>
      </div>

      <div className="flex items-baseline gap-3">
        <span className={cn("font-display text-5xl tabular", tone)}>{effective}</span>
        <span className={cn("italic-soft text-sm", tone)}>{SCORE_BAND_LABEL[band]}</span>
      </div>
      <p className="text-[0.65rem] tabular tracking-widest text-cream/35 mt-2">
        auto: {autoScore}
        {manualScore !== null && ` · manual: ${manualScore}`}
      </p>

      {editing && (
        <div className="mt-4 space-y-3">
          <input
            type="number"
            min={0}
            max={100}
            value={value ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setValue(v === "" ? null : Math.max(0, Math.min(100, Number(v))));
            }}
            placeholder={`automático (${autoScore})`}
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => save(value)}
              disabled={isPending}
              className="btn-primary text-[0.65rem] px-4 py-2"
            >
              {isPending ? "Salvando…" : "Salvar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setValue(null);
                save(null);
              }}
              disabled={isPending}
              className="btn-ghost text-[0.65rem] px-4 py-2"
            >
              Voltar ao auto
            </button>
          </div>
          {error && <p className="text-xs text-red-300/90">{error}</p>}
        </div>
      )}
    </div>
  );
}
