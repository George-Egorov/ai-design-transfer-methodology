# Changelog

All notable changes to the public BRIDGE methodology, schemas, rule catalog, and documentation are recorded here. The private Figma plugin has its own non-public implementation history; only its public coverage boundary is documented in this repository.

## [0.11.5] — 2026-08-19

### Changed

- Rebuilt the public entry path around a concise homepage, practical quick start, focused examples, and a shorter designer checklist.
- Simplified navigation and core guidance while keeping advanced contracts, validation, accessibility, motion, data, and lifecycle references available outside the beginner path.
- Applied the same documentation structure and intent across English, Russian, and Chinese, including shorter sidebar labels and localized review paths.
- Replaced the generic homepage placeholder with a design map that shows responsive views and an action-to-modal relationship.

### Added

- Automated concision, heading-parity, and beginner-page checks across all three locales.

## [0.11.4] — 2026-08-19

### Added

- Complete zh-CN localization with manifest-backed coverage for all 27 routes, 43 tags, and 107 rules.
- Strict locale parity checks, shared homepage layer-tree structure, localized metadata, UI copy, and Chinese custom pages.

### Fixed

- Removed the silent English fallback and divergent parallel route lists that previously allowed incomplete Chinese URLs to render mixed-language content.

## [0.11.3] — 2026-08-19

### Changed

- Coverage snapshots now describe BRIDGE Assistant 0.9.3; exact Page Check 42/107 and Section Check 26/107 rule sets and catalog 0.5.0 are unchanged.
- The installable plugin now exposes its package version as a small, low-emphasis label in every visible plugin mode.

## [0.11.2] — 2026-08-19

### Fixed

- Page Check and Check selected section now bind change detection to the exact audited BRIDGE roots instead of treating any change on a large mixed Figma canvas as a stale result.
- A one-off relevant change triggers one automatic fresh read. Only repeated changes inside the audited scope stop the check, with copy that explains that BRIDGE did not edit the file.
- Extracted page facts are cached only when the document revision stays stable throughout traversal, preventing a mid-scan change from leaving stale evidence for the next run.
- Coverage snapshots now describe BRIDGE Assistant 0.9.2; the exact Page Check 42/107 and Section Check 26/107 rule sets and catalog 0.5.0 are unchanged.

## [0.11.1] — 2026-08-18

### Changed

- Native Figma Sections are now canonical transparent canvas organizers for BRIDGE page-root discovery. Responsive roots may sit directly on the Figma page or below one or more native `SECTION` nodes without turning those organizers into product structure.
- Organizer names/tags never become inherited BRIDGE context, while ordinary outer `FRAME`/`GROUP` wrappers remain non-transparent and invalid around page roots.
- Bilingual quick starts, design/responsive rules, checklists, validation pipeline, terminology, hard cases, examples, tag notes, and `routing.page-root-required` now describe the same boundary.
- BRIDGE Assistant 0.9.1 discovers direct and Section-organized roots together, accepts an unambiguous selected organizer, and preserves bounded scanning of unrelated canvas trees. Rule catalog 0.5.0 and exact Page/Section Check rule counts are unchanged.

## [0.11.0] — 2026-08-17

### Added

- A canonical selected-section adoption contract for applying BRIDGE to new work inside an otherwise legacy host without pretending that the host page is BRIDGE-ready.
- Typed `section` scope metadata, explicit selected-subtree and external-dependency boundaries, a valid multi-context section fixture, and executable scope/tag cases.
- A separate coverage profile for **Check selected section**, including local, selected-variant, deferred, and out-of-scope checks plus `Ready`, `Partial`, and `Blocked` result semantics.
- Bilingual section-scope guidance and a diagram covering opaque assets, atomic instances, traversed decorative layers, and deferred file-level resolution.

### Changed

- Responsive and section-layout catalog wording now applies to explicitly declared audit contexts without adding new rule IDs; the catalog remains version 0.5.0 with 107 rules.
- Incremental adoption, transfer, validation, preflight, designer, and lifecycle guidance now distinguish section-source readiness from page, integration, product, and WCAG readiness.
- A selected section below an inherited opaque `[asset]` boundary is now an explicit blocked scope precondition, while an exact `[section=id] [asset]` root remains a valid opaque whole-visual source with internal layout coverage not applicable.
- BRIDGE Assistant 0.9.0 adds selected-section checking. Its exact emitted-rule unions are recorded separately: Page Check covers 42 catalog rules (40 automatic, 2 heuristic), while Check selected section covers 26 (24 automatic, 2 heuristic; 20 local, 6 selected-variant). This also corrects the earlier Page Check manifest undercount without changing the 107-rule catalog.

## [0.10.0] — 2026-08-14

### Added

- Blocking native Figma Auto Layout rules for BRIDGE page roots, editable section roots, and multi-child content-flow containers.
- A blocking page-root `[asset]` rule, a blocking GROUP-outside-asset rule, and a bilingual Auto Layout gate diagram.
- Explicit source boundaries for opaque assets, exact-node decorative/overlay intent, primitives, and placed component instances.

### Changed

- Rule catalog expanded from 102 to 107 rules and versioned as 0.5.0.
- Page Check 0.8.0 coverage expanded from 24 to 30 rules: 29 automatic and 1 heuristic.
- `[bridge-exception=manual-layout] [reason=...]` now records a proposed deviation without suppressing structural errors; placed INSTANCE source components remain a separate audit boundary.
- Homepage, examples, checklists, validation guidance, tag registry, and transfer documentation now state the strict source-structure contract in English and Russian.

## [0.9.0] — 2026-08-13

### Added

- Contracts for real data and visualization, long-scroll and motion, state machines and reactions, WCAG 2.2 AA accessibility, target capabilities, performance budgets, and the full delivery lifecycle.
- Versioned `bridge` JSON Schema, valid fixture, 43-tag registry, executable tag examples, and explicit methodology coverage manifest.
- Six-channel homepage coverage map, review hub with persistent preflight and report export, filterable tag reference, and rule deep links.
- Five editable SVG infographics with PNG fallbacks and a new social preview.
- Pull-request CI, schema/content/link/build checks, and Playwright + axe coverage for desktop/mobile, keyboard, persistence, filtering, and reduced motion.

### Changed

- Rule catalog expanded from 77 to 102 rules; Page Check remains honestly scoped to 24 rules (23 automatic, 1 heuristic).
- Responsive default remains one logical tree, while structural changes are now represented by declared identity/state/semantics/focus mappings.
- Open questions and deviations are first-class records with scope, owner, status, review point, evidence, mitigation, and fallback.
- Site generation is manifest-driven, atomic, base-path aware, and checks generated/public asset parity.
- Public copy now makes the boundary explicit: the methodology and validator repository are open under MIT; the installable Figma plugin is public, but its implementation is private.

### Fixed

- Canonical homepage examples, exception grammar, plugin links, sitemap language alternates, 404 metadata, contrast, and interactive target sizes.

## [0.8.0] — 2026-07-17

- Added the interactive layer inspector, focused Figma companion workflow, bilingual site, and the original 77-rule catalog.

[0.11.5]: https://github.com/Poliklot/bridge-design-methodology/releases/tag/v0.11.5
[0.11.4]: https://github.com/Poliklot/bridge-design-methodology/releases/tag/v0.11.4
[0.11.3]: https://github.com/Poliklot/bridge-design-methodology/releases/tag/v0.11.3
[0.11.2]: https://github.com/Poliklot/bridge-design-methodology/releases/tag/v0.11.2
[0.11.1]: https://github.com/Poliklot/bridge-design-methodology/releases/tag/v0.11.1
[0.11.0]: https://github.com/Poliklot/bridge-design-methodology/releases/tag/v0.11.0
[0.10.0]: https://github.com/Poliklot/bridge-design-methodology/releases/tag/v0.10.0
[0.9.0]: https://github.com/Poliklot/bridge-design-methodology/releases/tag/v0.9.0
[0.8.0]: https://github.com/Poliklot/bridge-design-methodology/releases/tag/v0.8.0
