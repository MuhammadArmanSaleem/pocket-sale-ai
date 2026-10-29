# Database foundation

This folder defines the first database structure. The dashboard still uses preview data. An isolated `/auth-check` development page can verify a Supabase email/password session, but does not grant dashboard authorization. Owner provisioning, dashboard access control, WhatsApp and AI remain unimplemented.

## Exact migration order

Run from repository root. Supabase CLI runs timestamped filenames in this order automatically:

1. `migrations/20261028191245_core_schema.sql` — tables, constraints, indexes, timestamps; application tables start with RLS enabled and client grants revoked.
2. `migrations/20261028191252_tenant_security.sql` — narrow client grants, owner isolation, admin directory/support access and support reply state updates.
3. `migrations/20261028191259_product_storage.sql` — private product-image bucket and object access policies.
4. `migrations/20261028203600_current_access.sql` — authenticated access lookup using trusted admin membership and shop status.
5. `migrations/20261028204118_atomic_product_create.sql` — atomic owner product and variant creation.
6. `migrations/20261028210425_atomic_support_ticket.sql` — atomic owner ticket and first-message creation.
7. `migrations/20261029070919_provision_owner_records.sql` — trusted-only owner profile, shop and initial policy transaction.
8. `migrations/20261029072747_remove_variant_safely.sql` — guarded variant removal RPC.
9. `migrations/20261029073108_enforce_variant_removal.sql` — removes direct owner DELETE and restricts removal to the checked function.

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

Owners hide products rather than hard-delete them. Unreferenced variants/images may be removed; draft-referenced variants are protected. Deleting a draft deletes its items. No account/shop deletion endpoint is defined. Product creation can use `create_product_with_variants`, which atomically creates a product and its variants and enforces a minimum variant count for that RPC. Direct table inserts are still allowed by existing grants, and edits and imports need their own transactional flows; import reconciliation remains unimplemented. `is_visible` is stored only; there is no buyer/public catalogue access yet.

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

## SSR authentication foundation (development only)

Copy `.env.example` to `.env.local` and set the project's public URL and publishable key. Do not commit `.env.local` or put secret/service-role keys in public variables. `/auth-check` exercises sign-in and sign-out using Supabase Auth; it is not the production login or a role check. Next.js proxy refreshes session cookies. The preview dashboard still accepts demo credentials and must never be treated as protected or deployed as a production workspace.

Before production: disable hosted public signup, provision trusted users, implement server-verified roles and account status, replace preview entry, add rate limits, MFA and reset flows, and test real authenticated sessions and tenant isolation. No migrations are applied by the SSR client setup.

## Password change (work in progress)

The authenticated account page checks the current password with a separate, non-persisted Auth client and revokes that verification session before updating the current session. The application currently requires a minimum of 12 characters and maximum 72 UTF-8 bytes for new passwords; hosted Auth policy may be stricter. Configure hosted current-password and secure-password-change settings deliberately. Email nonce reauthentication, password reset, distributed rate limiting and MFA are not implemented by this path. Actual Auth behaviour has not been integration-tested.

The `provision_owner_records` RPC is service-role-only and creates profile, shop and initial policy atomically. It does not create an Auth user, send an invitation, check an admin caller or implement retry/idempotency. A future trusted server must verify the admin and handle Auth/database partial failure explicitly; do not expose the secret key.

The `remove_product_variant` RPC checks owner scope, locks the parent product, prevents deleting the last variant through the RPC and checks the variant version. Draft-referenced variants remain protected by foreign keys. Authenticated direct table DELETE is revoked by migration 9; a checked security-definer function in the private schema performs removal after verifying the authenticated owner and active shop. Existing direct inserts still permit products to be created without variants, so the schema does not guarantee every product starts with a variant. Concurrent requests and hosted security advisors have not yet been tested.
