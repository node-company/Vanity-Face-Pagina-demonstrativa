// Tipos de domínio refletindo o schema em supabase/migrations/0001_initial_schema.sql.
// Mantidos manualmente. Se mudar o schema, atualize aqui.

export type Role = "admin" | "attendant";

export type Stage =
  | "new"
  | "contacted"
  | "qualified"
  | "scheduled"
  | "attended"
  | "closed_won"
  | "closed_lost";

export type EventType =
  | "consultation"
  | "followup"
  | "call"
  | "procedure"
  | "other";

export type ActivityType =
  | "created"
  | "stage_changed"
  | "score_changed"
  | "note"
  | "whatsapp_sent"
  | "assigned"
  | "agenda_linked";

export interface Account {
  id: string;
  name: string;
  created_at: string;
}

export interface AccountMember {
  id: string;
  account_id: string;
  email: string;
  name: string;
  password_hash: string;
  role: Role;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface Lead {
  id: string;
  account_id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  area_concern: string | null;
  area_concern_other: string | null;
  procedure_interest: string | null;
  budget_range: string | null;
  timeframe: string | null;
  decision_authority: string | null;
  stage: Stage;
  score: number;
  manual_score: number | null;
  tags: string[];
  notes: string | null;
  assigned_to: string | null;
  source: string;
  utm: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  member_id: string | null;
  type: ActivityType | string;
  payload: Record<string, unknown> | null;
  created_at: string;
}

export interface AgendaEvent {
  id: string;
  account_id: string;
  lead_id: string | null;
  member_id: string | null;
  title: string;
  type: EventType;
  starts_at: string;
  ends_at: string;
  notes: string | null;
  google_event_id: string | null;
  created_at: string;
}

export const STAGE_LABELS: Record<Stage, string> = {
  new: "Novo",
  contacted: "Contatado",
  qualified: "Qualificado",
  scheduled: "Agendado",
  attended: "Compareceu",
  closed_won: "Fechado — Ganho",
  closed_lost: "Fechado — Perdido",
};

export const STAGE_ORDER: Stage[] = [
  "new",
  "contacted",
  "qualified",
  "scheduled",
  "attended",
  "closed_won",
  "closed_lost",
];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  consultation: "Consulta",
  followup: "Retorno",
  call: "Ligação",
  procedure: "Procedimento",
  other: "Outro",
};
