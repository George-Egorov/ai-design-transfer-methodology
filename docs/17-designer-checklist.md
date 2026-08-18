# Designer checklist before handoff

Use this short checklist before handing a design to a developer, an AI agent, or an automated implementation tool. The goal is simple: another person should understand the file without a call with its author.

For a strict review, use the [full preflight checklist](08-preflight-checklist.md).

## Choose the review scope first

For a full BRIDGE page, continue with the numbered page checklist below. For one new section inside a legacy host, use this section path instead of inventing page metadata:

- [ ] The selected boundary is a source root with `[section=<stable-id>]`; it has no fake `[page]`, `[bp]`, `[view]`, or `[route]`.
- [ ] One root declares one requested context. Responsive comparison uses only two or more explicitly selected roots with that same section id.
- [ ] The selected subtree satisfies the applicable identity, structure, content, asset/decor, interaction, component, and state items below.
- [ ] Targets inside the selected roots resolve locally; complete valid `http:`, `https:`, `mailto:`, and `tel:` hrefs are authored-resolved, while malformed external values block; only references requiring file/host lookup outside the roots are deferred.
- [ ] An exact `[section=id] [asset]` root may be the selected opaque whole visual with layout N/A; a section below a different asset ancestor is Blocked. `[decor]` remains traversed. A selected-root `INSTANCE` is Partial; an ordinary descendant instance is a trusted atomic boundary and does not lower Ready.
- [ ] **Check selected section** reports Ready, Partial, or Blocked for the section source only; the result is not presented as page/product/WCAG readiness.

See the [selected-section preflight profile](08-preflight-checklist.md#selected-section-profile-for-a-legacy-host). Page-only checklist items remain out of this audit scope; do not mark them passed.

## 1. Identify the page

- [ ] Each root frame has stable `[page]`, `[bp]`, and `[view]` values.
- [ ] The root is direct on the Figma page or organized only by native Figma Sections; no ordinary outer `FRAME`/`GROUP` stands between the Figma page and the root.
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

- [ ] Every page root and frame-built section uses native Auto Layout, even with zero or one child.
- [ ] A BRIDGE page root never carries `[asset]`; only genuine descendant visuals may create opaque asset boundaries.
- [ ] Every generic content container with at least two visible meaningful direct flow children uses native Auto Layout.
- [ ] Related elements have a meaningful frame/component parent; no Figma `GROUP` exists outside an opaque `[asset]` subtree.
- [ ] Primitive and leaf geometry is exempt; a descendant `[asset]` root remains one item in its parent's Auto Layout.
- [ ] `[decor]` marks only the exact intended absolute visual layer and never excuses a freeform container or GROUP.
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
- [ ] Intended absolute decorative visual layers use `[decor]` on the exact positioned node.
- [ ] Whole exported visuals use `[asset]`; complex decorative assets use `[decor] [asset]`.
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
