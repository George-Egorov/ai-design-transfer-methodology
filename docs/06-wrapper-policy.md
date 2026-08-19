# Wrappers

A wrapper is a real Figma frame or component with a clear job. It is not an extra tag or a note in the layer name.

## Keep a wrapper when it

- groups elements that adapt together;
- creates a list, grid, surface, or clipping area;
- owns a background or interaction area;
- defines a modal, state, or exportable illustration.

```text
hero-copy
  hero-title
  hero-subtitle
```

## Remove a wrapper when it

- only exists because layers were selected together;
- has one child and no structural purpose;
- changes coordinates without adding meaning;
- is a default `GROUP` or `Frame 53` outside an asset.

Use native Figma layout for content flow. `[decor]` marks a visual layer; it does not excuse a free-form content container. A genuinely opaque visual can use `[decor] [asset]`.

## Keep the tree stable

The settings may change between widths, but a meaningful wrapper and its place in the tree should remain recognizable. A wrapper that exists on only one width needs a documented structural reason.
