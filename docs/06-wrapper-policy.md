# Wrapper policy

A wrapper is a real frame or component structure in Figma. It is not a BRIDGE tag and not a manual layer-name annotation. A Figma `GROUP` is not a valid content wrapper outside an opaque `[asset]` subtree.

A wrapper is valid when it helps understand or reproduce interface structure. A wrapper that exists only because it was convenient while drawing is noise.

Every page root and frame-built section wrapper uses native Auto Layout. A generic Auto Layout-capable wrapper with at least two visible meaningful flow children also uses Auto Layout. Primitive/leaf geometry is exempt, and the internal composition of a genuine `[asset]` is opaque; the asset root remains one child in its parent's Auto Layout.

## Valid wrappers

A wrapper is valid when it does one of these jobs:

- groups elements that should adapt together;
- defines a list, grid, or repeated pattern;
- defines clipping, masking, or a visible surface;
- defines a shared background, border, radius, or shadow for a group;
- defines a scope for overlay, decor, or an out-of-bounds visual;
- defines a semantic interface region;
- defines a target such as modal, state, tab, accordion, or similar behavior;
- groups a complex illustration that should be exported or processed as one unit.

These responsibilities explain why the frame exists; they do not make manual coordinate layout valid. Use Auto Layout for its content flow and use native absolute positioning only for explicitly intended visual/overlay children.

```text
cards-grid
  product-card-oak-chair
  product-card-wool-lamp
```

## Invalid wrappers

A bad wrapper usually has one of these signs:

- it is a Figma `GROUP` outside an `[asset]` subtree;
- it is a page, section, or multi-child content-flow frame with Auto Layout disabled;
- one child and no structural reason;
- wrappers appear, disappear, or move children between breakpoints without a reason;
- names such as `Group 271`, `Frame 53`, `copy 2`;
- the wrapper changes coordinates but adds no meaning;
- the wrapper hides broken structure instead of fixing it.

Bad:

```text
Frame 53
  Group 271
    hero-title
```

Good (frames with native Auto Layout):

```text
hero-copy
  hero-title
  hero-subtitle
```

## GROUP and documented deviations

Replace every non-asset `GROUP` with a frame or component using Auto Layout. `[decor]` is not an exemption: it only marks the exact intended absolute visual layer. A complex decorative composition that should remain opaque is `[decor] [asset]`.

When a legacy or externally controlled manual composition genuinely cannot be converted, place `[bridge-exception=manual-layout] [reason=...]` on that exact GROUP. The tags document a proposed deviation but do not suppress `layout.group-outside-asset`; Page Check keeps the blocking finding even if a separate deviation gate later records external acceptance of its scope and risk.

## Wrapper stability across breakpoints

A wrapper's Figma settings may change between breakpoints, but the wrapper itself and its tree position should stay stable.

```text
// desktop
button-group
  primary-cta
  secondary-cta

// mobile
button-group
  primary-cta
  secondary-cta
```

The key stays stable because the logical group is the same.

A wrapper that exists only on one breakpoint changes the element structure. Treat it as an exception or add the same meaningful wrapper to every breakpoint. Where it is not visually needed, make it neutral using Figma settings.
