# Changelog

All notable changes to the public BRIDGE methodology, schemas, rule catalog, and documentation are recorded here. The private Figma plugin has its own non-public implementation history; only its public coverage boundary is documented in this repository.

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

[0.10.0]: https://github.com/Poliklot/bridge-design-methodology/releases/tag/v0.10.0
[0.9.0]: https://github.com/Poliklot/bridge-design-methodology/releases/tag/v0.9.0
[0.8.0]: https://github.com/Poliklot/bridge-design-methodology/releases/tag/v0.8.0
