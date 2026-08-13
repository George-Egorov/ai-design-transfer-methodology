# BRIDGE tag grammar

BRIDGE tags are short machine-readable annotations in layer names. In Figma, they are used only for transfer intent that is not present in Figma metadata.

## Core principle

Do not write a tag if it repeats what is already authored in Figma.

Figma is the source of truth for technical layer properties:

- node type: text, image/vector, component instance;
- Auto Layout, constraints, dimensions, gap, padding, alignment, wrap;
- hierarchy: frames, groups, components;
- positioning, clipping, masks;
- fills, strokes, effects;
- source component, variants, component properties.

A BRIDGE tag is only for product or transfer meaning.

## Syntax

Use property tags for facts an agent or adapter must read:

```text
[property=value]
```

Use boolean tags for visual-intent/policy flags and draft markers that do not need a value:

```text
[decor]
[asset]
[link]
[control]
```

Stable identity inside Figma can be just the layer name:

```text
hero-title
product-photo
close-icon
button-group
```

The name must be stable English kebab-case.

If a property tag has an identity-like value, the value must be English kebab-case unless the tag explicitly defines another value syntax, such as `[route=/path]`, `[href=https://...]`, or `[action=modal:target-id]`.

Optional identity values must not contain breakpoint names or widths. The breakpoint already belongs to the page/root frame via `[bp=...]`; child ids describe logical elements, not responsive variants.

Bad:

```text
Отзывы мобилка [control=button-reviews-box-768] [action=modal:marketplaces-modal]
```

Good:

```text
Отзывы мобилка [action=modal:marketplaces-modal]
```

For optional identity-bearing values such as `[link=...]`, `[control=...]`, `[field=...]`, `[modal=...]`, `[state=...]`, `[section=...]`, collection/item ids, and fallback `[decor=...]` / `[asset=...]` values, a suffix matching the current breakpoint, for example `-768`, `-375`, `-mobile`, or `-desktop`, is invalid.

## Tags designers write

### Page and route

```text
[page=home]
[route=/]
[bp=1920]
[view=default]
[anchor=faq]
```

```text
Home Page [page=home] [route=/] [bp=1920] [view=default]
FAQ [anchor=faq]
```

`[page=...]`, `[bp=...]`, and `[view=...]` define the draftable page root. Add `[route=...]` or `[route-pattern=...]` only when the real production URL is known:

```text
Contacts [page=contacts] [bp=1440] [view=default]
Contacts [page=contacts] [route=/contacts] [bp=1440] [view=default]
Product Detail [page=product-detail] [route-pattern=/catalog/:slug] [bp=1440] [view=default]
```

Do not invent fake production routes to satisfy a checklist.

### Section contract

```text
[section=product-slider]
[section=home-hero]
```

`[section=...]` describes the stable key of the section component, not the heading of a specific block.

If the block is an instance of a component from the `Page Sections` library page, the page instance does not need the tag:

```text
header
reviews
footer
```

In this case, the section key comes from the source component:

```text
Page Sections / header -> section=header
Page Sections / reviews -> section=reviews
Page Sections / footer -> section=footer
```

If the block is a regular frame or the component is too generic, use the tag explicitly:

```text
Catalog [section=product-slider]
Related Products [section=product-slider]
Recommended Products [section=product-slider]
Hero [section=home-hero]
```

Do not use prefixes such as `Section /`: the role is already clear from the tag or from the source component in `Page Sections`.

### Targets

```text
[modal=contact-modal]
[state=mobile-menu-open]
```

```text
Contact Modal [modal=contact-modal]
Mobile Menu Open [state=mobile-menu-open]
```

### Links

A known navigation destination is written as `[href=...]`. This tag is enough to classify the layer as a link; ordinary designer examples do not need `[link=...]`.

```text
[href=/contacts]
[href=/contacts#faq]
[href=#faq]
[href=https://t.me/company]
[href=mailto:sales@example.com]
[href=tel:+12025550123]
```

```text
contacts-link [href=/contacts]
faq-link [href=/contacts#faq]
same-page-faq [href=#faq]
telegram-link [href=https://t.me/company]
email-link [href=mailto:sales@example.com]
phone-link [href=tel:+12025550123]
```

If the destination is unknown, use the boolean draft marker `[link]`:

```text
contacts-link [link]
```

`[href=#]` is invalid. `#faq` is a real same-page anchor; `#` is not an unknown href placeholder.

Optional link behavior:

```text
[open=new-tab]
[a11y-label=Telegram]
```

Advanced override only: use `[link=...]` when an explicit stable machine id is needed in addition to the layer name. Do not use it in ordinary designer examples.

```text
contacts-cta [link=nav-contacts-primary] [href=/contacts]
```

Validators classify href values:

- `/path` — internal route;
- `#anchor` — same-page anchor;
- `/path#anchor` — cross-page anchor;
- `https://...` — external URL;
- `mailto:` / `tel:` — external protocol.

### Controls and actions

A known non-navigation action is written as `[action=...]`. This tag is enough to classify the layer as a control/button; ordinary designer examples do not need `[control=...]`.

```text
[action=modal:contact-modal]
[action=state:mobile-menu-open]
[action=submit:lead-form]
[action=reset:catalog-filters]
[action=none]
```

```text
contact-cta [action=modal:contact-modal]
menu-button [action=state:mobile-menu-open]
lead-submit [action=submit:lead-form]
reset-filters [action=reset:catalog-filters]
disabled-cta [action=none]
```

If the action is unknown, use the boolean draft marker `[control]`:

```text
contact-cta [control]
```

Advanced override only: use `[control=...]` when an explicit stable machine id is needed in addition to the layer name. Do not use it in ordinary designer examples.

```text
contact-cta [control=contact-cta-primary] [action=modal:contact-modal]
```

Allowed action forms:

```text
[action=modal:target-id]
[action=state:target-id]
[action=submit:form-id]
[action=reset:target-id]
[action=none]
```

### Fields

Fields require stable identity and a data binding name.

```text
email [field=email] [name=email]
country [field=country] [name=country]
message [field=message] [name=message]
```

Use `[field-type=...]` only when the type cannot be inferred from UI Kit/native metadata:

```text
country [field=country] [name=country] [field-type=select]
```

### Collections and repeated items

Use collection/item tags only when a dynamic list or repeated data must be explicit.

```text
products [collection=products]
product-card-oak-chair [item=product]
product-card-wool-lamp [item=product]
```

The shared `[item=product]` value classifies a repeatable role/type; it is not identity-bearing. Use the stable layer name/`bridgeKey` and structured `designInstance`/`runtimeData` mappings for unique authored and runtime identity. If the card is a component instance and repetition is obvious from the Figma structure, the extra tag is not required.

### Visual intent

A content image gets a stable layer name without a manual `[image=...]` tag.

```text
product-photo
article-cover
author-avatar
```

`[decor]` and `[asset]` are boolean visual-intent/policy tags, not mandatory identity tags. They may appear together and must not be reported as “multiple identity tags”.

A decorative visual is marked with `[decor]`.

`[decor]` means:

- the layer is decorative;
- it is not product content;
- it should not enter the accessibility tree and may be `aria-hidden`;
- it does not require alt/content semantics;
- it still preserves stable responsive identity and must not disappear between breakpoints.

```text
sneg [decor]
snow-bg [decor]
hero-glow [decor]
```

A whole exported visual is marked with `[asset]`.

`[asset]` means:

- export or use the visual as one whole unit;
- do not rebuild it from internal layers;
- the root asset still preserves stable responsive identity between breakpoints.

```text
promo-poster [asset]
lab-illustration [asset]
snow-bg [decor] [asset]
```

If the layer already has a stable name, prefer the boolean form:

```text
sneg [decor] [asset]
```

The identity is `sneg`. `[decor]` and `[asset]` only add visual intent and transfer policy.

The old value form remains valid only as a fallback for poor/default layer names:

```text
Frame 182 [decor=snow-bg]
Group 91 [asset=promo-poster]
```

If a value is present in `[decor=...]` or `[asset=...]`, validate it as English kebab-case. Boolean `[decor]` and `[asset]` without values are valid.

### Height and overflow

Use these tags only when behavior cannot be safely inferred from Figma or when dynamic content needs an explicit policy.

```text
[height=hug]
[height=fixed]
[height=min]
[height=fill]
[overflow=visible]
[overflow=hidden]
[overflow=scroll]
[overflow=truncate]
[lines=3]
```

```text
description [height=hug]
description [height=fixed] [overflow=truncate] [lines=3]
```

### Exceptions

```text
[bridge-exception=raster-text]
[bridge-exception=overlap]
[bridge-exception=fixed-height]
[bridge-exception=manual-line-break]
[bridge-exception=unsupported-effect]
[bridge-exception=manual-transfer]
[reason=brand-lockup]
```

Rules:

- every exception requires `[reason=...]`;
- `[bridge-exception=manual-line-break]` is allowed only when the line break is semantic or an approved brand lockup, not a workaround for dynamic text;
- exceptions do not make a design better, they only make complexity explicit.

## Tags not written in Figma

For Figma designs, do not use:

```text
[text=...]
[image=...]
[icon=...]
[container=...]
[layout=...]
[abs]
[component=...]
[to=...]
```

Rules:

- a TEXT node gets identity from the layer name;
- a content image gets identity from the layer name;
- an icon gets identity from the layer name and/or component metadata;
- structure is authored with frames, groups, components, and Auto Layout in Figma;
- positioning is authored in Figma;
- component source, variants, and states come from UI Kit component metadata;
- navigation destination is always `[href=...]`, not `[to=...]`.

## Component ownership

Do not mark page instances with `[component=...]` when Figma already knows the source component. Component source, variants, and UI states belong to the UI Kit and should be extracted from Figma component metadata.

Page instance:

```text
contact-cta [action=modal:contact-modal]
```

The UI Kit component source defines states: default, hover, focus, disabled, loading, error, and so on.

See [Components and UI Kit](14-components-and-ui-kit.md).

## Invalid examples

```text
hero-title [text=hero-title]
```

Invalid for a Figma TEXT node: use the layer name `hero-title`.

```text
content [container=content] [layout=stack]
```

Invalid for Figma structure: use a `content` frame and Auto Layout in Figma.

```text
snow-bg [decor] [abs]
```

Invalid: `decor` is intent; positioning comes from Figma. Use `snow-bg [decor]`.

```text
FAQ [to=anchor:contacts-faq] [href=/contacts#faq]
```

Invalid: two destinations. Use only `[href=/contacts#faq]`.

```text
unknown-link [href=#]
```

Invalid: `#` is not an unknown href placeholder. Use `unknown-link [link]`.

```text
Отзывы мобилка [control=button-reviews-box-768] [action=modal:marketplaces-modal]
```

Invalid: optional ids must not contain breakpoint suffixes. Use `Отзывы мобилка [action=modal:marketplaces-modal]`.
