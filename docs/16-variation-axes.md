# Variation axes

BRIDGE separates the reasons a design changes. One axis must not hide the effect of another.

## Core rule

> A breakpoint is the same logical tree in another layout by default. A different composition requires a declared responsive transformation; width alone never explains it.

Content changes require a content-bearing axis. Topology that changes only to preserve responsive usability requires a mapped transformation. Neither may appear as unexplained drift between roots.

## Canonical axes

| Axis | Design anchor | May content change? | Purpose |
| --- | --- | --- | --- |
| Page | `[page=...]` | No by itself | Logical page identity |
| Route | `[route=...]` / `[route-pattern=...]` | No | Known production URL/path template |
| Breakpoint | `[bp=...]` | No | Authored responsive width anchor |
| View | `[view=...]` | Yes, state-specific | Page/data state such as loading, empty, partial, or error |
| Locale | `[locale=...]` | Yes | Translation and regional formatting |
| Direction / writing mode | Structured context | No by itself | `ltr`/`rtl` and horizontal/vertical logical flow |
| Theme | `[theme=...]` | No | Visual token context |
| Experiment | `[experiment=...]` | Yes, controlled | Product experiment |
| Role | `[role-view=...]` | Yes, controlled | User/permission view |
| Data scenario | `[data=...]` | Fixtures only | Long, missing, minimum, maximum, stale, or failed data |
| Target/capability | Structured context/profile | Only through a decision | Supported platform/input/media/performance capabilities and fallback |

Tags are short design anchors. Direction, writing mode, capabilities, mappings, and acceptance criteria belong in structured `bridge.context`, `bridge.responsive`, or a target capability profile.

## Breakpoint axis

```text
catalog [page=catalog] [route=/catalog] [bp=1200] [view=default]
catalog [page=catalog] [route=/catalog] [bp=360] [view=default]
```

The default permits geometry, spacing, type scale, natural wrapping, column count, and visual arrangement to change. It does not permit silent content, action, data, semantic relationship, or accessibility loss. See [Responsive behavior](03-responsive-breakpoints.md).

## View axis

Views are reachable page/data fixtures:

```text
catalog [page=catalog] [route=/catalog] [bp=1200] [view=default]
catalog [page=catalog] [route=/catalog] [bp=1200] [view=loading]
catalog [page=catalog] [route=/catalog] [bp=1200] [view=empty]
catalog [page=catalog] [route=/catalog] [bp=1200] [view=error]
```

A view may change content because the product state changed. Matching breakpoints within that view still follow the same-tree default or a declared transformation. Component microstates remain in the component/state-machine contract rather than becoming page roots.

## Locale axis

```text
contacts [page=contacts] [route=/contacts] [bp=1200] [locale=en-US]
contacts [page=contacts] [route=/contacts] [bp=1200] [locale=ru-RU]
```

Locale may change translation, pluralization, date/number/currency formatting, and legal content selected by product rules. Test expansion, unbreakable values, font coverage, and formats. Locale is not a workaround for shorter mobile copy.

## Direction and writing mode

Locale and direction are related but not interchangeable. Record `direction: ltr | rtl` and `writingMode` in structured context:

```json
{
  "direction": "rtl",
  "writingMode": "horizontal-tb"
}
```

Declare whether composition mirrors; use logical start/end; identify icons that mirror and those that remain fixed; cover mixed-direction names, phone numbers, dates, ids, code, and digits; define chart axes/category order; preserve semantic reading and keyboard order independently of visual mirroring; and include RTL/bidirectional stress fixtures and screenshots when supported.

## Theme axis

```text
dashboard [page=dashboard] [bp=1200] [theme=light]
dashboard [page=dashboard] [bp=1200] [theme=dark]
```

Theme changes tokens, media choices, and perhaps contrast treatment. It must not silently change product copy, data, action, or available feature. Test every interactive, data, focus, disabled, error, and forced/high-contrast state rather than only the default background.

## Experiment axis

```text
pricing [page=pricing] [route=/pricing] [bp=1200] [experiment=cta-a]
pricing [page=pricing] [route=/pricing] [bp=1200] [experiment=cta-b]
```

Experiments may change approved content or flows. Define hypothesis, assignment, exposure event, metrics, duration/ownership, fallback, accessibility parity, and interaction/history mapping. Do not disguise an experiment as a breakpoint.

## Role axis

```text
dashboard [page=dashboard] [route=/dashboard] [bp=1200] [role-view=guest]
dashboard [page=dashboard] [route=/dashboard] [bp=1200] [role-view=admin]
```

Role/permission variants may change information and actions. The authorization system remains the runtime source of truth; hiding a layer is not security. Cover transitions when permissions change while the page is open.

## Data-scenario axis

Data scenarios are QA fixtures, not production variants:

```text
product-card [data=short]
product-card [data=long]
product-grid [collection=products] [data=max-items]
product-grid [collection=products] [data=empty]
```

Cover zero, one, typical, maximum/unknown counts, long and mixed-direction text, missing values/media, duplicates, partial, stale, failed, and unauthorized data. Fixture order or numeric suffix is never the runtime record identity. See [Data and visualization](20-data-and-visualization.md).

## Target and capability profile

A target may differ because it lacks hover, sticky positioning, scroll timelines, a chart primitive, a codec, memory, bandwidth, or another capability. Do not turn each capability into a flat tag. The structured target profile declares:

- platform/runtime and supported input/output capabilities;
- asset/media formats, dimensions, quality variants, and art direction;
- loading priority, poster/preview, preload versus lazy behavior;
- expected data volume and the threshold/strategy for pagination or virtualization;
- low-bandwidth, offline, data-saver, low-power, and reduced-motion behavior;
- unsupported-capability fallback and owner;
- performance budgets and where implementation measures them.

Design declares which media, information, and experience are essential. Implementation owns measurable budgets and platform mapping. An unknown capability is an explicit owned `openQuestions[]` record, not an assumed fallback.

## Axis composition

A transfer context may compose axes:

```text
catalog [page=catalog] [route=/catalog] [bp=360] [view=empty] [locale=ar-SA] [theme=dark]
```

Structured context may add `direction: rtl`, `writingMode: horizontal-tb`, and target profile `mobile-low-bandwidth`. Pairwise/full combinations are selected by risk; teams need not draw the Cartesian product, but every omitted combination must inherit deterministically or be recorded as an open question.

## Invalid examples

```text
// breakpoint hides a content experiment
hero-title desktop = "Launch your store in one day"
hero-title mobile = "Launch faster"

// fake locale hides mobile copy
hero [bp=320] [locale=mobile-short]

// theme changes product behavior
delete [theme=light] [action=modal:confirm-delete]
delete [theme=dark] [action=none]
```

## Validation

A validator or review should report:

- content/action/data changes across breakpoint or theme without an applicable axis;
- topology changes without a responsive transformation;
- locale used to encode device/layout;
- direction reduced to visual mirroring without bidi, reading, keyboard, icon, and chart decisions;
- an experiment without approved ownership and instrumentation;
- role-specific visibility treated as authorization;
- data fixtures used as runtime identity or production variants;
- unsupported target capabilities without fallback, owner, budget, or open question;
- ambiguous inheritance for an unprepared axis combination.
