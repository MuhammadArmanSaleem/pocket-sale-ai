-- Admin membership is never sourced from user-editable metadata.
create function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select (select auth.uid()) is not null and exists(select 1 from private.admin_users where user_id=(select auth.uid()));
$$;
create function private.owns_active_shop(target uuid) returns boolean language sql stable security definer set search_path='' as $$
 select (select auth.uid()) is not null and exists(select 1 from public.shops where id=target and owner_user_id=(select auth.uid()) and is_active);
$$;
revoke all on function private.is_admin(), private.owns_active_shop(uuid) from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_admin(), private.owns_active_shop(uuid) to authenticated;
grant select on public.profiles, public.shops to authenticated;
grant update(display_name,preferred_locale) on public.profiles to authenticated;
grant update(name,business_phone) on public.shops to authenticated;
create policy profiles_read on public.profiles for select to authenticated using(user_id=(select auth.uid()) or (select private.is_admin()));
create policy profiles_edit on public.profiles for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy shops_read on public.shops for select to authenticated using(owner_user_id=(select auth.uid()) or (select private.is_admin()));
create policy shops_edit on public.shops for update to authenticated using(owner_user_id=(select auth.uid()) and is_active) with check(owner_user_id=(select auth.uid()) and is_active);
grant select on public.shop_policies to authenticated;
grant insert(shop_id,delivery_time,delivery_charge,returns_policy) on public.shop_policies to authenticated;
grant update(delivery_time,delivery_charge,returns_policy) on public.shop_policies to authenticated;
create policy owner_read on public.shop_policies for select to authenticated using(private.owns_active_shop(shop_id));
create policy owner_insert on public.shop_policies for insert to authenticated with check(private.owns_active_shop(shop_id));
create policy owner_update on public.shop_policies for update to authenticated using(private.owns_active_shop(shop_id)) with check(private.owns_active_shop(shop_id));
grant select on public.products to authenticated;
grant insert(shop_id,name,category,description,is_visible) on public.products to authenticated;
grant update(name,category,description,is_visible) on public.products to authenticated;
create policy owner_read on public.products for select to authenticated using(private.owns_active_shop(shop_id));
create policy owner_insert on public.products for insert to authenticated with check(private.owns_active_shop(shop_id));
create policy owner_update on public.products for update to authenticated using(private.owns_active_shop(shop_id)) with check(private.owns_active_shop(shop_id));
grant select on public.product_variants to authenticated;
grant insert(shop_id,product_id,size,colour,unit_price,stock_quantity) on public.product_variants to authenticated;
grant update(size,colour,unit_price,stock_quantity) on public.product_variants to authenticated;
create policy owner_read on public.product_variants for select to authenticated using(private.owns_active_shop(shop_id));
create policy owner_insert on public.product_variants for insert to authenticated with check(private.owns_active_shop(shop_id));
create policy owner_update on public.product_variants for update to authenticated using(private.owns_active_shop(shop_id)) with check(private.owns_active_shop(shop_id));
grant select on public.product_images to authenticated;
grant insert(shop_id,product_id,object_name,sort_order,alt_text) on public.product_images to authenticated;
grant update(sort_order,alt_text) on public.product_images to authenticated;
create policy owner_read on public.product_images for select to authenticated using(private.owns_active_shop(shop_id));
create policy owner_insert on public.product_images for insert to authenticated with check(private.owns_active_shop(shop_id));
create policy owner_update on public.product_images for update to authenticated using(private.owns_active_shop(shop_id)) with check(private.owns_active_shop(shop_id));
grant select on public.order_drafts to authenticated;
grant insert(shop_id,customer_name,customer_phone,delivery_address,notes) on public.order_drafts to authenticated;
grant update(customer_name,customer_phone,delivery_address,notes) on public.order_drafts to authenticated;
create policy owner_read on public.order_drafts for select to authenticated using(private.owns_active_shop(shop_id));
create policy owner_insert on public.order_drafts for insert to authenticated with check(private.owns_active_shop(shop_id));
create policy owner_update on public.order_drafts for update to authenticated using(private.owns_active_shop(shop_id)) with check(private.owns_active_shop(shop_id));
grant select on public.order_draft_items to authenticated;
grant insert(shop_id,draft_id,variant_id,quantity,product_name_snapshot,size_snapshot,colour_snapshot,unit_price_snapshot) on public.order_draft_items to authenticated;
grant update(quantity,product_name_snapshot,size_snapshot,colour_snapshot,unit_price_snapshot) on public.order_draft_items to authenticated;
create policy owner_read on public.order_draft_items for select to authenticated using(private.owns_active_shop(shop_id));
create policy owner_insert on public.order_draft_items for insert to authenticated with check(private.owns_active_shop(shop_id));
create policy owner_update on public.order_draft_items for update to authenticated using(private.owns_active_shop(shop_id)) with check(private.owns_active_shop(shop_id));
grant delete on public.product_variants to authenticated;
create policy owner_delete on public.product_variants for delete to authenticated using(private.owns_active_shop(shop_id));
grant delete on public.product_images to authenticated;
create policy owner_delete on public.product_images for delete to authenticated using(private.owns_active_shop(shop_id));
grant delete on public.order_drafts to authenticated;
create policy owner_delete on public.order_drafts for delete to authenticated using(private.owns_active_shop(shop_id));
grant delete on public.order_draft_items to authenticated;
create policy owner_delete on public.order_draft_items for delete to authenticated using(private.owns_active_shop(shop_id));
grant select on public.support_tickets, public.support_messages to authenticated;
grant insert(shop_id,subject) on public.support_tickets to authenticated;
grant update(status) on public.support_tickets to authenticated;
grant insert(shop_id,ticket_id,author_role,body) on public.support_messages to authenticated;
create policy tickets_read on public.support_tickets for select to authenticated using(private.owns_active_shop(shop_id) or (select private.is_admin()));
create policy tickets_insert on public.support_tickets for insert to authenticated with check(private.owns_active_shop(shop_id) and created_by=(select auth.uid()));
create policy tickets_admin_update on public.support_tickets for update to authenticated using((select private.is_admin())) with check((select private.is_admin()));
create policy messages_read on public.support_messages for select to authenticated using(private.owns_active_shop(shop_id) or (select private.is_admin()));
create policy messages_insert on public.support_messages for insert to authenticated with check(
 author_user_id=(select auth.uid()) and ((author_role='owner' and private.owns_active_shop(shop_id)) or (author_role='admin' and (select private.is_admin())))
);
-- Reply insertion and ticket state transition are one transaction. No mutable messages.
create function private.support_reply_status() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if (select auth.uid()) is null or new.author_user_id<>(select auth.uid()) then raise exception 'Invalid reply author'; end if;
 if not ((new.author_role='owner' and private.owns_active_shop(new.shop_id)) or (new.author_role='admin' and private.is_admin())) then raise exception 'Reply access denied'; end if;
 update public.support_tickets set status=case when new.author_role='admin' then 'waiting' else 'open' end where id=new.ticket_id and shop_id=new.shop_id;
 return new;
end $$;
revoke all on function private.support_reply_status() from public, anon, authenticated;
create trigger support_reply_status after insert on public.support_messages for each row execute function private.support_reply_status();
