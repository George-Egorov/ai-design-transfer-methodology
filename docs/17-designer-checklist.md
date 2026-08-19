# Designer checklist

Use this short check before handing a Figma file to implementation. If a point needs a detailed decision, follow its guide instead of trying to solve the whole specification at once.

## Before you start

Choose the area you are handing over:

- a full page with its prepared widths; or
- one clearly marked new section inside an existing product.

Do not add page metadata to an existing product just to make one section checkable. See the [team adoption guide](19-team-adoption.md) for that case.

## Page and widths

- [ ] The page, route when known, width, and state are clear from the root.
- [ ] The prepared roots describe the same page and preserve the same meaning.
- [ ] The same logical element keeps the same name across widths.

See [responsive behavior](03-responsive-breakpoints.md).

## Names and relationships

- [ ] Important layers use short English names in `kebab-case`.
- [ ] Names do not contain device or width suffixes.
- [ ] Related layers are connected by a meaningful parent, not only by visual proximity.

See [layer names](02-layer-naming-and-identity.md) and [design rules](01-design-rules.md).

## Links, actions, and states

- [ ] Every link has an `[href]` or a deliberate open decision.
- [ ] Every interface change has an `[action]` and an existing target.
- [ ] Important default, loading, empty, error, and success states are shown or described.

See [interactions](05-interactions-and-targets.md) and [state reactions](22-state-machines-and-reactions.md).

## Content and components

- [ ] Text, prices, images, and lists survive realistic data and localization.
- [ ] Content, decoration, and exportable assets are distinguishable.
- [ ] Components come from the right library and remain editable where they should.

See [components](14-components-and-ui-kit.md) and [content and overflow](07-height-and-overflow.md).

## Handoff test

- [ ] A person who did not prepare the file can find the page, widths, actions, targets, and editable resources without a call.

If one answer still lives in chat, add it to the file or record it as an owned open question. Then run [Check page in Figma](https://www.figma.com/community/plugin/1654485530503673254/bridge).

## For a stricter review

Use the [full review](08-preflight-checklist.md) only when the team needs an exhaustive audit of data, accessibility, motion, implementation evidence, and release decisions.
