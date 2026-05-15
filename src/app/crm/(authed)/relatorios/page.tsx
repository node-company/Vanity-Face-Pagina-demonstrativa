import Link from "next/link";
import { requireCurrentMember } from "@/lib/dal";
import {
  getReportsBundle,
  type BreakdownRow,
  type FunnelStep,
  type MemberPerformanceRow,
  type PeriodKey,
  type StaleLeadRow,
} from "@/lib/reports-queries";
import PeriodFilter from "@/components/crm/PeriodFilter";
import PrintButton from "@/components/crm/PrintButton";
import SectionNav from "@/components/crm/SectionNav";
import LineChart from "@/components/crm/LineChart";
import MultiLineChart from "@/components/crm/MultiLineChart";
import { STAGE_LABELS, type Stage } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const VALID_PERIODS: PeriodKey[] = ["7d", "30d", "90d", "year", "all"];

const SECTIONS = [
  { id: "sec-geral", label: "Geral" },
  { id: "sec-tendencias", label: "Tendências" },
  { id: "sec-perfil", label: "Perfil dos leads" },
  { id: "sec-operacao", label: "Operação" },
];

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireCurrentMember();
  const sp = await searchParams;
  const periodRaw = typeof sp.period === "string" ? sp.period : "30d";
  const period: PeriodKey = (VALID_PERIODS as string[]).includes(periodRaw)
    ? (periodRaw as PeriodKey)
    : "30d";

  const data = await getReportsBundle(member.account_id, period);

  return (
    <div className="px-6 lg:px-10 py-10 lg:py-14 max-w-[1500px] reports-root">
      {/* Cabeçalho */}
      <header className="flex flex-wrap items-end justify-between gap-6 mb-8 reports-no-print">
        <div>
          <p className="eyebrow text-gold/80 mb-3">Relatórios</p>
          <h1 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] text-cream">
            Visão analítica
          </h1>
          <p className="mt-2 text-cream/55 text-sm">
            Período: <span className="text-cream">{data.rangeLabel}</span> · granularidade dos gráficos:{" "}
            <span className="text-cream">
              {data.daily.granularity === "day"
                ? "diária"
                : data.daily.granularity === "week"
                  ? "semanal"
                  : "mensal"}
            </span>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <PeriodFilter current={period} />
          <PrintButton label="Imprimir tudo" />
        </div>
      </header>

      {/* Capa só na impressão */}
      <div className="hidden print-cover mb-10">
        <p className="eyebrow text-gold mb-3">Vanity Face — Relatório</p>
        <h2 className="font-display text-3xl text-cream mb-2">{data.rangeLabel}</h2>
        <p className="text-cream/55 text-sm">
          Gerado em{" "}
          {new Date().toLocaleString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" · "}por {member.name}
        </p>
      </div>

      {/* Nav âncora */}
      <SectionNav sections={SECTIONS} />

      {/* ================== GERAL ================== */}
      <SectionHeader id="sec-geral" title="Geral" subtitle="Indicadores-chave e funil de conversão" />

      <div className="space-y-8 mb-16">
        <ReportCard
          id="summary"
          title="Resumo executivo"
          subtitle="Volumes, conversão e valor estimado de pipeline"
        >
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-cream/10 border border-cream/10">
            <Metric label="Total de leads" value={data.summary.total} />
            <Metric label="Quentes" value={data.summary.hot} hint="score ≥ 70" />
            <Metric label="Mornos" value={data.summary.warm} hint="40-69" />
            <Metric label="Frios" value={data.summary.cold} hint="< 40" />
            <Metric
              label="Conversão"
              value={`${data.summary.conversionPct}%`}
              hint="ganhos / total"
            />
            <Metric
              label="Agendados / Compareceram"
              value={data.summary.scheduledOrAttended}
            />
            <Metric label="Fechados — ganhos" value={data.summary.won} />
            <Metric label="Fechados — perdidos" value={data.summary.lost} />
            <Metric
              label="Pipeline (R$)"
              value={brl(data.summary.pipelineValue)}
              hint="estimado, exclui perdidos"
            />
            <Metric
              label="Ganho (R$)"
              value={brl(data.summary.wonValue)}
              hint="estimado pelos midpoints"
            />
          </div>
          <p className="mt-4 text-[0.65rem] tabular tracking-widest text-cream/35">
            Valores em R$ usam o ponto médio de cada faixa de investimento.
          </p>
        </ReportCard>

        <ReportCard
          id="funnel"
          title="Funil de conversão"
          subtitle="Quantos leads atingem cada estágio e a conversão de uma etapa para a próxima"
        >
          <FunnelTable steps={data.funnel} />
        </ReportCard>
      </div>

      {/* ================== TENDÊNCIAS ================== */}
      <SectionHeader
        id="sec-tendencias"
        title="Tendências"
        subtitle="Evolução temporal de leads, procedimentos e investimento"
      />

      <div className="space-y-8 mb-16">
        <ReportCard
          id="trend-leads"
          title="Volume de leads por dia"
          subtitle="Quantos leads chegaram em cada bucket do período"
        >
          <LineChart
            labels={data.daily.bucketLabels}
            data={data.daily.leadsTotal}
            ariaLabel={`Volume de leads — ${data.daily.leadsTotal.reduce((a, b) => a + b, 0)} leads no período`}
          />
        </ReportCard>

        <ReportCard
          id="trend-procedure"
          title="Procedimentos por dia"
          subtitle="Top 5 procedimentos com mais interesse + 'Outros'. Clique na legenda para ocultar uma série."
        >
          <MultiLineChart
            labels={data.daily.bucketLabels}
            series={data.daily.byProcedure}
            ariaLabel="Procedimentos de interesse ao longo do tempo"
          />
        </ReportCard>

        <ReportCard
          id="trend-budget"
          title="Faixas de investimento por dia"
          subtitle="Onde o pipeline está se concentrando financeiramente"
        >
          <MultiLineChart
            labels={data.daily.bucketLabels}
            series={data.daily.byBudget}
            ariaLabel="Faixas de investimento ao longo do tempo"
          />
        </ReportCard>

        <ReportCard
          id="trend-conversion"
          title="Conversões (ganhos) por dia"
          subtitle="Leads que viraram fechado-ganho, agrupados pela data de criação"
        >
          <LineChart
            labels={data.daily.bucketLabels}
            data={data.daily.conversionsTotal}
            color="#a8892e"
            ariaLabel={`Conversões — ${data.daily.conversionsTotal.reduce((a, b) => a + b, 0)} ganhos no período`}
          />
        </ReportCard>
      </div>

      {/* ================== PERFIL DOS LEADS ================== */}
      <SectionHeader
        id="sec-perfil"
        title="Perfil dos leads"
        subtitle="Quem está chegando e o que está pedindo"
      />

      <div className="space-y-8 mb-16">
        <ReportCard id="procedure" title="Interesse por procedimento">
          <BreakdownTable rows={data.byProcedure} />
        </ReportCard>

        <ReportCard
          id="budget"
          title="Faixas de investimento"
          subtitle="Distribuição financeira do pool de leads"
        >
          <BreakdownTable rows={data.byBudget} showValue />
        </ReportCard>

        <ReportCard id="area" title="Áreas que mais incomodam">
          <BreakdownTable rows={data.byArea} />
        </ReportCard>

        <ReportCard id="timeframe" title="Urgência (quando pretende realizar)">
          <BreakdownTable rows={data.byTimeframe} />
        </ReportCard>

        <ReportCard id="authority" title="Autonomia de decisão">
          <BreakdownTable rows={data.byAuthority} />
        </ReportCard>

        <ReportCard id="source" title="Origem dos leads">
          <BreakdownTable rows={data.bySource} />
        </ReportCard>

        {data.topTags.length > 0 && (
          <ReportCard id="tags" title="Tags mais usadas">
            <BreakdownTable rows={data.topTags} />
          </ReportCard>
        )}
      </div>

      {/* ================== OPERAÇÃO ================== */}
      <SectionHeader
        id="sec-operacao"
        title="Operação"
        subtitle="Como a equipe está executando e onde focar"
      />

      <div className="space-y-8 mb-12">
        <ReportCard id="agenda-report" title="Agenda no período">
          <div className="grid grid-cols-3 gap-px bg-cream/10 border border-cream/10 mb-5">
            <Metric label="Total de eventos" value={data.agenda.total} />
            <Metric label="Futuros" value={data.agenda.upcoming} />
            <Metric label="Passados" value={data.agenda.past} />
          </div>
          <BreakdownTable rows={data.agenda.byType} />
        </ReportCard>

        <ReportCard
          id="team"
          title="Atividade da equipe"
          subtitle="Quem mexeu em quê no período"
        >
          <MemberTable rows={data.byMember} />
        </ReportCard>

        <ReportCard
          id="stale"
          title="Leads sem ação há mais de 7 dias"
          subtitle="Top 25 — priorize follow-ups com estes"
        >
          <StaleTable rows={data.staleLeads} />
        </ReportCard>
      </div>

      <footer className="mt-16 pt-8 border-t border-cream/10 text-cream/35 text-[0.65rem] tabular tracking-widest text-center reports-no-print">
        Vanity Face — CRM · Relatórios
      </footer>
    </div>
  );
}

// ===========================================================================
// Building blocks
// ===========================================================================

function SectionHeader({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div id={id} className="scroll-mt-20 mb-6 mt-12 first:mt-8">
      <div className="flex items-center gap-4 mb-2">
        <span className="h-px w-10 bg-gold/60" />
        <span className="eyebrow text-gold tabular">{title}</span>
      </div>
      {subtitle && (
        <p className="font-display text-2xl lg:text-[1.7rem] text-cream/85 leading-tight">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ReportCard({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={`report-${id}`}
      data-report={id}
      className="report-section border border-cream/10 bg-navy-light/20 print-keep-together"
    >
      <header className="flex items-baseline justify-between gap-4 px-6 lg:px-8 py-5 border-b border-cream/10">
        <div>
          <h2 className="font-display text-xl lg:text-2xl text-cream">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-cream/55 text-sm font-light">{subtitle}</p>
          )}
        </div>
        <PrintButton
          target={id}
          className="text-[0.6rem] tracking-[0.22em] uppercase text-cream/55 hover:text-gold transition-colors reports-no-print"
          label="Imprimir"
        />
      </header>
      <div className="px-6 lg:px-8 py-6">{children}</div>
    </section>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="bg-navy p-5">
      <p className="eyebrow text-cream/45">{label}</p>
      <p className="font-display text-3xl text-cream mt-2 tabular">{value}</p>
      {hint && (
        <p className="text-[0.65rem] tracking-[0.18em] uppercase text-cream/35 mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}

function FunnelTable({ steps }: { steps: FunnelStep[] }) {
  const max = Math.max(1, ...steps.map((s) => s.count));
  return (
    <div className="space-y-3">
      {steps.map((s) => (
        <div key={s.stage} className="flex items-center gap-5">
          <span className="w-44 text-[0.7rem] tracking-[0.22em] uppercase text-cream/65">
            {STAGE_LABELS[s.stage]}
          </span>
          <div className="flex-1 h-7 bg-cream/5 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gold/30"
              style={{ width: `${(s.count / max) * 100}%` }}
            />
          </div>
          <span className="w-12 text-right text-sm tabular text-cream font-medium">
            {s.count}
          </span>
          <span className="w-16 text-right text-xs tabular text-cream/55">
            {s.pctOfTotal}% tot.
          </span>
          <span className="w-20 text-right text-xs tabular text-gold/80">
            {s.conversionFromPrev !== null ? `${s.conversionFromPrev}% conv.` : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

function BreakdownTable({
  rows,
  showValue,
}: {
  rows: BreakdownRow[];
  showValue?: boolean;
}) {
  if (rows.length === 0) {
    return <p className="italic-soft text-cream/45">Sem dados no período.</p>;
  }
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-[0.6rem] tracking-[0.22em] uppercase text-cream/45 border-b border-cream/10">
          <th className="py-2 pr-4 font-normal">Item</th>
          <th className="py-2 pr-4 font-normal">Distribuição</th>
          <th className="py-2 pr-4 font-normal text-right w-16">Qtd</th>
          <th className="py-2 pr-4 font-normal text-right w-16">%</th>
          {showValue && (
            <th className="py-2 pr-4 font-normal text-right w-32">Valor (R$)</th>
          )}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key} className="border-b border-cream/5">
            <td className="py-3 pr-4 text-cream text-sm">{r.label}</td>
            <td className="py-3 pr-4">
              <div className="h-3 bg-cream/5 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gold/30"
                  style={{ width: `${(r.count / max) * 100}%` }}
                />
              </div>
            </td>
            <td className="py-3 pr-4 text-right text-cream tabular">{r.count}</td>
            <td className="py-3 pr-4 text-right text-cream/55 tabular text-sm">
              {r.pct}%
            </td>
            {showValue && (
              <td className="py-3 pr-4 text-right text-gold tabular text-sm">
                {brl(r.value ?? 0)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MemberTable({ rows }: { rows: MemberPerformanceRow[] }) {
  if (rows.length === 0) {
    return <p className="italic-soft text-cream/45">Sem atividade no período.</p>;
  }
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-[0.6rem] tracking-[0.22em] uppercase text-cream/45 border-b border-cream/10">
          <th className="py-2 pr-4 font-normal">Membro</th>
          <th className="py-2 pr-4 font-normal text-right">Atividades</th>
          <th className="py-2 pr-4 font-normal text-right">Mudanças stage</th>
          <th className="py-2 pr-4 font-normal text-right">WhatsApp</th>
          <th className="py-2 pr-4 font-normal text-right">Notas</th>
          <th className="py-2 pr-4 font-normal text-right">Atribuídos</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.memberId ?? "_orphan"} className="border-b border-cream/5">
            <td className="py-3 pr-4 text-cream text-sm font-serif">{r.memberName}</td>
            <td className="py-3 pr-4 text-right text-cream tabular">{r.totalActivities}</td>
            <td className="py-3 pr-4 text-right text-cream/65 tabular">{r.stageChanges}</td>
            <td className="py-3 pr-4 text-right text-cream/65 tabular">{r.whatsappSent}</td>
            <td className="py-3 pr-4 text-right text-cream/65 tabular">{r.notes}</td>
            <td className="py-3 pr-4 text-right text-cream/65 tabular">{r.leadsAssigned}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StaleTable({ rows }: { rows: StaleLeadRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="italic-soft text-cream/45">
        Nada parado há mais de 7 dias. Bom trabalho.
      </p>
    );
  }
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-[0.6rem] tracking-[0.22em] uppercase text-cream/45 border-b border-cream/10">
          <th className="py-2 pr-4 font-normal">Lead</th>
          <th className="py-2 pr-4 font-normal">WhatsApp</th>
          <th className="py-2 pr-4 font-normal">Estágio</th>
          <th className="py-2 pr-4 font-normal text-right">Score</th>
          <th className="py-2 pr-4 font-normal text-right">Há quantos dias</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className="border-b border-cream/5">
            <td className="py-3 pr-4">
              <Link
                href={`/crm/leads/${r.id}`}
                className="font-serif text-cream hover:text-gold transition-colors"
              >
                {r.name}
              </Link>
            </td>
            <td className="py-3 pr-4 text-cream/65 tabular text-sm">{r.whatsapp}</td>
            <td className="py-3 pr-4 text-cream/65 text-sm">
              {STAGE_LABELS[r.stage as Stage]}
            </td>
            <td className="py-3 pr-4 text-right text-cream tabular">{r.score}</td>
            <td className="py-3 pr-4 text-right text-gold tabular">{r.daysSinceUpdate}d</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function brl(n: number): string {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}
