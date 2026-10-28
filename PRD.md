# Product requirements

## Product and roles
PocketSales AI serves multiple independent clothing shops. Buyers message a shop through WhatsApp; they do not need a PocketSales account.
- Super admin creates owner logins and gives them to owners, views shop owners and handles their platform support queries.
- Owner can later change login details. Exact editable credentials and secure initial-delivery/reset flow remain unresolved.
- One shop per owner account for now; owner only, no staff accounts.
- Owner completes shop information and WhatsApp setup. No public self-registration.
- WhatsApp connection is required before access to the owner workspace. Disconnection returns the owner to the connection screen.

## Immediate scope: UI/UX
Implement login and owner setup screens; WhatsApp connection states; owner overview; catalogue; sessions interface; draft-order/follow-up screens; support requests; super admin owner directory and support inbox.
Use clearly marked mock data and simulated connection state until real integrations are implemented. An interface control is not evidence of a working external service.
English and Urdu with RTL; mobile and desktop equally important. shadcn/ui, shared design tokens and Apple design guidance. Green/light styling remains provisional.

## Catalogue requirements
- Manual forms and Excel/CSV import.
- Product name, description, category, price, sizes, colours and exact quantity for each variant.
- Same price across variants or separate variant prices.
- Product visibility: owner can hide a saved product from customer-facing AI.
- One or multiple product photos.
- Import product records first; owner uploads photos separately afterward.
- Shop delivery and return policies.
Import templates, duplicate handling, photo limits, currency rules and error handling are still to be specified.

## Later agent scope from the source plan
Official WhatsApp Cloud API; catalogue-grounded Urdu/Roman Urdu/English replies; missing-detail collection; draft orders requiring seller confirmation; human handover; seller-reviewed follow-up queue; usage/cost tracking.
The owner has explicitly deferred agent behavior decisions. Stock reservation/deduction, cancellations, order edit rules, session rules and delivery automation are unresolved. Do not encode proposed answers as approved behavior.
Voice, payments, shipping integrations, multiple messaging channels and complex CRM are outside the initial source-plan scope.

## UI acceptance criteria
- Owner/admin screens are distinct; mock role switching must not be presented as authorization.
- Owner setup and disconnected-state routing are demonstrable without a live account.
- Catalogue supports form states for variants, prices, stock, visibility and photo selection.
- Import flow shows upload, column mapping/validation preview, outcome and separate photo-upload step; accepted format details require agreement.
- Sessions show conversation, status and takeover/resume UI; behavior remains a simulation.
- Support flow shows owner request, admin reply and status, with empty/loading/error states.
- Urdu changes interface copy, document language/direction and mirrored layout; identifiers/phone numbers remain readable.
- Primary tasks are reachable on touch devices and desktop with keyboard support.
- No false connected, delivered, saved or AI-success claims.

## Open decisions
Subscription/usage limits, detailed admin account powers, initial credential delivery, password recovery, import conventions, product image constraints and all deferred agent rules.


## Implementation status: first UI branch
UI screens now exist with marked sample data: preview entry, shop setup, simulated connection/failure/disconnect, owner/admin shells, overview, catalogue variants/photos/import, policies, sessions, support and owner provisioning preview. Orders and follow-ups deliberately stop at review-only UI pending operational decisions.
English/Urdu translations and server document direction are implemented. Mobile styles and list/detail navigation are implemented but device/browser acceptance is not complete. Keyboard/portal behavior uses Radix primitives and still needs end-to-end acceptance.
No real login, notifications, tenant isolation, Meta, AI or Supabase. Preview records are in-memory, not durable. The locale cookie is real preference storage. Initial browser-local changes are not production persistence.
