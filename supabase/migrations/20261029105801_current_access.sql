-- Authorization is read from trusted database records, never user metadata.
-- The invoker remains subject to row-level security on shops.
create function public.current_access()
returns table (account_role text, shop_id uuid, shop_active boolean)
language sql stable security invoker set search_path = '' as $$
  select 'admin'::text, null::uuid, true
  where (select auth.uid()) is not null and (select private.is_admin())
  union all
  select 'owner'::text, s.id, s.is_active
  from public.shops s
  where s.owner_user_id = (select auth.uid())
    and not (select private.is_admin());
$$;
revoke all on function public.current_access() from public, anon;
grant execute on function public.current_access() to authenticated;
