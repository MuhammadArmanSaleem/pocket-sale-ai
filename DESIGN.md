# Design system and UI/UX

## Direction and status
Green/light is the selected starting direction; the final visual design is not approved.
Use shadcn/ui rather than recreating inputs, dialogs, menus, selects, tables and sheets. Adapt appearance through shared tokens and component variants.
Reference: [Apple design skill](https://www.ui-skills.com/skills/emilkowalski/apple-design). Apply relevant guidance to product tasks; do not add decorative gestures just to demonstrate animation.

## Token contract
Define shared semantic CSS variables in app/globals.css, integrated with shadcn's theme:
- Surfaces: background, foreground, card, popover, muted.
- Actions: primary, secondary, accent and their foregrounds.
- Feedback: destructive, warning, success and accessible foregrounds.
- Structure: border, input, ring, sidebar.
- Typography: system-oriented English stack, tested Urdu-capable stack, sizes, weights and line heights.
- Layout: spacing scale, radii, elevation and motion tokens.
Concrete values are to be selected and checked in the UI implementation. Avoid isolated hex values, arbitrary spacing or inconsistent radii in feature code.

## Interaction
Clear labels, calm hierarchy and immediate press feedback. Use subtle, interruptible motion where it supports orientation; do not delay input or lock controls during transitions. Respect reduced motion, contrast preferences and reduced transparency. Translucent surfaces must retain legibility.
Dialogs and sheets need accessible titles, focus handling, Escape behavior and predictable close controls. Show inline validation and meaningful completion/error feedback.

## Bilingual design
English and Urdu UI copy, including form errors, navigation, dialogs, import results and status labels. Urdu sets lang=ur and dir=rtl at the document boundary.
Use logical start/end spacing and alignment; mirror directional arrows, navigation and drawer placement. Do not mirror logos or non-directional icons.
Use appropriate direction for phone numbers, IDs, prices and mixed text. Do not apply English tracking rules to Urdu. Test font shaping, wrapping and generous line heights.

## Mobile and desktop
Both are equal priority. Desktop sidebar can become an accessible mobile navigation sheet with text labels. Catalogue rows need a usable narrow-screen presentation; important actions cannot depend on hover.
Sessions use list/detail navigation on mobile, rather than squeezing three columns. Support follows the same pattern. Preserve drafts and context when moving between panels.
Validate touch targets, long translated labels, keyboard navigation and zoom. Do not hide essential status/actions merely because a viewport is narrow.

## Planned screens
- Login: admin-issued owner credentials; credential-change UI; no public signup.
- Owner setup: shop details and WhatsApp connection, including disconnected/retry.
- Overview: clearly sourced summaries, attention items and empty states.
- Catalogue: products, variants, common/separate prices, exact stock, hide/unhide, multiple photos; manual and import flows.
- Sessions: list/detail, status, transcript and handover controls; no finalized AI behavior.
- Draft orders/follow-ups: source-plan screens with deferred operational decisions labeled.
- Owner support: create/read/reply to queries.
- Super admin: owner directory and support list/detail/reply/status.

Prior standalone HTML previews guide discussion only. Do not copy their custom primitives or role-switch logic into production authentication.

## Planned i18n implementation
Use next-intl for translations and a single validated locale shared by server/client rendering. useTranslations supplies component messages; useLocale reads the active locale; async server components use getTranslations. NextIntlClientProvider supplies client translation context.
Set html lang and dir from the server-resolved locale, then pass the same direction to shadcn's DirectionProvider, including portaled components. Configure generated shadcn components for RTL according to the chosen primitive family. A translation hook does not mirror layout by itself.
Keep English/Urdu dictionaries in messages/en.ts and messages/ur.ts; supported locale constants and direction mapping in lib/constants.ts; types in lib/types.ts; display language options in lib/data.ts. Use message keys for labels in mapped arrays rather than hardcoded translated strings. Keep message keys type-safe; no any or assertion escape hatches.
Use a locale cookie as the planned preference source for this dashboard; a validated request locale must be available before first render. Switching language should update the cookie and server context while preserving the current page, query, shop context and unsaved edits (prompt or preserve rather than discard). Do not implement a client-only direction flip after hydration.
Verify translated validation/error/empty states, Urdu shaping, prices, mixed-direction identifiers, directional icons, mobile navigation, dialogs/menus/tooltips, first render and reload. Include missing/invalid cookie fallback using the centralized default locale.
References: [next-intl server/client usage](https://next-intl.dev/docs/environments/server-client-components), [configuration](https://next-intl.dev/docs/usage/configuration), [shadcn RTL for Next.js](https://ui.shadcn.com/docs/rtl/next).
Status: documented approach only; dependencies, provider, cookie flow and UI are not implemented or tested.
