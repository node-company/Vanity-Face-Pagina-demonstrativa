import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCurrentMember } from "@/lib/dal";
import { getLeadActivities, getLeadById } from "@/lib/leads-queries";
import { StageBadge, ScoreBadge } from "@/components/crm/badges";
import LeadStageEditor from "@/components/crm/LeadStageEditor";
import LeadScoreEditor from "@/components/crm/LeadScoreEditor";
import LeadTagsEditor from "@/components/crm/LeadTagsEditor";
import LeadNotesEditor from "@/components/crm/LeadNotesEditor";
import LeadWhatsappButton from "@/components/crm/LeadWhatsappButton";
import LeadDeleteButton from "@/components/crm/LeadDeleteButton";
import {
  AREA_CONCERN_LABELS,
  AUTHORITY_LABELS,
  BUDGET_LABELS,
  PROCEDURE_LABELS,
  TIMEFRAME_LABELS,
  type AREA_CONCERN_OPTIONS,
  type AUTHORITY_OPTIONS,
  type BUDGET_OPTIONS,
  type PROCEDURE_OPTIONS,
  type TIMEFRAME_OPTIONS,
} from "@/lib/validators";

export const dynamic = "force-dynamic";

export default async function LeadDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await requireCurrentMember();
  const lead = await getLeadById(member.account_id, id);
  if (!lead) notFound();

  const activities = await getLeadActivities(lead.id);

  const procLabel = lead.procedure_interest
    ? PROCEDURE_LABELS[lead.procedure_interest as (typeof PROCEDURE_OPTIONS)[number]]
    : null;
  const areaLabel =
    lead.area_concern === "outro"
      ? lead.area_concern_other ?? "Outro"
      : lead.area_concern
        ? AREA_CONCERN_LABELS[lead.area_concern as (typeof AREA_CONCERN_OPTIONS)[number]]
        : "—";
  const budgetLabel = lead.budget_range
    ? BUDGET_LABELS[lead.budget_range as (typeof BUDGET_OPTIONS)[number]]
    : "—";
  const timeframeLabel = lead.timeframe
    ? TIMEFRAME_LABELS[lead.timeframe as (typeof TIMEFRAME_OPTIONS)[number]]
    : "—";
  const authorityLabel = lead.decision_authority
    ? AUTHORITY_LABELS[lead.decision_authority as (typeof AUTHORITY_OPTIONS)[number]]
    : "—";

  const firstName = lead.name.trim().split(/\s+/)[0];

  return (
    <div className="px-6 lg:px-10 py-10 lg:py-14 max-w-[1400px]">
      <Link
        href="/crm/leads"
        className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.24em] uppercase text-cream/55 hover:text-gold transition-colors mb-8"
      >
        ← Todos os leads
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-6 mb-12 border-b border-cream/10 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <StageBadge stage={lead.stage} />
            <ScoreBadge score={lead.manual_score ?? lead.score} />
          </div>
          <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] text-cream leading-tight">
            {lead.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-cream/55 tabular text-sm">
            <span className="text-cream/80">{lead.whatsapp}</span>
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="text-cream/80 hover:text-gold transition-colors lowercase"
              >
                {lead.email}
              </a>
            )}
            <span>
              · criado em{" "}
              {new Date(lead.created_at).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <div className="w-full sm:w-auto sm:min-w-[280px]">
          <LeadWhatsappButton
            leadId={lead.id}
            whatsapp={lead.whatsapp}
            firstName={firstName}
            procedureLabel={procLabel}
          />
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Coluna principal: respostas + atividades */}
        <div className="lg:col-span-8 space-y-12">
          <section>
            <h2 className="eyebrow text-gold/80 mb-6">Respostas do formulário</h2>
            <dl className="grid sm:grid-cols-2 gap-y-7 gap-x-10">
              <Field label="Procedimento de interesse" value={procLabel ?? "—"} />
              <Field label="Área que mais incomoda" value={areaLabel} />
              <Field label="Faixa de investimento" value={budgetLabel} />
              <Field label="Quando pretende realizar" value={timeframeLabel} />
              <Field label="Autonomia de decisão" value={authorityLabel} />
              <Field label="Fonte" value={lead.source} />
            </dl>
          </section>

          <section>
            <LeadNotesEditor leadId={lead.id} initial={lead.notes} />
          </section>

          <section>
            <h2 className="eyebrow text-gold/80 mb-6">Histórico</h2>
            {activities.length === 0 ? (
              <p className="italic-soft text-cream/45">Sem registros ainda.</p>
            ) : (
              <ul className="space-y-4 border-l border-cream/10 pl-6">
                {activities.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[27px] top-2 w-2 h-2 bg-gold/60" />
                    <p className="text-sm text-cream">
                      <ActivityLabel type={a.type} payload={a.payload} />
                    </p>
                    <p className="text-[0.65rem] tabular tracking-widest text-cream/35 mt-0.5">
                      {new Date(a.created_at).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Coluna lateral: edições */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="border border-cream/10 p-6 space-y-7 bg-navy-light/30">
            <LeadStageEditor leadId={lead.id} current={lead.stage} />
            <LeadScoreEditor
              leadId={lead.id}
              autoScore={lead.score}
              manualScore={lead.manual_score}
            />
            <LeadTagsEditor leadId={lead.id} initial={lead.tags ?? []} />
            {member.role === "admin" && (
              <LeadDeleteButton leadId={lead.id} leadName={lead.name} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-cream/45 mb-1">{label}</dt>
      <dd className="text-cream font-light text-base">{value}</dd>
    </div>
  );
}

function ActivityLabel({ type, payload }: { type: string; payload: Record<string, unknown> | null }) {
  switch (type) {
    case "created":
      return <>Lead criado a partir do formulário do site.</>;
    case "stage_changed":
      return (
        <>
          Estágio alterado de <em className="text-cream/65">{String(payload?.from ?? "?")}</em> para{" "}
          <em className="text-gold">{String(payload?.to ?? "?")}</em>
          {payload?.auto ? " (automático)" : ""}.
        </>
      );
    case "score_changed":
      return <>Score manual ajustado para {String(payload?.manual_score ?? "—")}.</>;
    case "note":
      return <>Nota atualizada: &ldquo;{String(payload?.preview ?? "")}&rdquo;…</>;
    case "whatsapp_sent":
      return <>WhatsApp aberto pela equipe.</>;
    case "assigned":
      return <>Lead atribuído a outro atendente.</>;
    case "agenda_linked":
      return <>Compromisso vinculado na agenda.</>;
    default:
      return <>{type}</>;
  }
}
