"use client";

import { useActionState } from "react";
import { changeOwnPassword, type ChangeOwnState } from "@/app/actions/members";
import { cn } from "@/lib/cn";

const initial: ChangeOwnState = { status: "idle" };

export default function ChangePasswordForm({ needsChange }: { needsChange: boolean }) {
  const [state, formAction, pending] = useActionState(changeOwnPassword, initial);

  return (
    <div>
      {needsChange && (
        <p className="mb-6 text-sm italic-soft text-gold/80">
          Esta é sua primeira sessão — defina uma senha pessoal antes de continuar.
        </p>
      )}
      <form action={formAction} className="space-y-6">
        <label className="block">
          <span className="eyebrow text-cream/55 mb-2 block">Senha atual</span>
          <input
            type="password"
            name="currentPassword"
            autoComplete="current-password"
            required
            className="w-full bg-transparent border-0 border-b border-cream/25 focus:border-gold outline-none py-3 text-cream font-light text-lg transition-colors duration-300 font-serif"
          />
        </label>
        <label className="block">
          <span className="eyebrow text-cream/55 mb-2 block">Nova senha (mín. 8 caracteres)</span>
          <input
            type="password"
            name="newPassword"
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full bg-transparent border-0 border-b border-cream/25 focus:border-gold outline-none py-3 text-cream font-light text-lg transition-colors duration-300 font-serif"
          />
        </label>

        {state.status === "error" && (
          <p className="text-sm text-red-300/90 italic-soft">{state.message}</p>
        )}
        {state.status === "ok" && (
          <p className="text-sm text-gold italic-soft">Senha atualizada.</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className={cn("btn-primary", pending && "opacity-60 pointer-events-none")}
        >
          {pending ? "Salvando…" : "Atualizar senha"}
        </button>
      </form>
    </div>
  );
}
