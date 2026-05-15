"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { LoginSchema } from "@/lib/validators";
import { getServiceClient } from "@/lib/supabase/service";
import { createSession, deleteSession } from "@/lib/session";
import type { AccountMember } from "@/lib/supabase/types";

export type LoginState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
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

  const { email, password } = parsed.data;
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("account_members")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("login: erro consultando member", error);
    return { status: "error", message: "Erro ao validar credenciais. Tente novamente." };
  }

  const member = data as AccountMember | null;
  if (!member || !member.is_active) {
    return { status: "error", message: "E-mail ou senha inválidos." };
  }

  const ok = await bcrypt.compare(password, member.password_hash);
  if (!ok) {
    return { status: "error", message: "E-mail ou senha inválidos." };
  }

  // Atualiza last_login_at em background — sem aguardar.
  supabase
    .from("account_members")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", member.id)
    .then(({ error: updErr }) => {
      if (updErr) console.warn("login: falhou atualizar last_login_at", updErr);
    });

  await createSession({
    memberId: member.id,
    role: member.role,
    accountId: member.account_id,
  });

  redirect("/crm");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/crm/login");
}
