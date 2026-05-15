"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";
import { cn } from "@/lib/cn";

const initial: LoginState = { status: "idle" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <form action={formAction} className="space-y-7">
      <div>
        <label
          htmlFor="email"
          className="block eyebrow text-cream/60 mb-2"
        >
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full bg-transparent border-0 border-b border-cream/25 focus:border-gold outline-none py-3 text-cream font-light text-lg transition-colors duration-300 font-serif"
        />
        {state.status === "error" && state.fieldErrors?.email && (
          <p className="mt-2 text-xs text-red-300/90">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block eyebrow text-cream/60 mb-2"
        >
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full bg-transparent border-0 border-b border-cream/25 focus:border-gold outline-none py-3 text-cream font-light text-lg transition-colors duration-300 font-serif"
        />
        {state.status === "error" && state.fieldErrors?.password && (
          <p className="mt-2 text-xs text-red-300/90">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p className="text-sm italic-soft text-red-300/90">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={cn("btn-primary w-full", pending && "opacity-60 pointer-events-none")}
      >
        {pending ? "Entrando…" : "Entrar"}
        {!pending && (
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="square" />
          </svg>
        )}
      </button>
    </form>
  );
}
