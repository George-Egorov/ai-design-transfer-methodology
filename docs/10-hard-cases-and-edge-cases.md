# Hard cases and edge cases

BRIDGE becomes useful only if it covers ugly real-world design situations, not just clean landing-page examples. This document lists the cases that should shape the checklist, validator rules, examples, and future adapters.

## Severity model

- **Blocker** — the design is not BRIDGE-ready. Transfer would require guessing.
- **Warning** — transfer is possible, but the result is risky or adapter-specific.
- **Manual review** — automation can detect a suspicious pattern, but a human must confirm intent.

## 1. Identity nightmares

| Case | Why it is dangerous | BRIDGE response | Auto-check |
| --- | --- | --- | --- |
| Same logical element has different identities on breakpoints | The adapter creates duplicates instead of one responsive element. | Keep one stable identity: a layer name or required BRIDGE tag. | Compare breakpoint groups. |
| Same identity points to different element types | A button becomes text, an image becomes a card, etc. | Same identity must preserve logical type unless modeled as a different entity. | Compare type by key. |
| Repeated cards reuse one identity | The adapter cannot distinguish instances. | Use indexed keys: `card-1`, `card-2`. | Detect duplicate identities. |
| Component instance overrides hide changed content | Source component says one thing, override says another. | Treat resolved instance content as source of truth and report overrides. | Extract component metadata. |
| Hidden layer is the real source of truth | Transfer may pick wrong copy/state. | Hidden alternatives must be declared as states, variants, or archive. | Detect hidden keyed layers. |

## 2. Responsive nightmares

| Case | Why it is dangerous | BRIDGE response | Auto-check |
| --- | --- | --- | --- |
| Mobile copy changes product meaning | Users see different promises on different devices. | Responsive breakpoints must preserve exact content; model locale/experiment/product variants separately. | Text diff by identity. |
| Element count changes between breakpoints | The adapter cannot know whether an item is deleted, hidden, duplicated, or variant-specific. | Preserve the same logical cardinality, or model the difference as a collection rule, state, variant, or structural exception. | Identity cardinality diff. |
| Identity is reparented on one breakpoint | DOM/component topology, state ownership, ARIA relationships, and analytics can break. | Preserve parent-child topology; use shared wrappers or declare a structural exception. | Compare parent identity by key. |
| Hidden element is removed instead of hidden | The adapter cannot distinguish intentional invisibility from a missing element. | Keep the identity in the same parent and mark visibility per breakpoint. | Identity coverage + visibility diff. |
| Mobile-only copy replaces the real element | States, actions, analytics, and content can drift between copies. | Use one identity; change visibility/order/placement instead of duplicating. | Duplicate role/content heuristic. |
| Critical element disappears on mobile | CTA, legal note, price, or error state is lost. | Mark intentional exclusions or keep key on required breakpoints. | Identity coverage check. |
| Desktop grid becomes mobile carousel | Different behavior, states, and controls appear. | Declare `responsive-behavior=carousel` and carousel controls. | Key + role change heuristic. |
| Order changes without reason | DOM/order may differ from visual intent and accessibility. | Declare order strategy or preserve semantic order. | Compare sibling order by key. |
| Breakpoints do not cover transition zones | Design works only at exact widths. | Define breakpoint roots first, then min/max/fluid strategy. | Check declared breakpoint set. |
| Safe areas and device chrome are ignored | Mobile UI collides with notches, browser bars, sticky nav. | Declare safe-area and sticky/fixed behavior. | Manual/adapter check. |

## 3. Structure and geometry nightmares

| Case | Why it is dangerous | BRIDGE response | Auto-check |
| --- | --- | --- | --- |
| Related items are free-floating siblings | Responsive transfer cannot infer grouping. | Meaningful Figma structure: frames/groups/components, Auto Layout, or constraints. | Geometry clustering heuristic. |
| Wrapper maze | Layout tree is deep but meaningless. | Keep only wrappers with a real grouping, layout, clipping, surface, semantic, or interaction function; do not invent a wrapper tag. | Detect one-child/deep wrappers. |
| Fixed height clips real content | Localization/CMS content breaks layout. | Use hug/min-height or explicit overflow policy. | Fixed-height text/card checks. |
| Visually detached element behaves like ordinary content | It will not adapt with the group. | Move it into the shared structure or mark intent as `[decor]`, `[asset]`, `[modal=...]`, or an exception. | Positioning + intent check. |
| Overlap is accidental | z-order differs across targets. | Declare overlay/decor/asset intent or collision reason. | Bounding-box overlap heuristic. |
| Parent clips child unintentionally | Decor, tooltip, focus ring, or text is cut. | Declare overflow policy. | Clip + child overflow check. |
| Negative spacing or constraints fight Auto Layout | The adapter cannot reproduce intent deterministically. | Use tokens/gaps or mark exception. | Geometry + layout metadata. |
| Sticky/fixed element overlaps content | Header, cookie bar, nav, or sidebar hides section content. | Declare fixed behavior and reserved space. | Manual/adapter check. |

## 4. Content and dynamic data nightmares

| Case | Why it is dangerous | BRIDGE response | Auto-check |
| --- | --- | --- | --- |
| CMS item count changes | A 3-card design breaks with 2 or 7 cards. | Declare collection rules: min/max/empty/loading. | Collection metadata check. |
| Localization expands text | German/Russian text overflows English layout. | Use hug/min-height and text expansion tolerance. | Text box risk heuristic. |
| Manual line breaks make content fit | CMS/admin/localized text arrives without designer-inserted breaks and breaks the layout. | Wrap by text area width; manual line breaks only as explicit semantic/brand exceptions. | Line-break-in-text heuristic. |
| Price/legal text changes across breakpoints | Compliance and product truth are broken. | Treat price/legal keys as strict content. | Strict content diff. |
| Rich text is flattened | Links, bold, lists, and line breaks disappear. | Declare rich-text structure. | Text node metadata check. |
| Empty/error/loading states are missing | Real product states are not implementable. | Declare required states for dynamic blocks. | State coverage check. |

## 5. Interaction nightmares

| Case | Why it is dangerous | BRIDGE response | Auto-check |
| --- | --- | --- | --- |
| Button has no action | Nobody knows what click does. | Use `[action=...]` when known, or `[control]` as a draft TODO until it is known. Navigation uses `[href=...]` or draft `[link]`. | Clickable-without-action. |
| Modal target is missing | Adapter cannot build the flow. | `action=modal:x` requires `[modal=x]`. | Interaction graph check. |
| Modal has no close behavior | User can get trapped. | Declare close control, backdrop behavior, escape behavior. | Modal structure check. |
| Form fields have no labels | Accessibility and backend mapping fail. | Declare labels, names, validation, submit target. | Form field checks. |
| Tabs/accordions/carousels have only one state | Interaction cannot be reproduced. | Declare all states and active/default state. | State group check. |
| External link target is unknown | Security/UX decisions are hidden. | Declare URL and new-tab policy if needed. | Action syntax check. |
| Hover/focus/disabled/loading states are absent | UI looks correct only in default state. | Required control states depend on component role. | Component state coverage. |

## 6. Asset and media nightmares

| Case | Why it is dangerous | BRIDGE response | Auto-check |
| --- | --- | --- | --- |
| Text is rasterized as an image | It cannot be translated, indexed, or edited. | Keep text native or mark asset reason. | Image-with-text heuristic/manual. |
| Image crop has no focal point | Responsive crops cut faces/products. | Declare focal point or crop strategy. | Asset metadata check. |
| SVG/icon is a random image | Color/theme/tokens cannot apply. | Mark icon role and theming policy. | Asset type check. |
| Video/Lottie has no fallback | Target may not support it. | Declare poster, fallback, autoplay, controls. | Media metadata check. |
| Blend modes/filters are unsupported | Visual result changes across targets. | Mark as BRIDGE Exception or flatten asset. | Adapter capability check. |

## 7. Design-system and theme nightmares

| Case | Why it is dangerous | BRIDGE response | Auto-check |
| --- | --- | --- | --- |
| Colors and spacing are one-off | Implementation drifts from system. | Prefer tokens; mark exceptions. | Token coverage check. |
| Dark mode is partial | Some elements disappear or clash. | Declare theme coverage. | Theme coverage check. |
| Component variants are missing | Button/card states are invented later. | Define required variants and states. | Component variant check. |
| Touch targets are too small | Mobile usability breaks. | Minimum touch sizes per platform. | Geometry check. |
| Contrast is risky | Accessibility fails. | Contrast threshold or manual review for images. | Contrast check. |

## 8. Strange but real cases

- A hidden old mobile frame is accidentally named like the final one.
- A modal is reused by three buttons but contains section-specific copy.
- A sticky header covers anchor targets after scroll.
- A cookie banner, chat widget, or promo bar changes viewport height.
- A designer draws validation errors but not the default form state.
- A carousel has arrows but no slide definitions.
- An animation is the only place where important content appears.
- A layer is visually a button but is named `Rectangle 44` and has no action.
- Desktop uses cards; mobile uses screenshots of the cards.
- Desktop and mobile use different currencies, prices, or legal disclaimers.

## 9. Capability and performance blind spots

| Case | Why it is dangerous | BRIDGE response | Owner/check |
| --- | --- | --- | --- |
| Oversized image/video has no delivery intent | Bandwidth, memory, and loading regress while the design still “matches.” | Declare intrinsic dimensions, formats, quality, art direction, crop safe area, poster, and priority/lazy policy. | Design declares essential media; implementation owns budget and measurement. |
| A data display assumes the fixture count | Large results freeze or become unusable. | Declare expected/max volume and pagination, streaming, or virtualization threshold. | Data + implementation test. |
| Experience assumes fast network and full power | Offline, data saver, low bandwidth, or low power loses the task. | Capability profile defines essential outcome, degraded states, cache/queue behavior, and fallback. | Target-profile QA. |
| Target lacks sticky, animation, codec, input, or chart capability | An adapter silently drops meaning. | Record support and a semantic fallback; if unknown, create an owned blocking/non-blocking open question. | Adapter capability check. |
| Budget exists only as a vague wish | Nobody can verify it. | Name metric, limit, environment, measurement point, and accountable implementation owner. | Release evidence. |

BRIDGE is not web-only: each target maps the same capability profile into native mechanisms. Safety, privacy, accessibility, and essential task completion take priority over media fidelity.

## Definition of a robust BRIDGE design

A robust BRIDGE design is not perfect because it has no exceptions. It is robust because every exception is named, justified, and checkable.
