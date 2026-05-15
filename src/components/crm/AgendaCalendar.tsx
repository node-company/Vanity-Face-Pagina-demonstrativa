"use client";

import { useMemo, useState, useTransition } from "react";
import { useActionState } from "react";
import {
  createAgendaEvent,
  deleteAgendaEvent,
  type AgendaState,
} from "@/app/actions/agenda";
import { EVENT_TYPE_LABELS, type AgendaEvent, type EventType, type Lead } from "@/lib/supabase/types";
import { cn } from "@/lib/cn";

const initial: AgendaState = { status: "idle" };
const EVENT_TONES: Record<EventType, string> = {
  consultation: "bg-gold/80 text-navy",
  followup: "bg-cream/35 text-navy",
  call: "bg-mist/60 text-navy",
  procedure: "bg-gold-dark text-navy",
  other: "bg-cream/15 text-cream",
};

interface Props {
  events: AgendaEvent[];
  leads: Pick<Lead, "id" | "name" | "whatsapp">[];
}

export default function AgendaCalendar({ events, leads }: Props) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [modal, setModal] = useState<
    | null
    | { mode: "new"; date: Date }
    | { mode: "view"; event: AgendaEvent }
  >(null);

  const monthLabel = cursor.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  // Build days of month grid (Mon-Sun layout)
  const grid = useMemo(() => buildMonthGrid(cursor), [cursor]);

  // Group events by yyyy-mm-dd
  const byDay = useMemo(() => {
    const m = new Map<string, AgendaEvent[]>();
    events.forEach((e) => {
      const k = isoDateKey(new Date(e.starts_at));
      const list = m.get(k) ?? [];
      list.push(e);
      m.set(k, list);
    });
    // sort each day by starts_at
    m.forEach((v) => v.sort((a, b) => a.starts_at.localeCompare(b.starts_at)));
    return m;
  }, [events]);

  return (
    <>
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
            className="text-cream/55 hover:text-gold text-[0.7rem] tracking-[0.22em] uppercase"
          >
            ← Anterior
          </button>
          <h2 className="font-display text-2xl text-cream capitalize">{monthLabel}</h2>
          <button
            type="button"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
            className="text-cream/55 hover:text-gold text-[0.7rem] tracking-[0.22em] uppercase"
          >
            Próximo →
          </button>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "new", date: new Date() })}
          className="btn-primary text-[0.65rem] px-5 py-2.5"
        >
          + Novo compromisso
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-cream/10 border border-cream/10">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
          <div
            key={d}
            className="bg-navy py-2 text-center text-[0.6rem] tracking-[0.24em] uppercase text-cream/45"
          >
            {d}
          </div>
        ))}
        {grid.map((day) => {
          const key = isoDateKey(day.date);
          const list = byDay.get(key) ?? [];
          return (
            <button
              key={key + (day.outside ? "-x" : "")}
              type="button"
              onClick={() => setModal({ mode: "new", date: day.date })}
              className={cn(
                "bg-navy min-h-[110px] p-2 text-left flex flex-col gap-1 hover:bg-navy-light/40 transition-colors",
                day.outside && "opacity-35",
                day.isToday && "ring-1 ring-inset ring-gold/50"
              )}
            >
              <span
                className={cn(
                  "text-xs tabular self-end",
                  day.isToday ? "text-gold" : "text-cream/55"
                )}
              >
                {day.date.getDate()}
              </span>
              {list.slice(0, 3).map((ev) => (
                <span
                  key={ev.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal({ mode: "view", event: ev });
                  }}
                  className={cn(
                    "block text-[0.65rem] px-1.5 py-1 truncate tabular tracking-tight font-medium cursor-pointer",
                    EVENT_TONES[ev.type]
                  )}
                  title={ev.title}
                >
                  {new Date(ev.starts_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  {ev.title}
                </span>
              ))}
              {list.length > 3 && (
                <span className="text-[0.6rem] text-cream/45">+{list.length - 3} mais</span>
              )}
            </button>
          );
        })}
      </div>

      {modal?.mode === "new" && (
        <NewEventModal
          date={modal.date}
          leads={leads}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.mode === "view" && (
        <ViewEventModal
          event={modal.event}
          leadName={leads.find((l) => l.id === modal.event.lead_id)?.name ?? null}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

// -- modals ------------------------------------------------------------------

function NewEventModal({
  date,
  leads,
  onClose,
}: {
  date: Date;
  leads: Pick<Lead, "id" | "name" | "whatsapp">[];
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(createAgendaEvent, initial);

  // Quando ok, fecha
  if (state.status === "ok") {
    setTimeout(onClose, 50);
  }

  const defaultDate = new Date(date);
  defaultDate.setHours(10, 0, 0, 0);
  const defaultEnd = new Date(defaultDate);
  defaultEnd.setHours(defaultEnd.getHours() + 1);

  return (
    <ModalShell title="Novo compromisso" onClose={onClose}>
      <form action={formAction} className="space-y-5">
        <Field label="Título">
          <input
            name="title"
            required
            placeholder="Consulta inicial — Ana"
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
          />
        </Field>
        <Field label="Tipo">
          <select
            name="type"
            defaultValue="consultation"
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
          >
            {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((t) => (
              <option key={t} value={t}>
                {EVENT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Início">
            <input
              type="datetime-local"
              name="starts_at"
              required
              defaultValue={toLocalInput(defaultDate)}
              className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
            />
          </Field>
          <Field label="Fim">
            <input
              type="datetime-local"
              name="ends_at"
              required
              defaultValue={toLocalInput(defaultEnd)}
              className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
            />
          </Field>
        </div>
        <Field label="Lead (opcional)">
          <select
            name="lead_id"
            defaultValue=""
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
          >
            <option value="">Nenhum</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} — {l.whatsapp}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Notas">
          <textarea
            name="notes"
            rows={3}
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
          />
        </Field>
        {state.status === "error" && (
          <p className="text-sm text-red-300/90 italic-soft">{state.message}</p>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost text-[0.65rem] px-5 py-2">
            Cancelar
          </button>
          <button type="submit" disabled={pending} className="btn-primary text-[0.65rem] px-5 py-2">
            {pending ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ViewEventModal({
  event,
  leadName,
  onClose,
}: {
  event: AgendaEvent;
  leadName: string | null;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function onDelete() {
    startTransition(async () => {
      await deleteAgendaEvent(event.id);
      onClose();
    });
  }

  const starts = new Date(event.starts_at);
  const ends = new Date(event.ends_at);

  return (
    <ModalShell title={event.title} onClose={onClose}>
      <div className="space-y-4">
        <Row label="Tipo" value={EVENT_TYPE_LABELS[event.type]} />
        <Row
          label="Quando"
          value={`${starts.toLocaleString("pt-BR", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })} – ${ends.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`}
        />
        {leadName && <Row label="Lead" value={leadName} />}
        {event.notes && <Row label="Notas" value={event.notes} />}

        <div className="flex justify-end gap-3 pt-2">
          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="text-[0.65rem] tracking-[0.22em] uppercase text-red-300/80 hover:text-red-300"
            >
              Apagar
            </button>
          ) : (
            <>
              <span className="text-xs text-cream/55 self-center">Tem certeza?</span>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="btn-ghost text-[0.65rem] px-4 py-2"
              >
                Não
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={isPending}
                className="btn-primary text-[0.65rem] px-4 py-2 bg-red-400/90 hover:bg-red-300"
              >
                {isPending ? "Apagando…" : "Sim, apagar"}
              </button>
            </>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-navy/85 backdrop-blur-md"
      />
      <div className="relative w-full max-w-md bg-navy border border-cream/15 p-6 max-h-[88vh] overflow-y-auto">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="font-display text-xl text-cream pr-4">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-cream/55 hover:text-gold text-sm"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-cream/55 mb-2 block">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow text-cream/45 mb-1">{label}</p>
      <p className="text-cream text-sm font-light">{value}</p>
    </div>
  );
}

// -- date helpers ------------------------------------------------------------

function buildMonthGrid(monthStart: Date): { date: Date; outside: boolean; isToday: boolean }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const first = new Date(monthStart);
  first.setHours(0, 0, 0, 0);
  // Day of week: 0=Sun, but we want Mon=0
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - offset);

  const cells: { date: Date; outside: boolean; isToday: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    d.setHours(0, 0, 0, 0);
    cells.push({
      date: d,
      outside: d.getMonth() !== monthStart.getMonth(),
      isToday: d.getTime() === today.getTime(),
    });
  }
  return cells;
}

function isoDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
