# State machines and reactions

A clickable prototype shows one path. A BRIDGE reaction contract defines every relevant path: the event, current state, guard, side effect, next state, feedback, focus, URL/history effect, and recovery behavior.

## Reaction, state, and view

- A **reaction** is `event + current state + guard → effects + next state`.
- A **state** is a stable condition of a component, form, flow, or page.
- A **view** (`[view=...]`) is a page/data fixture such as `default`, `loading`, `empty`, or `error`.
- A **target** is the stable element, state, modal, form, route, or service operation referenced by a reaction.

Do not confuse a screenshot named “success” with a complete success reaction. The contract also needs the submitting state, response handling, focus destination, announcement, repeat behavior, and navigation/history result.

## Keep layer tags short

Existing tags locate interaction anchors:

```text
Email [field=email] [name=email]
Send [action=submit:lead-form]
Lead Form [state=lead-form-idle]
Success [state=lead-form-success]
```

Prototype connections may supply additional evidence. Do not add a tag for every event, guard, timeout, focus destination, announcement, and HTTP status. Put those relationships in structured BRIDGE metadata keyed by stable identities.

## Canonical reaction record

A reaction should answer all fields that apply:

| Field | Meaning |
| --- | --- |
| `id` | Stable reaction identity. |
| `scope` | Component, form, page, application, or cross-route flow. |
| `from` / `event` | Current state and initiating user/system event. |
| `guard` | Condition that allows or rejects the transition. |
| `effects` | Validation, request, storage, analytics, clipboard, or other side effects. |
| `to` | Success state; include failure/cancel/timeout branches. |
| `feedback` | Visible status and assistive-technology announcement. |
| `focus` | Focus destination and restoration rule. |
| `history` | URL, query, hash, navigation, replace/push, and Back/Forward result. |
| `concurrency` | Duplicate input, cancellation, stale response, and ordering policy. |
| `persistence` | What survives reload, route change, closing, or another device. |

> **Non-standalone module fragment.** This excerpt shows only `bridge.interaction` and intentionally omits required envelope fields. Insert it into the required `bridge` envelope from the [transfer contract](04-transfer-contract.md#required-envelope) before exchange or full-contract validation.

```json
{
  "bridge": {
    "interaction": {
    "stateMachines": [{
      "id": "lead-form",
      "initial": "idle",
      "states": ["idle", "invalid", "submitting", "success", "failure"],
      "transitions": [{
        "id": "submit-lead",
        "from": ["idle", "invalid", "failure"],
        "event": { "type": "submit", "source": "lead-form" },
        "guard": "all-required-fields-valid",
        "pending": { "to": "submitting", "duplicateEvent": "ignore", "cancel": "on-route-leave" },
        "outcomes": {
          "success": { "to": "success", "focus": "success-heading", "announce": "Lead sent" },
          "validation": { "to": "invalid", "focus": "first-invalid-field", "announce": "Form has errors" },
          "failure": { "to": "failure", "focus": "error-summary", "retry": "preserve-values" }
        },
        "history": "none"
      }]
    }]
    }
  }
}
```

Values in the structured contract are adapter-facing identifiers, not a request to place them all in Figma layer names.

## Model state at the right scope

| Scope | Examples | Source of truth |
| --- | --- | --- |
| Element | focused, pressed, selected, invalid | Native semantics or UI Kit component |
| Component | accordion open, dialog busy, date picker month | UI Kit state model plus instance content |
| Form | pristine, dirty, validating, submitting, success | Form reaction machine |
| Page/data | loading, empty, partial, error | Root `[view]` fixtures plus data contract |
| Application | signed out, offline, permission changed | Cross-page flow contract |

Do not create a page root for every hover state. Do not hide a page-wide error inside a button variant. Parent and child machines may interact, but ownership and event propagation must be explicit.

## Events and input parity

Record semantic events—`activate`, `submit`, `change`, `dismiss`, `select`, `drag`, `timeout`, `response`—rather than a device-specific gesture alone. Then define supported inputs:

- click/tap activation also works with the native keyboard behavior;
- hover-only content also appears on keyboard focus and can be dismissed;
- drag operations have a single-pointer, keyboard, or control-based alternative;
- long press, swipe, and multi-touch gestures have discoverable alternatives;
- repeated activation while pending follows an explicit concurrency rule.

Follow the interaction and keyboard conventions in the official [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/), while preferring native HTML semantics when available.

## Forms: field and form states

For every field define:

- data name, value type, required/optional status, and autocomplete purpose where applicable;
- persistent visible label, instructions, accepted format, and constraints;
- pristine, focused, filled, invalid, disabled, and read-only presentation;
- validation timing: on input, blur, step change, or submit;
- canonical error code/message and relationship to the field;
- normalization that does not silently change meaning;
- dependent fields, conditional visibility, and what happens to hidden values.

For the form define:

- client and server validation authority;
- error summary, first-invalid-field focus, and announcement;
- pending UI and which actions remain available;
- value preservation on error, authentication expiry, route change, and retry;
- success result, duplicate submission handling, and idempotency expectation;
- reset/undo confirmation and loss-of-unsaved-work behavior.

Placeholder text is not a label. Disabled controls cannot explain why they are unavailable; provide nearby status or instruction. Read-only and disabled are different product states.

## Asynchronous reactions

Every request path includes `idle → pending → success | empty | partial | failure | cancelled | timed-out` as applicable. Specify:

- whether prior content remains visible and whether it becomes stale;
- progress behavior and minimum/maximum wait before changed messaging;
- retry policy, backoff, offline queueing, and manual retry;
- cancellation when query, route, modal, or component instance changes;
- race policy: latest request wins, ordered application, merge, or reject;
- deduplication and idempotency for repeated actions;
- optimistic update, rollback, conflict resolution, and undo window;
- status announcement without noisy repetition.

A spinner is not an async contract. A late response must not overwrite a newer query or move focus unexpectedly.

## Overlays, disclosure, and focus

For dialogs, drawers, menus, popovers, and disclosures, define:

- opening event and allowed states;
- initial focus or reason focus stays on the trigger;
- whether the surface is modal;
- Tab/Shift+Tab scope and arrow-key rules where relevant;
- Escape, close control, outside click, and destructive-dismiss behavior;
- focus restoration to the trigger or a declared successor if the trigger disappears;
- nested overlay and route-change behavior;
- scroll locking without losing the previous scroll position.

Content hidden visually must not remain accidentally operable. Content merely collapsed for presentation must not lose required state. Use the matching [APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/) as implementation guidance, not as a substitute for the product decisions above.

## Focus is part of every transition

A complete reaction says where focus goes when:

- validation fails;
- a modal opens or closes;
- content is inserted, deleted, reordered, or filtered;
- a step completes;
- the focused item disappears;
- a route changes or history is restored;
- an operation fails, times out, or is undone.

Default to preserving focus when the user can continue in place. Move it only to support the next task or expose important feedback. Never reset focus to the document start as an accidental rendering side effect.

## URL and history contract

Declare whether state is shareable, bookmarkable, and restorable. For filters, tabs, pagination, selected records, drawers, and multi-step flows decide:

- path, query, hash, in-memory, or persistent storage;
- `push` versus `replace` history behavior;
- Back/Forward result;
- direct-load and refresh initialization;
- invalid or expired state handling;
- scroll and focus restoration;
- whether closing an overlay reverses a history entry.

A deep link must initialize the same product state without replaying preceding clicks. The URL must not expose secrets or sensitive form values.

## Reaction coverage table

Before handoff, enumerate at least:

| Path | Required evidence |
| --- | --- |
| Happy path | Start, intermediate feedback, final state, focus/history result |
| Invalid input | Field and summary feedback, correction path |
| Empty result | Explanation and recovery action |
| Permission/auth failure | Preserved work and re-auth/request-access path |
| Network/server failure | Retriable vs terminal behavior |
| Timeout/offline | Cached state, queued work, reconnect behavior |
| Cancellation/dismissal | Side-effect cleanup and focus restoration |
| Duplicate/rapid input | Deterministic concurrency outcome |
| Back/Forward/reload | State, focus, and scroll restoration |

## Review gate

A flow is BRIDGE-ready only when:

- every interactive anchor has an action or real navigation destination;
- every action resolves to a target and a complete reaction record;
- all reachable states, including pending and failure, have designs or an inherited component contract;
- fields have labels, constraints, errors, and value-preservation behavior;
- async races, duplicate events, cancellation, retry, and rollback are decided;
- focus, announcements, URL, history, and scroll behavior are explicit;
- keyboard, pointer, touch, and assistive-technology users can complete the same task.
