import { requireCurrentMember } from "@/lib/dal";
import { getServiceClient } from "@/lib/supabase/service";
import KanbanBoard from "@/components/crm/KanbanBoard";
import type { Lead } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const member = await requireCurrentMember();
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("account_id", member.account_id)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("pipeline list", error);
  }

  const leads = (data ?? []) as Lead[];

  return (
    <div className="px-6 lg:px-10 py-10 lg:py-14">
      <header className="mb-10">
        <p className="eyebrow text-gold/80 mb-3">Pipeline</p>
        <h1 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] text-cream">
          Arraste leads entre estágios
        </h1>
        <p className="mt-2 text-cream/55 text-sm">
          O score do lead é mostrado no canto direito de cada cartão. Clique no nome
          para abrir o detalhe.
        </p>
      </header>

      <KanbanBoard initial={leads} />
    </div>
  );
}
