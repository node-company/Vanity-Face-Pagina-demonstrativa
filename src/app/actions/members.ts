"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, requireCurrentMember } from "@/lib/dal";
import { getServiceClient } from "@/lib/supabase/service";

const InviteSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto.").max(120),
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  password: z
    .string()
    .min(8, "Senha precisa de pelo menos 8 caracteres.")
    .max(128),
});

export type InviteState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "ok"; memberId: string };

export async function inviteMember(
  _prev: InviteState,
  formData: FormData
): Promise<InviteState> {
  const admin = await requireAdmin();

  const parsed = InviteSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Confira os campos.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = getServiceClient();

  // E-mail já existe?
  const { data: existing } = await supabase
    .from("account_members")
    .select("id")
    .eq("email", parsed.data.email)
    .maybeSingle();
  if (existing) {
    return { status: "error", message: "Esse e-mail já está em uso." };
  }

  const hash = await bcrypt.hash(parsed.data.password, 12);

  const { data, error } = await supabase
    .from("account_members")
    .insert({
      account_id: admin.accountId,
      name: parsed.data.name,
      email: parsed.data.email,
      password_hash: hash,
      role: "attendant",
      is_active: true,
      must_change_password: true,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("inviteMember", error);
    return { status: "error", message: "Não foi possível criar." };
  }

  revalidatePath("/crm/contas");
  return { status: "ok", memberId: data.id };
}

export async function setMemberActive(
  memberId: string,
  active: boolean
): Promise<{ ok: boolean; message?: string }> {
  const admin = await requireAdmin();
  const supabase = getServiceClient();

  // Não permite desativar a si mesmo
  if (memberId === admin.memberId) {
    return { ok: false, message: "Você não pode desativar a própria conta." };
  }

  const { data: target } = await supabase
    .from("account_members")
    .select("account_id")
    .eq("id", memberId)
    .maybeSingle();
  if (!target || target.account_id !== admin.accountId) {
    return { ok: false, message: "Membro não encontrado." };
  }

  const { error } = await supabase
    .from("account_members")
    .update({ is_active: active })
    .eq("id", memberId);
  if (error) {
    return { ok: false, message: "Falhou ao atualizar." };
  }
  revalidatePath("/crm/contas");
  return { ok: true };
}

const ResetSchema = z.object({
  memberId: z.string().uuid(),
  password: z.string().min(8, "Senha precisa de pelo menos 8 caracteres.").max(128),
});

export async function resetMemberPassword(input: {
  memberId: string;
  password: string;
}): Promise<{ ok: boolean; message?: string }> {
  const admin = await requireAdmin();
  const parsed = ResetSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message };
  }
  const supabase = getServiceClient();
  const { data: target } = await supabase
    .from("account_members")
    .select("account_id")
    .eq("id", parsed.data.memberId)
    .maybeSingle();
  if (!target || target.account_id !== admin.accountId) {
    return { ok: false, message: "Membro não encontrado." };
  }
  const hash = await bcrypt.hash(parsed.data.password, 12);
  const { error } = await supabase
    .from("account_members")
    .update({ password_hash: hash, must_change_password: true })
    .eq("id", parsed.data.memberId);
  if (error) {
    return { ok: false, message: "Falhou ao redefinir." };
  }
  revalidatePath("/crm/contas");
  return { ok: true };
}

// Admin edita nome/e-mail de um membro do próprio account
const UpdateMemberSchema = z.object({
  memberId: z.string().uuid(),
  name: z.string().trim().min(2, "Nome muito curto.").max(120),
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
});

export async function updateMember(input: {
  memberId: string;
  name: string;
  email: string;
}): Promise<{ ok: boolean; message?: string; fieldErrors?: Record<string, string[]> }> {
  const admin = await requireAdmin();
  const parsed = UpdateMemberSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Confira os campos.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const supabase = getServiceClient();
  const { data: target } = await supabase
    .from("account_members")
    .select("account_id, email")
    .eq("id", parsed.data.memberId)
    .maybeSingle();
  if (!target || target.account_id !== admin.accountId) {
    return { ok: false, message: "Membro não encontrado." };
  }
  if (parsed.data.email.toLowerCase() !== String(target.email).toLowerCase()) {
    const { data: collide } = await supabase
      .from("account_members")
      .select("id")
      .eq("email", parsed.data.email)
      .neq("id", parsed.data.memberId)
      .maybeSingle();
    if (collide) {
      return { ok: false, message: "Esse e-mail já está em uso." };
    }
  }
  const { error } = await supabase
    .from("account_members")
    .update({ name: parsed.data.name, email: parsed.data.email })
    .eq("id", parsed.data.memberId);
  if (error) {
    console.error("updateMember", error);
    return { ok: false, message: "Falhou ao atualizar." };
  }
  revalidatePath("/crm/contas");
  return { ok: true };
}

// Admin exclui um membro do próprio account (hard delete)
const DeleteMemberSchema = z.object({
  memberId: z.string().uuid(),
  confirm: z.literal("EXCLUIR"),
});

export async function deleteMember(input: {
  memberId: string;
  confirm: string;
}): Promise<{ ok: boolean; message?: string }> {
  const admin = await requireAdmin();
  const parsed = DeleteMemberSchema.safeParse(input);
  if (!parsed.success) {
    const failedConfirm = parsed.error.issues.some((i) => i.path[0] === "confirm");
    return {
      ok: false,
      message: failedConfirm
        ? 'Digite "EXCLUIR" pra confirmar.'
        : (parsed.error.issues[0]?.message ?? "Entrada inválida."),
    };
  }
  if (parsed.data.memberId === admin.memberId) {
    return { ok: false, message: "Você não pode excluir a própria conta." };
  }
  const supabase = getServiceClient();
  const { data: target } = await supabase
    .from("account_members")
    .select("account_id")
    .eq("id", parsed.data.memberId)
    .maybeSingle();
  if (!target || target.account_id !== admin.accountId) {
    return { ok: false, message: "Membro não encontrado." };
  }
  const { error } = await supabase
    .from("account_members")
    .delete()
    .eq("id", parsed.data.memberId);
  if (error) {
    console.error("deleteMember", error);
    return { ok: false, message: "Falhou ao excluir." };
  }
  revalidatePath("/crm/contas");
  return { ok: true };
}

// Admin atualiza o nome da clínica (account row)
const UpdateAccountNameSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto.").max(160),
});

export async function updateAccountName(input: {
  name: string;
}): Promise<{ ok: boolean; message?: string }> {
  const admin = await requireAdmin();
  const parsed = UpdateAccountNameSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message };
  }
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("accounts")
    .update({ name: parsed.data.name })
    .eq("id", admin.accountId);
  if (error) {
    console.error("updateAccountName", error);
    return { ok: false, message: "Falhou ao atualizar." };
  }
  revalidatePath("/crm/configuracoes");
  return { ok: true };
}

// Zona de risco: exclui todos os leads do account
const ConfirmOnlySchema = z.object({ confirm: z.literal("EXCLUIR") });

export async function deleteAllLeads(input: {
  confirm: string;
}): Promise<{ ok: boolean; message?: string; deleted?: number }> {
  const admin = await requireAdmin();
  const parsed = ConfirmOnlySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'Digite "EXCLUIR" pra confirmar.' };
  }
  const supabase = getServiceClient();
  const { error, count } = await supabase
    .from("leads")
    .delete({ count: "exact" })
    .eq("account_id", admin.accountId);
  if (error) {
    console.error("deleteAllLeads", error);
    return { ok: false, message: "Falhou ao excluir." };
  }
  revalidatePath("/crm");
  revalidatePath("/crm/leads");
  revalidatePath("/crm/pipeline");
  revalidatePath("/crm/relatorios");
  return { ok: true, deleted: count ?? 0 };
}

// Zona de risco: exclui todas as contas (membros) do account, exceto o admin atual
export async function deleteAllMembers(input: {
  confirm: string;
}): Promise<{ ok: boolean; message?: string; deleted?: number }> {
  const admin = await requireAdmin();
  const parsed = ConfirmOnlySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'Digite "EXCLUIR" pra confirmar.' };
  }
  const supabase = getServiceClient();
  const { error, count } = await supabase
    .from("account_members")
    .delete({ count: "exact" })
    .eq("account_id", admin.accountId)
    .neq("id", admin.memberId);
  if (error) {
    console.error("deleteAllMembers", error);
    return { ok: false, message: "Falhou ao excluir." };
  }
  revalidatePath("/crm/contas");
  return { ok: true, deleted: count ?? 0 };
}

// Atendente troca a própria senha
const ChangeOwnSchema = z.object({
  currentPassword: z.string().min(1, "Informe a senha atual."),
  newPassword: z.string().min(8, "Nova senha precisa de pelo menos 8 caracteres.").max(128),
});

export type ChangeOwnState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok" };

export async function changeOwnPassword(
  _prev: ChangeOwnState,
  formData: FormData
): Promise<ChangeOwnState> {
  const member = await requireCurrentMember();
  const parsed = ChangeOwnSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Erro." };
  }
  const ok = await bcrypt.compare(parsed.data.currentPassword, member.password_hash);
  if (!ok) {
    return { status: "error", message: "Senha atual incorreta." };
  }
  const supabase = getServiceClient();
  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await supabase
    .from("account_members")
    .update({ password_hash: newHash, must_change_password: false })
    .eq("id", member.id);
  return { status: "ok" };
}
