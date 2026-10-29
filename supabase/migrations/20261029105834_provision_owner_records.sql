-- Service role is required: this RPC grants no privilege to authenticated users.
-- The trusted caller must first verify the requesting admin and manage the
-- separate Auth-user creation/invitation lifecycle.
create function public.provision_owner_records(
  owner_id uuid, owner_name text, shop_name text, business_phone text
) returns uuid language plpgsql security invoker set search_path = '' as $$
declare new_shop_id uuid;
begin
  if owner_id is null or owner_name is null or length(btrim(owner_name)) not between 1 and 120
     or shop_name is null or length(btrim(shop_name)) not between 1 and 160
     or business_phone is null or length(btrim(business_phone)) not between 1 and 40 then
    raise exception 'Invalid owner details';
  end if;
  insert into public.profiles(user_id,display_name) values(owner_id,btrim(owner_name));
  insert into public.shops(owner_user_id,name,business_phone)
    values(owner_id,btrim(shop_name),btrim(business_phone)) returning id into new_shop_id;
  insert into public.shop_policies(shop_id) values(new_shop_id);
  return new_shop_id;
end $$;
revoke all on function public.provision_owner_records(uuid,text,text,text) from public, anon, authenticated;
grant execute on function public.provision_owner_records(uuid,text,text,text) to service_role;
