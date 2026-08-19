# Interactions and targets

BRIDGE uses one source of truth per interaction anchor. Navigation uses `href`. Non-navigation behavior uses `action`. A nontrivial action then resolves to the structured [reaction/state-machine contract](22-state-machines-and-reactions.md); the short tag is a locator, not the whole behavior specification.

The simple designer path does not require machine ids for ordinary links and buttons.

```text
contacts [href=/contacts]
contact-cta [action=modal:marketplaces-modal]
```

## Links use `href`

A known navigation destination is written directly as `[href=...]`. This tag is enough to classify the layer as a link.

```text
contacts [href=/contacts]
faq [href=/contacts#faq]
same-page-faq [href=#faq]
telegram [href=https://t.me/company]
email [href=mailto:sales@example.com]
phone [href=tel:+12025550123]
```

Rules:

- `[href=...]` is both the link marker and the only destination truth.
- Do not add `[link=...]` just to say that the layer is a link.
- Internal routes start with `/`.
- Same-page anchors start with `#` and must name a real anchor, for example `#faq`.
- `[href=#]` is not an unknown placeholder and is invalid.
- External URLs start with `http://` or `https://`.
- `mailto:` and `tel:` are valid external protocols.
- Do not add a second semantic destination such as `[to=...]`.

If the destination is not known yet, use the boolean draft marker `[link]` instead of a fake href:

```text
contacts [link]
```

`[link]` means “this layer will be a link, but the href is not known yet”. It is valid as draft markup, but it is a TODO before final handoff.

Optional behavior tags may describe how the link opens, not where it points:

```text
telegram [href=https://t.me/company] [open=new-tab] [a11y-label=Telegram]
```

### Optional advanced link id

`[link=...]` is allowed only as an advanced override when an implementation, analytics, or automation pipeline needs an explicit stable machine id that is different from the layer name.

```text
contacts-cta [link=nav-contacts-primary] [href=/contacts]
```

The value must be English kebab-case and must not contain breakpoint suffixes such as `-768`, `-375`, `-mobile`, or `-desktop`.

## Controls use `action`

A control is an interactive element that does something other than direct navigation. A known non-navigation behavior is written directly as `[action=...]`. This tag is enough to classify the layer as a control/button.

```text
contact-cta [action=modal:marketplaces-modal]
menu [action=state:mobile-menu-open]
reset-filters [action=state:catalog-default]
submit [action=submit:lead-form]
disabled-cta [action=none]
```

Rules:

- `[action=...]` is both the control marker and the only action truth.
- Do not add `[control=...]` just to say that the layer is a button/control.
- Do not force page designers to write detailed roles such as `accordion-trigger` or `menu-button` in the page layer name.
- The exact component/control type should come from the UI Kit component instance metadata whenever possible.

If the action is not known yet, use the boolean draft marker `[control]`:

```text
contact-cta [control]
```

`[control]` means “this layer will be a control/button, but the action is not known yet”. It is valid as draft markup, but it is a TODO before final handoff.

Allowed action forms:

```text
[action=modal:contact-modal]
[action=state:mobile-menu-open]
[action=submit:lead-form]
[action=reset:catalog-filters]
[action=none]
```

### Optional advanced control id

`[control=...]` is allowed only as an advanced override when an implementation, analytics, or automation pipeline needs an explicit stable machine id that is different from the layer name.

```text
contact-cta [control=contact-cta-primary] [action=modal:marketplaces-modal]
```

The value must be English kebab-case and must not contain breakpoint suffixes such as `-768`, `-375`, `-mobile`, or `-desktop`.

Bad:

```text
reviews [control=button-reviews-box-768] [action=modal:marketplaces-modal]
```

Good:

```text
reviews [action=modal:marketplaces-modal]
```

## Fields use `field` and `name`

Form fields need stable identity and data binding.

```text
email [field=email] [name=email]
country [field=country] [name=country]
message [field=message] [name=message]
```

Use `[field-type=...]` only when the type cannot be inferred from the UI Kit component or native field metadata:

```text
country [field=country] [name=country] [field-type=select]
```

## Modals and states

Known actions must point to existing targets:

```text
contact-cta [action=modal:contact-modal]
contact-modal [modal=contact-modal]

menu [action=state:mobile-menu-open]
mobile-menu [state=mobile-menu-open]
```

If a modal or state target does not exist, the design is not BRIDGE-ready.

## From action anchor to complete reaction

`[action=submit:lead-form]` answers “which operation starts?” It does not answer what happens during validation, waiting, failure, cancellation, retry, success, or duplicate input. Structured `bridge.interaction.stateMachines[]` records:

- current state, semantic event, and guard;
- pending state and side effects;
- every reachable outcome and recovery path;
- concurrency, cancellation, stale-response, and retry policy;
- visible feedback and assistive-technology announcement;
- focus destination/restoration;
- URL, query, browser history, scroll, and persistence effect.

Do not add flat tags for each event, timeout, error, focus target, and response. Keep stable layer identities and reference them from one versioned reaction graph.

## Forms and async behavior

Fields declare stable binding anchors in the design; the form contract also supplies visible labels, instructions, constraints, autocomplete purpose, validation timing, error relationships, hidden-dependent-value policy, and disabled versus read-only behavior.

Every asynchronous operation covers the applicable path:

```text
idle → pending → success | empty | partial | failure | cancelled | timed-out
```

Specify whether old data remains visible/stale, whether repeat input replaces or queues a request, how optimistic updates roll back, which values survive failure, and when retry or undo is available. A spinner or one success screen is not a complete interaction.

## Focus and history are outputs

Every reaction must preserve focus or move it for a declared task reason. Define initial/restored focus for dialogs, validation, deletion, inserted results, disappearing controls, route changes, and responsive transformations.

For shareable filters, tabs, pagination, drawers, and steps, decide path/query/hash or internal state, history `push` versus `replace`, Back/Forward, direct load, refresh, and scroll/focus restoration. Deep links must initialize the state without replaying earlier clicks, and URLs must not expose sensitive values.

## What validators should check

- `[href=...]` without `[link=...]` is a valid link.
- `[action=...]` without `[control=...]` is a valid control.
- `[link]` and `[control]` are valid draft markers and should be reported as TODOs, not syntax errors.
- `[link=...]` and `[control=...]` are optional advanced ids; validate kebab-case and breakpoint suffixes only when a value is present.
- `[href=#]` is invalid; use `[link]` when the destination is unknown.
- Internal href routes resolve to declared routes when those routes are known.
- Internal href anchors resolve to declared sections/anchors.
- Modal/state/submit/reset action targets exist.
- Nontrivial actions resolve to a reachable reaction/state-machine record with pending, failure, focus, announcement, and history effects as applicable.
- Forms define labels, validation/error behavior, value preservation, and duplicate submission policy.
- Async races, cancellation, retry, and stale responses have deterministic outcomes.
- Social/icon-only links have an accessible label.
- Page instances do not invent component states; states belong in the UI Kit.
