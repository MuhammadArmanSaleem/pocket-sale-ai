# PocketSales AI

A bilingual seller and super admin dashboard UI built with Next.js, TypeScript, shadcn/ui (Radix), Tailwind tokens and next-intl.

## Current implementation
- Explicit preview entry for owner/admin; owner shop setup and simulated WhatsApp connection/failure/disconnection gate.
- Owner overview, product catalogue, variant prices/quantities, hide/show, local multiple-photo selection and shop-policy form.
- CSV/XLSX import preview with strict header/value checks, grouped variants, hidden products and later photo upload. Preview limits are provisional, not approved production import policy.
- Conversation list/detail, simulated seller takeover/resume and local replies.
- Draft-order review and follow-up placeholders; no finalized order automation.
- Owner support requests and admin support replies/statuses; sample owner directory and account-provisioning form.
- English/Urdu translations, server-set document direction, Radix direction context and locale cookie.
- Responsive layouts and keyboard-accessible primitives; browser/device acceptance remains pending.

The root route opens the real Supabase account flow, with development admin and owner pages backed by the database. `/demo` redirects to the real account flow; the former sample workspace is not exposed as a route. The real catalogue can import up to 25 validated products per file as hidden products; imports stop on the first uncertain result and require inspection before retry. A development photo upload flow uses private storage, with hosted verification, removal and orphan reconciliation pending. WhatsApp and AI remain unfinished. Language preference persists in a cookie.

## Run
```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```

Open localhost:3000 for the real account flow after configuring Supabase. Account roles are determined by server-verified database records.

## Project guide
[PRD](PRD.md) · [Architecture](ARCHITECTURE.md) · [Essentials](ARCHITECTURE-ESSENTIALS.md) · [Design](DESIGN.md) · [Decisions](DECISIONS.md) · [Frontend review](FRONTEND-REVIEW.md) · [Research](RESEARCH.md) · [Agent rules](AGENTS.md) · [Claude entry](CLAUDE.md)

## Dependencies and attribution
shadcn primitives were retrieved from the official shadcn-ui/ui new-york-v4 registry after the CLI registry endpoint failed in the build environment. Source imports were adapted locally; see SHADCN-LICENSE.md. Components use Radix direction context. Spreadsheet parsing uses lazy-loaded Papa Parse and ExcelJS (with a patched uuid override), is client-only, and rejects formula cells; production import security/limits and parser maintenance must be reviewed before accepting untrusted production files.

Deployment target remains Vercel. No deployment or merge is performed by this UI change.


## Database foundation (2026-10-28)
Supabase SQL architecture now exists in `supabase/migrations/`; see [database guide](supabase/README.md) for exact run order, table relationships, security, provisioning and verification. This supersedes planned-only database statements above: the schema is implemented and locally SQL-tested, but has not been applied to Supabase or wired to UI. Auth endpoints, WhatsApp, AI, sessions and operational order rules remain deferred. Dashboard records still use mock state.

## Development branch

`dev` is the shared integration and testing branch. Create focused branches from `dev` and target new pull requests to `dev`; changes to `main` follow a separate review. Existing stacked PRs retain their original bases for history.

For local testing:

```sh
git fetch origin
git switch dev
git pull --ff-only
npm ci
```

Copy `.env.example` to `.env.local` and fill in the Supabase project URL and publishable key. Never commit `.env.local` or put a secret/service-role key in a `NEXT_PUBLIC_` variable. Start with `npm run dev`. The dashboard remains a preview; the `/auth-check` page is an isolated development session check, not an authorized production dashboard. See `supabase/README.md` for migration order and hosted setup prerequisites.
