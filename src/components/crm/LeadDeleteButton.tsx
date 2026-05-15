"use client";

import { useState, useTransition } from "react";
import { deleteLead } from "@/app/actions/lead-update";
import { cn } from "@/lib/cn";

interface Props {
  leadId: string;
  leadName: string;
}

export default function LeadDeleteButton({ leadId, leadName }: Props) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setOpen(false);
    setConfirmText("");
    setError(null);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await deleteLead({ leadId, confirm: confirmText.trim().toUpperCase() });
      // se não jogou redirect, é porque deu erro
      if (res?.ok === false) {
        setError(res.message ?? "Falhou ao excluir.");
      }
    });
  }

  return (
    <div className="border-t border-cream/10 pt-6">
      <p className="eyebrow text-cream/45 mb-3">Zona de risco</p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-[0.7rem] tracking-[0.22em] uppercase text-red-300/80 hover:text-red-300 transition-colors"
        >
          Excluir este lead
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-cream/75 leading-relaxed">
            Excluir <span className="text-cream font-medium">{leadName}</span>{" "}
            apaga o lead, todas as atividades e desvincula compromissos da agenda.{" "}
            <span className="text-red-300/85">Não tem como desfazer.</span>
          </p>
          <p className="text-xs text-cream/55">
            Pra confirmar, digite{" "}
            <code className="px-1 py-0.5 bg-navy-light/60 text-gold tabular text-[0.7rem]">
              EXCLUIR
            </code>{" "}
            abaixo.
          </p>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="EXCLUIR"
            disabled={isPending}
            autoFocus
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm tabular focus:border-red-300/60 outline-none"
          />
          {error && <p className="text-xs text-red-300/90">{error}</p>}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={reset}
              disabled={isPending}
              className="text-[0.65rem] tracking-[0.22em] uppercase text-cream/55 hover:text-cream transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={isPending || confirmText.trim().toUpperCase() !== "EXCLUIR"}
              className={cn(
                "px-4 py-2 text-[0.65rem] tracking-[0.24em] uppercase font-semibold transition-colors",
                "bg-red-400/90 text-navy hover:bg-red-300",
                "disabled:opacity-40 disabled:pointer-events-none"
              )}
            >
              {isPending ? "Excluindo…" : "Excluir definitivamente"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
