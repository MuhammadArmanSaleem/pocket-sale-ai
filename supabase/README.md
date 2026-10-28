# Database foundation

This folder defines the first database structure. It does **not** connect the dashboard, implement login/provisioning endpoints, integrate WhatsApp/AI, or apply anything to a hosted project.

## Exact migration order

Run from repository root. Supabase CLI runs timestamped filenames in this order automatically:

1. `migrations/20261028191245_core_schema.sql` — tables, constraints, indexes, timestamps; application tables start with RLS enabled and client grants revoked.
2. `migrations/20261028191252_tenant_security.sql` — narrow client grants, owner isolation, admin directory/support access and support reply state updates.
3. `migrations/20261028191259_product_storage.sql` — private product-image bucket and object access policies.

Do not run a later file first. These are one-time forward migrations, not repeatedly executable scripts. Create changes with `npx supabase migration new descriptive_name`; never edit applied migration history. The files were generated with CLI 2.122.0. No seed data or credentials are included.

## Run locally

Requires Docker and Supabase CLI; Node 22 is used by CI.

```sh
npm ci
npm run test:db
npx supabase start
npx supabase migration up --local
```

`start` initializes a fresh local stack using migrations; `migration up --local` applies any remaining local migrations. Check the selected project before using hosted commands. These instructions have not been exercised with Docker in the authoring environment.

For an explicitly selected hosted project, first configure its Auth settings to disable public signup (including email signup), then link and inspect the plan:

```sh
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push --dry-run
```

Review the plan and backup/restore arrangements before deliberately running `npx supabase db push`. No hosted command has been executed for this change. Local `config.toml` disables signup; migrations do not change hosted Auth settings. Never expose service-role/secret keys in the browser.

## Records and relationships

| Table | Purpose |
|---|---|
| `profiles` | Display name and en/ur preference, linked to Supabase Auth; no passwords or editable role |
| `shops` | One unique owner per shop, shop name/phone, active state, PKR |
| `shop_policies` | Delivery estimate/charge and returns text |
| `products` | Name, category, description, visibility |
| `product_variants` | Product size/colour, price and exact stock |
| `product_images` | Private object path, ordering and alt text |
| `order_drafts` / `order_draft_items` | Manually managed drafts with item snapshots; no final-order lifecycle |
| `support_tickets` / `support_messages` | Owner requests and admin replies |
| `private.admin_users` | Trusted admin membership, outside exposed API schemas |

Child records carry `shop_id` and composite foreign keys so a variant, photo, order item or reply cannot reference another shop's parent. Variant combinations are unique per product after trimming and case-folding size/colour. Price must be positive; stock is a nonnegative integer. Money uses decimal columns. PKR is the current preview convention, not a finalized multi-currency design.

An owner can manage only their active shop's catalogue, policies, drafts and support. They cannot change ownership, active state, author identity or admin membership. A disabled shop retains its own profile/shop directory read but loses catalogue/files/support access. Admin can read the owner directory and all support tickets, reply and change ticket status. Admin receives no general customer-order or catalogue access. Trusted server credentials bypass RLS and require separate server authorization.

Owners hide products rather than hard-delete them. Unreferenced variants/images may be removed; draft-referenced variants are protected. Deleting a draft deletes its items. No account/shop deletion endpoint is defined. Product creation with variants and imports should later be implemented as server transactions; this schema does not yet enforce a minimum variant count or implement import reconciliation. `is_visible` is stored only; there is no buyer/public catalogue access yet.

## Provisioning (trusted backend work still pending)

1. Bootstrap an admin Auth account using Supabase's administrative tools. Insert its profile and `private.admin_users` membership using trusted database administration. Do not store passwords in SQL or create role assignments from `user_metadata`.
2. An authorized server uses the Auth Admin API to create an owner identity. In one database transaction insert its profile, shop and initial shop policies. Owner identity is unique on shops.
3. Handle Auth creation vs database-transaction failure explicitly: retry safely or remove the unused Auth identity. Auth and database writes are not a shared transaction. Never leave a successful-looking partial provisioning response.
4. Secure credential delivery, password reset/change and owner-management endpoints remain to be implemented. No public signup or client-side admin-provisioning access is granted.

## Photos

Private bucket: `product-images`. Object name: `<shop UUID>/<product UUID>/<unique filename>`. Upload using the Storage API, then save metadata. Paths must point into an existing product belonging to the authenticated owner. Reads require authentication or a short-lived signed URL obtained through authorized Storage access. Do not persist signed URLs as image identities.

JPEG/PNG/WebP and 5 MiB per object match provisional UI limits. The six-photo UI cap is **not** enforced by this migration and remains a product decision. Neither MIME allowlists nor path rules inspect file content; validation/scanning belongs in the later upload flow. Metadata does not prove the object exists. Upload/metadata failures need compensating cleanup. Removing metadata does not delete a stored object: use Storage API deletion and reconcile orphans; never delete from `storage.objects` with raw SQL. No public image bucket or admin file access is added.

## Drafts and support behavior

Drafts do not reserve, deduct or validate available stock. Quantity may exceed available stock because confirmation rules are deferred. The later backend must derive trusted item snapshots/prices from catalogue data; current owner-editable snapshots are draft content, not financial records. No totals, payment, shipping or confirmation automation exists.

Support messages are append-only. A successful admin reply sets the ticket to `waiting`; an owner reply sets it to `open`, including reopening a resolved ticket. Admin can mark a ticket `resolved`. The trigger makes reply and status change atomic and verifies author/role. Ticket creation plus first message must later use a transaction. These semantics follow the preview and can be revised in a new migration.

## Verification and limits

`npm run test:db` applies every SQL file, in order, to fresh embedded PostgreSQL (PGlite) with minimal Auth/Storage test tables. It checks RLS, privileges, constraints, cross-shop access, role spoofing, support transitions, storage paths, suspended shops and unchanged stock after draft creation. CI runs it alongside existing application checks. Test identities are generated fixtures, never production records.

This is not a hosted Supabase acceptance test: Auth issuance, PostgREST column grants, signed URLs, Storage uploads/content limits, Docker startup and concurrent writes still need end-to-end testing against a disposable Supabase project before wiring production UI. No database was deployed. UI remains in-memory.

References reviewed: [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage access](https://supabase.com/docs/guides/storage/security/access-control), [local migrations](https://supabase.com/docs/guides/local-development/overview), [changelog](https://supabase.com/changelog). Schema avoids optional extensions and user-editable JWT role claims.
