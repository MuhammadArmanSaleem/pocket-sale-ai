-- Private files; use Storage API, never manipulate managed object rows directly.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('product-images','product-images',false,5242880,array['image/jpeg','image/png','image/webp']);
create function private.owns_product_object(object_name text) returns boolean language sql stable security definer set search_path='' as $$
 select (select auth.uid()) is not null and length(split_part(object_name,'/',3))>0 and exists(
 select 1 from public.products p join public.shops s on s.id=p.shop_id
 where s.owner_user_id=(select auth.uid()) and s.is_active
 and s.id::text=split_part(object_name,'/',1) and p.id::text=split_part(object_name,'/',2));
$$;
revoke all on function private.owns_product_object(text) from public, anon, authenticated;
grant execute on function private.owns_product_object(text) to authenticated;
create policy product_photo_read on storage.objects for select to authenticated using(bucket_id='product-images' and private.owns_product_object(name));
create policy product_photo_insert on storage.objects for insert to authenticated with check(bucket_id='product-images' and private.owns_product_object(name));
create policy product_photo_update on storage.objects for update to authenticated using(bucket_id='product-images' and private.owns_product_object(name)) with check(bucket_id='product-images' and private.owns_product_object(name));
create policy product_photo_delete on storage.objects for delete to authenticated using(bucket_id='product-images' and private.owns_product_object(name));
