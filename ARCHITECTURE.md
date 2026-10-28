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
