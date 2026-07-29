-- Widen social_accounts.sujets_recents limits: 10 -> 15 items, 280 -> 600
-- characters per item (full Instagram captions need more than a tweet-length cap).

begin;

create or replace function public.valid_sujets_recents(p_sujets text[])
returns boolean
language sql
immutable
as $$
  select not exists (
    select 1 from unnest(p_sujets) as sujet
    where char_length(btrim(sujet)) = 0 or char_length(sujet) > 600
  );
$$;

alter table public.social_accounts
  drop constraint social_accounts_sujets_count;

alter table public.social_accounts
  add constraint social_accounts_sujets_count check (
    cardinality(sujets_recents) between 3 and 15
  );

commit;
