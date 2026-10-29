-- Application records only. Supabase owns auth and storage schemas.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table private.admin_users (
 user_id uuid primary key references auth.users(id) on delete restrict,
 created_at timestamptz not null default now()
);
create table public.profiles (
 user_id uuid primary key references auth.users(id) on delete restrict,
 display_name text not null check (length(btrim(display_name)) between 1 and 120),
 preferred_locale text not null default 'en' check (preferred_locale in ('en','ur')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.shops (
 id uuid primary key default gen_random_uuid(),
 owner_user_id uuid not null unique references public.profiles(user_id) on delete restrict,
 name text not null check(length(btrim(name)) between 1 and 160),
 business_phone text not null default '',
 currency text not null default 'PKR' check(currency = 'PKR'),
 is_active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.shop_policies (
 shop_id uuid primary key references public.shops(id) on delete restrict,
 delivery_time text not null default '', delivery_charge numeric(12,2) not null default 0 check(delivery_charge >= 0),
 returns_policy text not null default '',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.products (
 id uuid primary key default gen_random_uuid(), shop_id uuid not null references public.shops(id) on delete restrict,
 name text not null check(length(btrim(name)) between 1 and 200), category text not null default '', description text not null default '',
 is_visible boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(shop_id,id)
);
create table public.product_variants (
 id uuid primary key default gen_random_uuid(), shop_id uuid not null, product_id uuid not null,
 size text not null check(length(btrim(size)) between 1 and 80), colour text not null check(length(btrim(colour)) between 1 and 80),
 unit_price numeric(12,2) not null check(unit_price > 0), stock_quantity integer not null check(stock_quantity >= 0),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 foreign key(shop_id,product_id) references public.products(shop_id,id) on delete restrict, unique(shop_id,id)
);
create unique index product_variants_combination on public.product_variants(product_id,lower(btrim(size)),lower(btrim(colour)));
create table public.product_images (
 id uuid primary key default gen_random_uuid(), shop_id uuid not null, product_id uuid not null,
 object_name text not null unique, sort_order integer not null default 0 check(sort_order >= 0), alt_text text not null default '',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 foreign key(shop_id,product_id) references public.products(shop_id,id) on delete restrict,
 check(split_part(object_name,'/',1)=shop_id::text and split_part(object_name,'/',2)=product_id::text and length(split_part(object_name,'/',3))>0)
);
create table public.order_drafts (
 id uuid primary key default gen_random_uuid(), shop_id uuid not null references public.shops(id) on delete restrict,
 customer_name text not null check(length(btrim(customer_name)) between 1 and 200), customer_phone text not null default '',
 delivery_address text not null default '', notes text not null default '', currency text not null default 'PKR' check(currency='PKR'),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(shop_id,id)
);
create table public.order_draft_items (
 id uuid primary key default gen_random_uuid(), shop_id uuid not null, draft_id uuid not null, variant_id uuid not null,
 quantity integer not null check(quantity > 0), product_name_snapshot text not null check(length(btrim(product_name_snapshot))>0),
 size_snapshot text not null check(length(btrim(size_snapshot))>0), colour_snapshot text not null check(length(btrim(colour_snapshot))>0),
 unit_price_snapshot numeric(12,2) not null check(unit_price_snapshot>0),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 foreign key(shop_id,draft_id) references public.order_drafts(shop_id,id) on delete cascade,
 foreign key(shop_id,variant_id) references public.product_variants(shop_id,id) on delete restrict
);
create table public.support_tickets (
 id uuid primary key default gen_random_uuid(), shop_id uuid not null references public.shops(id) on delete restrict,
 created_by uuid not null default auth.uid() references public.profiles(user_id) on delete restrict,
 subject text not null check(length(btrim(subject)) between 1 and 200),
 status text not null default 'open' check(status in ('open','waiting','resolved')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(shop_id,id)
);
create table public.support_messages (
 id uuid primary key default gen_random_uuid(), shop_id uuid not null, ticket_id uuid not null,
 author_user_id uuid not null default auth.uid() references public.profiles(user_id) on delete restrict,
 author_role text not null check(author_role in ('owner','admin')),
 body text not null check(length(btrim(body)) between 1 and 3000), created_at timestamptz not null default now(),
 foreign key(shop_id,ticket_id) references public.support_tickets(shop_id,id) on delete restrict
);
alter table public.profiles enable row level security;
revoke all on public.profiles from public, anon, authenticated;
grant all on public.profiles to service_role;
alter table public.shops enable row level security;
revoke all on public.shops from public, anon, authenticated;
grant all on public.shops to service_role;
alter table public.shop_policies enable row level security;
revoke all on public.shop_policies from public, anon, authenticated;
grant all on public.shop_policies to service_role;
alter table public.products enable row level security;
revoke all on public.products from public, anon, authenticated;
grant all on public.products to service_role;
alter table public.product_variants enable row level security;
revoke all on public.product_variants from public, anon, authenticated;
grant all on public.product_variants to service_role;
alter table public.product_images enable row level security;
revoke all on public.product_images from public, anon, authenticated;
grant all on public.product_images to service_role;
alter table public.order_drafts enable row level security;
revoke all on public.order_drafts from public, anon, authenticated;
grant all on public.order_drafts to service_role;
alter table public.order_draft_items enable row level security;
revoke all on public.order_draft_items from public, anon, authenticated;
grant all on public.order_draft_items to service_role;
alter table public.support_tickets enable row level security;
revoke all on public.support_tickets from public, anon, authenticated;
grant all on public.support_tickets to service_role;
alter table public.support_messages enable row level security;
revoke all on public.support_messages from public, anon, authenticated;
grant all on public.support_messages to service_role;
alter table private.admin_users enable row level security;
revoke all on private.admin_users from public, anon, authenticated, service_role;
create index products_shop on public.products(shop_id);
create index product_variants_shop on public.product_variants(shop_id);
create index product_images_shop on public.product_images(shop_id);
create index order_drafts_shop on public.order_drafts(shop_id);
create index order_draft_items_shop on public.order_draft_items(shop_id);
create index support_tickets_shop on public.support_tickets(shop_id);
create index support_messages_shop on public.support_messages(shop_id);
create index draft_items_parent on public.order_draft_items(shop_id,draft_id);
create index support_messages_parent on public.support_messages(shop_id,ticket_id,created_at);
create index support_tickets_creator on public.support_tickets(created_by);
create index support_messages_author on public.support_messages(author_user_id);
create index draft_items_variant on public.order_draft_items(shop_id,variant_id);
create function private.set_updated_at() returns trigger language plpgsql set search_path='' as $$
begin new.updated_at=now(); return new; end $$;
revoke all on function private.set_updated_at() from public, anon, authenticated;
create trigger touch_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger touch_updated_at before update on public.shops for each row execute function private.set_updated_at();
create trigger touch_updated_at before update on public.shop_policies for each row execute function private.set_updated_at();
create trigger touch_updated_at before update on public.products for each row execute function private.set_updated_at();
create trigger touch_updated_at before update on public.product_variants for each row execute function private.set_updated_at();
create trigger touch_updated_at before update on public.product_images for each row execute function private.set_updated_at();
create trigger touch_updated_at before update on public.order_drafts for each row execute function private.set_updated_at();
create trigger touch_updated_at before update on public.order_draft_items for each row execute function private.set_updated_at();
create trigger touch_updated_at before update on public.support_tickets for each row execute function private.set_updated_at();
