# Components, UI Kit, and Page Sections

BRIDGE separates reusable library components into two levels:

- **UI Kit** — ordinary interface components;
- **Page Sections** — reusable page-level section blocks.

This separation prevents designers from repeating `[section=...]` on every section component instance and prevents page sections from being confused with buttons, cards, fields, and other UI components.

## Core rule

> An instance of a component from `Page Sections` is treated as a page section. An instance of a component from `UI Kit` is not treated as a page section.

A section component is identified by its source component, not by its position inside the page tree.

The editable source root of every component classified under `Page Sections` uses native Auto Layout even with zero or one child, unless the entire source root is a legitimate opaque whole-visual `[asset]` with no live content flow. A placed INSTANCE is an atomic page-tree boundary: Page Check 0.8 does not resolve its source or report its internals as page findings. Audit the source component separately by selecting an editable FRAME or COMPONENT tree; detaching the instance is not a workaround.

## Two library levels

The Figma library should separate ordinary UI components from page section components.

```text
UI Kit
  button
  input
  select
  checkbox
  tabs
  accordion
  product-card
  review-card
  icon-button

Page Sections
  header
  footer
  hero
  reviews
  faq
  product-slider
  catalog-preview
  cta
```

`UI Kit` contains the interface elements used to build screens.

`Page Sections` contains large reusable page blocks that may appear on different pages with different content.

## What this means on a page

If `footer`, `reviews`, or `product-slider` are instances of components from `Page Sections`, they stay clean on the page:

```text
footer
reviews
product-slider
```

Do not write:

```text
footer [section=footer]
reviews [section=reviews]
product-slider [section=product-slider]
```

The section meaning comes from the source component:

```text
Page Sections / footer -> section=footer
Page Sections / reviews -> section=reviews
Page Sections / product-slider -> section=product-slider
```

## How section id is resolved

For a component from `Page Sections`, section id is resolved from the source component or component set name.

```text
Component set: footer
  Breakpoint=1920
  Breakpoint=1280
  Breakpoint=768
  Breakpoint=375
```

The section id is `footer`.

`Breakpoint` is a component variant property and is not part of the section id.

## Why this is better than `[section=...]` on every instance

Repeating `[section=...]` on every instance creates duplication:

- Figma already knows the source component;
- the designer repeats the same meaning manually;
- the instance tag can drift from the source component;
- the same component has to be tagged again on every page.

BRIDGE avoids two sources of truth: if Figma already knows the source component, the page does not repeat it with a tag.

## When `[section=...]` is still required

A page layer still needs `[section=...]` only in these cases:

1. The section is a regular frame, not a component from `Page Sections`.
2. The component is too generic and its name does not identify the concrete section.
3. The page intentionally overrides the section meaning for this specific placement.

```text
Reviews [section=reviews]
```

The tag is not a mandatory mark for every component. It is an explicit explanation only where Figma does not provide enough meaning.

## Wrappers around sections

Sections do not have to be direct children of the root frame. A shared wrapper may group several sections for background, spacing, or visual scope.

```text
page-root
  dark-area
    reviews
    faq
```

`dark-area` is a wrapper, not a section.

`reviews` and `faq` remain sections when their source components live in `Page Sections`.

`page-root` and the `dark-area` content wrapper follow the Auto Layout policy. Neither may become a Figma GROUP merely because the visual geometry already looks correct.

## UI Kit responsibility

`UI Kit` owns ordinary interface components and their states: buttons, fields, links, cards, tabs, accordions, modals, and other elements.

A page should not be the place where hover, focus, disabled, loading, error, selected, expanded, or open states are invented for the first time.

Examples of state coverage:

| Component family | Required states |
| --- | --- |
| Button-like controls | default, hover, focus, pressed, disabled, loading |
| Links | default, hover, focus, visited, disabled |
| Text fields | empty, filled, focus, error, disabled, success |
| Select-like fields | closed, open, selected, focus, error, disabled |
| Toggles/switches | off, on, focus, disabled |
| Tabs | default, active, hover, focus, disabled |
| Disclosure/accordion | collapsed, expanded, focus, disabled |
| Modal/dialog | default, close behavior, backdrop behavior, focus trap |

The exact component taxonomy may differ between design systems. BRIDGE should not force a designer to write detailed control roles in page layer names.

## Page instance responsibility

A page instance describes only the meaning that belongs to the specific page:

```text
Contact us [action=modal:contact-modal]
FAQ [href=/contacts#faq]
Email [field=email] [name=email]
```

Do not add `[component=...]` when Figma already knows the source component.

Bad:

```text
Contact us [component=button] [action=modal:contact-modal]
```

Good:

```text
Contact us [action=modal:contact-modal]
```

## Validator checks

A BRIDGE validator should report:

- page section block is not a component from `Page Sections` and does not have `[section=...]`;
- component instance from `Page Sections` repeats `[section=...]` manually without a reason;
- component from `UI Kit` is accidentally used as a page section;
- same logical element uses different source components across breakpoints;
- instance is detached from the library component without a reason;
- required component states are missing in the library;
- component states are drawn manually on a page;
- instance overrides change component structure rather than allowed content;
- form fields do not expose data names;
- icon-only links do not expose accessible text meaning.

## Component source of truth

Preferred source order:

1. Figma instance metadata.
2. Source component or component set.
3. Library page: `UI Kit` or `Page Sections`.
4. Component documentation.
5. BRIDGE tag only when Figma does not provide enough meaning.

BRIDGE tags should not duplicate information that Figma already provides reliably.

## Page state vs component state

Do not confuse page/data state with component state.

Page state:

```text
Catalog Page [page=catalog] [route=/catalog] [bp=1200] [view=empty]
```

Component state in the library:

```text
Button / Primary / Disabled
Input / Error
Accordion / Expanded
```

A page may show a real data state such as empty catalog. But hover, focus, disabled, and loading for components belong in the component library.
