-- Support the new "analyze anonymously, capture email before reveal" flow:
-- anonymous Supabase sessions run the real analysis, then the lead email is
-- stored on creator_profiles (separate from auth.users.email, which stays
-- null for anonymous identities).

begin;

alter table public.creator_profiles
  add column email text;

alter table public.creator_profiles
  add constraint creator_profiles_email_shape check (
    email is null
    or (
      email = btrim(email)
      and char_length(email) between 3 and 320
      and position('@' in email) > 1
    )
  );

commit;
