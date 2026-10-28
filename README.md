# PocketSales AI

A planned WhatsApp sales-assistant platform for Pakistani clothing sellers. Each shop owner has a separate account and shop workspace; the super admin manages owner accounts and support queries.

## Current state
The repository contains a Next.js starter and a documentation foundation. No product dashboard, shadcn installation, Urdu localization, authentication, Supabase connection, WhatsApp integration or AI agent is implemented in this branch. An earlier standalone design preview is a reference only and is not application code in this repository.

## Development sequence
1. Documentation foundation.
2. Dashboard UI/UX using shadcn/ui, shared design tokens, English/Urdu RTL and responsive layouts.
3. Real accounts, storage and integration work in separately scoped changes.
4. AI/WhatsApp agent behavior after requirements are clarified.

## Local starter
Use npm with the existing package-lock.json:
```sh
npm ci
npm run dev
npm run build
```
These are the starter commands; this documentation change has not run or verified application builds.

## Project guide
- [PRD](PRD.md): requirements, acceptance criteria and open questions.
- [Architecture essentials](ARCHITECTURE-ESSENTIALS.md): quick orientation.
- [Architecture](ARCHITECTURE.md): current and proposed boundaries.
- [Design system](DESIGN.md): components, tokens and bilingual interaction.
- [Decisions](DECISIONS.md): significant choices and status.
- [Research](RESEARCH.md): evidence and unresolved external facts.
- [Agent instructions](AGENTS.md): mandatory contributor rules.
- [Claude entry point](CLAUDE.md): routes to shared guidance.

Deployment target: Vercel. Planned identity/data provider: Supabase. Neither is configured by this PR.
