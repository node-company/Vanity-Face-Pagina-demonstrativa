// Itens de navegação compartilhados entre Sidebar (desktop) e MobileNav.
// Mude aqui pra refletir nos dois.

export interface CrmNavItem {
  label: string;
  href: string;
  index: string;
  adminOnly?: boolean;
}

export const CRM_NAV: CrmNavItem[] = [
  { label: "Painel", href: "/crm", index: "00" },
  { label: "Pipeline", href: "/crm/pipeline", index: "01" },
  { label: "Leads", href: "/crm/leads", index: "02" },
  { label: "Agenda", href: "/crm/agenda", index: "03" },
  { label: "Relatórios", href: "/crm/relatorios", index: "04" },
  { label: "Contas", href: "/crm/contas", index: "05", adminOnly: true },
  { label: "Configurações", href: "/crm/configuracoes", index: "06", adminOnly: true },
];
