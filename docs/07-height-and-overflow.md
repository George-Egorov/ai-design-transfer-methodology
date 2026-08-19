# Content and overflow

Dynamic content should be allowed to use the space it needs. A fixed height is a product decision, not a shortcut for matching one screenshot.

## Prefer content-driven height

Let text, data, and lists grow. Test long words, prices, names, localization, errors, and empty states.

## When a fixed height is valid

Use it when the product needs a known viewport, crop, media frame, or scroll region. Record what happens when content does not fit:

- wrap or grow;
- clip with a visible reason;
- scroll inside a named region;
- truncate with an accessible way to read the rest.

Do not use manual line breaks or separate mobile text only to preserve a composition.

## Check the edges

Verify that content, focus, validation messages, and interactive targets are not clipped accidentally. See [responsive behavior](03-responsive-breakpoints.md) for intermediate widths.

## Ready

The rule is ready when the team knows how the block behaves with normal, long, empty, and error data.
