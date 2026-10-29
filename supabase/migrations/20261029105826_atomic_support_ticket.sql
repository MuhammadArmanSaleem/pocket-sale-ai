-- The caller remains subject to the normal owner policies and column grants.
create function public.create_support_ticket(target_shop uuid, ticket_subject text, first_message text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare created_ticket uuid;
begin
  if (select auth.uid()) is null or not private.owns_active_shop(target_shop) then
    raise exception 'Support access denied' using errcode = '42501';
  end if;
  if ticket_subject is null or length(btrim(ticket_subject)) not between 1 and 200
     or first_message is null or length(btrim(first_message)) not between 1 and 3000 then
    raise exception 'Invalid support request';
  end if;
  insert into public.support_tickets(shop_id,subject)
  values(target_shop,btrim(ticket_subject)) returning id into created_ticket;
  insert into public.support_messages(shop_id,ticket_id,author_role,body)
  values(target_shop,created_ticket,'owner',btrim(first_message));
  return created_ticket;
end $$;
revoke all on function public.create_support_ticket(uuid,text,text) from public, anon;
grant execute on function public.create_support_ticket(uuid,text,text) to authenticated;
