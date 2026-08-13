# Wrapper policy

A wrapper is a real frame, group, or component structure in Figma. It is not a BRIDGE tag and not a manual layer-name annotation.

A wrapper is valid when it helps understand or reproduce interface structure. A wrapper that exists only because it was convenient while drawing is noise.

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

```text
cards-grid
  product-card-oak-chair
  product-card-wool-lamp
```

## Invalid wrappers

A bad wrapper usually has one of these signs:

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

Good:

```text
hero-copy
  hero-title
  hero-subtitle
```

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
