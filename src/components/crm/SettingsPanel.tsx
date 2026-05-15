"use client";

import { useState, useTransition } from "react";
import {
  updateAccountName,
  deleteAllLeads,
  deleteAllMembers,
} from "@/app/actions/members";
import { cn } from "@/lib/cn";

interface Props {
  accountName: string;
  leadsCount: number;
  otherMembersCount: number;
}

export default function SettingsPanel({
  accountName,
  leadsCount,
  otherMembersCount,
}: Props) {
  return (
    <div className="space-y-12">
      <ClinicSection initial={accountName} />
      <DangerZone
        leadsCount={leadsCount}
        otherMembersCount={otherMembersCount}
      />
    </div>
  );
}

function ClinicSection({ initial }: { initial: string }) {
  const [name, setName] = useState(initial);
  const [savedName, setSavedName] = useState(initial);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [isPending, startTransition] = useTransition();

  const dirty = name.trim() !== savedName.trim();

  function submit() {
    setErr(null);
    setOk(false);
    startTransition(async () => {
      const res = await updateAccountName({ name: name.trim() });
      if (!res.ok) {
        setErr(res.message ?? "Falhou.");
      } else {
        setSavedName(name.trim());
        setOk(true);
      }
    });
  }

  return (
    <section className="border border-cream/10">
      <header className="bg-navy-light/30 px-5 py-3">
        <h2 className="eyebrow text-cream/70">Clínica</h2>
      </header>
      <div className="p-6 max-w-xl space-y-4">
        <label className="block">
          <span className="eyebrow text-cream/55 mb-2 block">
            Nome exibido no CRM
          </span>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setOk(false);
            }}
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
          />
        </label>
        {err && <p className="text-sm text-red-300/90">{err}</p>}
        {ok && (
          <p className="text-sm text-gold italic-soft">Nome atualizado.</p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={submit}
            disabled={isPending || !dirty || name.trim().length < 2}
            className="btn-primary text-[0.65rem] px-5 py-2 disabled:opacity-50"
          >
            {isPending ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </section>
  );
}

function DangerZone({
  leadsCount,
  otherMembersCount,
}: {
  leadsCount: number;
  otherMembersCount: number;
}) {
  return (
    <section className="border border-red-400/30">
      <header className="bg-red-500/10 px-5 py-3">
        <h2 className="eyebrow text-red-300/85">Zona de risco</h2>
      </header>
      <div className="p-6 space-y-8">
        <DestructiveAction
          title="Excluir todos os leads"
          description={`Apaga todos os ${leadsCount} leads desta conta, junto com a timeline de atividades. Compromissos da agenda mantêm o histórico, mas perdem o vínculo com o lead. Não tem como desfazer.`}
          buttonLabel="Excluir todos os leads"
          disabled={leadsCount === 0}
          disabledMsg="Nenhum lead pra excluir."
          run={(confirm) => deleteAllLeads({ confirm })}
          successMsg={(deleted) =>
            `${deleted} ${deleted === 1 ? "lead removido" : "leads removidos"}.`
          }
        />

        <div className="border-t border-cream/10" />

        <DestructiveAction
          title="Excluir todas as contas"
          description={`Apaga as ${otherMembersCount} contas de membros desta clínica (mantendo apenas a sua). Os usuários perdem o acesso imediatamente. Não tem como desfazer.`}
          buttonLabel="Excluir todas as contas"
          disabled={otherMembersCount === 0}
          disabledMsg="Nenhuma outra conta pra excluir."
          run={(confirm) => deleteAllMembers({ confirm })}
          successMsg={(deleted) =>
            `${deleted} ${deleted === 1 ? "conta removida" : "contas removidas"}.`
          }
        />
      </div>
    </section>
  );
}

function DestructiveAction({
  title,
  description,
  buttonLabel,
  disabled,
  disabledMsg,
  run,
  successMsg,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  disabled: boolean;
  disabledMsg: string;
  run: (confirm: string) => Promise<{
    ok: boolean;
    message?: string;
    deleted?: number;
  }>;
  successMsg: (deleted: number) => string;
}) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setOpen(false);
    setConfirmText("");
    setErr(null);
  }

  function submit() {
    setErr(null);
    setOkMsg(null);
    startTransition(async () => {
      const res = await run(confirmText.trim().toUpperCase());
      if (!res.ok) {
        setErr(res.message ?? "Falhou.");
      } else {
        setOkMsg(successMsg(res.deleted ?? 0));
        reset();
      }
    });
  }

  return (
    <div>
      <h3 className="font-serif text-lg text-cream mb-1">{title}</h3>
      <p className="text-sm text-cream/65 leading-relaxed mb-4">{description}</p>
      {okMsg && (
        <p className="mb-4 text-sm text-gold italic-soft">{okMsg}</p>
      )}

      {!open ? (
        <button
          type="button"
          onClick={() => {
            setOkMsg(null);
            setOpen(true);
          }}
          disabled={disabled}
          className={cn(
            "text-[0.7rem] tracking-[0.22em] uppercase transition-colors",
            disabled
              ? "text-cream/30 pointer-events-none"
              : "text-red-300/80 hover:text-red-300"
          )}
        >
          {disabled ? disabledMsg : buttonLabel}
        </button>
      ) : (
        <div className="space-y-3 max-w-xl">
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
          {err && <p className="text-xs text-red-300/90">{err}</p>}
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
              disabled={
                isPending || confirmText.trim().toUpperCase() !== "EXCLUIR"
              }
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
