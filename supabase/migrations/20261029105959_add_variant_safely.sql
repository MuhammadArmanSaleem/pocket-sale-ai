-- Serializes additions through this RPC by locking the owner product.
create function public.add_product_variant(target_shop uuid, target_product uuid, variant_size text, variant_colour text, variant_price numeric, variant_stock integer)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare new_variant uuid;
begin
  if (select auth.uid()) is null or not private.owns_active_shop(target_shop) then raise exception 'Product access denied' using errcode = '42501'; end if;
  if variant_size is null or length(btrim(variant_size)) not between 1 and 80
    or variant_colour is null or length(btrim(variant_colour)) not between 1 and 80
    or variant_price is null or variant_price::text in ('NaN','Infinity','-Infinity')
    or variant_price <= 0 or variant_price > 9999999999.99 or round(variant_price,2) <> variant_price
    or variant_stock is null or variant_stock < 0 then raise exception 'Invalid variant'; end if;
  perform 1 from public.products where shop_id=target_shop and id=target_product for update;
  if not found then raise exception 'Product unavailable'; end if;
  if (select count(*) from public.product_variants where shop_id=target_shop and product_id=target_product) >= 100 then raise exception 'Variant limit reached'; end if;
  insert into public.product_variants(shop_id,product_id,size,colour,unit_price,stock_quantity)
  values(target_shop,target_product,btrim(variant_size),btrim(variant_colour),variant_price,variant_stock) returning id into new_variant;
  return new_variant;
end $$;
revoke all on function public.add_product_variant(uuid,uuid,text,text,numeric,integer) from public, anon;
grant execute on function public.add_product_variant(uuid,uuid,text,text,numeric,integer) to authenticated;
