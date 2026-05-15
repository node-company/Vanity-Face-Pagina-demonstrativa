"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { updateLeadDetails } from "@/app/actions/lead-update";

export default function LeadNotesEditor({
  leadId,
  initial,
}: {
  leadId: string;
  initial: string | null;
}) {
  const [value, setValue] = useState(initial ?? "");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const lastSaved = useRef(initial ?? "");

  // autosave 1.2s após parar de digitar
  useEffect(() => {
    if (value === lastSaved.current) return;
    const t = setTimeout(() => {
      startTransition(async () => {
        const res = await updateLeadDetails({ leadId, notes: value });
        if (res.ok) {
          lastSaved.current = value;
          setError(null);
          setSavedAt(new Date().toLocaleTimeString("pt-BR"));
        } else {
          setError(res.message ?? "Falhou ao salvar.");
        }
      });
    }, 1200);
    return () => clearTimeout(t);
  }, [value, leadId]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="eyebrow text-cream/55">Notas internas</label>
        <span className="text-[0.65rem] tabular tracking-widest text-cream/35">
          {isPending ? "salvando…" : savedAt ? `salvo ${savedAt}` : ""}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Observações sobre este lead, contexto da conversa, pontos a abordar…"
        rows={6}
        className="w-full bg-navy-light/40 border border-cream/10 focus:border-gold/60 outline-none p-4 text-cream text-sm font-light transition-colors"
      />
      {error && <p className="mt-2 text-xs text-red-300/90">{error}</p>}
    </div>
  );
}
