# Components and sections

Use the component library to keep shared visual behavior consistent. Use page structure to show what the current instance means and does.

## Two library levels

- `UI Kit` contains reusable interface parts: buttons, fields, cards, and controls.
- `Page Sections` contains larger reusable page blocks with their own structure and product role.

The size of a component does not decide its level. Its source and responsibility do.

## Component versus instance

The shared component can define visual states and default behavior. The instance on a page supplies its current content, context, and action:

```text
contact-button [action=modal:contact-modal]
```

The same button component may open different targets in different places. Do not put a page-specific action into the shared component name.

## Section identity

An instance from `Page Sections` already has a stable source. Do not repeat `[section]` unless a local frame is the section boundary. A section built directly in the page uses an explicit key:

```text
checkout-summary [section=checkout-summary]
```

## Keep the source of truth clear

Use instances instead of detached copies when the shared component is still the owner. Keep page-specific content visible and editable. Put product data, actions, and states in the page or structured contract where they belong.

## Check before handoff

- Can the team find the source component?
- Is the page-specific content visible?
- Is the action attached to the current context?
- Are actual states represented instead of hidden old layers?

See [design rules](01-design-rules.md) for the general source-of-truth policy.
