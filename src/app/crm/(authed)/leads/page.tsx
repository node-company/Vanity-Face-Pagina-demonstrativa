import Link from "next/link";
import { requireCurrentMember } from "@/lib/dal";
import { listLeads } from "@/lib/leads-queries";
import { StageBadge, ScoreBadge } from "@/components/crm/badges";
import {
  STAGE_LABELS,
  STAGE_ORDER,
  type Stage,
} from "@/lib/supabase/types";
import { PROCEDURE_LABELS, type PROCEDURE_OPTIONS } from "@/lib/validators";

export const dynamic = "force-dynamic";

type ScoreBand = "hot" | "warm" | "cold";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireCurrentMember();
  const sp = await searchParams;
  const search = typeof sp.q === "string" ? sp.q : undefined;
  const stage =
    typeof sp.stage === "string" && (STAGE_ORDER as string[]).includes(sp.stage)
      ? (sp.stage as Stage)
      : undefined;
  const scoreBand: ScoreBand | undefined =
    sp.score === "hot" || sp.score === "warm" || sp.score === "cold"
      ? (sp.score as ScoreBand)
      : undefined;
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;
  const justDeleted = sp.deleted === "1";

  const { rows, total, pageSize } = await listLeads({
    accountId: member.account_id,
    search,
    stage,
    scoreBand,
    page,
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="px-6 lg:px-10 py-10 lg:py-14 max-w-[1500px]">
      <header className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <p className="eyebrow text-gold/80 mb-3">Leads</p>
          <h1 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] text-cream">
            Todos os contatos recebidos
          </h1>
        </div>
        <div className="flex items-baseline gap-6">
          <p className="text-sm text-cream/55 tabular">
            {total} lead{total === 1 ? "" : "s"}
          </p>
          <a
            href="/crm/api/leads/export"
            className="text-[0.65rem] tracking-[0.22em] uppercase text-cream/65 hover:text-gold transition-colors"
          >
            Exportar CSV ↓
          </a>
        </div>
      </header>

      {justDeleted && (
        <div className="mb-6 px-4 py-3 border border-gold/40 bg-gold/10 text-cream text-sm">
          Lead excluído.
        </div>
      )}

      <form
        method="get"
        className="mb-8 flex flex-wrap gap-4 items-end border-b border-cream/10 pb-6"
      >
        <div className="flex-1 min-w-[240px]">
          <label className="eyebrow text-cream/55 mb-2 block">Buscar</label>
          <input
            name="q"
            defaultValue={search ?? ""}
            placeholder="Nome, WhatsApp ou e-mail"
            className="w-full bg-transparent border-0 border-b border-cream/25 focus:border-gold outline-none py-2 text-cream font-light text-base"
          />
        </div>
        <div>
          <label className="eyebrow text-cream/55 mb-2 block">Estágio</label>
          <select
            name="stage"
            defaultValue={stage ?? ""}
            className="bg-navy border border-cream/15 text-cream py-2 px-3 text-sm"
          >
            <option value="">Todos</option>
            {STAGE_ORDER.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="eyebrow text-cream/55 mb-2 block">Temperatura</label>
          <select
            name="score"
            defaultValue={scoreBand ?? ""}
            className="bg-navy border border-cream/15 text-cream py-2 px-3 text-sm"
          >
            <option value="">Todas</option>
            <option value="hot">Quentes (≥ 70)</option>
            <option value="warm">Mornos (40-69)</option>
            <option value="cold">Frios (&lt; 40)</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">
          Filtrar
        </button>
      </form>

      {rows.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-2xl text-cream/55">Nenhum lead aqui ainda.</p>
          <p className="mt-3 text-cream/40 text-sm">
            Quando alguém preencher o formulário, aparece aqui.
          </p>
        </div>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="text-[0.6rem] tracking-[0.22em] uppercase text-cream/45 border-b border-cream/10">
              <th className="py-3 pr-4 font-normal">Nome</th>
              <th className="py-3 pr-4 font-normal">WhatsApp</th>
              <th className="py-3 pr-4 font-normal">Procedimento</th>
              <th className="py-3 pr-4 font-normal">Estágio</th>
              <th className="py-3 pr-4 font-normal">Score</th>
              <th className="py-3 pr-4 font-normal">Criado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-cream/5 hover:bg-cream/[0.03] transition-colors"
              >
                <td className="py-4 pr-4">
                  <Link
                    href={`/crm/leads/${lead.id}`}
                    className="font-serif text-xl text-cream hover:text-gold transition-colors"
                  >
                    {lead.name}
                  </Link>
                </td>
                <td className="py-4 pr-4 text-cream/70 tabular text-sm">
                  {lead.whatsapp}
                </td>
                <td className="py-4 pr-4 text-cream/70 text-sm">
                  {lead.procedure_interest
                    ? PROCEDURE_LABELS[
                        lead.procedure_interest as (typeof PROCEDURE_OPTIONS)[number]
                      ]
                    : "—"}
                </td>
                <td className="py-4 pr-4">
                  <StageBadge stage={lead.stage} />
                </td>
                <td className="py-4 pr-4">
                  <ScoreBadge score={lead.manual_score ?? lead.score} showLabel={false} />
                </td>
                <td className="py-4 pr-4 text-cream/55 text-xs tabular">
                  {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-between text-sm">
          <PageLink
            page={page - 1}
            disabled={page <= 1}
            search={search}
            stage={stage}
            scoreBand={scoreBand}
          >
            ← Anterior
          </PageLink>
          <span className="text-cream/55 tabular">
            Página {page} de {totalPages}
          </span>
          <PageLink
            page={page + 1}
            disabled={page >= totalPages}
            search={search}
            stage={stage}
            scoreBand={scoreBand}
          >
            Próxima →
          </PageLink>
        </nav>
      )}
    </div>
  );
}

function PageLink({
  page,
  disabled,
  search,
  stage,
  scoreBand,
  children,
}: {
  page: number;
  disabled: boolean;
  search?: string;
  stage?: Stage;
  scoreBand?: ScoreBand;
  children: React.ReactNode;
}) {
  if (disabled) {
    return <span className="text-cream/25 cursor-not-allowed">{children}</span>;
  }
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  if (stage) params.set("stage", stage);
  if (scoreBand) params.set("score", scoreBand);
  params.set("page", String(page));
  return (
    <Link
      href={`/crm/leads?${params.toString()}`}
      className="text-cream hover:text-gold transition-colors"
    >
      {children}
    </Link>
  );
}
