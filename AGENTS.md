# Shared coding-agent instructions

Read this file, PRD.md, ARCHITECTURE-ESSENTIALS.md, DESIGN.md and relevant DECISIONS.md entries before changes. Read ARCHITECTURE.md before changing boundaries. User instructions take precedence. Preserve the generated Next.js guidance below.

## Mandatory structure and typing
- Centralize shared constants in `lib/constants.ts`, types/interfaces in `lib/types.ts`, and static display arrays (including navigation and arrays rendered with map) in `lib/data.ts`. Import them where needed; do not scatter definitions through components.
- Do not combine these concerns into one file. Keep dependencies one-way: types are independent; constants/data may import types; components import these modules.
- No TypeScript `any`, explicit or implicit. No `as any`, double assertions or suppression comments to bypass typing. Use precise types and validated `unknown` at external boundaries.
- Runtime records, component state and derived lists are not static configuration; do not move them into data.ts just because they use map. Avoid duplicating definitions.
- Do not implement these modules as empty placeholders in documentation-only changes.

## UI and design
- Use shadcn/ui components. Do not rebuild primitive controls. Read DESIGN.md.
- Centralize semantic design tokens; use the shared design system for colour, typography, spacing, radius, shadows and motion. Avoid ad hoc visual values in feature components.
- English and Urdu, with real RTL support. Both mobile and desktop are first-class.
- Apply the Apple design guidance linked in DESIGN.md. Green/light is a direction, not an approved final design.
- Current scope is UI/UX. Label sample data and simulated actions. Do not claim working authentication, WhatsApp, AI, imports or persistence without implementing and verifying them.
- No public self-signup: super admin provisions shop-owner accounts. Do not reintroduce abandoned Hermes/KSoR alternatives.

## Workflow and verification
- Inspect branch/head and existing changes. Branch new focused work from `dev` and target future PRs to `dev` unless the user explicitly requests a different base. Preserve `main` and unrelated edits. Do not merge, force-push or deploy without applicable authorization.
- Keep PRD, architecture, design and decisions aligned with material changes. Distinguish confirmed requirements, proposals, implementation and unresolved questions.
- For docs-only changes check references and consistency. For implementation run appropriate type/build checks and exercise changed UI flows, including mobile and Urdu RTL. Report exact results and limitations.
- Strict TypeScript and no-explicit-any lint enforcement are implemented. Keep both checks passing; do not weaken them to bypass errors.
- Never commit credentials, private customer data or conversation dumps. Public docs should describe professional product requirements, not personal background.
- Record material choices in DECISIONS.md with context, decision, rationale, alternatives, consequences, evidence and revisit conditions.
- Handoff: explain what changed, why, checks, limitations and the next concrete dependency.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Mandatory i18n and direction
- Use next-intl as the planned translation layer: useTranslations/useLocale for appropriate components, getTranslations for async server components, and NextIntlClientProvider for client context. Do not create duplicate language state per component.
- Centralize supported en/ur locales and locale-to-direction mapping in lib/constants.ts, locale/direction types in lib/types.ts, language option arrays in lib/data.ts and translations in messages/en.ts and messages/ur.ts.
- Resolve one validated locale on the server and use it for document lang/dir, translations and the shadcn DirectionProvider. English is ltr; Urdu is rtl. Follow the installed primitive family's current shadcn RTL guide.
- Persist language selection in a locale cookie for the dashboard approach; switching language must refresh server context without dropping route, query, shop context or unsaved drafts. No locale-prefixed routes are required by this decision.
- Use logical start/end layout utilities, intentional directional icon mirroring and bidi isolation for IDs/phones. Hooks alone do not implement RTL.
- Verify first render, refresh and switching both ways, portal direction (dialogs/menus/tooltips), keyboard/mobile behavior and absence of hydration mismatches. These are future implementation checks, not completed by docs.
