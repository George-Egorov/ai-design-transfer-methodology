# Designer quick start

This is the short, practical entry point to BRIDGE. You **do not need to read the full specification first**. Follow the worked example below, then use the [example catalog](../examples/README.md) when a specific question appears.

## The expected result

A developer, AI agent, or tool should be able to open the design and understand without a meeting:

1. which page and state it represents;
2. which frames are breakpoints of the same page;
3. which elements correspond across those breakpoints;
4. where links go and what controls do;
5. what is content, decoration, or an exported asset.

## One example from draft to handoff

Assume a landing page has two breakpoints and a contact modal.

### Before: the design must be decoded

```text
Desktop
  Frame 42
    Group 18
      Heading
      Text
    Button
    Button copy

Mobile final 2
  Group 91
    Title mobile
    Text
    Button

Popup
  ...
```

This tree does not reliably tell us whether the two roots are the same page, which elements match, what either button does, how `Popup` is reached, or why one button disappeared.

### After: the same design explains itself

```text
Home [page=home] [route=/] [bp=1440] [view=default]
  Hero [section=home-hero]
    hero-copy
      hero-title
      hero-subtitle
    hero-actions
      email-link [href=mailto:sales@example.com]
      contact-button [action=modal:contact-modal]

Home [page=home] [route=/] [bp=375] [view=default]
  Hero [section=home-hero]
    hero-copy
      hero-title
      hero-subtitle
    hero-actions
      email-link [href=mailto:sales@example.com]
      contact-button [action=modal:contact-modal]

Contact Modal [modal=contact-modal]
  modal-content
    modal-title
    close-button
```

Now `[page=home]`, `[view=default]`, and stable layer names connect the breakpoints; `[bp]` distinguishes their widths; the link and action are explicit; and the modal action resolves to a real target. `close-button` is an instance of a close control from the UI Kit, so its behavior comes from component metadata. Layout, dimensions, Auto Layout, and styling still come from Figma rather than tags.

> The visual layout may change between breakpoints. The same logical elements and parent relationships should remain recognizable.

## Do this in five steps

### 1. Name each root frame

Use this minimum:

```text
Name [page=page-id] [bp=width] [view=default]
```

Add `[route=/production-path]` only when the real route is known.

### 2. Match the breakpoints

Compare desktop and mobile layer by layer. The same logical element keeps the same name, parent, content meaning, and action. Dimensions, Auto Layout direction, spacing, order, and visibility may change.

### 3. Give important elements stable names

Use short English `kebab-case` names such as `hero-title`, `product-grid`, and `contact-button`. Do not add device or breakpoint suffixes such as `-mobile` or `-375`.

### 4. Add only intent Figma cannot express

| Figma already knows | Use a BRIDGE tag for |
| --- | --- |
| layer type, component, variant | page and state: `[page]`, `[view]` |
| Auto Layout, gap, padding | route and breakpoint: `[route]`, `[bp]` |
| size, position, constraints | link or action: `[href]`, `[action]` |
| fill, stroke, effect, mask | target: `[modal]`, `[state]` |
| frame and group hierarchy | transfer intent: `[section]`, `[decor]`, `[asset]` |

### 5. Test without the author

Ask another person to identify the page, its breakpoints, every interaction result, all modal/state targets, and what should be exported. If the answer must be given verbally, the design still lacks part of its contract.

### Check it in the plugin

Open the [BRIDGE Assistant workflow](https://poliklot.github.io/bridge-design-methodology/en/check/) and install the plugin. In Figma:

1. open **BRIDGE**;
2. select the top-level frame with the `[page]` tag;
3. run **Check page**;
4. open each finding, jump to the affected layer, and read the linked rule and fix;
5. rerun the check after resolving or documenting the finding.

The page is ready for handoff when:

- the page, view, and required breakpoint roots are unambiguous;
- stable identities still refer to the same elements across breakpoints;
- links and controls have known destinations, and available targets resolve;
- every reported blocker is fixed, while warnings and exceptions have an explicit decision;
- the manual items in the [full preflight](08-preflight-checklist.md) have also been reviewed.

Page Check in version 0.7.0 covers 24 of the 102 catalog rules. It shortens the review; it does not replace the remaining manual checks.

## Find the right example

| Question | Open this example |
| --- | --- |
| How do I name a page and its breakpoints? | [Page and breakpoints](../examples/README.md#1-page-and-breakpoints) |
| Which names must match? | [One element at different widths](../examples/README.md#2-one-element-at-different-widths) |
| When should I write `[section]`? | [Page section](../examples/README.md#3-page-section) |
| Is this a link or an action? | [Link or action](../examples/README.md#4-link-or-action) |
| How do I connect a control to a modal? | [Control and modal target](../examples/README.md#5-control-and-modal-target) |
| What should wrappers express? | [Meaningful structure](../examples/README.md#6-meaningful-structure) |
| How should dynamic text behave? | [Dynamic text](../examples/README.md#7-dynamic-text) |
| Is this content, decor, or an asset? | [Content, decor, and asset](../examples/README.md#8-content-decor-and-asset) |

## Ready for handoff?

Use the [preflight checklist](08-preflight-checklist.md). Treat the full [tag grammar](13-tag-grammar.md) as reference material, not required cover-to-cover reading.
