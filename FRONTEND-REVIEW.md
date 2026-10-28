# Frontend engineering review

Scope: first UI preview and fixes to the five review findings. This is an explicit project review rubric, not a claim to have loaded an unavailable skill named frontend-engineering-rubric. The installed skill catalogs and local sources were searched; no exact match was found.

| Area | Evidence / result | Remaining acceptance |
|---|---|---|
| Functional correctness | Policy values now live in workspace state; shop-specific support navigation passes a shop filter with clear action; import Cancel/Escape/outside-close resets preview and invalidates pending reads. | Browser interaction checks pending. Reload intentionally resets preview data. |
| Input handling | Existing six row-validation tests plus four actual CSV/XLSX reader tests pass. Formula/complex Excel cells rejected. | Production file-security, reconciliation, alternate header mapping and background parsing remain out of scope. |
| Dependency hygiene | Removed xlsx. Lazy-loaded Papa Parse handles CSV; ExcelJS handles XLSX. ExcelJS uuid override uses patched 11.x API. npm audit reports zero vulnerabilities for this lockfile. | Audit is point-in-time evidence; future dependency updates require rerun. |
| Accessibility | Radix primitives, localized explicit dialog controls, labels, status/error announcements, visible focus, keyboard-native controls. Shared buttons have 44px minimum targets. | Screen-reader, focus-trap/return and full keyboard acceptance not verified in browser. |
| Bilingual / RTL | Locale drives document and Radix direction. Switch motion is direction-aware; dialog/sheet headings, select indicators, table and tab alignment use logical directions. | Urdu shaping, portal geometry, tab order and switch positions need live visual checks. |
| Responsive layout | Cards adapt; list/detail views expose mobile Back; navigation uses a localized sheet. Touch target minimum applied centrally. | 320/375/768/1440px, zoom and long Urdu label acceptance pending. No screenshot-based score awarded. |
| State and async correctness | Policy data survives catalogue unmount in the same visit; import generation guards ignore late completions after dismissal. | General navigation still discards unsaved editor/reply drafts; locale-switch preservation needs runtime acceptance. |
| Performance | Both spreadsheet readers are loaded on demand. Existing shared token/component system retained. | Bundle-size thresholds and main-thread timing not measured. |
| Architecture / typing | Shared types/constants/static data retained. Strict TypeScript, typed translation keys and no-any lint checks pass. | Large workspace component should be split in a focused follow-up; no claim of finalized architecture. |
| Visual craft | Apple design direction, green/light tokens and reduced-motion/transparency styles remain. | Browser preview unavailable; no visual approval or production-ready claim. |

## Verification record
- npm run typecheck: pass.
- npm run lint: pass before final documentation update; rerun result recorded in PR.
- npm test: 10 passing tests (six row validations; quoted CSV, real XLSX, formula rejection and malformed CSV).
- npm run build: pass with next.config.mjs.
- npm audit --json: zero vulnerabilities.
- Managed preview: production server readiness returned, but cloud browser received connection refused. Previous dev-server flag problem and TS-config runtime transpiler panic were diagnosed; no successful browser acceptance resulted.

## Decision
Keep PR draft until UI/browser acceptance is complete. No merge/deployment, account authorization or live-service integration is performed by these fixes.

## Second review fixes
- Product photo reads now expose loading status, disable further selection and Save, and guard form submission synchronously while a read is pending. This prevents a product being saved before selected photos are ready.
- Common price is controlled state, retained when same-price mode is toggled off and on.
- Support details derive from the filtered list; changing status filters clears selection and reply state so an out-of-filter query cannot remain open.
- Owner name and business phone are controlled workspace state, retained when returning from connection to setup. Continue validates trimmed setup fields and updates the sample shop name/owner record. No backend persistence is implied.
- Rechecked strict TypeScript, ESLint, all 10 existing import tests and production build: pass. These existing tests cover imports, not the four UI interactions; browser regression checks remain pending.
