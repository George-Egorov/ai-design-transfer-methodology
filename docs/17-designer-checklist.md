# Designer checklist before handoff

Use this short checklist before handing a design to a developer, an AI agent, or an automated implementation tool. The goal is simple: another person should understand the file without a call with its author.

For a strict review, use the [full preflight checklist](08-preflight-checklist.md).

## 1. Identify the page

- [ ] Each root frame has stable `[page]`, `[bp]`, and `[view]` values.
- [ ] `[route]` is present only when the real production route is known.
- [ ] Breakpoints of one page keep the same `[page]` and `[view]`.

## 2. Keep breakpoints logically equivalent

- [ ] Important elements exist at every required breakpoint.
- [ ] One logical element keeps one identity and one logical parent.
- [ ] Product copy, prices, legal text, and actions do not silently change.
- [ ] Collection cardinality is not adjusted to make the grid look full.

## 3. Classify sections

- [ ] Reusable page sections come from `Page Sections`.
- [ ] Ordinary interface components remain in `UI Kit`.
- [ ] Frame-built sections have an explicit `[section=...]`.
- [ ] Instances from `Page Sections` do not repeat a redundant section tag.

## 4. Use stable identities

- [ ] Important layer names use English `kebab-case`.
- [ ] Names do not contain viewport widths or device labels.
- [ ] Repeated design instances have distinct stable layer names/`bridgeKey` values; shared `[item=...]` values classify role/type only.
- [ ] No identity is reused for different logical types.

## 5. Keep technical truth in Figma

- [ ] Layer names do not duplicate node type, Auto Layout, constraints, clipping, or component source.
- [ ] BRIDGE tags express only product and transfer intent that Figma does not know.

## 6. Build meaningful structure

- [ ] Related elements have a meaningful parent.
- [ ] Every wrapper has a real layout, grouping, clipping, surface, or interaction purpose.
- [ ] One-breakpoint-only wrappers are explained.

## 7. Declare interactions

- [ ] Navigation uses `[href]`.
- [ ] Interface changes use `[action]`.
- [ ] Draft links and controls use `[link]` and `[control]`, not fake destinations.
- [ ] Every modal, state, and form action resolves to an existing target.

## 8. Prepare real forms and content

- [ ] Form fields have data names, labels, and relevant states.
- [ ] Dynamic text wraps without manual line breaks.
- [ ] Fixed text height has an explicit reason and overflow behavior.
- [ ] Long text, localization, and real CMS content have been tested.

## 9. Distinguish content, decor, and assets

- [ ] Content images have stable names.
- [ ] Decorative layers use `[decor]`.
- [ ] Whole exported visuals use `[asset]`.
- [ ] Editable text is not rasterized without an explicit reason.

## 10. Make states explicit

- [ ] Empty, loading, and error page states use `[view]`.
- [ ] Component states live in `UI Kit` variants or explicit state models.
- [ ] Hidden old versions are not part of the handoff tree.

## 11. Cover the full contract

- [ ] Runtime data has schema/key/source/format and loading, empty, partial, stale, error, offline, and permission behavior as applicable.
- [ ] Nontrivial actions have reaction paths for validation, pending, failure, retry, cancellation, focus, announcements, and history.
- [ ] Same tree is the responsive default; every structural change has an explicit semantic/focus/state mapping.
- [ ] Motion has stable scenes, reverse/re-entry, reduced-motion, and unsupported fallbacks.
- [ ] The implementation target and QA plan cover WCAG 2.2 AA, keyboard/focus, zoom/reflow, and supported RTL/bidirectional contexts.
- [ ] Target capabilities declare essential experience, media/data budgets, degradation conditions, and fallbacks.
- [ ] Every unknown/unsupported item has scope, owner, blocking status, review point, safe fallback, and status.
- [ ] Every deviation has impact, mitigation, evidence, approval, owner, and review date.

## Final test

Ask someone who did not prepare the file to identify the page, responsive contexts and transformations, reusable sections, interactions and states, data/provenance, motion fallbacks, accessibility expectations, target limitations, open questions, exported visuals, and deviations. If any answer exists only in speech or chat, it is an untracked blind spot and the design is not ready.
