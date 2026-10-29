-- Enforce the cap for direct inserts and RPCs. The invoker remains subject to
-- the caller's grants and row policies. Parent locking coordinates with the
-- existing checked add/remove functions for this product.
create function private.enforce_variant_limit() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  perform 1 from public.products where id=new.product_id and shop_id=new.shop_id for update;
  if not found then raise exception 'Product unavailable'; end if;
  if (select count(*) from public.product_variants where product_id=new.product_id and shop_id=new.shop_id) >= 100 then
    raise exception 'Variant limit reached';
  end if;
  return new;
end $$;
revoke all on function private.enforce_variant_limit() from public, anon, authenticated;
create trigger enforce_variant_limit before insert on public.product_variants
for each row execute function private.enforce_variant_limit();
