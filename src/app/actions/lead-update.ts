"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, requireCurrentMember } from "@/lib/dal";
import { getServiceClient } from "@/lib/supabase/service";
import { STAGE_ORDER, type Stage } from "@/lib/supabase/types";

const STAGES = STAGE_ORDER as readonly string[];

async function logActivity(
  leadId: string,
  memberId: string,
  type: string,
  payload?: Record<string, unknown>
) {
  const supabase = getServiceClient();
  await supabase.from("lead_activities").insert({
    lead_id: leadId,
    member_id: memberId,
    type,
    payload: payload ?? null,
  });
}

// --- updateLeadStage --------------------------------------------------------

const UpdateStageSchema = z.object({
  leadId: z.string().uuid(),
  stage: z.string().refine((s) => STAGES.includes(s), "Estágio inválido."),
});

export async function updateLeadStage(input: {
  leadId: string;
  stage: Stage;
}): Promise<{ ok: boolean; message?: string }> {
  const parsed = UpdateStageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message };
  }
  const member = await requireCurrentMember();
  const supabase = getServiceClient();

  const { data: existing, error: getErr } = await supabase
    .from("leads")
    .select("stage, account_id")
    .eq("id", parsed.data.leadId)
    .maybeSingle();

  if (getErr || !existing || existing.account_id !== member.account_id) {
    return { ok: false, message: "Lead não encontrado." };
  }

  if (existing.stage === parsed.data.stage) {
    return { ok: true };
  }

  const { error } = await supabase
    .from("leads")
    .update({ stage: parsed.data.stage })
    .eq("id", parsed.data.leadId);

  if (error) {
    console.error("updateLeadStage", error);
    return { ok: false, message: "Falhou ao atualizar." };
  }

  await logActivity(parsed.data.leadId, member.id, "stage_changed", {
    from: existing.stage,
    to: parsed.data.stage,
  });

  revalidatePath(`/crm/leads/${parsed.data.leadId}`);
  revalidatePath("/crm/leads");
  revalidatePath("/crm/pipeline");
  revalidatePath("/crm");
  return { ok: true };
}

// --- updateLeadDetails (score manual, notes, tags) --------------------------

const UpdateDetailsSchema = z.object({
  leadId: z.string().uuid(),
  manual_score: z.number().int().min(0).max(100).nullable().optional(),
  notes: z.string().max(8000).optional(),
  tags: z.array(z.string().min(1).max(40)).max(20).optional(),
});

export async function updateLeadDetails(input: {
  leadId: string;
  manual_score?: number | null;
  notes?: string;
  tags?: string[];
}): Promise<{ ok: boolean; message?: string }> {
  const parsed = UpdateDetailsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message };
  }
  const member = await requireCurrentMember();
  const supabase = getServiceClient();

  // Garante propriedade
  const { data: existing, error: getErr } = await supabase
    .from("leads")
    .select("manual_score, notes, tags, account_id")
    .eq("id", parsed.data.leadId)
    .maybeSingle();
  if (getErr || !existing || existing.account_id !== member.account_id) {
    return { ok: false, message: "Lead não encontrado." };
  }

  const update: Record<string, unknown> = {};
  if (parsed.data.manual_score !== undefined) update.manual_score = parsed.data.manual_score;
  if (parsed.data.notes !== undefined) update.notes = parsed.data.notes;
  if (parsed.data.tags !== undefined) update.tags = parsed.data.tags;

  if (Object.keys(update).length === 0) return { ok: true };

  const { error } = await supabase
    .from("leads")
    .update(update)
    .eq("id", parsed.data.leadId);

  if (error) {
    console.error("updateLeadDetails", error);
    return { ok: false, message: "Falhou ao salvar." };
  }

  if (parsed.data.manual_score !== undefined && parsed.data.manual_score !== existing.manual_score) {
    await logActivity(parsed.data.leadId, member.id, "score_changed", {
      manual_score: parsed.data.manual_score,
    });
  }
  if (parsed.data.notes !== undefined && parsed.data.notes !== existing.notes) {
    await logActivity(parsed.data.leadId, member.id, "note", {
      preview: parsed.data.notes.slice(0, 120),
    });
  }

  revalidatePath(`/crm/leads/${parsed.data.leadId}`);
  return { ok: true };
}

// --- deleteLead (admin only) -----------------------------------------------

const DeleteSchema = z.object({
  leadId: z.string().uuid(),
  /** Confirmação explícita: o admin precisa digitar "EXCLUIR" pra confirmar. */
  confirm: z.literal("EXCLUIR"),
});

export async function deleteLead(input: {
  leadId: string;
  confirm: string;
}): Promise<{ ok: boolean; message?: string }> {
  const parsed = DeleteSchema.safeParse(input);
  if (!parsed.success) {
    const failedConfirm = parsed.error.issues.some((i) => i.path[0] === "confirm");
    return {
      ok: false,
      message: failedConfirm
        ? 'Digite "EXCLUIR" pra confirmar.'
        : (parsed.error.issues[0]?.message ?? "Entrada inválida."),
    };
  }

  const admin = await requireAdmin();
  const supabase = getServiceClient();

  // Garante propriedade
  const { data: existing, error: getErr } = await supabase
    .from("leads")
    .select("account_id, name")
    .eq("id", parsed.data.leadId)
    .maybeSingle();
  if (getErr || !existing || existing.account_id !== admin.accountId) {
    return { ok: false, message: "Lead não encontrado." };
  }

  // Cascade configurado no schema: lead_activities cai junto, agenda_events vira lead_id NULL.
  const { error } = await supabase.from("leads").delete().eq("id", parsed.data.leadId);
  if (error) {
    console.error("deleteLead", error);
    return { ok: false, message: "Falhou ao excluir." };
  }

  revalidatePath("/crm/leads");
  revalidatePath("/crm/pipeline");
  revalidatePath("/crm");
  // Não dá pra revalidar a página detalhe que está sendo deletada — o redirect resolve.

  redirect("/crm/leads?deleted=1");
}

// --- logWhatsappSent --------------------------------------------------------

export async function logWhatsappSent(leadId: string): Promise<{ ok: boolean }> {
  const member = await requireCurrentMember();
  const supabase = getServiceClient();
  // Garante propriedade
  const { data: existing } = await supabase
    .from("leads")
    .select("account_id, stage")
    .eq("id", leadId)
    .maybeSingle();
  if (!existing || existing.account_id !== member.account_id) {
    return { ok: false };
  }
  await logActivity(leadId, member.id, "whatsapp_sent");
  // Se o lead ainda está como "new", promove para "contacted"
  if (existing.stage === "new") {
    await supabase.from("leads").update({ stage: "contacted" }).eq("id", leadId);
    await logActivity(leadId, member.id, "stage_changed", {
      from: "new",
      to: "contacted",
      auto: true,
    });
  }
  revalidatePath(`/crm/leads/${leadId}`);
  return { ok: true };
}
