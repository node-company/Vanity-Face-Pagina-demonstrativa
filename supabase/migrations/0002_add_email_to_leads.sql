-- Adiciona coluna email no lead.
-- Rode no SQL Editor do Supabase Dashboard.

alter table public.leads
  add column if not exists email citext;

-- Índice opcional pra busca rápida por email no CRM.
create index if not exists idx_leads_account_email
  on public.leads(account_id, email);
