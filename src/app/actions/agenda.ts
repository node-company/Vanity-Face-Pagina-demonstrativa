"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireCurrentMember } from "@/lib/dal";
import { getServiceClient } from "@/lib/supabase/service";

const EventBaseSchema = z.object({
  title: z.string().trim().min(2, "Título obrigatório.").max(160),
  type: z.enum(["consultation", "followup", "call", "procedure", "other"]),
  starts_at: z.string().min(1, "Data/hora obrigatórias."),
  ends_at: z.string().min(1, "Data/hora obrigatórias."),
  lead_id: z.string().uuid().nullable().optional(),
  notes: z.string().max(2000).optional(),
});

export type AgendaState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "ok"; eventId?: string };

export async function createAgendaEvent(
  _prev: AgendaState,
  formData: FormData
): Promise<AgendaState> {
  const parsed = EventBaseSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    starts_at: formData.get("starts_at"),
    ends_at: formData.get("ends_at"),
    lead_id: formData.get("lead_id") || null,
    notes: formData.get("notes") || "",
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Confira os campos.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const starts = new Date(parsed.data.starts_at);
  const ends = new Date(parsed.data.ends_at);
  if (isNaN(starts.getTime()) || isNaN(ends.getTime())) {
    return { status: "error", message: "Data inválida." };
  }
  if (ends <= starts) {
    return { status: "error", message: "O fim deve ser depois do início." };
  }

  const member = await requireCurrentMember();
  const supabase = getServiceClient();

  // Se lead_id, garante propriedade
  if (parsed.data.lead_id) {
    const { data: lead } = await supabase
      .from("leads")
      .select("account_id")
      .eq("id", parsed.data.lead_id)
      .maybeSingle();
    if (!lead || lead.account_id !== member.account_id) {
      return { status: "error", message: "Lead inválido." };
    }
  }

  const { data, error } = await supabase
    .from("agenda_events")
    .insert({
      account_id: member.account_id,
      member_id: member.id,
      lead_id: parsed.data.lead_id ?? null,
      title: parsed.data.title,
      type: parsed.data.type,
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      notes: parsed.data.notes || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("createAgendaEvent", error);
    return { status: "error", message: "Não foi possível salvar." };
  }

  // Se vinculou lead E o lead está em "new" ou "contacted", promove para "scheduled"
  if (parsed.data.lead_id) {
    const { data: lead } = await supabase
      .from("leads")
      .select("stage")
      .eq("id", parsed.data.lead_id)
      .maybeSingle();
    if (lead && (lead.stage === "new" || lead.stage === "contacted" || lead.stage === "qualified")) {
      await supabase
        .from("leads")
        .update({ stage: "scheduled" })
        .eq("id", parsed.data.lead_id);
      await supabase.from("lead_activities").insert({
        lead_id: parsed.data.lead_id,
        member_id: member.id,
        type: "stage_changed",
        payload: { from: lead.stage, to: "scheduled", auto: true },
      });
    }
    await supabase.from("lead_activities").insert({
      lead_id: parsed.data.lead_id,
      member_id: member.id,
      type: "agenda_linked",
      payload: { event_id: data.id, starts_at: starts.toISOString() },
    });
  }

  revalidatePath("/crm/agenda");
  revalidatePath("/crm");
  if (parsed.data.lead_id) revalidatePath(`/crm/leads/${parsed.data.lead_id}`);

  return { status: "ok", eventId: data.id };
}

export async function deleteAgendaEvent(eventId: string): Promise<{ ok: boolean }> {
  const member = await requireCurrentMember();
  const supabase = getServiceClient();

  // garante propriedade
  const { data: ev } = await supabase
    .from("agenda_events")
    .select("account_id")
    .eq("id", eventId)
    .maybeSingle();
  if (!ev || ev.account_id !== member.account_id) {
    return { ok: false };
  }

  const { error } = await supabase.from("agenda_events").delete().eq("id", eventId);
  if (error) {
    console.error("deleteAgendaEvent", error);
    return { ok: false };
  }
  revalidatePath("/crm/agenda");
  return { ok: true };
}
