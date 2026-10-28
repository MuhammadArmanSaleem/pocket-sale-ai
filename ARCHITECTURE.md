# Architecture

## Verified current state
The repository has app/page.tsx, app/layout.tsx, app/globals.css, starter public assets and npm configuration. This documentation change does not implement the application structure below.

## Proposed UI boundaries
| Area | Responsibility |
|---|---|
| app/ | Routes, layouts and route composition |
| components/ui/ | shadcn/ui components |
| components/layout/ | Responsive owner/admin shells and navigation |
| features/catalogue/ | Product forms, variants, import and photo UI |
| features/sessions/ | Conversation and handover display |
| features/support/ | Owner queries and admin replies |
| lib/constants.ts | Shared constants/configuration |
| lib/types.ts | Shared TypeScript types and interfaces |
| lib/data.ts | Typed static arrays and clearly named preview fixtures |
| messages/en.ts, messages/ur.ts | Interface translations |

These are proposed paths, not existing files. Avoid circular dependencies and duplicate sources of truth. Runtime API results and state stay in their appropriate data/state layer, rather than becoming static exports.

## Design system
Use semantic tokens in app/globals.css and a shared shadcn-based component layer. Feature components consume tokens and variants; DESIGN.md specifies visual and accessibility rules.

## Owner flow
Admin-provisioned login → owner shop setup → required WhatsApp connection → owner dashboard.
On disconnection return to connection screen. UI phase uses explicit simulation, not fabricated API success.
Exact setup fields and credential lifecycle need further agreement. Admin routes have their own access flow and are not subject to the owner's WhatsApp gate.

## Future service boundaries — not implemented
Supabase is planned for identity, shop-scoped data and images. Owner/admin roles must be checked on the server and tenant separation enforced in database policies as appropriate. Client filtering alone is insufficient.
Vercel is the deployment target. Official Meta Cloud API receives/sends WhatsApp events. AI calls and privileged tools stay server-side. A later design must cover webhook verification, durable processing, idempotency, failure recovery and credential storage.
No external integration or hosting change is authorized by the presence of these architecture notes.

## UI state and persistence
Keep UI mocks behind a clearly identified preview data boundary. Do not mix mock records with production records. Browser persistence, if used for demos, must be labeled and isolated from live accounts.
Define loading, empty, validation, disconnected, permission-denied and retry states alongside successful screens.
Future real import processing must validate files on the server; client preview alone is not ingestion security.

## Verification
Documentation: check links, requirements and implemented/proposed labels.
Implementation: type checks, relevant automated checks, production build, keyboard flows, mobile/desktop layouts and both language directions. Record what actually ran; document missing access or environment limitations.

## Planned locale boundary
Adopt next-intl with a validated server-resolved locale and a locale cookie preference (no locale-prefixed routes required initially). The same locale supplies html lang/dir, request translations and NextIntlClientProvider. shadcn DirectionProvider receives the matching direction so primitive and portal behavior agrees with document layout.
Use useTranslations/useLocale in appropriate components and getTranslations in async server components. Keep locale constants/mapping, types, option arrays and translation dictionaries in the separate central files identified in AGENTS.md and DESIGN.md. Any request configuration modules should consume those definitions, not copy them.
Validate locale against en/ur and fall back to the central default. Persist switches via a validated server mechanism and refresh translation context while retaining route/query and owner draft state. Exact adapter/version compatibility must be checked against installed Next.js and next-intl docs during implementation.
This is a dependency/architecture selection, not an installed integration. No package or runtime files change in this documentation PR.


## UI implementation update (supersedes starter-only statements above)
The branch now contains an interactive Next.js UI. components/workspace.tsx owns preview role/stage/page and sample state; components/shared.tsx composes shadcn controls; features/catalogue and features/support handle their forms. components/sessions.tsx handles sample conversation state. The UI is not wired to production accounts or services.
Central lib/constants.ts, lib/types.ts and lib/data.ts are implemented, along with semantic CSS tokens. Locale is validated in i18n/request.ts from an httpOnly cookie. i18n/actions.ts changes only validated language preference; app/layout.tsx renders lang/dir and next-intl/Radix providers from that locale. global.d.ts checks translation keys.
Next cacheComponents/partialPrefetching and agent-feedback experimental starter flags were removed: request-time locale rendering uses the standard dynamic route path rather than requiring a root Suspense workaround. Tailwind runs through its PostCSS plugin. No hosting platform changed.
Imports parse CSV/XLSX in the browser via a lazy-loaded spreadsheet parser, validate rows in lib/import.ts, and group variants. All imports and photos remain in memory. Provisional limits are central constants. Duplicate checks currently cover combinations within the uploaded file, not reconciliation with existing catalogue records; production semantics remain open.
No browser acceptance was completed: managed preview rejected Next's CLI flags; a temporary compatibility wrapper did not keep the preview service alive and was removed. No alternative browser automation was substituted. Type/build and unit verification are recorded in the PR.

## Review fixes
Shop policy values now live in workspace state and are passed to Catalogue; edits survive navigation in the same visit. Admin owner cards pass a shop filter into Support and offer a clear-filter control. Import dismissal clears preview/error/loading state and invalidates asynchronous reads using a generation ref.
Papa Parse handles CSV, ExcelJS handles XLSX; readers are dynamically loaded. xlsx is removed. Formula/object cells are rejected before product validation. A patched uuid 11.x override resolves the transitive ExcelJS advisory for this lockfile. Config is native next.config.mjs after a TS-config transpiler panic in the managed production preview.
See FRONTEND-REVIEW.md for the explicit review rubric and remaining browser acceptance work.
