-- Self-service quota reset: lets a user clear their own AI quota window
-- (private.ai_quota_events is never exposed via PostgREST, so this is the
-- only way to unblock testing without touching another user's data).

begin;

create or replace function public.reset_my_ai_quota()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from private.ai_quota_events where user_id = auth.uid();
end;
$$;

revoke all on function public.reset_my_ai_quota() from public, anon;
grant execute on function public.reset_my_ai_quota() to authenticated;

commit;
