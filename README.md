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

All records are sample data. Changes live in React memory for the visit and reset on reload. Language preference persists in a cookie. Switching language refreshes server context while retaining the mounted client workspace. Real authentication, shop isolation, Supabase, Meta and AI are not integrated. Do not enter actual passwords or private customer information in this preview.

## Run
```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```

Open localhost:3000. Use the preview form to enter owner setup; the role selector exposes the admin preview separately. Neither is authorization.

## Project guide
[PRD](PRD.md) · [Architecture](ARCHITECTURE.md) · [Essentials](ARCHITECTURE-ESSENTIALS.md) · [Design](DESIGN.md) · [Decisions](DECISIONS.md) · [Research](RESEARCH.md) · [Agent rules](AGENTS.md) · [Claude entry](CLAUDE.md)

## Dependencies and attribution
shadcn primitives were retrieved from the official shadcn-ui/ui new-york-v4 registry after the CLI registry endpoint failed in the build environment. Source imports were adapted locally; see SHADCN-LICENSE.md. Components use Radix direction context. Spreadsheet parsing is lazy-loaded and client-only; production import security/limits and parser maintenance must be reviewed before accepting untrusted production files.

Deployment target remains Vercel. No deployment or merge is performed by this UI change.
