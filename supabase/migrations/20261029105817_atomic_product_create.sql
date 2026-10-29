-- The invoker's RLS and column grants remain in force. Any error rolls back
-- both the product and every variant in the single RPC transaction.
create function public.create_product_with_variants(
  target_shop uuid, product_name text, product_category text,
  product_description text, product_visible boolean, variants jsonb
) returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  created_product uuid;
  item jsonb;
  price_text text;
  stock_text text;
begin
  if (select auth.uid()) is null or not private.owns_active_shop(target_shop) then
    raise exception 'Product access denied' using errcode = '42501';
  end if;
  if product_name is null or length(btrim(product_name)) not between 1 and 200
     or product_category is null or length(product_category) > 60
     or product_description is null or length(product_description) > 2000
     or product_visible is null then
    raise exception 'Invalid product';
  end if;
  if variants is null or jsonb_typeof(variants) <> 'array' then
    raise exception 'Invalid variants';
  end if;
  if jsonb_array_length(variants) not between 1 and 100 then
    raise exception 'Invalid variants';
  end if;
  insert into public.products(shop_id,name,category,description,is_visible)
  values(target_shop,btrim(product_name),product_category,product_description,product_visible)
  returning id into created_product;
  for item in select value from jsonb_array_elements(variants) loop
    if jsonb_typeof(item) <> 'object' or jsonb_typeof(item->'size') <> 'string'
       or jsonb_typeof(item->'colour') <> 'string'
       or jsonb_typeof(item->'price') <> 'number'
       or jsonb_typeof(item->'stock') <> 'number' then
      raise exception 'Invalid variant';
    end if;
    price_text := item->>'price';
    stock_text := item->>'stock';
    if price_text !~ '^[0-9]{1,10}(\.[0-9]{1,2})?$'
       or stock_text !~ '^(0|[1-9][0-9]{0,9})$'
       or price_text::numeric <= 0 or stock_text::numeric > 2147483647 then
      raise exception 'Invalid variant';
    end if;
    insert into public.product_variants(shop_id,product_id,size,colour,unit_price,stock_quantity)
    values(target_shop,created_product,btrim(item->>'size'),btrim(item->>'colour'),price_text::numeric,stock_text::integer);
  end loop;
  return created_product;
end $$;
revoke all on function public.create_product_with_variants(uuid,text,text,text,boolean,jsonb) from public, anon;
grant execute on function public.create_product_with_variants(uuid,text,text,text,boolean,jsonb) to authenticated;
