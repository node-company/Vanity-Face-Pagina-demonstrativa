import { requireAdmin } from "@/lib/dal";
import { getServiceClient } from "@/lib/supabase/service";
import SettingsPanel from "@/components/crm/SettingsPanel";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const admin = await requireAdmin();
  const supabase = getServiceClient();

  const [{ data: account }, { count: leadsCount }, { count: membersCount }] =
    await Promise.all([
      supabase
        .from("accounts")
        .select("id, name")
        .eq("id", admin.accountId)
        .maybeSingle(),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("account_id", admin.accountId),
      supabase
        .from("account_members")
        .select("id", { count: "exact", head: true })
        .eq("account_id", admin.accountId)
        .neq("id", admin.memberId),
    ]);

  return (
    <div className="px-6 lg:px-10 py-10 lg:py-14 max-w-[1200px]">
      <header className="mb-10">
        <p className="eyebrow text-gold/80 mb-3">Configurações</p>
        <h1 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] text-cream">
          Conta & ajustes
        </h1>
        <p className="mt-2 text-cream/55 text-sm">
          Apenas administradores. Ajuste o nome da clínica e gerencie a zona de
          risco — ações destrutivas não têm como ser desfeitas.
        </p>
      </header>

      <SettingsPanel
        accountName={account?.name ?? ""}
        leadsCount={leadsCount ?? 0}
        otherMembersCount={membersCount ?? 0}
      />
    </div>
  );
}
