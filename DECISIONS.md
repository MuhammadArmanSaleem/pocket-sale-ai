# Decision log

Preserve numbered entries; supersede explicitly rather than rewriting history. Record concise engineering rationale, not private reasoning or chat transcripts.

## ADR-001 — Adopt documentation-first development
- Status: Implemented in this documentation branch.
- Context: Contributors need shared requirements before dashboard work.
- Decision: PRD, architecture summary/detail, design guide, research notes and shared agent instructions, followed by focused implementation PRs.
- Rationale: Keeps current state, requirements and unresolved choices distinguishable.
- Alternatives: Begin feature implementation without a shared specification.
- Consequences: Maintain docs with material changes; main stays unchanged until reviewed merge.
- Evidence: Baseline repository and trading-agent workflow inspected; this PR is documentation only.
- Revisit when: Documentation boundaries become duplicated or unclear.

## ADR-002 — Centralize definitions and prohibit TypeScript any
- Status: Confirmed contributor rule; code modules/lint enforcement not implemented.
- Context: Shared definitions must not be scattered across components.
- Decision: Separate lib/constants.ts, lib/types.ts and lib/data.ts; import definitions where used. No explicit/implicit any or assertion/suppression workarounds.
- Rationale: Consistent reuse and type checking.
- Alternatives: Inline duplicate configuration; one mixed central file.
- Consequences: Keep runtime/derived state separate; prevent circular imports.
- Evidence: Recorded in AGENTS.md and architecture; no application checks run.
- Revisit when: Central modules require a reviewed organization change.

## ADR-003 — Shared UI system with bilingual responsive design
- Status: Confirmed direction; implementation pending.
- Context: Dashboard UI comes before agent behavior.
- Decision: shadcn/ui, central semantic tokens, Apple design guidance, provisional green/light, English/Urdu RTL, equal mobile/desktop priority.
- Rationale: Reuse primitives and provide a consistent accessible experience.
- Alternatives: Custom primitive HTML implementation; desktop-only or English-only UI.
- Consequences: Requires localization, RTL and mobile verification; final visual values remain open.
- Evidence: DESIGN.md defines the contract; no shadcn dependencies added.
- Revisit when: Design review identifies needed changes.

## ADR-004 — Admin-provisioned single-shop owner access
- Status: Confirmed requirement; implementation pending.
- Context: Platform serves multiple independent shop owners.
- Decision: Super admin creates logins; owners complete setup and may later change login details. One shop/owner, no staff. Required WhatsApp connection gates owner workspace; disconnect returns to connection setup.
- Rationale: Matches agreed initial access flow.
- Alternatives: Public owner signup; multiple shops/staff; disconnected workspace access.
- Consequences: Secure provisioning/reset details remain open. Super admin support access is separate from owner connection gating.
- Evidence: Captured in PRD.md; no real login or authorization exists.
- Revisit when: Client changes account or connectivity requirements.

## New entry template
- Status: Proposed / Confirmed requirement / Implemented / Superseded.
- Context:
- Decision:
- Rationale:
- Alternatives:
- Consequences:
- Evidence:
- Revisit when:
