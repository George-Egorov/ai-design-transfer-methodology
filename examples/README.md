# BRIDGE by example

This is a catalog of short recipes. Each starts with a problem, contrasts a bad and good version, and explains one rule only.

If BRIDGE is new to you, begin with the [designer quick start](../docs/00-designer-quick-start.md).

| Example | Use it when |
| --- | --- |
| [1. Page and breakpoints](#1-page-and-breakpoints) | connecting desktop, tablet, and mobile |
| [2. One element at different widths](#2-one-element-at-different-widths) | making layer names stable |
| [3. Page section](#3-page-section) | choosing between `[section]` and `Page Sections` |
| [4. Link or action](#4-link-or-action) | declaring the result of a click |
| [5. Control and modal target](#5-control-and-modal-target) | connecting a control to an existing target |
| [6. Meaningful structure](#6-meaningful-structure) | removing accidental wrappers |
| [7. Dynamic text](#7-dynamic-text) | preparing for CMS content and localization |
| [8. Content, decor, and asset](#8-content-decor-and-asset) | declaring how a visual should transfer |
| [9. Data display with real states](#9-data-display-with-real-states) | transferring a chart/table and its runtime contract |
| [10. Declared responsive transformation](#10-declared-responsive-transformation) | replacing a composition without losing semantics |
| [11. Async form reaction](#11-async-form-reaction) | covering validation, pending, errors, focus, and history |
| [12. Long-scroll story and reduced motion](#12-long-scroll-story-and-reduced-motion) | defining scenes, reverse/re-entry, and fallback |
| [13. End-to-end catalog delivery](#13-end-to-end-catalog-delivery) | tracing design through QA and a managed deviation |

## 1. Page and breakpoints

**Goal:** show two breakpoints of the same home page.

❌ Ambiguous:

```text
Desktop final
Mobile new
```

✅ Explicit:

```text
Home [page=home] [route=/] [bp=1440] [view=default]
Home [page=home] [route=/] [bp=375] [view=default]
```

`page` and `view` stay the same because the product page and state are the same. `bp` changes with width. `route` is present because the production route is known.

[Full rule: responsive breakpoints](../docs/03-responsive-breakpoints.md)

---

## 2. One element at different widths

**Goal:** connect one heading and CTA across desktop and mobile.

❌ Copies look like unrelated elements:

```text
// desktop
title-desktop
blue-button-1440

// mobile
title-mobile
blue-button-375
```

✅ Names express identity rather than appearance:

```text
// desktop and mobile
hero-title
primary-cta
```

Font, color, size, and position already live in Figma. The name identifies the same element at another breakpoint.

[Full rule: naming and identity](../docs/02-layer-naming-and-identity.md)

---

## 3. Page section

**Goal:** identify a hero section.

### Option A: ordinary frame

```text
Hero [section=home-hero]
```

The tag is needed because Figma does not know the frame's product section key.

### Option B: instance from `Page Sections`

```text
home-hero
```

No tag is needed on the instance: `section=home-hero` is inferred from the source section component. A button or card from the ordinary `UI Kit` does not automatically become a section.

[Full rule: Page Sections](../docs/14-components-and-ui-kit.md)

---

## 4. Link or action

**Goal:** declare the result of a click.

```text
email-link [href=mailto:sales@example.com]
menu-button [action=state:mobile-menu-open]
Mobile Menu Open [state=mobile-menu-open]
unknown-button [control]
disabled-button [action=none]
```

- navigation to a URL or anchor uses `[href=...]`;
- UI changes, modals, submit, and reset use `[action=...]`;
- an unknown destination or behavior temporarily uses `[link]` or `[control]`.

Every `[action=type:target-id]` target must exist in the handoff structure with the same id. Draft markers `[link]` and `[control]` are valid while work is in progress but remain TODOs before final handoff.

❌ Do not use `[href=#]` as a placeholder. `#faq` is a real target; `#` alone is not.

[Full rule: interactions](../docs/05-interactions-and-targets.md)

---

## 5. Control and modal target

**Goal:** show which modal a CTA opens.

❌ The action points nowhere:

```text
contact-button [action=modal:contact-modal]
```

✅ A matching target exists in the handoff structure:

```text
contact-button [action=modal:contact-modal]

Contact Modal [modal=contact-modal]
  modal-content
  close-button
```

The id after `modal:` must match `[modal=...]`. The modal component must define `close-button`, backdrop, and Escape behavior. Loading, error, and success states must not exist only in verbal instructions either.

[Full rule: targets](../docs/05-interactions-and-targets.md#modals-and-states)

---

## 6. Meaningful structure

**Goal:** group a hero heading, text, and controls.

❌ Accidental siblings and wrappers:

```text
hero
  Frame 18
    Frame 19
      hero-title
  hero-subtitle
  primary-cta
```

✅ Parents explain relationships:

```text
hero
  hero-copy
    hero-title
    hero-subtitle
  hero-actions
    primary-cta
    secondary-cta
```

`hero-copy` and `hero-actions` have clear jobs. A wrapper is unnecessary when it does not provide grouping, layout, clipping, a shared background, a target, or another real responsibility.

[Full rule: wrappers](../docs/06-wrapper-policy.md)

---

## 7. Dynamic text

**Goal:** prepare a card for real content.

❌ The design only works for one string:

```text
product-card (fixed height 280)
  product-title: "A very comfortable\nchair"
```

✅ Text wraps naturally and height follows content:

```text
product-card (Auto Layout, hug contents)
  product-title: "A very comfortable chair"
```

If fixed height and clipping are product decisions, declare the overflow policy and reason. Otherwise localization or CMS data will break the card.

[Full rule: height and overflow](../docs/07-height-and-overflow.md)

---

## 8. Content, decor, and asset

**Goal:** decide how three visual layers transfer.

```text
product-photo
glow [decor]
complex-illustration [decor] [asset]
```

- `product-photo` is a content image with stable identity;
- `glow [decor]` has no product or accessibility semantics;
- `complex-illustration [decor] [asset]` is decoration exported as one asset.

`[decor]` does not mean the layer may silently disappear on mobile, and `[asset]` does not replace a stable layer name.

[Full rule: image, decor, and asset](../docs/01-design-rules.md#4-image-decor-and-asset-mean-different-things)

---

## 9. Data display with real states

**Goal:** transfer a revenue display rather than a screenshot of ideal values.

The design supplies stable anchors and page states:

```text
Dashboard [page=dashboard] [route=/dashboard] [bp=1200] [view=default]
  Revenue [section=revenue-overview]
    period-filter
    revenue-chart
    revenue-table
    data-status

Dashboard Loading [page=dashboard] [route=/dashboard] [bp=1200] [view=loading]
Dashboard Empty [page=dashboard] [route=/dashboard] [bp=1200] [view=empty]
Dashboard Error [page=dashboard] [route=/dashboard] [bp=1200] [view=error]
```

The structured contract—not more layer tags—adds the question being answered, dataset/owner/refresh, month and currency fields, locale/time-zone/rounding rules, sort/filter behavior, partial and stale behavior, and `revenue-table` as the accessible value equivalent. QA fixtures cover missing months, negative values, a delayed partial response, stale data, long localized labels, and mixed-direction identifiers.

✅ A reviewer can distinguish zero from missing, find the last-updated status, operate the filter with a keyboard, and obtain every plotted value without relying on color or hover.

[Full rule: data and visualization](../docs/20-data-and-visualization.md)

---

## 10. Declared responsive transformation

**Goal:** turn a comparison table into disclosures only when its container is too narrow.

❌ Unexplained screenshots:

```text
// wide
comparison-table

// narrow
comparison-card-1
comparison-card-2
```

✅ The contract keeps `same-tree` as the default and declares one structural transformation:

> **Non-standalone fragment.** This excerpt shows only `bridge.responsive`. Insert it into the required `bridge` envelope from the [transfer contract](../docs/04-transfer-contract.md#required-envelope); required envelope fields are intentionally omitted here.

```json
{
  "bridge": {
    "responsive": {
      "defaultPolicy": "same-tree",
      "contexts": [
        { "id": "comparison-wide", "driver": "container", "width": 800 },
        { "id": "comparison-narrow", "driver": "container", "width": 480 }
      ],
      "transformations": [{
        "id": "comparison-table-to-disclosures",
        "fromContext": "comparison-wide",
        "toContext": "comparison-narrow",
        "when": { "driver": "container", "container": "comparison-panel", "condition": "max-width: 480px" },
        "mappings": [{ "source": ["comparison-table"], "target": ["comparison-disclosures"], "semantics": "same-records-and-fields" }],
        "preserves": ["headers", "values", "selection", "actions", "accessible-names"],
        "readingOrder": ["comparison-heading", "comparison-disclosures"],
        "focusOrder": ["comparison-disclosure-trigger"],
        "stateTransfer": "preserve-selection-and-open-record",
        "history": "no-new-entry"
      }]
    }
  }
}
```

Each row/column maps to a labeled disclosure field. Reading and keyboard order, omitted-detail path, focus when the condition changes, selection, and Back/Forward behavior are acceptance criteria. `ltr` and `rtl` fixtures decide logical order and which directional icons mirror.

[Full rule: responsive behavior](../docs/03-responsive-breakpoints.md#declared-structural-transformations)

---

## 11. Async form reaction

**Goal:** make “submit this lead form” implementable beyond the happy path.

```text
Lead Form [state=lead-form-idle]
  name [field=name] [name=name]
  email [field=email] [name=email]
  consent [field=consent] [name=consent]
  send [action=submit:lead-form]

Form Success [state=lead-form-success]
Form Error [state=lead-form-failure]
```

The state machine adds `idle`, `invalid`, `submitting`, `success`, and `failure`. It defines validation timing, the first-invalid-field focus, error summary announcement, duplicate-click policy, cancellation on route leave, value preservation, retry, and success focus. The form does not add a URL history entry; refresh after success follows a declared product decision.

✅ Test the client validation path, server field error, offline failure, timeout, rapid double submit, retry, route leave, and keyboard/screen-reader completion. A spinner and a success screenshot alone would leave most of the reaction unknown.

[Full rule: state machines and reactions](../docs/22-state-machines-and-reactions.md)

---

## 12. Long-scroll story and reduced motion

**Goal:** transfer a three-scene product explanation.

```text
Workflow Story [section=feature-story]
  story-visual
  scene-intro
  scene-compare
  scene-result
```

The structured motion sequence says that document scroll continuously drives three ranges, `story-visual` is sticky only inside `feature-story`, backward scroll derives the reverse state from current progress, a deep link initializes from current position, resize/localization recalculates the range, and a focused target is revealed immediately.

Reduced motion renders all three scenes as static sections in document order. Unsupported sticky/scroll-timeline behavior uses the same static fallback. Content, actions, completion state, and focus do not depend on `animationend`.

[Full rule: motion and long scroll](../docs/21-motion-and-scroll.md)

---

## 13. End-to-end catalog delivery

**Goal:** carry a product result from design evidence to a released implementation without losing unknowns.

### Design evidence

```text
Catalog [page=catalog] [route=/catalog] [bp=1200] [view=default]
  Product Results [section=product-results]
    catalog-filter-form
    results-heading
    product-grid [collection=products]
      product-card-oak-chair [item=product]
      product-card-wool-lamp [item=product]
    pagination

Catalog [page=catalog] [route=/catalog] [bp=360] [view=default]
  Product Results [section=product-results]
    catalog-filter-form
    results-heading
    product-grid [collection=products]
      product-card-oak-chair [item=product]
      product-card-wool-lamp [item=product]
    pagination
```

The layer names/`bridgeKey` values identify authored fixture occurrences, not record positions. The repeated `[item=product]` value classifies their shared role/type. The contract maps `templateKey=product-card`, `designInstanceKey=product-card-oak-chair`, `runtimeDataKey=sku:CHAIR-OAK-01`, and target `ProductCard` separately.

### Contract and open decision

Data states cover loading, empty, partial, stale, error, offline, and unauthorized. Filter reactions preserve values, replace the query history entry, cancel stale requests, and focus/announce the results heading. The capability profile declares square product art direction, image formats/dimensions, lazy loading after the first result window, 10,000 maximum records, server pagination, and a virtualization threshold.

The team does not yet know whether stale cached products may be opened offline. This is not hidden in chat: `OPEN-CATALOG-003` records scope `catalog/offline`, the product owner, blocking status, the contract-gate review date, and a safe read-only fallback.

### Implementation and QA

Implementation uses record `sku`, never card order. QA covers 1200 and 360 anchors, intermediate/container widths, 400% reflow, long Russian and RTL/bidirectional values, keyboard/screen reader, low bandwidth, offline, data saver, partial/error states, duplicate filter submission, Back/Forward, and image/data budgets.

### Managed deviation

The target comparison component cannot yet preserve multi-row selection in the declared disclosure transformation. The team keeps the semantic scrollable table temporarily. The deviation links the affected requirement, impact, mitigation, test evidence, product/accessibility approval, owner, and expiry. It is visible in the release record and is closed only after the intended transformation ships and is retested.

This is “no blind spots”: not every answer existed on day one, but every unknown and difference was explicit, owned, and testable.

[Full contract](../docs/04-transfer-contract.md) · [Delivery lifecycle](../docs/24-delivery-lifecycle.md) · [Accessibility profile](../docs/23-accessibility-profile.md)

---

## How to use this catalog

1. Find the situation closest to yours.
2. Copy the good structure, not its specific ids.
3. Check the same element in every breakpoint and state.
4. Open the full rule only for a disputed case.
5. Run the [preflight checklist](../docs/08-preflight-checklist.md) before handoff.
