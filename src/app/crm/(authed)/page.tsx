import { requireCurrentMember } from "@/lib/dal";
import { getDashboardMetrics } from "@/lib/leads-queries";
import { STAGE_LABELS, STAGE_ORDER } from "@/lib/supabase/types";
import { periodToRange, type PeriodKey } from "@/lib/reports-queries";
import PeriodFilter from "@/components/crm/PeriodFilter";

export const dynamic = "force-dynamic";

const VALID: PeriodKey[] = ["7d", "30d", "90d", "year", "all"];

export default async function CrmDashboard({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireCurrentMember();
  const sp = await searchParams;
  const periodRaw = typeof sp.period === "string" ? sp.period : "all";
  const period: PeriodKey = (VALID as string[]).includes(periodRaw)
    ? (periodRaw as PeriodKey)
    : "all";
  const { fromIso, label } = periodToRange(period);

  const m = await getDashboardMetrics(member.account_id, fromIso);
  const maxByStage = Math.max(1, ...Object.values(m.byStage));

  return (
    <div className="px-6 lg:px-10 py-10 lg:py-14 max-w-[1400px]">
      <header className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-gold/80 mb-3">Painel</p>
          <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] text-cream">
            Bom te ver,{" "}
            <span className="italic text-gold">{member.name.split(/\s+/)[0]}</span>.
          </h1>
          <p className="mt-3 text-cream/55 text-sm">
            Período em análise: <span className="text-cream">{label}</span>.
          </p>
        </div>
        <PeriodFilter current={period} />
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-cream/10 mb-14 border border-cream/10">
        <Metric label="Total de Leads" value={m.total} hint={label.toLowerCase()} />
        <Metric label="Esta semana" value={m.thisWeek} hint="últimos 7 dias" />
        <Metric label="Quentes em aberto" value={m.hotOpen} hint="score ≥ 70 sem fechar" />
        <Metric
          label="Conversão"
          value={`${m.conversionPct}%`}
          hint="leads ganhos / total"
        />
      </section>

      <section>
        <h2 className="eyebrow text-cream/55 mb-6">Distribuição por estágio</h2>
        <div className="space-y-3">
          {STAGE_ORDER.map((stage) => {
            const count = m.byStage[stage];
            const pct = (count / maxByStage) * 100;
            return (
              <div key={stage} className="flex items-center gap-5">
                <span className="w-44 text-[0.7rem] tracking-[0.22em] uppercase text-cream/65">
                  {STAGE_LABELS[stage]}
                </span>
                <div className="flex-1 h-7 bg-cream/5 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gold/30 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm tabular text-cream font-medium">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <div className="bg-navy p-7">
      <p className="eyebrow text-cream/50">{label}</p>
      <p className="font-display text-5xl text-cream mt-3 tabular">{value}</p>
      <p className="text-[0.7rem] tracking-[0.18em] uppercase text-cream/35 mt-3">
        {hint}
      </p>
    </div>
  );
}
