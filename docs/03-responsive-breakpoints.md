# Responsive behavior

Responsive design is one page with a clear meaning at more than one width. It is not a set of unrelated desktop and mobile pictures.

## Start with prepared roots

Give each prepared root the same page and state, changing only the context width:

```text
home [page=home] [bp=1440] [view=default]
home [page=home] [bp=375] [view=default]
```

Choose widths that the team will actually implement. A screenshot width is not automatically a product breakpoint.

## What can change

The following may change when the available space changes:

- size and spacing;
- number of columns;
- order inside the same meaningful parent;
- visibility of optional content;
- a declared presentation, such as table to disclosure list.

The page meaning, content identity, actions, and reading order must remain clear.

## Do not change the data to fit the grid

A narrow layout may show fewer items at once, but it must not silently delete records, alter prices, or use a different meaning. Record pagination, filtering, or a separate request as product behavior.

## Intermediate widths matter

Check the space between prepared roots. Text, cards, tables, fixed controls, and focus indicators need a defined behavior there too. Prefer intrinsic and fluid behavior over a collection of device-specific copies.

## Declare a real transformation

When the structure changes, name the source and destination and state what is preserved:

- records and content;
- actions and field relationships;
- selection and open state;
- reading and focus order.

Do not put the transformation into names such as `table-mobile`.

## Direction and accessibility

If the product supports RTL, localization, zoom, reduced motion, or long content, check those contexts as well. Visual mirroring must not break reading order, keyboard order, action targets, or accessible names.

## Ready to continue

The responsive part is ready when the team can tell what stays the same, what changes, at which condition, and what data or behavior is preserved. See [variation axes](../docs/16-variation-axes.md) for the structured reference.
