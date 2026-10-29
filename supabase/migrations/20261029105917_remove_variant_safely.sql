-- Serializes removals through this RPC by locking the parent product.
-- Existing direct table DELETE privileges are unchanged; callers must not use
-- them as a substitute for this RPC's minimum-count check.
create function public.remove_product_variant(target_shop uuid, target_product uuid, target_variant uuid, expected_version timestamptz)
returns void language plpgsql security invoker set search_path = '' as $$
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
revoke all on function public.remove_product_variant(uuid,uuid,uuid,timestamptz) from public, anon;
grant execute on function public.remove_product_variant(uuid,uuid,uuid,timestamptz) to authenticated;
