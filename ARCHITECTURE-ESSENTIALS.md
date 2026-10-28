# Architecture essentials

- Next.js App Router, React, strict TypeScript, Tailwind/PostCSS, shadcn/ui with Radix, next-intl.
- UI-only preview: client state in components/workspace.tsx; no authentication, database, live WhatsApp or AI.
- One shop per owner. Owner preview setup → simulated connection → workspace; disconnect routes back. Admin preview independent.
- Shared constants: lib/constants.ts; all application types: lib/types.ts; static arrays/fixtures: lib/data.ts. No TypeScript any; lint enforces explicit-any prohibition and strict TS rejects implicit any.
- shadcn primitives in components/ui; feature composition in features/catalogue, features/support and components/sessions.tsx.
- Design tokens: app/globals.css. Translation dictionaries: messages/en.ts and messages/ur.ts with typed keys.
- Server-resolved locale cookie sets html lang/dir, next-intl provider and Radix DirectionProvider. Switching refreshes server context and retains mounted client state; reload resets mock records.
- Import parsing is browser-only and lazy-loaded, validated by lib/import.ts; production validation and reconciliation are future work.
- Vercel remains target hosting, Supabase remains planned. Nothing deployed.
- Commands: npm run typecheck, npm run lint, npm test, npm run build.
- Browser/device/portal RTL acceptance is pending due to managed preview failure. Build success does not replace interaction testing.
- Read the installed Next.js docs before code changes per AGENTS.md.
