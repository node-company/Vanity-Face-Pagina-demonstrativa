import { NextResponse } from "next/server";
import { requireCurrentMember } from "@/lib/dal";
import { getServiceClient } from "@/lib/supabase/service";
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
import { STAGE_LABELS, type Lead } from "@/lib/supabase/types";

export async function GET() {
  const member = await requireCurrentMember();
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("account_id", member.account_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }

  const leads = (data ?? []) as Lead[];

  const header = [
    "id",
    "criado_em",
    "nome",
    "whatsapp",
    "email",
    "estagio",
    "score_auto",
    "score_manual",
    "procedimento",
    "area_incomodo",
    "faixa_investimento",
    "prazo",
    "autonomia_decisao",
    "tags",
    "notas",
  ];

  const rows = leads.map((l) =>
    [
      l.id,
      l.created_at,
      l.name,
      l.whatsapp,
      l.email ?? "",
      STAGE_LABELS[l.stage],
      l.score,
      l.manual_score ?? "",
      l.procedure_interest
        ? PROCEDURE_LABELS[l.procedure_interest as (typeof PROCEDURE_OPTIONS)[number]]
        : "",
      l.area_concern === "outro"
        ? l.area_concern_other ?? "Outro"
        : l.area_concern
          ? AREA_CONCERN_LABELS[l.area_concern as (typeof AREA_CONCERN_OPTIONS)[number]]
          : "",
      l.budget_range ? BUDGET_LABELS[l.budget_range as (typeof BUDGET_OPTIONS)[number]] : "",
      l.timeframe ? TIMEFRAME_LABELS[l.timeframe as (typeof TIMEFRAME_OPTIONS)[number]] : "",
      l.decision_authority
        ? AUTHORITY_LABELS[l.decision_authority as (typeof AUTHORITY_OPTIONS)[number]]
        : "",
      (l.tags ?? []).join("; "),
      (l.notes ?? "").replace(/\r?\n/g, " "),
    ].map(csvCell)
  );

  const csv = [header.map(csvCell).join(","), ...rows.map((r) => r.join(","))].join("\n");

  const filename = `vanity-face-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse("﻿" + csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
