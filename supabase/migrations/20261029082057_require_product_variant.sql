-- A product and its first variants may be inserted in one transaction. A
-- standalone product insert must not commit without a corresponding variant.
create function private.require_product_variant() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if exists (select 1 from public.products where id = new.id and shop_id = new.shop_id)
    and not exists (select 1 from public.product_variants where product_id = new.id and shop_id = new.shop_id) then
    raise exception 'At least one variant is required';
  end if;
  return null;
end $$;
revoke all on function private.require_product_variant() from public, anon, authenticated;
create constraint trigger require_product_variant
  after insert on public.products deferrable initially deferred
  for each row execute function private.require_product_variant();
