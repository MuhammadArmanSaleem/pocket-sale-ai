# Decision log

Preserve numbered entries; supersede explicitly rather than rewriting history. Record concise engineering rationale, not private reasoning or chat transcripts.

## ADR-001 — Adopt documentation-first development
- Status: Implemented in this documentation branch.
- Context: Contributors need shared requirements before dashboard work.
- Decision: PRD, architecture summary/detail, design guide, research notes and shared agent instructions, followed by focused implementation PRs.
- Rationale: Keeps current state, requirements and unresolved choices distinguishable.
- Alternatives: Begin feature implementation without a shared specification.
- Consequences: Maintain docs with material changes; main stays unchanged until reviewed merge.
- Evidence: Baseline repository and trading-agent workflow inspected; this PR is documentation only.
- Revisit when: Documentation boundaries become duplicated or unclear.

## ADR-002 — Centralize definitions and prohibit TypeScript any
- Status: Confirmed contributor rule; code modules/lint enforcement not implemented.
- Context: Shared definitions must not be scattered across components.
- Decision: Separate lib/constants.ts, lib/types.ts and lib/data.ts; import definitions where used. No explicit/implicit any or assertion/suppression workarounds.
- Rationale: Consistent reuse and type checking.
- Alternatives: Inline duplicate configuration; one mixed central file.
- Consequences: Keep runtime/derived state separate; prevent circular imports.
- Evidence: Recorded in AGENTS.md and architecture; no application checks run.
- Revisit when: Central modules require a reviewed organization change.

## ADR-003 — Shared UI system with bilingual responsive design
- Status: Confirmed direction; implementation pending.
- Context: Dashboard UI comes before agent behavior.
- Decision: shadcn/ui, central semantic tokens, Apple design guidance, provisional green/light, English/Urdu RTL, equal mobile/desktop priority.
- Rationale: Reuse primitives and provide a consistent accessible experience.
- Alternatives: Custom primitive HTML implementation; desktop-only or English-only UI.
- Consequences: Requires localization, RTL and mobile verification; final visual values remain open.
- Evidence: DESIGN.md defines the contract; no shadcn dependencies added.
- Revisit when: Design review identifies needed changes.

## ADR-004 — Admin-provisioned single-shop owner access
- Status: Confirmed requirement; implementation pending.
- Context: Platform serves multiple independent shop owners.
- Decision: Super admin creates logins; owners complete setup and may later change login details. One shop/owner, no staff. Required WhatsApp connection gates owner workspace; disconnect returns to connection setup.
- Rationale: Matches agreed initial access flow.
- Alternatives: Public owner signup; multiple shops/staff; disconnected workspace access.
- Consequences: Secure provisioning/reset details remain open. Super admin support access is separate from owner connection gating.
- Evidence: Captured in PRD.md; no real login or authorization exists.
- Revisit when: Client changes account or connectivity requirements.

## New entry template
- Status: Proposed / Confirmed requirement / Implemented / Superseded.
- Context:
- Decision:
- Rationale:
- Alternatives:
- Consequences:
- Evidence:
- Revisit when:

## ADR-005 — Central next-intl locale and shadcn direction
- Status: Selected implementation approach; not installed or implemented.
- Context: English/Urdu need shared translations and consistent RTL rather than scattered client state.
- Decision: next-intl hooks/server helpers with NextIntlClientProvider; one validated server locale sets document lang/dir and shadcn DirectionProvider. Persist preference using a locale cookie without requiring localized route prefixes.
- Rationale: Reuse a Next.js translation layer while treating direction as a layout and primitive concern, not a translation side effect.
- Alternatives: Handwritten translation hook with duplicated locale state; client-only dir toggles; immediate locale-prefixed route migration.
- Consequences: Central locale definitions and typed message keys; logical CSS, bidi isolation and portal verification remain necessary. Switching must preserve route and unsaved work. Dependency compatibility still requires implementation checks.
- Evidence: Official next-intl server/client configuration guidance and shadcn RTL/Next.js guidance reviewed on 2026-10-28; see DESIGN.md references. Runtime behavior is unverified.
- Revisit when: Public localized URLs or another preference persistence requirement is introduced.


## ADR-006 — Deliver an explicitly simulated dashboard before service integrations
- Status: UI implemented; browser acceptance pending.
- Context: Dashboard/UI comes before agent integration and real accounts.
- Decision: Build shadcn/Radix UI with typed central definitions, in-memory preview records, owner connection gating and admin support; keep order automation deferred. Add next-intl locale cookie and shared document/primitive direction.
- Rationale: Review actual components and flows without inventing service access or business behavior.
- Alternatives: Extend standalone custom HTML; silently connect services; present fake authentication as production.
- Consequences: Reload resets preview records; no production isolation or notifications. Import limits (500 rows/2 MB; 6 photos/5 MB each) are explicit provisional preview choices. Final import policies remain unresolved.
- Evidence: See PR verification. Six focused import-validation cases were added. Managed browser preview failed; no successful browser acceptance claimed.
- Revisit when: UI review is complete and backend/auth/integration requirements are ready.

## ADR-007 — Standard dynamic locale rendering and official shadcn source fallback
- Status: Implemented.
- Context: Request-time locale requires dynamic rendering; starter experimental cache/agent flags are unnecessary. shadcn CLI registry access failed in the build environment.
- Decision: Remove experimental starter flags, use Tailwind PostCSS and standard Next.js dynamic route rendering. Retrieve Radix shadcn source from its official registry repository and preserve its MIT license.
- Rationale: Keep the chosen framework/component system with verified build compatibility.
- Alternatives: Rebuild primitives; change hosting/framework; retain experimental root cache behavior.
- Consequences: No dependency on the CLI registry at runtime. Revisit source components with future shadcn updates. Real device/RTL checks still required.
- Evidence: Production compilation and type checks succeeded during implementation; final outcomes recorded in PR.
- Revisit when: Framework caching or component generation requirements change.

## ADR-008 — Replace vulnerable spreadsheet parser and repair preview state
- Status: Implemented; browser acceptance pending.
- Context: Review found xlsx advisories, policy success without retained state, stale import previews, incomplete RTL styles and unfiltered shop support navigation.
- Decision: Use lazy Papa Parse/ExcelJS readers, override ExcelJS uuid to patched 11.x, reject complex/formula cells, retain policies in workspace state, filter support by selected shop, and reset/invalidate import reads on dismissal. Make primitive directional styles explicit and raise shared button targets to 44px minimum.
- Rationale: Fix concrete review failures while keeping the UI-only scope and central definitions.
- Alternatives: Keep vulnerable xlsx; label non-persisted policy edits as saved; assume direction context rewrites CSS.
- Consequences: Spreadsheet dependencies are larger but lazy-loaded. Production import policy/security remains separate. Next config uses native ESM (.mjs) to avoid TS-config runtime transpilation failure observed in preview.
- Evidence: 10 tests, strict type checking, lint and production build pass; audit reports zero vulnerabilities. FRONTEND-REVIEW.md distinguishes source checks from unverified browser/device checks.
- Revisit when: Real import processing or backend services are integrated; dependency advisories or bundle measurements change.


## ADR-009 — Isolated Supabase database foundation before integrations
- Status: SQL implemented; hosted deployment and UI integration pending.
- Context: Build the data structure before AI or WhatsApp and keep migrations ordered in one folder.
- Decision: Three CLI-generated forward migrations in supabase/migrations, with explicit order in supabase/README.md. Use one shop per owner, composite shop-scoped foreign keys, RLS plus narrow column grants, private admin membership and private product storage. Admin has directory/support access, not general owner catalogue/customer data access. Store draft orders only; do not mutate stock through orders.
- Rationale: Establish tenant boundaries and validation without inventing agent or fulfilment rules.
- Alternatives: Client-only filtering, JWT user_metadata roles, public image bucket, premature order automation.
- Consequences: Provisioning and upload cleanup need trusted server flows; SQL does not itself wire UI/Auth APIs. PKR/photo limits remain provisional. Reply insertion atomically reopens owner tickets or marks admin replies waiting.
- Evidence: Embedded PostgreSQL migration/security tests and official Supabase RLS/Storage guidance; exact limitations and commands in supabase/README.md. No hosted project was modified.
- Revisit when: Credential lifecycle, final currency/image requirements, staff/multi-shop needs or order confirmation rules are approved.

## ADR-010 — Development owner provisioning with explicit partial-failure handling
- Status: Implemented for development; hosted acceptance and credential-delivery workflow pending.
- Context: An administrator needs to create an owner and shop, but Supabase Auth creation and the database transaction cannot be committed together.
- Decision: Verify administrator membership on each server action, create the Auth identity with a manually supplied initial password, and create application records through the service-only RPC. If either result is uncertain, stop retries and require manual inspection; do not automatically delete an identity after a potentially committed transaction. The administrator verifies email ownership and delivers credentials securely outside the app.
- Rationale: Prevent role spoofing and avoid making an uncertain cross-service failure worse by retrying or deleting records blindly.
- Alternatives: Public signup; automatic identity deletion; email invitation without a complete invitation acceptance flow.
- Consequences: Requires a server-only Supabase secret and manual recovery for partial failures. Password rotation, secure automated delivery, distributed rate limiting and hosted Auth testing remain outstanding. This is not production-ready.
- Evidence: Input and orchestration tests cover successful creation and ambiguous failures; embedded database tests cover RPC privileges. Hosted Auth and real browser testing are pending.
- Revisit when: A verified invitation/credential-delivery flow and idempotent reconciliation are implemented.

## ADR-011 — Development product photo upload
- Status: Implemented for development; hosted and browser acceptance pending.
- Context: Owners need photos, while the existing private bucket and metadata table are separate services without a shared transaction.
- Decision: Upload with the owner's session to an owner/product-scoped private path, then insert metadata. Display via five-minute signed URLs. Clean up the uploaded object only for a definite metadata rejection; stop and request inspection on ambiguous results. The existing six-image cap is a UI limit only.
- Rationale: Preserve existing RLS boundaries and avoid deleting a file if metadata may have committed after a lost response.
- Alternatives: Public image bucket; service-role uploads; automatic retry or deletion after uncertain failures.
- Consequences: Upload may leave an orphan after an uncertain outcome; delete, reconciliation, enforced quotas, full file scanning and hosted verification remain pending. Signed URLs remain valid until expiry.
- Evidence: File signature and size tests; existing database policy tests. Browser, Storage API and cross-tenant checks still need hosted tests.
- Revisit when: Image deletion, orphan reconciliation and server-enforced quotas are implemented.
