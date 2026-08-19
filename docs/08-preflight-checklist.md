# Full BRIDGE preflight

Use this gate before implementation begins and again before release. It evaluates the complete BRIDGE 0.11 transfer: source design, structured contract, target capability profile, implementation evidence, QA, open questions, and deviations.

The shorter [designer checklist](17-designer-checklist.md) is a preparation aid. It does not replace this gate.

## Gate stages and evidence

Run the same checklist at four stages:

| Gate | Required result |
| --- | --- |
| Design | The source and fixtures expose all applicable intent without private explanation. |
| Contract | The versioned `bridge` envelope is valid, references resolve, and implementation can start without inventing behavior. |
| Implementation | Every accepted requirement maps to target behavior, code, or an approved deviation. |
| QA/release | Observable outcomes pass in declared contexts; evidence and active deviations are linked to the release. |

Classify evidence as:

- **automatic** — deterministic source, schema, or implementation check;
- **heuristic** — a tool identifies a suspicious case for human judgment;
- **manual** — product, semantic, visual, accessibility, or target-specific review;
- **runtime** — measurement in a declared implementation environment.

Mark an item `not applicable` only with a scope-based reason. An omitted module must not mean “nobody checked.”

## Immediate blockers

The affected scope cannot pass its gate when any of these applies:

- an important element, context, requirement, target, or source revision cannot be identified;
- role, template, design instance, runtime data, and target implementation are collapsed into an ambiguous or positional id;
- a required action or link has no known destination, reaction, or reachable target;
- runtime data meaning, provenance, key, format, state, or privacy behavior must be invented;
- responsive topology differs without a complete declared transformation;
- a page root or frame-built section has native Auto Layout disabled;
- a generic Auto Layout-capable container with at least two visible meaningful flow children has Auto Layout disabled;
- a Figma `GROUP` exists outside an opaque `[asset]` subtree; a documented manual-layout deviation does not suppress the blocker;
- an essential task or content disappears in a breakpoint, capability, reduced-motion, RTL, offline, or failure context without a mapped alternative;
- a form or async path lacks validation, pending, failure, recovery, focus, or announcement behavior;
- applicable WCAG 2.2 A/AA requirements have no implementation path or safe fallback;
- an essential target capability is unsupported without a verified fallback;
- an `unknown`, `unsupported`, or `TBD` decision exists only in speech, chat, an unlinked task, or memory;
- a blocking open question is unresolved, or its fallback is unsafe, inaccessible, misleading, destructive, or untestable;
- an exception or implementation deviation lacks scope, impact, mitigation, owner, evidence, approval, or review date;
- contract, source, implementation, and QA revisions cannot be traced to one release.

## 1. Scope, contexts, revisions, and owners

- [ ] The transfer unit—page, flow, section, or component—has a stable `transferId` and explicit scope.
- [ ] Page, route when known, view, locale, direction, writing mode, theme, experiment, role, data scenario, and target profile are declared as applicable.
- [ ] Source file/page/node references and an immutable source revision are pinned.
- [ ] `contractVersion`, `methodologyVersion`, and `rulesVersion` match supported versions.
- [ ] Contract revision and target build/revision are linked.
- [ ] Design, contract, implementation, QA/accessibility, and deviation approval have accountable owners.
- [ ] Requirements and acceptance criteria have stable ids and evidence locations.
- [ ] Unprepared context combinations inherit deterministically or are explicit open questions.

## Selected-section profile for a legacy host

Use this profile when the surrounding file/product is not BRIDGE and the transfer unit is one new section. It narrows evidence; it does not waive local BRIDGE requirements or convert the host page to BRIDGE.

### Boundary and evidence

- [ ] Every selected root resolves to the same explicit `[section=<stable-id>]`; an untagged frame is not silently accepted.
- [ ] No selected section sits below a different opaque `[asset]` ancestor. An exact `[section=id] [asset]` root is allowed only as the selected opaque whole visual; an inherited asset boundary makes the scope Blocked before traversal.
- [ ] The section carries no invented `[page]`, `[bp]`, `[view]`, or `[route]` tags. A selected page root is reviewed with **Check page**, not this profile.
- [ ] `bridge.context.scope` records `kind: section`, `boundary: selected-subtree`, `assetBoundary: none|selected-root-opaque`, the root identity, host status, selection mode, context ids, and `readinessClaim: section-source-only`.
- [ ] Source document, selected node(s), layer paths, and immutable revision are pinned.
- [ ] One selected root declares one requested context. Two or more explicitly selected roots share the same section id and declare the variants to compare; legacy siblings are not discovered implicitly.
- [ ] A context label inferred from selected root/container width is marked `labelSource: inferred-from-selected-root-width` rather than presented as authored intent.

### Required inside the selected subtree

- [ ] The editable section root and every eligible local content container satisfy the native Auto Layout rules; no non-asset `GROUP` remains.
- [ ] An exact selected-root `[asset]` stops internal traversal and makes layout N/A while keeping that root as one flow item; `[decor]` alone remains traversed and is valid only on the intended visual layer.
- [ ] A selected section root that is itself an `INSTANCE` is reported as a Partial source boundary. Ordinary descendant instances are trusted atomic boundaries: their internals are not applicable to this traversal, they do not lower Ready, and they are never detached to make the result look complete.
- [ ] Stable identities are unique inside each declared selected context; local syntax, content, overflow, components, actions, and targets are reviewed.
- [ ] Targets located inside the selected roots resolve locally. Complete valid `http:`, `https:`, `mailto:`, and `tel:` hrefs are authored-resolved; incomplete or malformed external values are blocking syntax errors, not Deferred. Internal routes/anchors, modal/state/form/reset targets, components, and data requiring lookup outside the roots are listed in `externalDependencies` with owner, status, and a file/integration review point.
- [ ] When selected variants were requested, their identity/type, logical tree/cardinality, parentage, product text, and visual-intent policy are compared. An unrequested variant is `not requested`, not a missing breakpoint.

### Deferred or global evidence

Do not count the following as passed by a selected-section check: host page-root structure, page/view/route completeness, required page breakpoint roots, global identity uniqueness, outward route/anchor/modal/state/form resolution, parent placement and clipping/stacking/sticky behavior, page landmarks and full reading/focus order, complete journeys, runtime behavior, performance, production accessibility, or WCAG conformance. Record the relevant item as `deferred`, `unverified-external`, or `not evaluated: requires host/page evidence`, then run the separate file/integration and implementation gates.

### Section result

- **Ready** — the selected source has no error, warning/TODO, selected-root source gap, or deferred check in the declared scope. A single requested context may be Ready, and trusted descendant instances do not lower it.
- **Partial** — there is no blocking local error, but a warning/TODO, selected-root `INSTANCE`, deferred file-resolved reference, or indistinguishable selected context remains.
- **Blocked** — the tagged boundary is missing/invalid or lies below an inherited opaque asset boundary, selected roots are nested or use different section ids, or any blocking local finding remains.

All three statuses are scope-qualified. “Ready” means **section source ready for the declared selected contexts** and never page-, product-, implementation-, or WCAG-ready. Exact automated coverage is published separately in the [selected-section manifest](../validator/section-check-coverage.json).

## 2. Identity and source mapping

- [ ] Important authored elements have stable English `kebab-case` design identities or an allowed fallback tag.
- [ ] Width/device suffixes such as `-375`, `-mobile`, and `-desktop` do not appear in logical identities.
- [ ] `bridgeKey` references are unique in scope and resolve.
- [ ] Role, `templateKey`, `designInstanceKey`, runtime record-key rule, and target mapping are distinct where needed.
- [ ] `[item=...]` describes a repeatable item role/type and may repeat; it is not the unique fixture or runtime record identity.
- [ ] Design fixtures have stable design identities that survive reordering; runtime records use a stable product key rather than array position.
- [ ] Every declared source node exists in its context and maps to the expected logical element.
- [ ] Interaction targets use stable BRIDGE references and are not confused with target-implementation locators.
- [ ] `[decor]` and `[asset]` remain policy flags; they do not replace a stable design identity.

See [Layer naming and identity](02-layer-naming-and-identity.md) and the [transfer contract](04-transfer-contract.md).

## 3. Source structure, components, and wrappers

- [ ] Each page root is either a direct child of the Figma page or reached only through native Figma `SECTION` canvas organizers. Organizer Sections carry no inherited BRIDGE context and do not replace the root; ordinary outer `FRAME`/`GROUP` wrappers are not transparent.
- [ ] Every BRIDGE page root uses native Auto Layout even with zero or one child; the root cannot declare itself `[asset]` to bypass the check.
- [ ] Every frame-built section uses native Auto Layout even with zero or one child, except a narrowly legitimate whole-visual `[asset]` section with no live content flow.
- [ ] Every generic Auto Layout-capable container with at least two visible meaningful direct flow children uses native Auto Layout.
- [ ] Primitive and leaf geometry is exempt; an opaque `[asset]` subtree may keep its internal composition, while its root remains one child in the parent's Auto Layout.
- [ ] No Figma `GROUP` exists outside an `[asset]` subtree. `[decor]` is not an exemption; manual-layout plus reason documents a deviation but leaves the finding blocking.
- [ ] Related elements use meaningful frames, components, Auto Layout, constraints, and clipping in the source tool.
- [ ] Layer tags do not duplicate node type, geometry, component source, variants, or other native source metadata.
- [ ] Each wrapper has a grouping, layout, clipping, surface, semantic, export, or interaction responsibility.
- [ ] Page-level reusable sections come from `Page Sections` or use an explicit `[section=...]` when the source is ambiguous.
- [ ] The source root of every `Page Sections` component satisfies the section Auto Layout rule in a separate source audit; Page Check 0.9 neither resolves the source from a placed INSTANCE nor treats instance internals as editable page structure.
- [ ] UI controls inherit a pinned component/template contract; instance overrides are intentional and visible.
- [ ] Component states are not modeled as unrelated page roots, and page/data views are not hidden inside one component variant.
- [ ] Detached component copies, flattened assets, rasterized text, and hidden source-of-truth layers have explicit reasons or are removed.
- [ ] Component/system inheritance and instance-specific overrides do not contradict each other.

An intended absolute ornament carries `[decor]` on that exact absolute visual node. `[decor]` does not legalize a freeform container or subtree. Use `[decor] [asset]` for a complex decorative visual transferred as one opaque unit, and `[bridge-exception=overlay] [reason=...]` only for an intentional overlay that needs documented intent.

## 4. Responsive, fluid, container, and directional behavior

- [ ] Prepared roots use `[bp=...]` as authored width anchors, not inferred media-query boundaries.
- [ ] Same logical tree, meaning, actions, data relationships, and accessibility semantics are the default across contexts.
- [ ] Viewport, container, content/intrinsic, and capability drivers are distinguished.
- [ ] Stepped conditions and fluid min/preferred/max ranges cover values between authored frames.
- [ ] Each topology or presentation change has `fromContext`, `toContext`, condition, complete mappings, and preserved semantics.
- [ ] A transformation defines reading/focus order, action and validation parity, state/selection transfer, scroll, URL/history, reverse transition, and fallback.
- [ ] Important content is relocated or disclosed through a reachable mapping rather than silently removed.
- [ ] Collection cardinality and runtime record identity do not change to fill a responsive grid.
- [ ] Sticky/fixed UI reserves space and does not obscure anchors, content, errors, or focus.
- [ ] Safe areas, nested scroll ownership, viewport units, orientation, and on-screen keyboard behavior are covered where relevant.
- [ ] Supported `ltr`, `rtl`, bidirectional text, and writing modes have logical start/end, icon mirroring, mixed-value, chart-axis, reading-order, and keyboard-order decisions.
- [ ] QA includes anchors, just above/below steps, intermediate widths, nested containers, zoom/reflow, long content, and direction fixtures.

See [Responsive and adaptive behavior](03-responsive-breakpoints.md) and [Variation axes](16-variation-axes.md).

## 5. Content, runtime data, tables, and visualization

- [ ] Authored copy is separated from runtime fields and from presentation-only labels or annotations.
- [ ] Each runtime display defines purpose, schema, stable key rule, nullability, relationships, and cardinality.
- [ ] Source owner, dataset, aggregation, refresh, staleness, limitations, privacy, suppression, and last-updated behavior are explicit.
- [ ] Locale, currency, units, time zone, precision, sign, rounding, ranges, and missing/zero/estimated/not-applicable values are unambiguous.
- [ ] Loading, empty, partial, stale, error, offline, and unauthorized states have visible feedback and recovery as applicable.
- [ ] Sort, filter, pagination, virtualization, selection, bulk action, editing, drill-down, and export behavior are complete where present.
- [ ] Tables preserve caption/name, header relationships, comparison semantics, and narrow-width access.
- [ ] Charts/maps define dimensions, measures, domain, scale, baseline, aggregation, ordering, encodings, annotations, and interaction.
- [ ] Color, hover, canvas, SVG, or animation is not the only way to obtain status, values, or conclusions.
- [ ] A table, list, summary, detail, or download provides an appropriate accessible equivalent for complex data.
- [ ] Fixtures cover zero, one, typical, maximum/unknown, long, mixed-direction, missing, duplicate, outlier, partial, stale, failed, and restricted data as applicable.

See [Data and visualization](20-data-and-visualization.md).

## 6. Interactions, state machines, forms, focus, and history

- [ ] Navigation uses a real `[href=...]`; non-navigation behavior uses `[action=...]`; draft markers remain visible TODOs.
- [ ] Every nontrivial action resolves to a versioned reaction/state-machine record.
- [ ] States, events, guards, effects, pending behavior, outcomes, cancellation, timeout, retry, and concurrency are deterministic.
- [ ] Async race policy prevents a stale response from replacing newer state.
- [ ] Optimistic updates define rollback, conflict handling, and undo where applicable.
- [ ] Fields have stable binding, visible labels, instructions, value types, required status, autocomplete purpose, constraints, and error relationships.
- [ ] Validation timing, client/server authority, error summary, first-error focus, value preservation, duplicate submit, reset, and unsaved-change behavior are explicit.
- [ ] Dialogs, drawers, menus, popovers, and disclosures define initial focus, keyboard scope, Escape/close/outside behavior, nesting, scroll locking, and focus restoration.
- [ ] Hover, drag, swipe, long press, and multipoint input have keyboard/single-pointer alternatives where required.
- [ ] Dynamic insertion, deletion, filtering, permission change, and route change preserve or intentionally move focus and announce meaningful status.
- [ ] Path/query/hash/storage, `push` versus `replace`, Back/Forward, direct load, refresh, deep links, scroll, and focus restoration are declared.
- [ ] URLs and analytics do not expose secret or sensitive field values.

See [Interactions and targets](05-interactions-and-targets.md) and [State machines and reactions](22-state-machines-and-reactions.md).

## 7. Motion and long-scroll behavior

- [ ] Every sequence has a product purpose and meaningful stable states that work as still content.
- [ ] Driver, trigger, source, range, timing, easing, tracks, synchronization, and final state are declared.
- [ ] Long-scroll scenes define scroller, offsets, continuous/threshold mapping, sticky/pinned bounds, reserved flow space, and normal-flow fallback.
- [ ] Reverse, re-entry, rapid input, interruption, cancellation, resize, localization, dynamic content, route restore, and deep links are deterministic.
- [ ] Focused content is rendered and revealed immediately; completion does not rely only on an animation-end event.
- [ ] Reduced motion removes problematic travel/parallax/loops or replaces them with a static/short transition while preserving task, content, state, and focus.
- [ ] Users can pause, stop, or hide applicable moving/auto-updating content, and flashing remains below applicable thresholds.
- [ ] Unsupported animation, sticky, or timeline capabilities use the declared semantic fallback.

See [Motion and long scroll](21-motion-and-scroll.md).

## 8. WCAG 2.2 AA accessibility profile

- [ ] The complete implemented scope targets every applicable WCAG 2.2 Level A and AA criterion.
- [ ] Document title/language, language changes, landmarks, headings, lists, tables, labels, statuses, and reading order match meaning.
- [ ] Controls and fields have names that include visible labels; icon-only controls, repeated links, instructions, and errors are distinguishable.
- [ ] All functionality is keyboard operable without a trap; focus order is logical, visible, restored intentionally, and not obscured.
- [ ] Text and non-text contrast, non-color cues, 200% text resize, 320 CSS px equivalent reflow, text spacing, orientation, and sensory instructions are verified.
- [ ] Pointer targets meet the WCAG 2.2 AA minimum or an allowed exception; primary touch controls follow the stronger product target where declared.
- [ ] Drag and complex gestures have alternatives, and pointer down-event actions can be cancelled where applicable.
- [ ] Forms identify and suggest correction for errors, preserve repeated information, and support accessible authentication.
- [ ] Live status, time limits, captions, audio description, transcripts, autoplay, motion, and flashing satisfy applicable criteria.
- [ ] Complex images and data visualizations expose equivalent essential information.
- [ ] Each responsive transformation preserves name, role, value, state, relationships, task completion, focus, and help.
- [ ] Manual QA covers declared browser/platform/assistive-technology combinations, keyboard, screen reader, zoom/reflow, spacing, contrast modes, reduced motion, touch, RTL/bidi, data states, and transformations.
- [ ] No mockup, isolated component, automated score, or incomplete process is presented as a WCAG conformance claim.

See the [Accessibility profile](23-accessibility-profile.md).

## 9. Assets, capabilities, degradation, and performance

- [ ] Essential content, media, sequence, and task outcome are declared by design/product.
- [ ] Each target profile names platform/runtime, input/output capabilities, supported features, and unsupported-feature fallbacks.
- [ ] Images/video/animation define intrinsic dimensions, formats, quality, focal/crop safe area, art direction, poster/preview, priority, preload, and lazy policy as applicable.
- [ ] Expected and maximum data volume, page/window size, streaming, pagination, and virtualization threshold are explicit.
- [ ] Low bandwidth, offline, data saver, low power, reduced motion, missing API/codec, memory pressure, and interruption have usable degraded behavior where applicable.
- [ ] Loading priority does not hide essential text/actions behind nonessential media.
- [ ] Performance budgets name metric, limit, unit, owner, target environment, measurement point, and evidence.
- [ ] Security, privacy, legal, data integrity, accessibility, and essential task completion take precedence over visual fidelity.
- [ ] An unsupported or unknown capability is an owned open question rather than a silent adapter assumption.

See the target/capability guidance in [Variation axes](16-variation-axes.md) and the [transfer contract](04-transfer-contract.md#target-capability-and-performance-profile).

## 10. Routes, content safety, and target dependencies

- [ ] `[route=...]` and `[route-pattern=...]` are used only for known production paths; unknown routes remain tracked questions rather than fake URLs.
- [ ] Internal routes and anchors resolve; external, email, and phone destinations use allowed schemes and opening behavior.
- [ ] Modal, state, form, section, and anchor dependencies resolve inside the accepted scope or an explicitly linked external contract.
- [ ] Authentication and permission views do not treat visual hiding as authorization.
- [ ] Sensitive, private, legal, and user-generated data have exposure, redaction, retention, and failure behavior as required by the product.
- [ ] Target-native safety, platform semantics, and security constraints are documented when they override visual source evidence.
- [ ] Analytics, experiments, and persisted state have approved ownership and do not change product behavior invisibly.

## 11. Open questions, exceptions, deviations, and lifecycle

- [ ] Every open question has stable id, exact scope, question, owner, blocking status, due date or review gate, safe fallback, and status.
- [ ] Answered/closed questions link the decision and update affected source, contract, implementation, and tests.
- [ ] An exception records an intentional source/contract rule exception; a deviation records implementation variance from the accepted contract.
- [ ] Each exception/deviation references the affected requirement and exact context.
- [ ] Impact covers user, accessibility, data, security/privacy, performance, and maintenance as applicable.
- [ ] Alternatives, mitigation, accountable owner, approver, evidence, status, and review/expiry date are recorded.
- [ ] A deviation that fails WCAG 2.2 AA is not described as conforming.
- [ ] Temporary deviations return to verification and close only after contract and implementation converge and tests pass.
- [ ] Source changes after contract acceptance create a new revision or are proven non-semantic.
- [ ] Runtime findings feed back into canonical source, contract, components, fixtures, and regression tests.

See the [Delivery lifecycle](24-delivery-lifecycle.md).

## 12. Validation coverage and evidence

- [ ] The canonical tag registry, JSON Schema, rule catalog, localization, examples, content manifest, and coverage manifests validate.
- [ ] Page Check scope is represented honestly: plugin 0.9.2 has an exact emitted-rule union of 42 of 107 rules—40 automatic and 2 heuristic.
- [ ] **Check selected section** is represented separately: its exact emitted-rule union is 26 rules—24 automatic and 2 heuristic; 20 local and 6 selected-variant.
- [ ] Rules outside each declared union have structured, heuristic, manual, implementation, or runtime evidence according to the coverage manifest; the two counts are not added because the scopes overlap.
- [ ] A clean Page Check report is not presented as full BRIDGE or WCAG validation.
- [ ] Automatic, heuristic, manual, and runtime results name environment, expected result, actual result, and evidence.
- [ ] Every applicable acceptance criterion is `pass`, `fail`, `not-applicable`, `blocked`, or linked to an accepted deviation.
- [ ] High-risk behavior has repeatable regression coverage.
- [ ] The release pins source, contract, rule/schema, target build, QA evidence, open-question, and deviation revisions.

## Gate decision record

Record one decision for the reviewed scope:

- **pass** — all applicable criteria pass and no blocker remains;
- **pass with accepted deviations** — deviations are approved, mitigated, evidenced, and reviewable;
- **blocked** — an unresolved requirement, question, failure, or unsafe fallback prevents transfer/release;
- **not applicable** — only for a precisely excluded scope, never for an unreviewed area.

The decision must name scope, revisions, reviewers, date, remaining questions, active deviations, evidence, and the next review point. If an implementation-critical answer still requires private verbal context, the gate is blocked.
