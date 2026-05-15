"use server";

import { headers } from "next/headers";
import { getServiceClient } from "@/lib/supabase/service";
import {
  LeadFormSchema,
  formatBrMobile,
  type LeadFormInput,
} from "@/lib/validators";
import { computeLeadScore } from "@/lib/leads";

export type SubmitLeadState =
  | { status: "idle" }
  | { status: "error"; errors?: Record<string, string[]>; message?: string }
  | { status: "ok"; leadId: string };

export async function submitLead(
  _prevState: SubmitLeadState,
  formData: FormData
): Promise<SubmitLeadState> {
  // 1. Coletar e validar input
  const raw: Record<string, FormDataEntryValue | undefined> = {
    name: formData.get("name") ?? undefined,
    whatsapp: formData.get("whatsapp") ?? undefined,
    email: formData.get("email") ?? undefined,
    area_concern: formData.get("area_concern") ?? undefined,
    area_concern_other: formData.get("area_concern_other") ?? undefined,
    procedure_interest: formData.get("procedure_interest") ?? undefined,
    budget_range: formData.get("budget_range") ?? undefined,
    timeframe: formData.get("timeframe") ?? undefined,
    decision_authority: formData.get("decision_authority") ?? undefined,
  };

  const parsed = LeadFormSchema.safeParse(raw);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      status: "error",
      errors: flat.fieldErrors as Record<string, string[]>,
      message: "Revise os campos destacados.",
    };
  }
  const data: LeadFormInput = parsed.data;

  // 2. UTM e referrer (opcional — pega de headers se vier)
  const hdrs = await headers();
  const referer = hdrs.get("referer") || null;
  const utm: Record<string, string> = {};
  if (referer) {
    try {
      const url = new URL(referer);
      url.searchParams.forEach((v, k) => {
        if (k.startsWith("utm_")) utm[k] = v;
      });
    } catch {
      // ignora
    }
  }

  // 3. Achar a primeira conta (multi-tenant futuro)
  const supabase = getServiceClient();
  const { data: account, error: accErr } = await supabase
    .from("accounts")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (accErr || !account) {
    console.error("submitLead: conta não encontrada", accErr);
    return {
      status: "error",
      message:
        "Não foi possível registrar agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.",
    };
  }

  // 4. Score
  const score = computeLeadScore(data);

  // 5. Insert (whatsapp salvo no formato canônico (DD) 9 XXXX-XXXX)
  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .insert({
      account_id: account.id,
      name: data.name,
      whatsapp: formatBrMobile(data.whatsapp),
      email: data.email,
      area_concern: data.area_concern,
      area_concern_other:
        data.area_concern === "outro" ? data.area_concern_other ?? null : null,
      procedure_interest: data.procedure_interest,
      budget_range: data.budget_range,
      timeframe: data.timeframe,
      decision_authority: data.decision_authority,
      score,
      utm: Object.keys(utm).length ? utm : null,
    })
    .select("id")
    .single();

  if (leadErr || !lead) {
    console.error("submitLead: erro ao inserir lead", leadErr);
    return {
      status: "error",
      message:
        "Não foi possível registrar agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.",
    };
  }

  // 6. Activity log inicial
  await supabase.from("lead_activities").insert({
    lead_id: lead.id,
    type: "created",
    payload: { score, source: "website_form" },
  });

  return { status: "ok", leadId: lead.id };
}
