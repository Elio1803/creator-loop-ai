-- Replace the strict "one subject per line" input with a single free-form
-- pasted-text field. The AI now splits it into subjects itself, removing the
-- format friction (line count / per-line length limits) from the UI.

begin;

alter table public.social_accounts
  drop constraint social_accounts_sujets_count,
  drop constraint social_accounts_sujets_length;

drop function public.valid_sujets_recents(text[]);

alter table public.social_accounts
  add column contenu_brut text;

update public.social_accounts
  set contenu_brut = array_to_string(sujets_recents, E'\n')
  where contenu_brut is null;

alter table public.social_accounts
  alter column contenu_brut set not null,
  drop column sujets_recents;

alter table public.social_accounts
  add constraint social_accounts_contenu_brut_length check (
    char_length(btrim(contenu_brut)) between 20 and 4000
  );

commit;
