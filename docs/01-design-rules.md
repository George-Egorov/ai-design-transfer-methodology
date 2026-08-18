# Design rules

A BRIDGE-ready design must be understandable before transfer. In Figma, that comes from a correctly authored structure, stable names, and explicit product intent — not from hand-written technical tags.

## 1. Do not duplicate Figma metadata

Designers must not write layer-name tags for technical properties that Figma already exposes as data:

- node type: text, image, vector, component instance;
- Auto Layout: direction, gap, padding, alignment, wrap;
- frame, group, and component hierarchy;
- positioning, constraints, clip content, dimensions;
- fills, strokes, effects, masks;
- source component, variants, component properties.

The adapter reads these from Figma. A manual tag is needed only when Figma does not know the product intent.

## 2. What designers declare manually

Layer names declare only transfer intent:

- page, real production route when known, breakpoint, and view;
- section contract;
- `href` for known links, `[link]` for draft unknown links;
- `action` for known controls/buttons, `[control]` for draft unknown actions;
- form field;
- modal or state target;
- decorative visual;
- whole exported asset;
- height, overflow, or explicit exception when it cannot be safely inferred.

## 3. Build structure with native Auto Layout

Related elements must be authored as real Figma structure and their content flow must be explicit:

- copy and buttons live inside a meaningful parent;
- cards live inside a shared list or grid;
- section title, copy, and CTA live inside the section;
- repeated items are structured consistently;
- random `Frame 53`, `Group 271`, and `copy 2` layers are not part of a ready handoff.

If elements should adapt together, they must not be loose free-floating siblings. A frame that only preserves manually drawn coordinates is not a transferable layout contract.

### Blocking Auto Layout policy

![Auto Layout gate showing required page, section, and content-container flow; GROUP and page-root asset blockers; and the narrow asset, absolute-layer, and instance boundaries](../assets/diagrams/auto-layout-gate.svg)

*The gate is structural: native flow passes, while manual containers and GROUP nodes outside an opaque asset remain blocking findings.*

Use native Figma Auto Layout—vertical, horizontal, or grid—at these boundaries:

| Source node | Required policy |
| --- | --- |
| BRIDGE page root | Always uses Auto Layout, even with zero or one child. A page root cannot mark itself `[asset]` to bypass this rule. |
| Frame-built page section | Always uses Auto Layout, even with zero or one child. A section may be an opaque `[asset]` only when the entire section is intentionally delivered as one visual and contains no live text, controls, forms, data, or content flow. |
| Generic Auto Layout-capable content container | Uses Auto Layout when it has at least two visible meaningful direct children participating in content flow. |
| Primitive or leaf geometry | Exempt because it does not own content flow. |
| Opaque `[asset]` subtree | Internal composition is exempt. The asset root still participates as one child in its parent's Auto Layout. |
| Component instance | Page Check treats the placed INSTANCE as an atomic boundary and does not resolve or inspect its source component. Audit the editable source root separately against this policy. |

A **meaningful flow child** is a visible direct child that carries content, interaction, semantic structure, or a reusable visual item. Hidden/archive layers and correctly declared absolute visual children do not create generic content flow. Page and section roots do not use the two-child threshold: their Auto Layout requirement is unconditional.

### GROUP nodes are not layout containers

A Figma `GROUP` outside an `[asset]` subtree is a blocking error, regardless of its child count. Replace it with a frame or component and define native Auto Layout. `[decor]` does not make a GROUP valid and must never be used as a structural bypass.

If conversion is genuinely impossible, record a proposed deviation on the GROUP itself:

```text
legacy-lockup [bridge-exception=manual-layout] [reason=vendor-master-art]
```

Both tags must be on the exact GROUP. They document an unavoidable manual composition but **do not suppress** `layout.group-outside-asset`; Page Check still reports the blocking finding. A separate deviation-acceptance gate must review its scope, impact, mitigation, evidence, owner, approver, and review date. The exception also never exempts the parent page, section, or content-flow container.

### Absolute visual layers

An intended absolute ornament may be a leaf visual layer such as:

```text
hero-glow [decor]
```

`[decor]` is valid only on the exact visual layer whose Figma positioning is absolute. It does not authorize an arbitrary freeform subtree and does not waive Auto Layout or GROUP rules for any ancestor. If a complex decorative composition should remain opaque, use `[decor] [asset]`; if an intentional non-decorative overlay cannot be modeled otherwise, use `[bridge-exception=overlay] [reason=...]` on the exact overlay node.

```text
Home [page=home] [bp=1440] [view=default]     // FRAME, vertical Auto Layout
  hero [section=hero]                          // FRAME, vertical Auto Layout
    hero-copy                                  // FRAME, vertical Auto Layout
      hero-title                               // TEXT leaf
      hero-subtitle                            // TEXT leaf
    hero-glow [decor]                          // intended ABSOLUTE visual leaf
    hero-art [decor] [asset]                   // intended ABSOLUTE opaque visual
```

## 4. Image, decor, and asset mean different things

A content image carries information. If removing it changes the meaning, give the layer a stable name.

Decor is visual ornament. If removing it preserves meaning, mark it with the boolean visual-intent tag `[decor]`.

`[decor]` means:

- the layer is decorative, not product content;
- outside an `[asset]` subtree, it is the exact intended absolute visual layer rather than a flow container or freeform GROUP;
- it should not enter the accessibility tree and may be `aria-hidden`;
- it does not need alt/content semantics;
- it still keeps stable responsive identity and must not disappear between breakpoints;
- it never exempts a page, section, container, GROUP, or arbitrary subtree from the structural policy above.

An asset is a visual that should be exported as one whole file instead of being rebuilt from internal layers. Mark it with the boolean policy tag `[asset]`.

`[asset]` means:

- export or use the visual as one whole unit;
- do not rebuild it from internal layers;
- internal freeform composition is opaque to structural layout checks;
- the root asset layer still keeps stable responsive identity across breakpoints and participates as one item in the parent's Auto Layout;
- it cannot be applied to an entire BRIDGE page root merely to silence layout findings.

When the layer already has a good stable name, prefer boolean tags:

```text
product-photo
article-cover
author-avatar
snow-bg [decor]
hero-glow [decor]
promo-poster [asset]
lab-illustration [asset]
sneg [decor] [asset]
```

The older value form is only a fallback for poor/default layer names:

```text
Frame 182 [decor=snow-bg]
Group 91 [asset=promo-poster]
```

## 5. The root frame is a concrete page or section breakpoint

The root frame should carry stable page/view/breakpoint data. Add `[route=...]` only when the real production route is known:

On the Figma canvas, this root may be a direct child of the Figma page or a descendant reached only through native Figma `SECTION` organizers. Those Sections are outside the transferred page hierarchy: their names and tags are not inherited, and they do not relax the root's Auto Layout contract. An ordinary `FRAME` or `GROUP` outside the tagged root is not a transparent organizer.

```text
Home Page [bp=1920] [view=default] [page=home] [route=/]
Home Page [bp=375] [view=default] [page=home] [route=/]
```

If the route is not known yet, omit it instead of inventing a fake production URL:

```text
Contacts Page [bp=1440] [view=default] [page=contacts]
```

A breakpoint is the same page at another width, not a new version of meaning or structure.

## 6. Clipping and overflow are decisions

If a frame is a card, viewport, mask, or constrained surface, its overflow behavior must be intentional.

Text coming from a CMS, admin panel, catalog, or localization must not rely on manual line breaks. It should wrap by the width of its text area and have clear overflow behavior.

## 7. Native/editable elements stay native

Text, buttons, form fields, simple shapes, and icons should not be turned into images without a reason. Exported assets are only for complex visuals that the target implementation should not or cannot rebuild.

## 8. The methodology is platform-independent

BRIDGE is not tied to one tool. Figma is the primary design source, but the contract should transfer into frontend frameworks, static HTML/CSS, visual editors, mobile UI, or internal design systems without guessing.
