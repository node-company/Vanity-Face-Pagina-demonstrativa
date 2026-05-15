"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import { updateLeadStage } from "@/app/actions/lead-update";
import { STAGE_LABELS, STAGE_ORDER, type Lead, type Stage } from "@/lib/supabase/types";
import { ScoreBadge } from "./badges";
import { cn } from "@/lib/cn";

const COLUMN_TONES: Record<Stage, string> = {
  new: "border-cream/15",
  contacted: "border-mist/40",
  qualified: "border-gold-soft/60",
  scheduled: "border-gold/60",
  attended: "border-gold/80",
  closed_won: "border-emerald-500/50",
  closed_lost: "border-red-500/40",
};

type ByStage = Record<Stage, Lead[]>;

export default function KanbanBoard({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const byStage: ByStage = STAGE_ORDER.reduce(
    (acc, s) => ({ ...acc, [s]: [] }),
    {} as ByStage
  );
  leads.forEach((l) => {
    byStage[l.stage].push(l);
  });

  function onDragEnd(e: DragEndEvent) {
    const leadId = String(e.active.id);
    const overId = e.over?.id;
    if (!overId) return;
    const newStage = String(overId) as Stage;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage === newStage) return;

    const previousStage = lead.stage;
    // Optimistic update
    setLeads((cur) =>
      cur.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
    );

    startTransition(async () => {
      const res = await updateLeadStage({ leadId, stage: newStage });
      if (!res.ok) {
        setError(res.message ?? "Falhou ao mover.");
        // rollback
        setLeads((cur) =>
          cur.map((l) => (l.id === leadId ? { ...l, stage: previousStage } : l))
        );
        setTimeout(() => setError(null), 3500);
      }
    });
  }

  return (
    <>
      {error && (
        <p className="mb-4 text-sm text-red-300/90 italic-soft">{error}</p>
      )}
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 lg:-mx-10 px-6 lg:px-10">
          {STAGE_ORDER.map((stage) => (
            <Column
              key={stage}
              stage={stage}
              leads={byStage[stage]}
              tone={COLUMN_TONES[stage]}
            />
          ))}
        </div>
      </DndContext>
    </>
  );
}

function Column({
  stage,
  leads,
  tone,
}: {
  stage: Stage;
  leads: Lead[];
  tone: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-72 shrink-0 bg-navy-light/40 border-t-2 transition-colors",
        tone,
        isOver && "bg-navy-light/70"
      )}
    >
      <div className="px-4 pt-4 pb-3 flex items-baseline justify-between">
        <span className="eyebrow text-cream/75">{STAGE_LABELS[stage]}</span>
        <span className="text-[0.7rem] tabular text-cream/45">{leads.length}</span>
      </div>
      <div className="px-2 pb-3 space-y-2 min-h-[60vh]">
        {leads.map((lead) => (
          <Card key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}

function Card({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "bg-navy border border-cream/10 p-3 group cursor-grab active:cursor-grabbing transition-shadow",
        isDragging && "opacity-60 shadow-2xl"
      )}
    >
      <div {...listeners} className="touch-none">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link
            href={`/crm/leads/${lead.id}`}
            className="font-serif text-base text-cream hover:text-gold transition-colors line-clamp-1"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {lead.name}
          </Link>
          <ScoreBadge
            score={lead.manual_score ?? lead.score}
            showLabel={false}
            className="shrink-0"
          />
        </div>
        <p className="text-xs text-cream/55 tabular">{lead.whatsapp}</p>
        {lead.procedure_interest && (
          <p className="mt-1 text-[0.7rem] tracking-wide uppercase text-cream/45 line-clamp-1">
            {lead.procedure_interest}
          </p>
        )}
        <p className="mt-2 text-[0.6rem] tabular tracking-widest text-cream/30">
          {timeAgo(lead.created_at)}
        </p>
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 30) return `${days}d atrás`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}m atrás`;
  return `${Math.floor(days / 365)}a atrás`;
}
