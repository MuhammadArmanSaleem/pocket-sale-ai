# Research and evidence

## Repository baseline
Inspected the main branch through the GitHub connector on 2026-10-28. It contains a Next.js starter; package.json records the versions summarized in ARCHITECTURE-ESSENTIALS.md. No application integration has been verified.
Workflow reference: [trading-agent AGENTS.md](https://github.com/MuhammadArmanSaleem/trading-agent/blob/main/AGENTS.md). Adopt shared guidance, scoped requirements, decision records and evidence-based handoffs; do not transfer its Python stack or trading rules.

## Source plan
The supplied PocketSales AI plan proposes a catalogue-grounded WhatsApp assistant, draft orders, human handover and seller-reviewed follow-ups. Confirmed product interview decisions in PRD.md supersede its assumptions (notably admin-created accounts).
The original plan's exact model/WhatsApp prices and vendor free-tier claims are not an implementation contract.

## External references to verify before integration
- [Apple design guidance](https://www.ui-skills.com/skills/emilkowalski/apple-design): read for design principles; not a dependency installed by this change.
- [shadcn/ui](https://ui.shadcn.com/docs): use current installation, theming and RTL guidance before implementation.
- [Meta pricing](https://business.whatsapp.com/products/platform-pricing): the earlier review could not resolve conflicting October 2026 service-message rates from an official rate card. Do not hardcode those disputed prices.
- [Vercel Hobby](https://vercel.com/docs/plans/hobby): earlier review found non-commercial restrictions; commercial hosting budget requires confirmation.
- [Supabase pricing](https://supabase.com/pricing): free-tier limits/pausing must be rechecked when provisioning.

This document distinguishes earlier findings from checks performed by this PR. No live integration, dependency install, build, deployment or pricing re-verification was performed in the documentation phase.
