# Architecture essentials

- Current code: Next.js App Router starter in app/; public/ contains starter assets.
- package.json currently pins Next 16.4.3, React/React DOM 19.3.0; TypeScript and Tailwind are present. shadcn/ui is not yet installed.
- Target hosting: Vercel. Planned login/database/storage: Supabase; no configuration yet.
- UI/UX first. Do not add an agent or live WhatsApp connection under the dashboard phase.
- Proposed central modules: lib/constants.ts, lib/types.ts, lib/data.ts. Separate files, imported by components. No TypeScript any.
- Shared shadcn primitives in components/ui; shared feature/layout components composed above them.
- Semantic CSS tokens in app/globals.css; token roles and usage documented in DESIGN.md.
- English/Urdu messages separated from components. Set lang and dir at the document boundary.
- One shop per owner; no staff or public owner signup. Super admin provisions owner access.
- Connection gate applies to owner workspace; disconnected owners return to connection setup. Do not accidentally block super admin support access.
- Client role switches are preview controls, never security. Real authorization and tenant separation are future server/database requirements.
- Keep secrets server-side. Future AI receives authorized shop information, never unrestricted database access.
- Read installed Next.js docs before code changes per AGENTS.md.
