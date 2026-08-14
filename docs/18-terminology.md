# BRIDGE terminology

This glossary defines the canonical terms used by BRIDGE 0.10. Use these meanings in design evidence, structured contracts, implementation notes, QA, and deviations.

## Usage rule

Human-facing explanations may be localized. Machine-readable layer tags, JSON field names, rule ids, enum values, and stable references remain in their canonical English form. A familiar word does not override its BRIDGE definition below.

## The six principles

| Term | BRIDGE meaning |
| --- | --- |
| **Breakpoints** | Declared responsive contexts: authored width anchors plus viewport-, container-, fluid-, intrinsic-, directional-, and capability-dependent rules. A breakpoint is not merely a screenshot or an inferred CSS media query. |
| **Roles** | The logical purpose of an element, display, action, or owner, derived from native source metadata first and explicit BRIDGE intent where needed. |
| **Identity** | A traceable mapping across role, template, design instance, runtime data, and target implementation. It is not one overloaded id. |
| **Dependencies** | Data, actions, targets, states, focus/history effects, capabilities, and inherited contracts required for an outcome to work. |
| **Geometry** | Reproducible exact, stepped, fluid, intrinsic, spatial, and temporal properties, including bounds, spacing, text metrics, ranges, and motion tracks. |
| **Exceptions** | Intentional, scoped exceptions to a source or contract rule with reason, impact, mitigation, owner, evidence, and review. A responsive transformation or implementation deviation is not automatically an exception. |

## Source and contract surfaces

| Term | Meaning |
| --- | --- |
| **Design/source evidence** | The versioned source file, page, node, component, native metadata, fixture, prototype, annotation, or asset that demonstrates authored intent. Figma is one possible source, not a requirement of the methodology. |
| **Root** | The top-level source object for a page, view, responsive context, or standalone section. |
| **Stable layer name** | A human-visible English `kebab-case` design anchor that does not encode viewport width, device label, or runtime list position. |
| **Short layer tag** | A canonical bracketed marker such as `[page=catalog]`, `[href=/catalog]`, or `[item=product]` used only for concise intent that must remain visible in the layer tree. |
| **Structured `bridge` metadata** | Namespaced data for relationships too rich for layer names: identity mappings, data displays, responsive transformations, reactions, motion, accessibility, capabilities, lifecycle, questions, and exceptions. |
| **BRIDGE Contract** | The versioned, target-independent combination of source evidence, short anchors, structured metadata, requirements, and acceptance criteria delivered to implementation and QA. |
| **Required envelope** | A complete payload rooted at `bridge` with supported version fields plus `source`, `context`, and `identity`; applicable modules are added inside that envelope. |
| **Module fragment** | A non-standalone excerpt such as `{ "bridge": { "data": … } }` used to explain one module. It must be inserted into the required envelope before exchange or validation as a complete contract. |
| **Requirement** | A stable, scoped statement of behavior or quality whose result can be verified. |
| **Acceptance criterion** | An observable condition that determines whether a requirement passes in a declared context. |
| **Evidence** | A linkable source, contract, implementation, test, measurement, or review artifact that supports a requirement result. |
| **Revision** | An immutable version of source, contract, implementation, or evidence pinned to a lifecycle decision. |

## Identity and references

| Term | Meaning |
| --- | --- |
| **`bridgeKey`** | The stable contract reference for one logical authored element. It links records but does not replace the five identity dimensions. |
| **Role** | What the element does, for example navigation, product data item, status, or form field. |
| **Template** | The reusable component or section definition that owns structure and inherited behavior; identified by `templateKey` where needed. |
| **Design instance** | One authored occurrence and its source nodes in declared contexts; identified by `designInstanceKey`. |
| **Runtime data** | The collection, stable record-key rule, and optional fixture binding used when real data is rendered; `runtimeDataKey` is never an array position. |
| **Target implementation** | The component, native control, view, route, entity, or locator that realizes the contract on a target platform. |
| **Interaction target** | A modal, state, form, route, or element reached by a reaction through a stable BRIDGE reference. It is distinct from the target-implementation mapping. |
| **`[item=…]` value** | A repeatable item role/type, for example `[item=product]`. Sibling items may intentionally use the same value. Their unique authored and runtime identities come from the stable layer name/`bridgeKey`, `designInstance`, and `runtimeData`, not from `[item]`. |
| **Fixture key** | A stable authored sample binding used to reproduce a scenario. It may identify the oak-chair example, but it must not be treated as the production record key. |

## Responsive and variation language

| Term | Meaning |
| --- | --- |
| **Responsive context** | A named layout context with a declared viewport or container driver and any relevant variation axes. |
| **Breakpoint anchor** | A prepared width represented by a root `[bp=…]`. It is an authored reference point, not automatically a CSS boundary. |
| **Same-tree default** | The rule that logical elements, meaning, actions, data relationships, and accessibility semantics remain equivalent across responsive contexts unless a transformation declares otherwise. |
| **Structural transformation** | A declared mapping between `fromContext` and `toContext` when topology or presentation model changes. It records conditions, source/target mapping, preserved semantics, order, state transfer, history, reverse behavior, and fallback. It is not an exception. |
| **Stepped behavior** | A discrete rule that changes at an explicit condition. |
| **Fluid behavior** | A value derived continuously between declared minimum, preferred, and maximum bounds. |
| **Intrinsic behavior** | Layout determined by content, available space, or a target-native primitive rather than a fixed width. |
| **Variation axis** | A user, content, environment, or product dimension such as locale, theme, direction, writing mode, role, data state, input, motion preference, or capability. |
| **Direction and writing mode** | The declared `ltr`/`rtl` and horizontal/vertical writing context, including logical order/properties and explicit mirror versus non-mirror decisions. |
| **Bidirectional content** | Mixed-direction text such as Arabic labels with Latin ids, numbers, dates, or SKUs that needs isolation, ordering, formatting, chart-axis, keyboard-order, and test-fixture decisions. |

## Content, data, and visualization

| Term | Meaning |
| --- | --- |
| **Authored content** | Copy or media whose approved value is part of the design/source contract. |
| **Runtime data** | Values supplied by a service, CMS, user, device, or target environment after implementation. |
| **Data display** | A table, grid, list, card collection, chart, map, metric, or other presentation that answers a declared question from structured data. |
| **Data schema** | Field types, stable keys, nullability, relationships, and cardinality expected by a display or reaction. |
| **Fixture** | Versioned sample data for a normal, boundary, failure, localization, direction, privacy, or accessibility scenario. |
| **Provenance** | Dataset/source, accountable owner, aggregation, refresh behavior, limitations, privacy, and last-updated information needed to interpret values. |
| **Data state** | A distinguishable condition such as `loading`, `empty`, `partial`, `stale`, `error`, `offline`, or `unauthorized`, with feedback and recovery where applicable. |
| **Format semantics** | Locale, unit, currency, time zone, precision, rounding, sign, range, and missing/zero/estimated rules that affect meaning rather than decoration. |
| **Accessible equivalent** | A table, list, summary, detail view, or download that exposes the essential values and conclusion of a complex visual without relying on color, hover, canvas, or animation alone. |

## Interaction and state

| Term | Meaning |
| --- | --- |
| **Reaction** | A versioned response to an event, including preconditions, state change, effects, outcomes, focus, announcements, and history behavior. |
| **State machine** | A bounded model of reachable states and deterministic transitions for a component, form, flow, or page. |
| **View** | A page- or data-level presentation such as default, loading, empty, or error. It is not a substitute for a complete state machine. |
| **Event** | The user, system, data, time, or history occurrence that requests a transition. |
| **Guard** | A condition that permits, rejects, or redirects a transition. |
| **Effect** | Work caused by a transition, such as a request, storage update, focus move, announcement, or navigation. |
| **Outcome** | A named success, empty, invalid, failure, timeout, cancellation, or conflict result and its next state. |
| **Async policy** | Rules for pending feedback, concurrency, duplicate events, cancellation, timeout, stale responses, retry, rollback, and recovery. |
| **Focus contract** | Initial focus, order, movement, restoration, visibility, and announcement behavior across a transition. |
| **History contract** | URL path/query/hash/storage plus push/replace, Back/Forward, refresh, deep-link, scroll, and focus-restoration behavior. |

## Motion and long scroll

| Term | Meaning |
| --- | --- |
| **Motion sequence** | A purposeful set of stable states joined by declared timing or progress rules. |
| **Driver** | The source of progress, such as time, document scroll, container scroll, drag, media time, or state transition. |
| **Timeline/track** | The ordered ranges and property changes driven through a sequence. |
| **Scene** | A meaningful stable state or interval in a longer sequence. |
| **Sticky/pinned region** | Content held within declared containing bounds while layout space, scroll ownership, focus, and fallback remain defined. |
| **Reverse/re-entry policy** | What happens when progress moves backward, the user returns, input changes rapidly, or a sequence is interrupted. |
| **Reduced-motion alternative** | A static or shorter behavior that preserves task, content, state, and focus while removing problematic travel, parallax, or looping. |
| **Motion fallback** | The semantic result used when the driver or target capability is unsupported; completion must not depend only on an animation-end event. |

## Accessibility

| Term | Meaning |
| --- | --- |
| **Accessibility profile** | The target standard/version/level and the semantic, input, visual, media, motion, responsive, and QA requirements for the delivered scope. BRIDGE 0.10 uses WCAG 2.2 Level AA as its default web profile. |
| **Conformance target** | The standard a complete implementation aims to meet. It is not a conformance claim for a mockup, isolated component, automated score, or unfinished process. |
| **Accessible name/description** | The programmatically exposed label and supporting explanation for an element; visible text, label-in-name, and repeated-control context remain aligned. |
| **Reading order** | The semantic order in which content relationships are exposed, independent of purely visual placement. |
| **Focus order** | The keyboard/assistive-technology traversal order through operable content. It must remain logical and visible and may differ from reading order only intentionally. |
| **Live status** | A meaningful dynamic update announced without unexpectedly moving focus. |
| **Reflow** | Preservation of content and functionality at required zoom and narrow equivalent width without unjustified two-dimensional scrolling. |
| **Target size** | The operable pointer area, including applicable WCAG exceptions and any stronger product/platform requirement. |

## Capabilities and performance

| Term | Meaning |
| --- | --- |
| **Target profile** | A named platform/runtime and input, output, layout, media, network, storage, memory, and power capability context. |
| **Capability** | A target feature the contract may rely on only when support or a tested alternative is declared. |
| **Essential experience** | Content, task, media meaning, and outcome that must survive degradation even when visual fidelity or advanced effects cannot. |
| **Fallback** | A planned safe alternative used for an unsupported, unresolved, failed, or constrained condition. A fallback is not automatically a deviation. |
| **Degradation** | The intentional transition to a reduced but usable experience under low bandwidth, offline, data saver, low power, memory pressure, missing API/codec, or similar conditions. |
| **Performance budget** | A measurable limit with metric, unit, owner, target environment, measurement point, and evidence. |
| **Art direction** | The crop, focal/safe area, aspect, resolution, format, quality, poster/preview, and source selection needed to preserve media meaning. |
| **Virtualization threshold** | The declared data volume after which rendering/windowing strategy changes while identity, order, focus, selection, and accessibility remain correct. |

## Lifecycle and governance

| Term | Meaning |
| --- | --- |
| **Lifecycle** | The traceable chain from design to contract, implementation, QA, release, operation, and feedback. |
| **Gate** | A design, contract, implementation, QA, or release decision with scope, revisions, evidence, owners, and an explicit result. |
| **Handoff** | Delivery of the accepted source and contract to implementation; it is one lifecycle transition, not the end of responsibility. |
| **BRIDGE-ready** | Explicit enough for the affected gate to proceed without inventing behavior and without untracked unknowns. |
| **Open question** | A known `unknown`, `unsupported`, or `TBD` decision with stable id, exact scope, owner, blocking status, due/review point, safe fallback, status, and eventual decision link. |
| **Blind spot** | Relevant meaning or uncertainty that is absent from the versioned source/contract and exists only in chat, speech, memory, or an unlinked task. “No blind spots” means no untracked unknowns, not that every answer is already known. |
| **Exception** | An approved exception to a methodology, source, or contract rule, recorded before implementation relies on it. |
| **Deviation** | An intentional, reviewed mismatch between an accepted contract and the implementation or supported target. It records requirement, scope, difference, reason, impact, mitigation, owner, status, evidence, and review date as applicable. |
| **Mitigation** | A verified measure that reduces the user, accessibility, data, security/privacy, performance, or maintenance impact of an exception or deviation. |
| **Traceability** | The ability to follow a stable requirement or identity across source, contract, implementation, tests, questions, deviations, and release revisions. |

## Validation and reporting

| Term | Meaning |
| --- | --- |
| **Automatic check** | A deterministic test with a reproducible pass/fail result. |
| **Heuristic check** | A tool finding that identifies a likely risk and requires human judgment. |
| **Manual check** | A semantic, product, visual, accessibility, or target-specific review by a qualified person. |
| **Runtime check** | A measurement or observation in a declared implementation environment. |
| **Validator** | A tool that evaluates only the rules represented in its declared coverage; a clean report is not complete BRIDGE or WCAG validation. |
| **Severity** | The reporting priority `error`, `warning`, or `info`; it does not replace gate status. |
| **Gate status** | `pass`, `pass with accepted deviations`, `blocked`, or a precisely justified `not applicable` decision for a reviewed scope. |

## Writing and naming

- Keep machine-readable names, tag values, ids, references, enum values, and JSON fields in canonical English.
- Keep stable design identities in English `kebab-case`; use localized product copy for visible labels.
- Do not use “breakpoint” as shorthand for every responsive decision, “state” as shorthand for every screenshot, or “exception” as shorthand for every difference.
- Distinguish a responsive transformation, safe fallback, source/contract exception, and implementation deviation.
- Distinguish a design fixture from runtime data and a `bridgeKey` from a target-platform locator.
- Distinguish handoff, implementation, QA, release, and asset export: they are different lifecycle operations.
