-- Creator Loop AI - Phase 1 schema (validation technique)
-- Only the tables needed for: saisie du compte, audit, score, diagnostic.
-- No paywall/plan/mission tables yet (Phase 2).

begin;

create type public.social_platform as enum ('instagram', 'tiktok');

create type public.publishing_goal as enum ('audience', 'communaute', 'vente', 'notoriete');

create type public.publishing_rhythm as enum ('quotidien', '2_3_semaine', '1_semaine', 'irregulier');

create type public.improvement_potential as enum ('faible', 'moyen', 'eleve');

-- CHECK constraints cannot contain a raw subquery; wrapping the per-element
-- validation in an immutable function is the standard workaround.
create or replace function public.valid_sujets_recents(p_sujets text[])
returns boolean
language sql
immutable
as $$
  select not exists (
    select 1 from unnest(p_sujets) as sujet
    where char_length(btrim(sujet)) = 0 or char_length(sujet) > 280
  );
$$;

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),

  constraint users_email_shape check (
    email is null
    or (
      email = btrim(email)
      and char_length(email) between 3 and 320
      and position('@' in email) > 1
    )
  )
);

create unique index users_email_lower_unique
  on public.users (lower(email))
  where email is not null;

create table public.creator_profiles (
  user_id uuid primary key references public.users (id) on delete cascade,
  niche text,
  objectif public.publishing_goal,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint creator_profiles_niche_length check (
    niche is null or (niche = btrim(niche) and char_length(niche) between 1 and 120)
  )
);

create table public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references public.users (id) on delete cascade,
  handle text not null,
  platform public.social_platform not null,
  niche text not null,
  objectif public.publishing_goal not null,
  rythme public.publishing_rhythm not null,
  sujets_recents text[] not null,
  created_at timestamptz not null default now(),

  constraint social_accounts_handle_shape check (
    handle = btrim(handle)
    and char_length(handle) between 2 and 60
  ),
  constraint social_accounts_niche_length check (
    niche = btrim(niche) and char_length(niche) between 1 and 120
  ),
  constraint social_accounts_sujets_count check (
    cardinality(sujets_recents) between 3 and 10
  ),
  constraint social_accounts_sujets_length check (
    public.valid_sujets_recents(sujets_recents)
  )
);

create index social_accounts_user_created_idx
  on public.social_accounts (user_id, created_at desc);

-- Re-submitting the same handle/platform reuses the existing account (and its
-- audit) instead of creating a duplicate row.
create unique index social_accounts_user_platform_handle_unique
  on public.social_accounts (user_id, platform, lower(handle));

create table public.audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references public.users (id) on delete cascade,
  social_account_id uuid not null references public.social_accounts (id) on delete cascade,
  score_progression smallint not null,
  score_regularite smallint not null,
  score_coherence smallint not null,
  score_clarte smallint not null,
  score_diversite smallint not null,
  potentiel_amelioration public.improvement_potential not null,
  explication_regularite text not null,
  explication_coherence text not null,
  explication_clarte text not null,
  explication_diversite text not null,
  frein_principal text not null,
  meilleur_levier text not null,
  created_at timestamptz not null default now(),

  constraint audits_scores_range check (
    score_progression between 0 and 100
    and score_regularite between 0 and 100
    and score_coherence between 0 and 100
    and score_clarte between 0 and 100
    and score_diversite between 0 and 100
  ),
  constraint audits_explications_length check (
    char_length(explication_regularite) between 1 and 500
    and char_length(explication_coherence) between 1 and 500
    and char_length(explication_clarte) between 1 and 500
    and char_length(explication_diversite) between 1 and 500
    and char_length(frein_principal) between 1 and 500
    and char_length(meilleur_levier) between 1 and 500
  )
);

-- One diagnostic kept per social account: revisiting the report reloads the
-- persisted audit instead of regenerating it (see supabase/functions/generate-audit).
create unique index audits_social_account_unique
  on public.audits (social_account_id);

create index audits_user_created_idx
  on public.audits (user_id, created_at desc);

-- Internal usage ledger for cost control and AI quota enforcement. Outside the
-- exposed `public` schema; only the SECURITY DEFINER functions below and the
-- Edge Function's service-role client can touch it.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  action_type text not null,
  input_tokens integer not null,
  output_tokens integer not null,
  estimated_cost numeric(10, 6) not null,
  created_at timestamptz not null default now(),

  constraint ai_usage_action_type check (action_type in ('generate_audit')),
  constraint ai_usage_tokens_nonnegative check (input_tokens >= 0 and output_tokens >= 0),
  constraint ai_usage_cost_nonnegative check (estimated_cost >= 0)
);

revoke all on table private.ai_usage from public, anon, authenticated;

create index ai_usage_user_window_idx
  on private.ai_usage (user_id, action_type, created_at desc);

create table private.ai_quota_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now(),

  constraint ai_quota_events_action check (action in ('generate_audit'))
);

revoke all on table private.ai_quota_events from public, anon, authenticated;

create index ai_quota_events_user_window_idx
  on private.ai_quota_events (user_id, action, created_at desc);

-- Keep public profiles synchronized with Supabase Auth.
create or replace function public.sync_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email, created_at)
  values (new.id, new.email, coalesce(new.created_at, now()))
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

revoke all on function public.sync_auth_user_profile()
  from public, anon, authenticated;

create trigger on_auth_user_profile_changed
  after insert or update of email on auth.users
  for each row execute function public.sync_auth_user_profile();

insert into public.users (id, email, created_at)
select id, email, created_at
from auth.users
on conflict (id) do update
  set email = excluded.email;

-- Cost ledger writer. The `private` schema is never exposed via PostgREST,
-- so this SECURITY DEFINER function is the only way to record AI spend
-- (called by the Edge Function with the service-role client).
create or replace function public.log_ai_usage(
  p_user_id uuid,
  p_action_type text,
  p_input_tokens integer,
  p_output_tokens integer,
  p_estimated_cost numeric
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into private.ai_usage (user_id, action_type, input_tokens, output_tokens, estimated_cost)
  values (p_user_id, p_action_type, p_input_tokens, p_output_tokens, p_estimated_cost);
end;
$$;

revoke all on function public.log_ai_usage(uuid, text, integer, integer, numeric)
  from public, anon, authenticated;

-- Daily quota: at most 3 audit generations per user per day (Phase 1 cost cap).
create or replace function public.consume_ai_quota(p_action text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  requesting_user_id uuid := auth.uid();
  daily_limit integer;
  recent_request_count integer;
begin
  if requesting_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'authentication required';
  end if;

  daily_limit := case p_action
    when 'generate_audit' then 3
    else null
  end;

  if daily_limit is null then
    raise exception using
      errcode = '22023',
      message = 'unknown AI quota action';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(requesting_user_id::text || ':' || p_action, 0)
  );

  delete from private.ai_quota_events
  where created_at < now() - interval '48 hours';

  select count(*)
    into recent_request_count
  from private.ai_quota_events as usage
  where usage.user_id = requesting_user_id
    and usage.action = p_action
    and usage.created_at >= now() - interval '24 hours';

  if recent_request_count >= daily_limit then
    return false;
  end if;

  insert into private.ai_quota_events (user_id, action)
  values (requesting_user_id, p_action);

  return true;
end;
$$;

revoke all on function public.consume_ai_quota(text) from public, anon;
grant execute on function public.consume_ai_quota(text) to authenticated;

alter table public.users enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.social_accounts enable row level security;
alter table public.audits enable row level security;

alter table public.users force row level security;
alter table public.creator_profiles force row level security;
alter table public.social_accounts force row level security;
alter table public.audits force row level security;

create policy users_select_own
  on public.users
  for select
  to authenticated
  using (id = (select auth.uid()));

create policy creator_profiles_select_own
  on public.creator_profiles
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy creator_profiles_insert_own
  on public.creator_profiles
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy creator_profiles_update_own
  on public.creator_profiles
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy social_accounts_select_own
  on public.social_accounts
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy social_accounts_insert_own
  on public.social_accounts
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- Audits are AI-generated: only the Edge Function's service-role client may
-- insert them (after validating the model output), never the browser client.
create policy audits_select_own
  on public.audits
  for select
  to authenticated
  using (user_id = (select auth.uid()));

commit;
