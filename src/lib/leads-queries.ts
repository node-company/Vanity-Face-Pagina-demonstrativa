import "server-only";
import { getServiceClient } from "./supabase/service";
import type { Lead, LeadActivity, Stage } from "./supabase/types";

export interface LeadsListParams {
  accountId: string;
  search?: string;
  stage?: Stage;
  scoreBand?: "hot" | "warm" | "cold";
  page?: number;
  pageSize?: number;
}

export interface LeadsListResult {
  rows: Lead[];
  total: number;
  page: number;
  pageSize: number;
}

const PAGE_SIZE = 20;

export async function listLeads(p: LeadsListParams): Promise<LeadsListResult> {
  const supabase = getServiceClient();
  const page = Math.max(1, p.page ?? 1);
  const pageSize = p.pageSize ?? PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .eq("account_id", p.accountId)
    .order("created_at", { ascending: false });

  if (p.stage) q = q.eq("stage", p.stage);
  if (p.search) {
    const term = `%${p.search.replace(/[%_]/g, "")}%`;
    q = q.or(`name.ilike.${term},whatsapp.ilike.${term},email.ilike.${term}`);
  }
  if (p.scoreBand === "hot") q = q.gte("score", 70);
  else if (p.scoreBand === "warm") q = q.gte("score", 40).lt("score", 70);
  else if (p.scoreBand === "cold") q = q.lt("score", 40);

  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error) throw error;

  return {
    rows: (data ?? []) as Lead[],
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getLeadById(accountId: string, id: string): Promise<Lead | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("account_id", accountId)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("getLeadById", error);
    return null;
  }
  return (data as Lead) ?? null;
}

export async function getLeadActivities(leadId: string): Promise<LeadActivity[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("lead_activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(80);
  if (error) {
    console.error("getLeadActivities", error);
    return [];
  }
  return (data ?? []) as LeadActivity[];
}

export interface DashboardMetrics {
  total: number;
  thisWeek: number;
  hotOpen: number;
  conversionPct: number;
  byStage: Record<Stage, number>;
}

export async function getDashboardMetrics(
  accountId: string,
  fromIso?: string | null
): Promise<DashboardMetrics> {
  const supabase = getServiceClient();
  let q = supabase
    .from("leads")
    .select("stage, score, created_at")
    .eq("account_id", accountId);
  if (fromIso) q = q.gte("created_at", fromIso);
  const { data, error } = await q;
  if (error) throw error;

  const rows = (data ?? []) as Pick<Lead, "stage" | "score" | "created_at">[];
  const total = rows.length;
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = rows.filter((r) => new Date(r.created_at).getTime() >= sevenDaysAgo).length;
  const hotOpen = rows.filter(
    (r) => r.score >= 70 && r.stage !== "closed_won" && r.stage !== "closed_lost"
  ).length;
  const won = rows.filter((r) => r.stage === "closed_won").length;
  const conversionPct = total === 0 ? 0 : Math.round((won / total) * 100);

  const byStage: Record<Stage, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    scheduled: 0,
    attended: 0,
    closed_won: 0,
    closed_lost: 0,
  };
  rows.forEach((r) => {
    byStage[r.stage] = (byStage[r.stage] ?? 0) + 1;
  });

  return { total, thisWeek, hotOpen, conversionPct, byStage };
}
