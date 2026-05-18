"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent,
} from "react";
import { useLeadForm } from "./provider";
import {
  AREA_CONCERN_LABELS,
  AREA_CONCERN_OPTIONS,
  AUTHORITY_LABELS,
  AUTHORITY_OPTIONS,
  BUDGET_LABELS,
  BUDGET_OPTIONS,
  PROCEDURE_LABELS,
  PROCEDURE_OPTIONS,
  TIMEFRAME_LABELS,
  TIMEFRAME_OPTIONS,
  formatBrMobile,
  isValidBrMobile,
} from "@/lib/validators";
import { submitLead, type SubmitLeadState } from "@/app/actions/leads";
import { cn } from "@/lib/cn";

const STEPS = [
  "name",
  "whatsapp",
  "area",
  "procedure",
  "budget",
  "timeframe",
  "authority",
  "success",
] as const;
type StepKey = (typeof STEPS)[number];

interface FormState {
  name: string;
  whatsapp: string;
  area_concern: (typeof AREA_CONCERN_OPTIONS)[number] | "";
  area_concern_other: string;
  procedure_interest: (typeof PROCEDURE_OPTIONS)[number] | "";
  budget_range: (typeof BUDGET_OPTIONS)[number] | "";
  timeframe: (typeof TIMEFRAME_OPTIONS)[number] | "";
  decision_authority: (typeof AUTHORITY_OPTIONS)[number] | "";
}

const EMPTY: FormState = {
  name: "",
  whatsapp: "",
  area_concern: "",
  area_concern_other: "",
  procedure_interest: "",
  budget_range: "",
  timeframe: "",
  decision_authority: "",
};

export default function LeadFormModal() {
  const { isOpen, close, preselectedProcedure } = useLeadForm();
  const [stepIdx, setStepIdx] = useState(0);
  const [data, setData] = useState<FormState>(EMPTY);
  const [stepError, setStepError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const panelRef = useRef<HTMLDivElement>(null);

  const step: StepKey = STEPS[stepIdx];

  // Reset when opening
  useEffect(() => {
    if (!isOpen) return;
    setStepIdx(0);
    setData({
      ...EMPTY,
      procedure_interest: preselectedProcedure ?? "",
    });
    setStepError(null);
    setServerError(null);
  }, [isOpen, preselectedProcedure]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  // ---- Validação por step ----
  function validateCurrent(): string | null {
    switch (step) {
      case "name":
        if (data.name.trim().length < 2) return "Conte-nos seu nome (mínimo 2 letras).";
        return null;
      case "whatsapp": {
        if (!isValidBrMobile(data.whatsapp))
          return "Informe um WhatsApp brasileiro válido — formato (DD) 9 XXXX-XXXX.";
        return null;
      }
      case "area":
        if (!data.area_concern) return "Escolha uma opção para continuar.";
        if (data.area_concern === "outro" && data.area_concern_other.trim().length < 2)
          return "Conte um pouco sobre o que mais te incomoda.";
        return null;
      case "procedure":
        if (!data.procedure_interest) return "Escolha uma opção para continuar.";
        return null;
      case "budget":
        if (!data.budget_range) return "Escolha uma opção para continuar.";
        return null;
      case "timeframe":
        if (!data.timeframe) return "Escolha uma opção para continuar.";
        return null;
      case "authority":
        if (!data.decision_authority) return "Escolha uma opção para continuar.";
        return null;
      default:
        return null;
    }
  }

  function goNext() {
    const err = validateCurrent();
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);

    if (step === "authority") {
      handleSubmit();
      return;
    }

    setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setStepError(null);
    setStepIdx((i) => Math.max(i - 1, 0));
  }

  function handleSubmit() {
    setServerError(null);
    const fd = new FormData();
    fd.set("name", data.name.trim());
    fd.set("whatsapp", data.whatsapp.trim());
    fd.set("area_concern", data.area_concern);
    if (data.area_concern === "outro")
      fd.set("area_concern_other", data.area_concern_other.trim());
    fd.set("procedure_interest", data.procedure_interest);
    fd.set("budget_range", data.budget_range);
    fd.set("timeframe", data.timeframe);
    fd.set("decision_authority", data.decision_authority);

    startTransition(async () => {
      const result: SubmitLeadState = await submitLead({ status: "idle" }, fd);
      if (result.status === "ok") {
        setStepIdx(STEPS.indexOf("success"));
      } else if (result.status === "error") {
        setServerError(result.message ?? "Não foi possível enviar. Tente novamente.");
      }
    });
  }

  function onPanelKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" && step !== "success") {
      // Ctrl+Enter in textarea já submete; Enter no input simples também
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA" && !e.metaKey && !e.ctrlKey) return;
      e.preventDefault();
      goNext();
    }
  }

  const totalSteps = STEPS.length - 1; // exclui o success
  const displayIdx = step === "success" ? totalSteps : stepIdx + 1;
  const progress = step === "success" ? 100 : (stepIdx / totalSteps) * 100;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-stretch sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-label="Agendamento — Vanity Face"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={close}
        className="absolute inset-0 bg-navy/90 backdrop-blur-md animate-[fadeIn_300ms_ease-out]"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        onKeyDown={onPanelKeyDown}
        className={cn(
          "relative w-full sm:max-w-3xl sm:mx-6 bg-navy text-cream",
          "border border-cream/10 sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]",
          "flex flex-col min-h-[100svh] sm:min-h-[600px] sm:max-h-[88vh] sm:rounded-none",
          "animate-[panelIn_500ms_cubic-bezier(0.2,0.7,0.2,1)]"
        )}
      >
        {/* Top bar: progress + step counter + close */}
        <div className="relative flex items-center gap-6 px-6 lg:px-10 pt-6 sm:pt-7">
          <span className="eyebrow text-gold/80 tabular">
            {String(displayIdx).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
          </span>
          <div className="flex-1 h-px bg-cream/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar formulário"
            className="text-cream/70 hover:text-gold transition-colors w-9 h-9 -mr-2 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 pt-10 sm:pt-14 pb-8">
          <StepContent
            step={step}
            data={data}
            setData={setData}
            stepError={stepError}
            isPending={isPending}
          />
          {serverError && step !== "success" && (
            <p className="mt-6 text-sm text-red-300/90 italic-soft">{serverError}</p>
          )}
        </div>

        {/* Footer nav */}
        {step !== "success" && (
          <div className="px-6 lg:px-10 py-5 border-t border-cream/10 flex items-center justify-between gap-4 bg-navy">
            {stepIdx > 0 ? (
              <button
                type="button"
                onClick={goBack}
                disabled={isPending}
                className="text-[0.7rem] tracking-[0.28em] uppercase font-medium text-cream/60 hover:text-gold transition-colors disabled:opacity-50"
              >
                ← Voltar
              </button>
            ) : (
              <span className="text-[0.65rem] tracking-[0.22em] uppercase text-cream/40">
                Vanity Face · Vitória — ES
              </span>
            )}

            <button
              type="button"
              onClick={goNext}
              disabled={isPending}
              className={cn(
                "btn-primary",
                isPending && "opacity-60 pointer-events-none"
              )}
            >
              {step === "authority"
                ? isPending
                  ? "Enviando…"
                  : "Concluir"
                : "Continuar"}
              {!isPending && (
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="square" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Step content (switch on step key)
// ---------------------------------------------------------------------------

function StepContent({
  step,
  data,
  setData,
  stepError,
  isPending,
}: {
  step: StepKey;
  data: FormState;
  setData: React.Dispatch<React.SetStateAction<FormState>>;
  stepError: string | null;
  isPending: boolean;
}) {
  switch (step) {
    case "name":
      return (
        <StepShell
          n="01"
          question="Qual o seu nome?"
          subline="É só pra gente saber como te chamar."
          error={stepError}
        >
          <TextInput
            autoFocus
            value={data.name}
            onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
            placeholder="Seu nome completo"
            inputMode="text"
            autoComplete="name"
            maxLength={120}
          />
        </StepShell>
      );

    case "whatsapp":
      return (
        <StepShell
          n="02"
          question="Qual o seu melhor WhatsApp?"
          subline="Formato (DD) 9 XXXX-XXXX. É por aqui que vamos enviar seu plano de tratamento personalizado."
          error={stepError}
        >
          <TextInput
            autoFocus
            value={data.whatsapp}
            onChange={(e) =>
              setData((d) => ({ ...d, whatsapp: formatBrMobile(e.target.value) }))
            }
            placeholder="(27) 9 9946-5417"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
          />
        </StepShell>
      );

    case "area":
      return (
        <StepShell
          n="03"
          question="Qual dessas áreas mais te incomoda hoje?"
          error={stepError}
        >
          <Choices
            value={data.area_concern}
            onChange={(v) =>
              setData((d) => ({ ...d, area_concern: v as FormState["area_concern"] }))
            }
            options={AREA_CONCERN_OPTIONS.map((k) => ({
              value: k,
              label: AREA_CONCERN_LABELS[k],
            }))}
          />
          {data.area_concern === "outro" && (
            <div className="mt-6">
              <TextInput
                autoFocus
                value={data.area_concern_other}
                onChange={(e) =>
                  setData((d) => ({ ...d, area_concern_other: e.target.value }))
                }
                placeholder="Descreva, por favor"
                maxLength={160}
              />
            </div>
          )}
        </StepShell>
      );

    case "procedure":
      return (
        <StepShell
          n="04"
          question="Qual procedimento você tem mais interesse?"
          subline="Não se preocupe se ainda não tem certeza — é só uma direção."
          error={stepError}
        >
          <Choices
            value={data.procedure_interest}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                procedure_interest: v as FormState["procedure_interest"],
              }))
            }
            options={PROCEDURE_OPTIONS.map((k) => ({
              value: k,
              label: PROCEDURE_LABELS[k],
            }))}
          />
        </StepShell>
      );

    case "budget":
      return (
        <StepShell
          n="05"
          question="Para o seu planejamento pessoal, em qual dessas faixas de investimento você se sente mais confortável hoje?"
          subline="Suas respostas nos ajudam a planejar o melhor caminho para você."
          error={stepError}
        >
          <Choices
            value={data.budget_range}
            onChange={(v) =>
              setData((d) => ({ ...d, budget_range: v as FormState["budget_range"] }))
            }
            options={BUDGET_OPTIONS.map((k) => ({
              value: k,
              label: BUDGET_LABELS[k],
            }))}
          />
        </StepShell>
      );

    case "timeframe":
      return (
        <StepShell
          n="06"
          question="Quando você pretende realizar o procedimento?"
          error={stepError}
        >
          <Choices
            value={data.timeframe}
            onChange={(v) =>
              setData((d) => ({ ...d, timeframe: v as FormState["timeframe"] }))
            }
            options={TIMEFRAME_OPTIONS.map((k) => ({
              value: k,
              label: TIMEFRAME_LABELS[k],
            }))}
          />
        </StepShell>
      );

    case "authority":
      return (
        <StepShell
          n="07"
          question="A decisão depende apenas de você, ou precisa ser compartilhada com alguém?"
          subline="Cônjuge, pais, sócio — qualquer pessoa próxima da decisão."
          error={stepError}
        >
          <Choices
            value={data.decision_authority}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                decision_authority: v as FormState["decision_authority"],
              }))
            }
            options={AUTHORITY_OPTIONS.map((k) => ({
              value: k,
              label: AUTHORITY_LABELS[k],
            }))}
          />
          <p className="mt-10 text-xs text-cream/45 italic-soft max-w-md">
            Ao enviar, você concorda em ser contatado pela nossa equipe sobre seu
            plano de tratamento. Seus dados não são compartilhados com terceiros.
          </p>
        </StepShell>
      );

    case "success":
      return <SuccessStep name={data.name} />;
  }
}

// ---------------------------------------------------------------------------
// Visual building blocks
// ---------------------------------------------------------------------------

function StepShell({
  n,
  question,
  subline,
  error,
  children,
}: {
  n: string;
  question: string;
  subline?: string;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="h-px w-8 bg-gold/60" />
        <span className="eyebrow text-gold tabular">Pergunta {n}</span>
      </div>
      <h2 className="font-display text-[clamp(1.85rem,4.6vw,3rem)] text-cream">
        {question}
      </h2>
      {subline && (
        <p className="mt-4 text-cream/65 text-base lg:text-lg font-light leading-relaxed max-w-xl">
          {subline}
        </p>
      )}
      <div className="mt-8 lg:mt-10">{children}</div>
      {error && (
        <p className="mt-5 text-sm text-red-300/90 italic-soft">{error}</p>
      )}
    </div>
  );
}

function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { autoFocus?: boolean }
) {
  return (
    <input
      type="text"
      {...props}
      className={cn(
        "w-full bg-transparent border-0 border-b border-cream/25 focus:border-gold outline-none",
        "py-3 text-2xl lg:text-3xl font-light text-cream placeholder:text-cream/30",
        "transition-colors duration-300 font-serif",
        props.className
      )}
    />
  );
}

function Choices<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T | "";
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="grid gap-3">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "group text-left flex items-center justify-between gap-4",
              "px-5 py-4 lg:px-6 lg:py-5 border transition-all duration-300",
              selected
                ? "bg-gold text-navy border-gold"
                : "bg-transparent text-cream border-cream/15 hover:border-gold/70 hover:text-gold"
            )}
          >
            <span className="text-sm lg:text-base font-medium tracking-wide">
              {opt.label}
            </span>
            <span
              className={cn(
                "flex-shrink-0 w-5 h-5 border transition-colors duration-300 flex items-center justify-center",
                selected ? "border-navy bg-navy" : "border-cream/30"
              )}
            >
              {selected && (
                <svg viewBox="0 0 12 12" className="w-3 h-3 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2 6.5l2.5 2.5L10 3" strokeLinecap="square" />
                </svg>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SuccessStep({ name }: { name: string }) {
  const first = name.trim().split(/\s+/)[0] || "Tudo certo";
  return (
    <div className="max-w-xl mx-auto py-12 lg:py-16 text-center">
      <div className="mx-auto mb-10 w-14 h-14 border border-gold/60 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M4 12.5l5 5 11-11" strokeLinecap="square" />
        </svg>
      </div>
      <p className="eyebrow text-gold mb-4">Recebido</p>
      <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] text-cream">
        Obrigado, <span className="italic text-gold">{first}.</span>
      </h2>
      <p className="mt-6 text-cream/75 text-base lg:text-lg font-light leading-relaxed">
        Nossa equipe entra em contato em breve pelo WhatsApp informado, já com
        uma proposta inicial pensada para o seu caso.
      </p>
      <p className="mt-3 text-cream/45 italic-soft text-sm">
        Atendimento de segunda a sexta, 9h às 19h.
      </p>
    </div>
  );
}

