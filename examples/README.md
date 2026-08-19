# BRIDGE examples

Use these short recipes when a design question is concrete. Each example has one problem, one correction, and one reason. Start with the first eight examples; the advanced guides cover data, reactions, motion, and accessibility.

## 1. Page and widths

**Problem:** the file has unrelated `desktop` and `mobile-final-2` roots.

**Use:**

```text
home [page=home] [route=/] [bp=1440] [view=default]
home [page=home] [route=/] [bp=375] [view=default]
```

The same `[page]` and `[view]` connect the prepared widths. `[bp]` records the width shown by each root.

## 2. One name across widths

**Problem:** `hero-title-mobile` looks like a new element.

**Use:**

```text
hero-title
```

The size or position can change. The stable name keeps the same logical element recognizable.

## 3. A page section

Use `[section]` for a section built directly in the page:

```text
product-results [section=product-results]
  product-grid [collection=products]
```

An instance from the `Page Sections` library already has a source component. Do not repeat the section key unless the local frame really is the section boundary.

## 4. Link or interface action

Use `[href]` when the user navigates and `[action]` when the current interface changes:

```text
catalog-link [href=/catalog]
filter-button [action=state:filters-open]
```

Do not use a fake `href` for a button or a fake action for a normal link.

## 5. Button and modal

The action points to the modal’s stable identifier:

```text
contact-button [action=modal:contact-modal]

contact-modal [modal=contact-modal]
  modal-title
  close-button
```

The same UI Kit button can have different actions in different contexts. The action belongs to the instance in the page, not to the shared component name.

## 6. Meaningful structure

**Problem:** nearby layers are grouped only because they were selected together.

**Use:**

```text
hero
  hero-copy
    hero-title
    hero-subtitle
  hero-actions
    contact-button
```

Each wrapper has a real job: content, layout, clipping, background, or interaction area. Detailed layout policy is in [design rules](../docs/01-design-rules.md) and [wrapper policy](../docs/06-wrapper-policy.md).

## 7. Real content

Show the data that can change the layout:

```text
product-card
  product-title
  product-price
  product-image
```

Check short, long, empty, loading, and error states. Do not replace changing content with a picture of the final composition.

## 8. Content, decoration, and export

Use the smallest clear policy on the exact visual layer:

```text
product-image
hero-glow [decor]
campaign-illustration [asset]
```

`[decor]` describes visual purpose. `[asset]` says that the visual is transferred as one resource. A layer can use both when both statements are true.

## How to use this catalog

Find the question that matches the file, copy the smallest applicable pattern, and then run the designer checklist. For data, state machines, motion, and accessibility, use the advanced guides instead of adding more tags to a layer name.

> Non-standalone module fragment: this responsive block belongs inside the full `bridge` contract.

```json
{
  "bridge": {
    "responsive": {
      "defaultPolicy": "same-tree",
      "contexts": [
        { "id": "home-wide", "driver": "viewport", "width": 1440 },
        { "id": "home-narrow", "driver": "viewport", "width": 375 }
      ]
    }
  }
}
```
