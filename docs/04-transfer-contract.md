# BRIDGE transfer contract

The BRIDGE Contract is an advanced, versioned, target-independent record that connects design evidence to implementation and QA. Use this page for integrations and tooling, not as the first reading for a designer. The structured envelope and [JSON Schema](../validator/bridge.schema.json) may evolve before 1.0, so every exchange pins `contractVersion`, `methodologyVersion`, and `rulesVersion`.

## Two complementary surfaces

BRIDGE deliberately avoids turning layer names into a database.

### Short layer tags

A designer uses a small grammar for intent that must remain visible while browsing the design:

```text
catalog [page=catalog] [route=/catalog] [bp=1200] [view=default]
  products [section=product-results]
    product-grid [collection=products]
      product-card-oak-chair [item=product]
  filter [action=state:filters-open]
```

Tags locate pages, variants, sections, links/actions, targets, fields, collections, visual policy, overflow, and explicit exceptions. They do not carry a data schema, state graph, motion timeline, accessibility test plan, or delivery history.

### Structured `bridge` metadata

Rich intent lives in one namespaced object. It references the stable identities visible in the design and may be stored as Figma plugin data, a sidecar JSON file, or an adapter payload. It must travel with the handoff and be validated as a unit.

```text
Figma/source metadata + short BRIDGE anchors + structured bridge metadata
                                ↓
                    one transferable contract
```

Do not invent new flat tags when a structured field already exists.

## Required envelope

A complete payload has a `bridge` root. The core envelope includes:

| Field | Purpose |
| --- | --- |
| `contractVersion` | Version of the structured payload shape. |
| `methodologyVersion` | BRIDGE release used to prepare the transfer. |
| `rulesVersion` | Rule catalog version used for validation. |
| `source` | Tool, file/page, immutable revision, and capture context. |
| `context` | Declared transfer scope, product/page context when applicable, included axes, and external dependencies. |
| `identity` | Mapping across role, template, design instance, runtime data, and target implementation. |
| `structure` | Logical trees in declared responsive/data contexts. Native Figma node type, layout mode, positioning, and asset boundaries remain source evidence validated alongside this tree. |
| Contract modules | `data`, `responsive`, `interaction`, `motion`, `accessibility`, `capabilities`, and `lifecycle` as applicable. |
| `openQuestions` | Known unknowns with owner, scope, blocking status, review point, and fallback. |
| `exceptions` | Intentional source/contract exceptions with impact and mitigation. |

An omitted module means “not applicable” only when the scope proves that it is not applicable. It must not mean “nobody checked.”

## Selected-section scope inside a legacy host

A team may apply BRIDGE to one new section without migrating the surrounding product. The boundary is an explicitly selected source root carrying a stable section identity:

```text
checkout-summary [section=checkout-summary]
```

Do not turn the section into a fake page. `[page]`, `[bp]`, `[view]`, and `[route]` remain page-root tags and must not be added merely to run validation. **Check selected section** traverses only the normalized selected root and its descendants. A selected editable `FRAME` or `COMPONENT` receives the full local source audit; a `GROUP` remains a blocking structural finding. When the normalized selected section root itself is an `INSTANCE`, only boundary evidence is available and the result is Partial. An ordinary descendant `INSTANCE` is a trusted atomic boundary whose internals are not applicable to this selected-source traversal and does not lower Ready. An exact `[section=id] [asset]` root is a valid opaque whole-visual boundary with internal layout N/A. A section below a different non-page-root `[asset]` ancestor is instead an invalid Blocked scope: the check cannot pierce an inherited opaque boundary. An illegal `[asset]` on a page root never creates opacity; Page Check reports that root separately and descendants remain inspectable. `[decor]` alone never stops traversal.

The structured scope records what was selected and what remains outside it. This is a **non-standalone fragment**; insert it into the required `bridge` envelope:

```json
{
  "context": {
    "project": "Legacy storefront section adoption",
    "scope": {
      "kind": "section",
      "rootIdentity": "checkout-summary",
      "boundary": "selected-subtree",
      "assetBoundary": "none",
      "hostCompliance": "legacy-out-of-scope",
      "selectionMode": "explicit-variants",
      "contextIds": ["summary-container-360", "summary-container-1200"],
      "readinessClaim": "section-source-only"
    },
    "externalDependencies": [{
      "id": "checkout-route-dependency",
      "kind": "route",
      "reference": "/checkout",
      "status": "deferred",
      "owner": "storefront-platform",
      "reviewAt": "host integration gate"
    }]
  },
  "responsive": {
    "defaultPolicy": "same-tree",
    "contexts": [
      {
        "id": "summary-container-360",
        "driver": "container",
        "width": 360,
        "label": "Container 360",
        "labelSource": "inferred-from-selected-root-width"
      },
      {
        "id": "summary-container-1200",
        "driver": "container",
        "width": 1200,
        "label": "Container 1200",
        "labelSource": "inferred-from-selected-root-width"
      }
    ]
  }
}
```

`assetBoundary` is `none` for an editable or atomic source root and `selected-root-opaque` only when that exact selected section root carries `[asset]`. An ancestor asset boundary cannot form a valid section-scope contract. `single-root` declares one requested context and can be source-ready without inventing unrequested variants. `explicit-variants` means that the user explicitly selected two or more roots with the same `[section]` identity for comparison; the validator must not discover legacy siblings and silently expand scope. When a tool derives a context label from a selected root or container width, it records `labelSource: inferred-from-selected-root-width` rather than presenting the label as authored intent.

An action target resolved inside the selected roots is local. A complete valid `http:`, `https:`, `mailto:`, or `tel:` href is authored-resolved for section-source scope and does not cause Partial; its runtime availability remains outside source validation. An incomplete or malformed external href is a blocking `interaction.href-invalid` finding, not Deferred. Internal routes/anchors, modal/state/form/reset targets, components, and data that require lookup outside the selected roots are neither “missing” nor proven: link an external contract or record them in `externalDependencies` as deferred/unverified, then resolve them at the separate file/host integration check. The complete executable example is [`bridge-section-contract.valid.json`](../validator/examples/bridge-section-contract.valid.json).

A successful section-scope contract means **section source ready for the declared selected contexts**. It never means that the legacy host page, routes, complete responsive set, end-to-end journey, implementation, product, or WCAG conformance is BRIDGE-ready.

## Identity is a mapping, not one overloaded id

A single name cannot safely represent every identity involved in transfer. BRIDGE separates five dimensions:

| Dimension | Question | Example |
| --- | --- | --- |
| `role` | What logical job does this element perform? | data item / product |
| `template` | Which reusable definition owns its shape and behavior? | `product-card` |
| `designInstance` | Which authored occurrence is this in the design and contexts? | `product-card-oak-chair` |
| `runtimeData` | Which record-key rule/fixture binds content at runtime? | collection `products`, key field `sku` |
| `target` | Which implementation entity realizes it? | web component `ProductCard` |

`bridgeKey` connects contract references; it does not collapse those dimensions. The value `[item=product]` is a repeatable role/type, not a unique design fixture or runtime record id. A positional name like `product-card-3` may be a temporary design fixture identity, but it must never become the runtime record key. Sorting, filtering, pagination, live updates, and duplicate-looking records require a stable product key.

Interaction targets are different: a reaction refers to the `bridgeKey` of a modal, state, form, route, or element. The `identity.elements[].target` field maps an element to implementation code or another target platform.

## Canonical illustrative payload

This example is intentionally broad enough to show the composition of modules. Real payloads include only applicable modules but keep the same namespaced shape.

```json
{
  "bridge": {
    "contractVersion": "0.2.0",
    "methodologyVersion": "0.11.5",
    "rulesVersion": "0.5.0",
    "source": {
      "tool": "figma",
      "fileKey": "example-file-key",
      "pageId": "12:4",
      "pageName": "Catalog",
      "versionId": "figma-version-2026-08-13T10:20Z",
      "capturedAt": "2026-08-13T10:25:00Z"
    },
    "context": {
      "transferId": "catalog-default",
      "page": "catalog",
      "route": "/catalog",
      "view": "default",
      "axes": { "locale": "en-US", "theme": "light" },
      "contextIds": ["catalog-1200", "catalog-360"]
    },
    "identity": {
      "elements": [{
        "bridgeKey": "product-card-oak-chair",
        "role": { "kind": "data-item", "semantics": "product" },
        "template": {
          "templateKey": "product-card",
          "sourceComponentId": "55:8",
          "sourceComponentName": "UI Kit / Product Card"
        },
        "designInstance": {
          "designInstanceKey": "product-card-oak-chair",
          "sourceNodes": [
            { "contextId": "catalog-1200", "nodeId": "401:72", "layerPath": ["Catalog / 1200", "product-grid", "product-card-oak-chair"] },
            { "contextId": "catalog-360", "nodeId": "509:21", "layerPath": ["Catalog / 360", "product-grid", "product-card-oak-chair"] }
          ]
        },
        "runtimeData": {
          "collection": "products",
          "keyField": "sku",
          "fixtureKey": "oak-chair",
          "runtimeDataKey": "sku:CHAIR-OAK-01"
        },
        "target": {
          "platform": "web",
          "kind": "component",
          "targetKey": "ProductCard",
          "locator": "src/catalog/ProductCard"
        }
      }]
    },
    "structure": {
      "contexts": [
        { "id": "catalog-1200", "rootIdentity": "catalog", "tree": { "product-results": ["product-grid", "filter-button"] } },
        { "id": "catalog-360", "rootIdentity": "catalog", "tree": { "product-results": ["product-grid", "filter-button"] } }
      ]
    },
    "data": {
      "displays": [{
        "displayId": "product-grid",
        "purpose": "Browse products matching the active catalog query",
        "source": { "owner": "catalog-service", "dataset": "products", "refresh": "request" },
        "dimensions": [{ "key": "sku", "type": "string" }],
        "measures": [{ "key": "price", "type": "decimal", "currency": "USD" }],
        "format": { "locale": "user", "currencyDisplay": "symbol" },
        "states": ["loading", "empty", "error", "partial", "stale"]
      }]
    },
    "responsive": {
      "defaultPolicy": "same-tree",
      "contexts": [
        { "id": "catalog-1200", "driver": "viewport", "width": 1200 },
        { "id": "catalog-360", "driver": "viewport", "width": 360 }
      ],
      "transformations": [{
        "id": "comparison-table-to-disclosures",
        "fromContext": "comparison-wide",
        "toContext": "comparison-narrow",
        "when": { "driver": "container", "container": "comparison-panel", "condition": "max-width: 480px" },
        "mappings": [{ "source": ["comparison-table"], "target": ["comparison-disclosures"], "semantics": "same-records-and-fields" }],
        "preserves": ["content", "actions", "field-relationships", "selection", "accessible-names"],
        "readingOrder": ["comparison-heading", "comparison-disclosures"],
        "focusOrder": ["comparison-disclosure-trigger:*"],
        "stateTransfer": "preserve-selection-and-open-record",
        "history": "no-new-entry"
      }]
    },
    "interaction": {
      "stateMachines": [{
        "id": "catalog-filter",
        "initial": "idle",
        "states": ["idle", "pending", "results", "empty", "failure"],
        "transitions": [{
          "id": "apply-filter",
          "from": ["idle", "results", "empty", "failure"],
          "event": { "type": "submit", "source": "catalog-filter-form" },
          "pending": { "to": "pending", "duplicateEvent": "replace-with-latest" },
          "outcomes": {
            "success": { "to": "results", "focus": "results-heading", "announce": "Results updated" },
            "empty": { "to": "empty", "focus": "results-heading" },
            "failure": { "to": "failure", "focus": "filter-error", "retry": "preserve-values" }
          },
          "history": "replace-query"
        }]
      }]
    },
    "motion": { "sequences": [] },
    "capabilities": {
      "profiles": [{
        "id": "mobile-low-bandwidth",
        "target": { "platform": "web", "runtime": "browser" },
        "essentialExperience": ["product-name-and-price", "filter-and-open-product"],
        "supports": ["responsive-images", "offline-cache"],
        "unsupported": [{ "capability": "scroll-timeline", "fallback": "static-scenes", "owner": "storefront" }],
        "assets": [{
          "element": "product-image",
          "width": 960,
          "height": 960,
          "formats": ["avif", "webp", "jpeg"],
          "quality": "product-detail-visible",
          "artDirection": "square-crop-with-subject-safe-area",
          "loading": { "priority": "results-dependent", "poster": null, "strategy": "lazy-outside-first-window" }
        }],
        "data": { "expectedItems": 48, "maximumItems": 10000, "virtualizeAfter": 200, "strategy": "server-pagination" },
        "conditions": ["low-bandwidth", "offline", "data-saver", "low-power"],
        "budgets": [{ "metric": "initial-results-payload", "limit": 250, "unit": "KiB", "owner": "storefront", "measureAt": "release-qa" }]
      }]
    },
    "accessibility": {
      "profile": { "standard": "WCAG", "version": "2.2", "level": "AA" },
      "elements": [{
        "element": "product-grid",
        "name": "Catalog results",
        "readingOrder": ["results-heading", "active-filters", "product-grid", "pagination"],
        "testIds": ["catalog-results-keyboard", "catalog-results-reflow"]
      }]
    },
    "lifecycle": {
      "transferId": "catalog-default",
      "contractRevision": "7",
      "sourceRevision": "figma-version-2026-08-13T10:20Z",
      "targetRevision": "build-1842",
      "status": "qa",
      "owners": { "design": "catalog-design", "contract": "design-systems", "implementation": "storefront", "qa": "quality" },
      "requirements": ["REQ-CATALOG-017", "REQ-CATALOG-021"],
      "evidence": { "tests": ["catalog-grid-default", "catalog-grid-keyboard"] },
      "deviations": []
    },
    "openQuestions": [{
      "id": "OPEN-CATALOG-003",
      "scope": ["catalog", "offline"],
      "question": "May users open a product from stale cached results?",
      "owner": "catalog-product",
      "blocking": true,
      "due": "2026-08-18",
      "reviewAt": "contract-gate",
      "fallback": "Show cached results read-only and disable product navigation",
      "status": "open"
    }],
    "exceptions": []
  }
}
```

The layer tags in the example remain the human-visible anchors; the payload adds relationships and decisions that cannot fit safely in names.

## Same tree by default, transformation by declaration

`responsive.defaultPolicy` is `same-tree`. Geometry, Auto Layout direction, wrapping, order inside the same logical parent, and declared visibility may change without a structural mapping.

A topology or presentation change is valid only as a `responsive.transformations[]` record. It names source and result identities, the viewport/container condition, field/scene/action mapping, semantics preserved, reading and focus order, state transfer, and history behavior. If no transformation covers a difference, the difference is contract drift.

### Native layout remains required source evidence

The structured `bridge.structure` tree does not duplicate Figma's native `layoutMode`, node type, or positioning fields. A source validator reads those fields directly and applies the rule catalog:

- page roots always use native Auto Layout and cannot be `[asset]`;
- frame-built section roots and `Page Sections` source roots use Auto Layout unless the exact section is a legitimate opaque whole-visual asset;
- generic Auto Layout-capable containers with at least two visible meaningful flow children use Auto Layout;
- GROUP nodes are valid only inside a genuine opaque `[asset]` subtree;
- primitive/leaf geometry and placed INSTANCE internals are not treated as content-flow containers;
- `[decor]` identifies only the exact intended absolute visual node and never creates a structural exemption.

Page Check treats a placed INSTANCE as atomic and does not resolve its source component for the section-layout rule; audit the editable source root separately. An asset root still appears as one identity in the logical tree and one item in its parent's Auto Layout. A manual-layout exception with a reason may accompany a reported structural deviation, but it does not change the source evidence or turn a failing Page Check into a pass.

## Explicit unknowns: no untracked blind spots

BRIDGE does **not** promise that every decision is already known. It promises that no relevant unknown is untracked.

`unknown`, `unsupported`, `TBD`, and equivalent states are valid only as an `openQuestions[]` record with:

- a stable id and precise scope;
- the question or unsupported capability;
- an accountable owner;
- blocking status;
- due date or named review gate;
- safe fallback while unresolved;
- current status and decision link when resolved.

If the fallback would be unsafe, inaccessible, misleading, or destructive, the question is blocking and the affected scope cannot pass its gate. A question that exists only in speech, chat, a detached task, or someone's memory is a BRIDGE blind spot.

## Target capability and performance profile

The contract must not assume every target has the same codecs, input, layout primitives, memory, network, or power. `capabilities.profiles[]` declares the target/runtime, essential experience that must survive degradation, supported and unsupported capabilities, and a tested fallback for each unsupported requirement.

For media/assets, declare intrinsic dimensions, acceptable formats and quality, art direction/crop safe area, loading priority, poster/preview, and preload versus lazy behavior. For data, declare expected/maximum volume and the pagination, streaming, or virtualization threshold. Cover low bandwidth, offline, data-saver, low-power, reduced-motion, and missing-API conditions where applicable.

Design owns the declaration of essential content, media, sequence, and task outcome. Implementation owns measurable performance budgets, delivery strategy, instrumentation, and evidence. A capability or budget that is not yet known becomes an owned open question with a safe fallback; it is not inferred from the prettiest design frame.

## Source precedence and inheritance

Use one owner for each fact:

1. target-platform safety, security, privacy, and native semantics constrain all other sources;
2. approved product/content decisions define meaning;
3. the structured BRIDGE contract defines intent not expressible by the source tool;
4. Figma/source metadata defines authored structure, components, geometry, and styling;
5. pinned component/system contracts supply inherited behavior;
6. an explicit approved exception/deviation records any remaining difference.

Do not copy a component state machine onto every instance. Reference the pinned template, then declare only instance-specific content, overrides, and context.

## Validation

A contract validator should check:

- schema and pinned version fields;
- unique `bridgeKey`, design-instance, requirement, question, exception, and deviation ids in scope;
- valid references between identities, trees, displays, transformations, reactions, motion, accessibility, and tests;
- source nodes and contexts exist;
- runtime record mappings are not positional fixture indexes;
- same-tree parity unless an applicable transformation covers the difference;
- capability profiles include asset/media, data-volume, degradation, unsupported-feature fallback, and owned budgets as applicable;
- state-machine reachability and action targets;
- required data states and accessibility profile;
- open questions contain owner, scope, blocking status, review point, and fallback;
- temporary exceptions/deviations have review/expiry dates and evidence.

A valid JSON document is not automatically a valid product contract. Deterministic schema checks, design-source checks, and manual semantic review are complementary.

## Compatibility before 1.0

- Producers must emit an explicit `contractVersion`.
- Consumers must reject unsupported major shapes and report unknown fields without silently discarding required meaning.
- Additive extension fields should remain namespaced and documented.
- Migrations must preserve stable identities and requirement links.
- A contract revision is immutable once accepted for an implementation/QA run; changes create a new revision.

See [Data and visualization](20-data-and-visualization.md), [Responsive breakpoints](03-responsive-breakpoints.md), [State machines and reactions](22-state-machines-and-reactions.md), [Motion and long scroll](21-motion-and-scroll.md), [Accessibility profile](23-accessibility-profile.md), and [Delivery lifecycle](24-delivery-lifecycle.md).
