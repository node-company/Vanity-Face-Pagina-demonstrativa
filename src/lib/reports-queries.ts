import "server-only";
import { getServiceClient } from "./supabase/service";
import type { Lead, LeadActivity, Stage } from "./supabase/types";

// ---------------------------------------------------------------------------
// Períodos
// ---------------------------------------------------------------------------

export type PeriodKey = "7d" | "30d" | "90d" | "year" | "all";

export function periodToRange(p: PeriodKey | undefined): {
  fromIso: string | null;
  label: string;
} {
  const now = new Date();
  switch (p) {
    case "7d":
      return { fromIso: addDays(now, -7).toISOString(), label: "Últimos 7 dias" };
    case "30d":
      return { fromIso: addDays(now, -30).toISOString(), label: "Últimos 30 dias" };
    case "90d":
      return { fromIso: addDays(now, -90).toISOString(), label: "Últimos 90 dias" };
    case "year":
      return { fromIso: addDays(now, -365).toISOString(), label: "Último ano" };
    case "all":
    default:
      return { fromIso: null, label: "Todo o período" };
  }
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

// ---------------------------------------------------------------------------
// Granularidade & buckets para séries temporais
// ---------------------------------------------------------------------------

export type Granularity = "day" | "week" | "month";

export function periodToGranularity(p: PeriodKey): Granularity {
  if (p === "year") return "week";
  if (p === "all") return "month";
  return "day";
}

/**
 * Constrói os buckets (do início ao fim) e retorna labels prontos para o eixo X.
 */
function buildBuckets(
  granularity: Granularity,
  from: Date,
  to: Date
): { keys: string[]; labels: string[] } {
  const keys: string[] = [];
  const labels: string[] = [];

  const monthShort = (m: number) =>
    ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][m];

  if (granularity === "day") {
    const cur = new Date(from);
    cur.setHours(0, 0, 0, 0);
    const end = new Date(to);
    end.setHours(0, 0, 0, 0);
    while (cur <= end) {
      const k = isoDay(cur);
      keys.push(k);
      labels.push(`${pad2(cur.getDate())}/${pad2(cur.getMonth() + 1)}`);
      cur.setDate(cur.getDate() + 1);
    }
  } else if (granularity === "week") {
    // Semana ISO: usa segunda-feira como início
    const cur = startOfIsoWeek(from);
    const end = startOfIsoWeek(to);
    while (cur <= end) {
      const k = isoWeekKey(cur);
      keys.push(k);
      labels.push(`Sem ${isoWeekNumber(cur)}`);
      cur.setDate(cur.getDate() + 7);
    }
  } else {
    // month
    const cur = new Date(from.getFullYear(), from.getMonth(), 1);
    const end = new Date(to.getFullYear(), to.getMonth(), 1);
    while (cur <= end) {
      const k = `${cur.getFullYear()}-${pad2(cur.getMonth() + 1)}`;
      keys.push(k);
      labels.push(`${monthShort(cur.getMonth())}/${String(cur.getFullYear()).slice(-2)}`);
      cur.setMonth(cur.getMonth() + 1);
    }
  }

  return { keys, labels };
}

function bucketKeyForDate(d: Date, granularity: Granularity): string {
  if (granularity === "day") return isoDay(d);
  if (granularity === "week") return isoWeekKey(startOfIsoWeek(d));
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function isoDay(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfIsoWeek(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  // domingo=0, segunda=1, ..., sábado=6 → queremos segunda como dia 0
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x;
}

function isoWeekNumber(d: Date): number {
  const target = new Date(d.valueOf());
  target.setHours(0, 0, 0, 0);
  // ajusta para quinta-feira da semana corrente
  target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const diff = (target.getTime() - firstThursday.getTime()) / 86400000;
  return 1 + Math.round((diff - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
}

function isoWeekKey(weekStart: Date): string {
  return `${weekStart.getFullYear()}-W${pad2(isoWeekNumber(weekStart))}`;
}

// ---------------------------------------------------------------------------
// Estimativa de valor financeiro por faixa de investimento (midpoint)
// ---------------------------------------------------------------------------

export const BUDGET_VALUE: Record<string, number> = {
  "2k_5k": 3500,
  "5k_10k": 7500,
  "10k_15k": 12500,
  acima_20k: 25000,
  avaliando: 0,
};

export function leadValue(lead: Pick<Lead, "budget_range">): number {
  return BUDGET_VALUE[lead.budget_range ?? ""] ?? 0;
}

// ---------------------------------------------------------------------------
// Relatórios
// ---------------------------------------------------------------------------

export interface ReportSummary {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  won: number;
  lost: number;
  scheduledOrAttended: number;
  conversionPct: number;
  pipelineValue: number;
  wonValue: number;
}

export interface FunnelStep {
  stage: Stage;
  count: number;
  pctOfTotal: number;
  conversionFromPrev: number | null;
}

export interface BreakdownRow {
  key: string;
  label: string;
  count: number;
  pct: number;
  value?: number;
}

export interface MemberPerformanceRow {
  memberId: string | null;
  memberName: string;
  totalActivities: number;
  stageChanges: number;
  whatsappSent: number;
  notes: number;
  leadsAssigned: number;
}

export interface StaleLeadRow {
  id: string;
  name: string;
  whatsapp: string;
  stage: Stage;
  score: number;
  daysSinceUpdate: number;
}

export interface AgendaReport {
  total: number;
  byType: BreakdownRow[];
  upcoming: number;
  past: number;
}

export interface SeriesData {
  key: string;
  label: string;
  data: number[];
}

export interface DailySeries {
  granularity: Granularity;
  /** keys internas dos buckets (yyyy-mm-dd, yyyy-Wnn, yyyy-mm) */
  bucketKeys: string[];
  /** labels prontos para o eixo X */
  bucketLabels: string[];
  /** datas ISO (início do bucket) — útil para tooltip */
  bucketDates: string[];
  leadsTotal: number[];
  conversionsTotal: number[];
  byProcedure: SeriesData[];
  byBudget: SeriesData[];
}

export interface ReportsBundle {
  summary: ReportSummary;
  funnel: FunnelStep[];
  byProcedure: BreakdownRow[];
  byBudget: BreakdownRow[];
  byArea: BreakdownRow[];
  byTimeframe: BreakdownRow[];
  byAuthority: BreakdownRow[];
  bySource: BreakdownRow[];
  byMember: MemberPerformanceRow[];
  staleLeads: StaleLeadRow[];
  agenda: AgendaReport;
  topTags: BreakdownRow[];
  daily: DailySeries;
  rangeLabel: string;
  rangeFromIso: string | null;
}

export async function getReportsBundle(
  accountId: string,
  period: PeriodKey
): Promise<ReportsBundle> {
  const supabase = getServiceClient();
  const { fromIso, label } = periodToRange(period);

  // Leads do período
  let leadsQuery = supabase.from("leads").select("*").eq("account_id", accountId);
  if (fromIso) leadsQuery = leadsQuery.gte("created_at", fromIso);
  const { data: leadsData } = await leadsQuery;
  const leads = (leadsData ?? []) as Lead[];

  // Members da conta
  const { data: membersData } = await supabase
    .from("account_members")
    .select("id,name")
    .eq("account_id", accountId);
  const members = (membersData ?? []) as { id: string; name: string }[];

  // Activities do período (para performance por atendente)
  let activitiesQuery = supabase
    .from("lead_activities")
    .select("id,lead_id,member_id,type,created_at")
    .in("lead_id", leads.length > 0 ? leads.map((l) => l.id) : ["00000000-0000-0000-0000-000000000000"]);
  if (fromIso) activitiesQuery = activitiesQuery.gte("created_at", fromIso);
  const { data: activitiesData } = await activitiesQuery;
  const activities = (activitiesData ?? []) as Pick<
    LeadActivity,
    "id" | "lead_id" | "member_id" | "type" | "created_at"
  >[];

  // Agenda
  let agendaQuery = supabase
    .from("agenda_events")
    .select("id,type,starts_at")
    .eq("account_id", accountId);
  if (fromIso) agendaQuery = agendaQuery.gte("starts_at", fromIso);
  const { data: agendaData } = await agendaQuery;
  const agendaEvents = (agendaData ?? []) as { id: string; type: string; starts_at: string }[];

  // Stale leads (não fechados, sem update há > 7 dias) — sempre considera todos, não filtra por período
  const { data: staleData } = await supabase
    .from("leads")
    .select("id,name,whatsapp,stage,score,manual_score,updated_at")
    .eq("account_id", accountId)
    .not("stage", "in", "(closed_won,closed_lost)")
    .order("updated_at", { ascending: true })
    .limit(50);
  const stale = (staleData ?? []) as {
    id: string;
    name: string;
    whatsapp: string;
    stage: Stage;
    score: number;
    manual_score: number | null;
    updated_at: string;
  }[];

  // ------------------------------------------------------------------------
  // Sumário
  // ------------------------------------------------------------------------
  const total = leads.length;
  const hot = leads.filter((l) => (l.manual_score ?? l.score) >= 70).length;
  const warm = leads.filter((l) => {
    const s = l.manual_score ?? l.score;
    return s >= 40 && s < 70;
  }).length;
  const cold = leads.filter((l) => (l.manual_score ?? l.score) < 40).length;
  const won = leads.filter((l) => l.stage === "closed_won").length;
  const lost = leads.filter((l) => l.stage === "closed_lost").length;
  const scheduledOrAttended = leads.filter(
    (l) => l.stage === "scheduled" || l.stage === "attended"
  ).length;
  const conversionPct = total === 0 ? 0 : Math.round((won / total) * 100);

  const pipelineValue = leads
    .filter((l) => l.stage !== "closed_lost")
    .reduce((sum, l) => sum + leadValue(l), 0);
  const wonValue = leads
    .filter((l) => l.stage === "closed_won")
    .reduce((sum, l) => sum + leadValue(l), 0);

  // ------------------------------------------------------------------------
  // Funil (counts cumulativos: cada stage inclui leads que estão nele OU à frente)
  // ------------------------------------------------------------------------
  const STAGE_ORDER_FUNNEL: Stage[] = [
    "new",
    "contacted",
    "qualified",
    "scheduled",
    "attended",
    "closed_won",
  ];
  const reachedAtLeast = (stage: Stage, l: Lead): boolean => {
    const idx = STAGE_ORDER_FUNNEL.indexOf(stage);
    if (idx === -1) return false;
    if (l.stage === "closed_lost") {
      // perdidos só contam até onde chegaram (não temos esse dado, então 'new' sempre)
      return idx === 0;
    }
    const leadIdx = STAGE_ORDER_FUNNEL.indexOf(l.stage);
    return leadIdx >= idx;
  };
  const funnel: FunnelStep[] = STAGE_ORDER_FUNNEL.map((stage, i) => {
    const count = leads.filter((l) => reachedAtLeast(stage, l)).length;
    const prevCount =
      i === 0 ? null : leads.filter((l) => reachedAtLeast(STAGE_ORDER_FUNNEL[i - 1], l)).length;
    return {
      stage,
      count,
      pctOfTotal: total === 0 ? 0 : Math.round((count / total) * 100),
      conversionFromPrev:
        prevCount === null || prevCount === 0
          ? null
          : Math.round((count / prevCount) * 100),
    };
  });

  // ------------------------------------------------------------------------
  // Breakdowns
  // ------------------------------------------------------------------------
  const byProcedure = breakdownByKey(
    leads,
    (l) => l.procedure_interest,
    PROCEDURE_LABELS_LOCAL,
    total
  );
  const byBudget = breakdownByKey(
    leads,
    (l) => l.budget_range,
    BUDGET_LABELS_LOCAL,
    total,
    (l) => leadValue(l)
  );
  const byArea = breakdownByKey(leads, (l) => l.area_concern, AREA_LABELS_LOCAL, total);
  const byTimeframe = breakdownByKey(leads, (l) => l.timeframe, TIMEFRAME_LABELS_LOCAL, total);
  const byAuthority = breakdownByKey(leads, (l) => l.decision_authority, AUTHORITY_LABELS_LOCAL, total);
  const bySource = breakdownByKey(leads, (l) => l.source, undefined, total);

  // ------------------------------------------------------------------------
  // Performance por atendente
  // ------------------------------------------------------------------------
  const byMember: MemberPerformanceRow[] = members.map((m) => {
    const memberActs = activities.filter((a) => a.member_id === m.id);
    return {
      memberId: m.id,
      memberName: m.name,
      totalActivities: memberActs.length,
      stageChanges: memberActs.filter((a) => a.type === "stage_changed").length,
      whatsappSent: memberActs.filter((a) => a.type === "whatsapp_sent").length,
      notes: memberActs.filter((a) => a.type === "note").length,
      leadsAssigned: leads.filter((l) => l.assigned_to === m.id).length,
    };
  });
  // sem-membro (atividades automáticas)
  const orphanActs = activities.filter((a) => a.member_id === null);
  if (orphanActs.length > 0) {
    byMember.push({
      memberId: null,
      memberName: "— sistema / sem atribuição",
      totalActivities: orphanActs.length,
      stageChanges: orphanActs.filter((a) => a.type === "stage_changed").length,
      whatsappSent: orphanActs.filter((a) => a.type === "whatsapp_sent").length,
      notes: orphanActs.filter((a) => a.type === "note").length,
      leadsAssigned: leads.filter((l) => l.assigned_to === null).length,
    });
  }

  // ------------------------------------------------------------------------
  // Stale leads
  // ------------------------------------------------------------------------
  const today = Date.now();
  const staleLeads: StaleLeadRow[] = stale
    .map((l) => {
      const days = Math.floor((today - new Date(l.updated_at).getTime()) / (24 * 60 * 60 * 1000));
      return {
        id: l.id,
        name: l.name,
        whatsapp: l.whatsapp,
        stage: l.stage,
        score: l.manual_score ?? l.score,
        daysSinceUpdate: days,
      };
    })
    .filter((r) => r.daysSinceUpdate >= 7)
    .slice(0, 25);

  // ------------------------------------------------------------------------
  // Agenda
  // ------------------------------------------------------------------------
  const now = Date.now();
  const upcoming = agendaEvents.filter((e) => new Date(e.starts_at).getTime() >= now).length;
  const past = agendaEvents.length - upcoming;
  const agendaTypeMap: Record<string, number> = {};
  agendaEvents.forEach((e) => {
    agendaTypeMap[e.type] = (agendaTypeMap[e.type] ?? 0) + 1;
  });
  const agenda: AgendaReport = {
    total: agendaEvents.length,
    upcoming,
    past,
    byType: Object.entries(agendaTypeMap)
      .map(([k, count]) => ({
        key: k,
        label: AGENDA_TYPE_LABELS[k] ?? k,
        count,
        pct: agendaEvents.length === 0 ? 0 : Math.round((count / agendaEvents.length) * 100),
      }))
      .sort((a, b) => b.count - a.count),
  };

  // ------------------------------------------------------------------------
  // Top tags
  // ------------------------------------------------------------------------
  const tagMap: Record<string, number> = {};
  leads.forEach((l) => {
    (l.tags ?? []).forEach((t) => {
      tagMap[t] = (tagMap[t] ?? 0) + 1;
    });
  });
  const topTags: BreakdownRow[] = Object.entries(tagMap)
    .map(([k, count]) => ({
      key: k,
      label: k,
      count,
      pct: total === 0 ? 0 : Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // ------------------------------------------------------------------------
  // Daily series (line charts)
  // ------------------------------------------------------------------------
  const daily = buildDailySeries(leads, period, fromIso);

  return {
    summary: {
      total,
      hot,
      warm,
      cold,
      won,
      lost,
      scheduledOrAttended,
      conversionPct,
      pipelineValue,
      wonValue,
    },
    funnel,
    byProcedure,
    byBudget,
    byArea,
    byTimeframe,
    byAuthority,
    bySource,
    byMember,
    staleLeads,
    agenda,
    topTags,
    daily,
    rangeLabel: label,
    rangeFromIso: fromIso,
  };
}

// ---------------------------------------------------------------------------
// buildDailySeries: agrupa leads em buckets temporais
// ---------------------------------------------------------------------------

function buildDailySeries(
  leads: Lead[],
  period: PeriodKey,
  fromIso: string | null
): DailySeries {
  const granularity = periodToGranularity(period);
  const now = new Date();

  // Determina from/to.
  // Para "all": usa o created_at mais antigo dos leads (ou, se vazio, 30 dias atrás).
  let from: Date;
  if (fromIso) {
    from = new Date(fromIso);
  } else if (leads.length > 0) {
    from = leads.reduce((min, l) => {
      const d = new Date(l.created_at);
      return d < min ? d : min;
    }, new Date(leads[0].created_at));
  } else {
    from = addDays(now, -30);
  }
  const to = now;

  const { keys, labels } = buildBuckets(granularity, from, to);
  const bucketDates = keys.slice();

  // Inicializa séries
  const leadsTotal = new Array(keys.length).fill(0) as number[];
  const conversionsTotal = new Array(keys.length).fill(0) as number[];
  const procedureBuckets: Record<string, number[]> = {};
  const budgetBuckets: Record<string, number[]> = {};

  // Index lookup
  const keyIndex = new Map<string, number>();
  keys.forEach((k, i) => keyIndex.set(k, i));

  leads.forEach((l) => {
    const created = new Date(l.created_at);
    const k = bucketKeyForDate(created, granularity);
    const i = keyIndex.get(k);
    if (i === undefined) return;
    leadsTotal[i] += 1;
    if (l.stage === "closed_won") {
      conversionsTotal[i] += 1;
    }
    const proc = l.procedure_interest ?? "—";
    if (!procedureBuckets[proc]) procedureBuckets[proc] = new Array(keys.length).fill(0);
    procedureBuckets[proc][i] += 1;
    const bud = l.budget_range ?? "—";
    if (!budgetBuckets[bud]) budgetBuckets[bud] = new Array(keys.length).fill(0);
    budgetBuckets[bud][i] += 1;
  });

  // Top 5 procedimentos + "Outros"
  const procedureTotals = Object.entries(procedureBuckets)
    .map(([k, arr]) => ({ k, total: arr.reduce((a, b) => a + b, 0) }))
    .sort((a, b) => b.total - a.total);
  const topProcKeys = procedureTotals.slice(0, 5).map((p) => p.k);
  const otherProcKeys = procedureTotals.slice(5).map((p) => p.k);

  const byProcedure: SeriesData[] = topProcKeys.map((k) => ({
    key: k,
    label: PROCEDURE_LABELS_LOCAL[k] ?? k,
    data: procedureBuckets[k],
  }));
  if (otherProcKeys.length > 0) {
    const merged = new Array(keys.length).fill(0) as number[];
    otherProcKeys.forEach((k) => {
      procedureBuckets[k].forEach((v, i) => {
        merged[i] += v;
      });
    });
    byProcedure.push({ key: "_outros", label: "Outros", data: merged });
  }

  // Faixas de investimento — todas (5)
  const BUDGET_ORDER = ["acima_20k", "10k_15k", "5k_10k", "2k_5k", "avaliando"];
  const byBudget: SeriesData[] = BUDGET_ORDER.filter((k) => budgetBuckets[k]).map((k) => ({
    key: k,
    label: BUDGET_LABELS_LOCAL[k] ?? k,
    data: budgetBuckets[k],
  }));
  // adiciona qualquer faixa "—" (nulo) que apareceu mas não está em BUDGET_ORDER
  Object.keys(budgetBuckets)
    .filter((k) => !BUDGET_ORDER.includes(k))
    .forEach((k) => {
      byBudget.push({
        key: k,
        label: BUDGET_LABELS_LOCAL[k] ?? "Sem informação",
        data: budgetBuckets[k],
      });
    });

  return {
    granularity,
    bucketKeys: keys,
    bucketLabels: labels,
    bucketDates,
    leadsTotal,
    conversionsTotal,
    byProcedure,
    byBudget,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function breakdownByKey(
  leads: Lead[],
  picker: (l: Lead) => string | null | undefined,
  labelMap: Record<string, string> | undefined,
  total: number,
  valuePicker?: (l: Lead) => number
): BreakdownRow[] {
  const counts: Record<string, { count: number; value: number }> = {};
  leads.forEach((l) => {
    const k = picker(l) ?? "—";
    if (!counts[k]) counts[k] = { count: 0, value: 0 };
    counts[k].count += 1;
    if (valuePicker) counts[k].value += valuePicker(l);
  });
  return Object.entries(counts)
    .map(([k, v]) => ({
      key: k,
      label: labelMap?.[k] ?? k,
      count: v.count,
      pct: total === 0 ? 0 : Math.round((v.count / total) * 100),
      value: valuePicker ? v.value : undefined,
    }))
    .sort((a, b) => b.count - a.count);
}

// Locais para evitar import circular do validators (mantemos manual)
const PROCEDURE_LABELS_LOCAL: Record<string, string> = {
  lipo_papada: "Lipo de papada",
  palpebra: "Pálpebra",
  facelift: "Facelift / Rejuvenescimento",
  bioestimulador: "Bioestimulador / Preenchimento",
  nao_sei: "Não sabe ainda",
};
const BUDGET_LABELS_LOCAL: Record<string, string> = {
  "2k_5k": "R$ 2.000 a R$ 5.000",
  "5k_10k": "R$ 5.000 a R$ 10.000",
  "10k_15k": "R$ 10.000 a R$ 15.000",
  acima_20k: "Acima de R$ 20.000",
  avaliando: "Avaliando",
};
const AREA_LABELS_LOCAL: Record<string, string> = {
  papada_gordura: "Papada / gordura",
  flacidez_excesso_pele: "Flacidez / excesso de pele",
  olhar_cansado: "Olhar cansado",
  rugas_marcas_expressao: "Rugas / marcas",
  outro: "Outro",
};
const TIMEFRAME_LABELS_LOCAL: Record<string, string> = {
  mais_rapido_possivel: "O mais rápido possível",
  proximos_3_meses: "Próximos 3 meses",
  apenas_pesquisando: "Apenas pesquisando",
};
const AUTHORITY_LABELS_LOCAL: Record<string, string> = {
  apenas_de_mim: "Apenas eu decido",
  preciso_alinhar: "Preciso alinhar com alguém",
  ainda_nao_sei: "Ainda não sei",
};
const AGENDA_TYPE_LABELS: Record<string, string> = {
  consultation: "Consulta",
  followup: "Retorno",
  call: "Ligação",
  procedure: "Procedimento",
  other: "Outro",
};
