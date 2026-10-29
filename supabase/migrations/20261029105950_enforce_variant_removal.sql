-- Remove direct DELETE so authenticated clients cannot bypass minimum-count
-- checks. The privileged function is in a non-exposed schema and verifies the
-- authenticated user and active shop before touching any data.
revoke delete on public.product_variants from authenticated;

create function private.remove_product_variant_checked(target_shop uuid, target_product uuid, target_variant uuid, expected_version timestamptz)
returns void language plpgsql security definer set search_path = '' as $$
declare affected integer;
begin
  if (select auth.uid()) is null or not private.owns_active_shop(target_shop) then
    raise exception 'Product access denied' using errcode = '42501';
  end if;
  perform 1 from public.products where shop_id = target_shop and id = target_product for update;
  if not found then raise exception 'Product unavailable'; end if;
  if (select count(*) from public.product_variants where shop_id = target_shop and product_id = target_product) <= 1 then
    raise exception 'At least one variant is required';
  end if;
  delete from public.product_variants where shop_id = target_shop and product_id = target_product
    and id = target_variant and updated_at = expected_version;
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Variant unavailable or changed'; end if;
end $$;
revoke all on function private.remove_product_variant_checked(uuid,uuid,uuid,timestamptz) from public, anon, authenticated;
grant execute on function private.remove_product_variant_checked(uuid,uuid,uuid,timestamptz) to authenticated;

create or replace function public.remove_product_variant(target_shop uuid, target_product uuid, target_variant uuid, expected_version timestamptz)
returns void language sql security invoker set search_path = '' as $$
  select private.remove_product_variant_checked(target_shop,target_product,target_variant,expected_version)
$$;
revoke all on function public.remove_product_variant(uuid,uuid,uuid,timestamptz) from public, anon;
grant execute on function public.remove_product_variant(uuid,uuid,uuid,timestamptz) to authenticated;
