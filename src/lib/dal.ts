import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { readSession, type SessionPayload } from "./session";
import { getServiceClient } from "./supabase/service";
import type { AccountMember } from "./supabase/types";

/**
 * Lê a sessão do cookie e retorna o payload (memberId/role/accountId) ou null.
 * Memoizada para o ciclo de uma request (cache do React).
 */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  return await readSession();
});

/**
 * Exige uma sessão válida; redireciona para /crm/login se não houver.
 */
export const requireSession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session?.memberId) {
    redirect("/crm/login");
  }
  return session;
});

/**
 * Exige sessão admin; redireciona se atendente ou anônimo.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== "admin") {
    redirect("/crm");
  }
  return session;
}

/**
 * Retorna o member ativo correspondente à sessão.
 * Se inativo ou ausente, derruba a sessão.
 */
export const getCurrentMember = cache(async (): Promise<AccountMember | null> => {
  const session = await getSession();
  if (!session?.memberId) return null;

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("account_members")
    .select("*")
    .eq("id", session.memberId)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as AccountMember;
});

/**
 * Garante que o member é válido + ativo. Redireciona para login se não.
 * Use em Server Components / Server Actions / Route Handlers do CRM.
 */
export async function requireCurrentMember(): Promise<AccountMember> {
  const member = await getCurrentMember();
  if (!member) {
    redirect("/crm/login");
  }
  return member;
}
