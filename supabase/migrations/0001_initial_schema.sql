-- Vanity Face CRM — schema inicial
-- Rode este script no SQL Editor do Supabase Dashboard.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ----------------------------------------------------------------------------
-- accounts: a clínica (multi-tenant ready, mas começamos com 1)
-- ----------------------------------------------------------------------------
create table if not exists public.accounts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- account_members: usuários do CRM (admin/atendente) de uma conta
-- ----------------------------------------------------------------------------
create table if not exists public.account_members (
  id              uuid primary key default gen_random_uuid(),
  account_id      uuid not null references public.accounts(id) on delete cascade,
  email           citext not null unique,
  name            text not null,
  password_hash   text not null,
  role            text not null check (role in ('admin','attendant')),
  is_active       boolean not null default true,
  must_change_password boolean not null default false,
  created_at      timestamptz not null default now(),
  last_login_at   timestamptz
);

create index if not exists idx_members_account on public.account_members(account_id);

-- ----------------------------------------------------------------------------
-- leads: cada submissão do formulário público vira uma linha
-- ----------------------------------------------------------------------------
create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  account_id          uuid not null references public.accounts(id) on delete cascade,
  name                text not null,
  whatsapp            text not null,
  area_concern        text,
  area_concern_other  text,
  procedure_interest  text,
  budget_range        text,
  timeframe           text,
  decision_authority  text,
  stage               text not null default 'new'
                      check (stage in ('new','contacted','qualified','scheduled','attended','closed_won','closed_lost')),
  score               smallint not null default 0,
  manual_score        smallint,
  tags                text[] not null default '{}',
  notes               text,
  assigned_to         uuid references public.account_members(id) on delete set null,
  source              text not null default 'website_form',
  utm                 jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_leads_account_stage on public.leads(account_id, stage);
create index if not exists idx_leads_account_score on public.leads(account_id, score desc);
create index if not exists idx_leads_created on public.leads(account_id, created_at desc);

-- trigger para manter updated_at
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
  before update on public.leads
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- lead_activities: timeline (criação, mudança de estágio, notas, whatsapp enviado…)
-- ----------------------------------------------------------------------------
create table if not exists public.lead_activities (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  member_id   uuid references public.account_members(id) on delete set null,
  type        text not null,
  payload     jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_activities_lead on public.lead_activities(lead_id, created_at desc);

-- ----------------------------------------------------------------------------
-- agenda_events: compromissos da equipe (consultas, retornos, ligações)
-- ----------------------------------------------------------------------------
create table if not exists public.agenda_events (
  id              uuid primary key default gen_random_uuid(),
  account_id      uuid not null references public.accounts(id) on delete cascade,
  lead_id         uuid references public.leads(id) on delete set null,
  member_id       uuid references public.account_members(id) on delete set null,
  title           text not null,
  type            text not null default 'consultation'
                  check (type in ('consultation','followup','call','procedure','other')),
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  notes           text,
  google_event_id text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_agenda_account_starts on public.agenda_events(account_id, starts_at);
create index if not exists idx_agenda_lead on public.agenda_events(lead_id);

-- ----------------------------------------------------------------------------
-- RLS: habilita em todas as tabelas. O service role bypassa estas policies;
-- só clientes anon/authed seriam barrados. Isto é cinto-de-segurança caso
-- alguém exponha a anon key ou crie cliente Supabase no browser.
-- ----------------------------------------------------------------------------
alter table public.accounts          enable row level security;
alter table public.account_members   enable row level security;
alter table public.leads             enable row level security;
alter table public.lead_activities   enable row level security;
alter table public.agenda_events     enable row level security;

-- Sem policies = nega tudo. Service role sempre passa.
