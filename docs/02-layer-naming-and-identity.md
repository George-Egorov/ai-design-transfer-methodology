# Layer naming and identity

BRIDGE identity is the stable key of a logical element. In Figma, identity is provided in two ways:

1. by a stable layer name when the element type is reliably known from Figma;
2. by a BRIDGE tag when product intent must be declared because Figma does not know it.

## Core rule

Do not write a tag if it only repeats Figma metadata.

```text
hero-title
product-photo
close-icon
button-group
hero-copy
```

These names are enough when the layer has a clear Figma type and the name is stable English kebab-case.

## When a tag is required

A tag is required for intent that is not a technical layer property:

```text
Home Page [page=home] [route=/] [bp=1920] [view=default]
Catalog [section=product-slider]
primary-cta [href=/catalog]
menu-button [action=state:mobile-menu-open]
email [field=email] [name=email]
snow-bg [decor]
promo-poster [asset]
sneg [decor] [asset]
```

`[decor]` and `[asset]` are boolean visual-intent/policy tags, not mandatory identity tags. If the layer is already named well, the layer name remains the stable responsive identity:

```text
sneg [decor] [asset]
```

Here the identity is `sneg`; `[decor]` says the layer is decorative/non-content/accessibility-hidden, and `[asset]` says the visual should be transferred as one whole unit.

The older value form is allowed only as a fallback for poor/default layer names:

```text
Frame 182 [decor=snow-bg]
Group 91 [asset=promo-poster]
```

If a value is present in `[decor=...]` or `[asset=...]`, it must be English kebab-case. Boolean `[decor]` and `[asset]` without values are valid and should not be reported as missing values.

## What is not written as a Figma tag

For Figma designs, designers do not manually describe the technical construction of a layer:

- that a layer is text;
- that a layer is a content image;
- that a layer is an icon;
- that a layer is a frame, group, or structural wrapper;
- how Auto Layout is configured;
- how a layer is positioned;
- which source component owns an instance when Figma already knows it.

## Stable identity across breakpoints

The same logical element must keep the same key across all breakpoints.

Desktop:

```text
hero-title
button-group
  primary-cta [href=/pricing]
  secondary-cta [action=modal:contact-modal]
```

Mobile:

```text
hero-title
button-group
  primary-cta [href=/pricing]
  secondary-cta [action=modal:contact-modal]
```

The Figma layout may change, but identity stays the same.

Visual-intent tags must also stay semantically stable. If desktop has:

```text
sneg [decor] [asset]
```

then mobile must keep the same identity and the same visual intent:

```text
sneg [decor] [asset]
```

If `sneg` is missing on mobile, that is a responsive identity error. If mobile has `sneg` but drops `[decor] [asset]`, that is visual intent drift, not a new identity.

## Do not encode breakpoints in optional identity values

Optional BRIDGE identity values must describe the logical element, not the responsive breakpoint. Breakpoint data already belongs to the page/root frame through `[bp=...]`.

Bad:

```text
// [bp=768]
Отзывы мобилка [control=button-reviews-box-768] [action=modal:marketplaces-modal]

// [bp=375]
Отзывы мобилка [control=button-reviews-box-375] [action=modal:marketplaces-modal]
```

Good:

```text
// [bp=768]
Отзывы мобилка [action=modal:marketplaces-modal]

// [bp=375]
Отзывы мобилка [action=modal:marketplaces-modal]
```

Optional child ids such as `[control=...]`, `[link=...]`, `[field=...]`, `[modal=...]`, `[state=...]`, `[section=...]`, collection/item ids, and fallback `[decor=...]` / `[asset=...]` values must stay breakpoint-neutral. For ordinary links/buttons, prefer no optional id at all: use `[href=...]`, `[link]`, `[action=...]`, or `[control]`. If an optional identity value ends with the current breakpoint suffix, such as `-768`, `-375`, `-mobile`, or `-desktop`, remove the suffix and keep the breakpoint only on the root.

## Naming conventions

Use English kebab-case for stable identities:

- `section-bg`
- `hero-copy`
- `primary-cta`
- `stats-row`
- `card-main-image`

Avoid semantic collisions. Authored fixture instances need distinct, stable design identities:

```text
product-card-oak-chair [item=product]
product-card-wool-lamp [item=product]
```

The repeated `[item=product]` value classifies the role/type; it is intentionally not unique. The stable layer name and `bridgeKey` identify the authored occurrence. A numeric suffix such as `product-card-1` is acceptable only as a design-fixture fallback when no meaningful fixture key exists. It must not be treated as array position or runtime record identity: sorting, filtering, pagination, and live updates change positions. Repeated runtime content uses a separate template key, design-instance key, and stable product data key in the [structured transfer contract](04-transfer-contract.md).

## Five identity dimensions

The stable layer name is the human-visible design anchor, not a universal id for every system. Structured BRIDGE metadata maps five distinct dimensions:

| Dimension | Meaning |
| --- | --- |
| Role | The logical purpose, such as navigation, product data item, or status. |
| Template | The reusable component/section definition that owns structure and inherited behavior. |
| Design instance | This authored occurrence and its source nodes in each declared context. |
| Runtime data | The collection and stable product record-key rule, never a visual position. |
| Target | The component, entity, or locator that realizes the element on a target platform. |

```text
role=data-item
templateKey=product-card
designInstanceKey=product-card-oak-chair
runtimeDataKey=sku:CHAIR-OAK-01
targetKey=ProductCard
```

These are structured contract fields, not five new layer-name tags. They may coincide for a simple static element, but an adapter must not assume that they do. Interaction targets are resolved through the referenced element's stable `bridgeKey`; they are not the same as the target-implementation mapping.

## Section names

A section may be identified in two ways.

First, it may be an instance of a section component from the `Page Sections` library page. In that case, the page instance does not need `[section=...]`:

```text
header
reviews
footer
```

The section meaning comes from the source component:

```text
Page Sections / header -> section=header
Page Sections / reviews -> section=reviews
Page Sections / footer -> section=footer
```

Second, it may be a regular frame section or an ambiguous component. In that case, use an explicit tag:

```text
Recommended Products [section=product-slider]
Related Products [section=product-slider]
Catalog [section=product-slider]
```

Rules:

- the layer name before tags is the contextual label for this page;
- `[section=...]` is the stable key of the section component;
- content, heading, and data may differ across pages while `[section=...]` stays the same;
- if the section is already an instance of a component from `Page Sections`, do not duplicate `[section=...]` on the page;
- if the section is a regular frame, use `[section=...]`;
- if the component is too generic and its name does not identify the section, use `[section=...]` as an explicit clarification.

The same section across breakpoints of one page means the same section block and should keep a comparable structure. The same section across different pages does not require identical content.

## Content identity

The same identity across breakpoints means the same logical content.

Allowed changes:

- width;
- font size;
- line wrapping;
- position inside the same structure;
- parent Auto Layout settings;
- order inside the same parent;
- visibility on a specific breakpoint.

Not allowed across breakpoints:

- changing CTA text;
- changing price;
- changing legal copy;
- changing product claims;
- hiding important meaning on mobile;
- shortening labels only for mobile;
- moving the same element to another parent;
- adding or removing logical elements without an explicit variant, state, collection rule, or exception;
- replacing the same logical element with separate breakpoint-specific copies.

Bad:

```text
// desktop
hero-title = "Launch your store in one day"

// mobile
hero-title = "Launch faster"
```

If text, meaning, or structure differs because of locale, experiment, personalization, product variant, or target-specific limitations, model it outside the ordinary responsive breakpoint contract. A responsive breakpoint is the same element set laid out for another width, not a new content or structure version.

## Recommended structural names

```text
section-body
content
hero
hero-copy
button-group
stats-row
visual-column
cards-list
cards-grid
```

These are layer names, not a request to add technical tags.
