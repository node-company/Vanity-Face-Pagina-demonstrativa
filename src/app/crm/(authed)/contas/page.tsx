import { requireAdmin } from "@/lib/dal";
import { getServiceClient } from "@/lib/supabase/service";
import type { AccountMember } from "@/lib/supabase/types";
import MembersAdmin from "@/components/crm/MembersAdmin";

export const dynamic = "force-dynamic";

export default async function ContasPage() {
  const admin = await requireAdmin();
  const supabase = getServiceClient();

  const { data } = await supabase
    .from("account_members")
    .select("*")
    .eq("account_id", admin.accountId)
    .order("role", { ascending: true })
    .order("created_at", { ascending: true });

  const members = (data ?? []) as AccountMember[];

  return (
    <div className="px-6 lg:px-10 py-10 lg:py-14 max-w-[1200px]">
      <header className="mb-10">
        <p className="eyebrow text-gold/80 mb-3">Contas</p>
        <h1 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] text-cream">
          Equipe & acessos
        </h1>
        <p className="mt-2 text-cream/55 text-sm">
          Como admin, você pode adicionar atendentes, redefinir senhas e ativar
          ou desativar contas. Atendentes não veem esta página.
        </p>
      </header>

      <MembersAdmin members={members} currentMemberId={admin.memberId} />
    </div>
  );
}
