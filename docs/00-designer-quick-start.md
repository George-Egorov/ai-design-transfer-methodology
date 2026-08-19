# Designer quick start

BRIDGE helps another person understand a Figma file without a private explanation. You do not need to read the full specification first: prepare one real page, check its important relationships, and then hand it over.

## What the result should answer

The file should make five things clear:

1. Which page and state is shown.
2. Which prepared widths belong to that page.
3. Which layers represent the same element.
4. What each link or control does.
5. Which content is editable, decorative, or exported.

## One small example

### Before: the file needs a call

```text
desktop
  frame-42
    heading
    button

mobile-final-2
  group-91
    title
```

The names do not show whether these are the same page, which elements match, or what the button does.

### After: the file explains itself

```text
home [page=home] [bp=1440] [view=default]
  hero [section=home-hero]
    hero-title
    contact-button [action=modal:contact-modal]

home [page=home] [bp=375] [view=default]
  hero [section=home-hero]
    hero-title

contact-modal [modal=contact-modal]
```

Now the page, its widths, the matching title, and the modal target are visible in one tree.

## Prepare the file in five steps

### 1. Name the page

Give every prepared root a stable page name, width, and state:

```text
home [page=home] [bp=1440] [view=default]
```

Add `[route=/real-path]` only when the working route is known. Do not invent an address to fill the tag.

### 2. Use stable layer names

Use short English names in `kebab-case`:

```text
hero-title
product-grid
contact-button
```

Use the same name for the same logical element at every prepared width. Do not add `-mobile`, `-desktop`, or a width to the name.

### 3. Show the important widths

Prepare the wide and narrow versions that the team will implement. The size, order, and visibility may change; the element’s meaning and relationship should remain clear.

### 4. Describe links and actions

Use `[href]` for navigation and `[action]` for an interface change:

```text
email-link [href=mailto:sales@example.com]
contact-button [action=modal:contact-modal]
```

The target must exist in the declared file or be clearly marked as an open decision.

### 5. Check the handoff

Ask someone who did not prepare the file:

- What page and state is this?
- Which widths belong to it?
- What does each interactive element do?
- What should remain editable or be exported?

If the answers require a call, add the missing names, relationships, or states and run the check again.

## Add only meaning that Figma does not already store

Figma already stores layer type, component source, layout settings, dimensions, position, styles, and hierarchy. BRIDGE tags add product meaning such as page, section, route, action, target, state, content, decoration, or export policy.

See [design rules](01-design-rules.md) for the source-of-truth boundary and [layer names](02-layer-naming-and-identity.md) for naming details.

## If you are working inside an existing product

Start with one new section instead of inventing page metadata for the surrounding legacy file. The [team adoption guide](19-team-adoption.md) explains that separate path after the basic handoff works.

## Continue

- [BRIDGE examples](../examples/README.md)
- [Designer checklist](17-designer-checklist.md)
- [Full review](08-preflight-checklist.md)
