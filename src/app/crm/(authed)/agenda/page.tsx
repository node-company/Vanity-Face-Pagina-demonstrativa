import { requireCurrentMember } from "@/lib/dal";
import { getServiceClient } from "@/lib/supabase/service";
import AgendaCalendar from "@/components/crm/AgendaCalendar";
import type { AgendaEvent } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const member = await requireCurrentMember();
  const supabase = getServiceClient();

  // Eventos do mês atual ± 1 (60 dias de janela)
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const to = new Date(now.getFullYear(), now.getMonth() + 2, 1).toISOString();

  const [eventsRes, leadsRes] = await Promise.all([
    supabase
      .from("agenda_events")
      .select("*")
      .eq("account_id", member.account_id)
      .gte("starts_at", from)
      .lt("starts_at", to)
      .order("starts_at", { ascending: true }),
    supabase
      .from("leads")
      .select("id,name,whatsapp")
      .eq("account_id", member.account_id)
      .neq("stage", "closed_lost")
      .order("created_at", { ascending: false })
      .limit(300),
  ]);

  const events = (eventsRes.data ?? []) as AgendaEvent[];
  const leads = leadsRes.data ?? [];

  return (
    <div className="px-6 lg:px-10 py-10 lg:py-14">
      <header className="mb-8">
        <p className="eyebrow text-gold/80 mb-3">Agenda</p>
        <h1 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] text-cream">
          Compromissos e consultas
        </h1>
        <p className="mt-2 text-cream/55 text-sm">
          Clique num dia para criar um compromisso. Vincular a um lead muda o
          estágio dele para Agendado automaticamente.
        </p>
      </header>

      <AgendaCalendar events={events} leads={leads} />
    </div>
  );
}
