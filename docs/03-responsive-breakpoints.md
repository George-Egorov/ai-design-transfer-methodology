# Responsive and adaptive behavior

BRIDGE transfers responsive behavior as a set of declared contexts and rules—not as isolated desktop/mobile screenshots.

![Same-tree responsive behavior and an explicit structural transformation](../assets/diagrams/responsive-transformation.svg)

*Same logical tree is the default. A different composition is valid only through a declared transformation that preserves meaning and task completion.*

## Prepared root frames

Create roots for representative design contexts. They may be direct siblings on the Figma page or organized under native Figma Sections:

```text
home [page=home] [route=/] [bp=1440] [view=default]
home [page=home] [route=/] [bp=768] [view=default]
home [page=home] [route=/] [bp=375] [view=default]
```

```text
figma-page
├─ responsive-desktop                      // native Figma Section, organizer only
│  ├─ home [page=home] [bp=1440] [view=default]
│  └─ home [page=home] [bp=768] [view=default]
└─ home [page=home] [bp=375] [view=default] // direct root is also valid
```

Page Check descends through native Figma Sections while discovering roots and then compares the tagged root frames. It does not treat the organizer name, order, or nesting as product structure, and it does not descend through an ordinary outer `FRAME` or `GROUP` in place of a root.

`[bp]` records the authored frame width. It is evidence and a comparison anchor; it does not, by itself, prescribe a media-query boundary. Keep widths/device labels out of child identities.

Every prepared page root uses native Auto Layout at every breakpoint. Frame-built sections also use Auto Layout, and generic containers with at least two visible meaningful flow children do the same. Responsive differences may change Auto Layout direction, wrapping, gap, and sizing; they do not justify `layoutMode=NONE` or a non-asset Figma GROUP.

## Same logical tree is the default

Within one page, view, locale, theme, experiment, role, and data scenario, matching roots preserve:

- important logical elements and stable identities;
- semantic parent/child relationships;
- content and runtime-data meaning;
- actions, targets, form names, and state effects;
- collection schema/cardinality rules rather than the number that happens to fit a row;
- accessible names, relationships, reading order, and task completion;
- content/decor/asset policy.

The following may change without a structural transformation:

- dimensions, gaps, padding, alignment, and constraints;
- Auto Layout/flex/grid direction and column count;
- type size within the typography contract and natural wrapping;
- sibling visual order inside the same semantic parent when reading/focus order remains correct;
- declared visibility of optional presentation, without replacing it with another identity;
- sticky behavior, overflow, and geometry when their policy is defined.

“Same tree” means the same logical/semantic entities, not that an implementation must leave visually hidden duplicate DOM nodes. A hidden element may be absent from the rendered/accessibility tree while its contract identity and visibility rule remain traceable.

## Do not make cardinality responsive

A grid changing from four to two columns still represents the same result collection. Do not delete design fixtures to fill the last row:

```text
product-grid
  product-card-oak-chair
  product-card-wool-lamp
  product-card-steel-desk
  product-card-cork-stool
```

These are design fixture identities, not array positions. Runtime identity comes from a stable product record key. A different page/window of records requires an explicit pagination/query/data-scenario rule.

## Viewport and container contexts

Record the driver for each implementation rule:

- **viewport** when the whole application shell changes with the available window;
- **container** when a component changes according to its own allocated inline/block size;
- **capability** when behavior depends on input, hover, motion, color/contrast, safe area, or target support;
- **content/data** when intrinsic content or cardinality determines layout without a fixed boundary.

A reusable card grid should normally follow its container rather than assume the device. Declare the container identity, axis, named range/condition, and expected result. The target may implement this using the [CSS Containment specification](https://www.w3.org/TR/css-contain-3/#container-queries) or an equivalent platform facility.

Do not infer a breakpoint boundary merely as the midpoint between two Figma frames. A designer or implementation owner declares it after testing the transition range.

## Exact, stepped, and fluid properties

For every property decide whether it is:

1. **exact at an anchor** — the prepared frame value is an acceptance point;
2. **stepped** — switches at a declared viewport/container/capability condition;
3. **fluid** — follows a min/preferred/max rule across a declared range;
4. **intrinsic** — follows content, wrapping, grid fitting, or target-native layout;
5. **fixed by exception** — bounded for a stated product/platform reason.

A fluid contract records property, context/range, minimum, preferred relationship, maximum, rounding/snap behavior if visible, and behavior outside the range. It does not require a particular CSS formula; web targets may use mechanisms defined in [CSS Values and Units](https://www.w3.org/TR/css-values-4/), while other targets map the same intent natively.

Test the anchors, just above/below every step, several intermediate values, content extremes, zoom/reflow, and nested-container reuse. “Interpolate everything” is not a valid policy.

## Declared structural transformations

Sometimes the usable presentation really needs another composition:

- comparison table → labeled disclosure cards;
- persistent sidebar → modal/drawer navigation;
- multi-panel editor → sequential steps;
- pinned scroll story → static ordered sections;
- chart + legend → small multiples + data table.

This is not an ordinary breakpoint difference. Add a structured `responsive.transformations[]` record containing:

- transformation id and source/result identities;
- viewport, container, writing-mode, or capability condition;
- complete element/field/series/scene mapping;
- semantics and content that must remain equivalent;
- permitted omission and the path to omitted detail;
- reading, keyboard, and focus order;
- action, validation, selection, scroll, and state transfer;
- URL/history/deep-link behavior;
- accessible equivalent and reduced-motion fallback;
- reverse transition when the condition changes while the page is open.

If a source identity has no result mapping, record why its meaning is genuinely inapplicable. “There was no room” is not enough. An undeclared topology change is contract drift.

## Direction and writing mode

Locale is not sufficient to describe layout direction. Structured context may declare:

```json
{
  "direction": "rtl",
  "writingMode": "horizontal-tb"
}
```

Prepare and test `ltr` and `rtl`/bidirectional stress fixtures when the product supports them. Declare:

- whether the whole composition mirrors or only logical flow changes;
- logical start/end alignment and spacing instead of left/right assumptions;
- which icons mirror (back/forward, indentation) and which do not (brand marks, media controls, clocks, many real-world objects);
- mixed-direction names, phone numbers, identifiers, code, dates, and numeric values;
- chart axis direction, category order, legends, tooltips, and positive/negative meaning;
- semantic reading and keyboard order independent of visual mirroring;
- screenshots or fixtures covering long RTL copy and mixed Latin/digit runs.

`direction` and `writingMode` belong in structured context unless a tool has native properties. Do not create device-like flat tags for them. Follow the concepts in [CSS Writing Modes](https://www.w3.org/TR/css-writing-modes-4/) when targeting the web.

## Order and visibility

Visual reordering is allowed only when it preserves a logical reading and focus sequence. Do not use layout order to make keyboard focus jump unpredictably. A responsive implementation must also define focus when:

- the focused element becomes hidden;
- a sidebar becomes a dialog;
- a table becomes disclosures;
- resize/container change occurs while a state is open;
- browser history restores a different presentation.

Important content may not disappear solely because the viewport is small. Optional content may be disclosed or relocated through a mapped, reachable presentation.

## Wrappers, safe areas, and overflow

Prefer the same meaningful wrappers in all contexts. A context-only wrapper is either part of a declared transformation or an explicit structural exception with a real purpose such as clipping, scroll containment, overlay scope, semantic grouping, or target limitation.

Declare safe-area insets, reserved space for sticky/fixed UI, viewport-unit policy, on-screen keyboard behavior, and nested-scroll ownership where relevant. Focus indicators, validation messages, tooltips, and content must not be clipped accidentally.

## Responsive review gate

A transfer is ready only when:

- prepared roots have explicit, matching context axes;
- stable identities and meaning match by default;
- viewport and container drivers are not confused;
- step boundaries and fluid/intrinsic rules cover intermediate sizes;
- every topology change has a complete transformation mapping;
- data cardinality and runtime identity do not depend on columns or fixture order;
- LTR, RTL/bidirectional, writing mode, zoom, long content, and localization are covered as applicable;
- reading order, focus, actions, state, history, and accessibility survive every change;
- unsupported target capabilities have an owned fallback or explicit open question.
