# Validation and autochecks

BRIDGE should become comfortable because a designer can run a preflight check before handoff and see concrete, fixable problems. The methodology must therefore define not only advice, but also machine-checkable rules.

## Validation layers

1. **Syntax validation** — tags, boolean visual-intent/draft flags, optional tag values, keys, href/action syntax, breakpoint tags.
2. **Identity validation** — identity uniqueness, identity stability, breakpoint-neutral identity values, type stability, and correct exclusion of `[decor]`/`[asset]` flags from identity-tag counting.
3. **Responsive validation** — identity coverage, tree topology/cardinality, parent-child stability, visibility changes, visual-intent drift, content drift, order changes, breakpoint completeness.
4. **Structure validation** — page/section/content-container Auto Layout, forbidden non-asset GROUP nodes, wrappers, clipping, positioning intent, fixed heights, overlaps.
5. **Interaction graph validation** — href links, draft link/control markers, actions, targets, modals, states, forms.
6. **Content validation** — text equality, strict legal/price content, rich text, localization risk; skip product-content drift checks for text inside decorative/root asset visuals.
7. **Asset validation** — asset policy, native text misuse, export settings, focal points.
8. **Accessibility validation** — contrast risk, touch targets, labels, focusable states, decorative layers hidden from the accessibility tree.
9. **Adapter capability validation** — target-specific unsupported features.

## Automation levels

- **Automatic** — can be checked deterministically from extracted design data.
- **Heuristic** — can be detected with confidence, but may need designer confirmation.
- **Manual** — must be checked by a human, but the checklist should make it explicit.

## Report severity

- **error** — blocks BRIDGE-ready status.
- **warning** — requires explanation or fix before serious transfer.
- **info** — useful context for implementers and adapters.

## Minimum validator pipeline

```text
extract design tree
  -> normalize names, boolean visual-intent tags, optional tag values, keys, and Figma metadata
  -> group roots by page, then by view, then by breakpoint
  -> build identity map and type map
  -> check optional identity-bearing values against current breakpoint names/widths
  -> compare responsive tree cardinality and parent identities only inside one page/view group
  -> compare visibility, sibling order, and visual-intent flags inside each parent
  -> compare product content across breakpoints, excluding decorative/root asset visuals
  -> classify page, section, generic content-container, primitive/leaf, component-instance, and opaque asset boundaries
  -> inspect native node type and layout mode; require Auto Layout and reject non-asset GROUP nodes
  -> validate exact-node absolute decor/overlay intent without treating [decor] as a structural exemption
  -> classify remaining wrappers and positioning intent
  -> build href/action-target graph
  -> inspect geometry, overflow, and fixed heights
  -> check assets and component states
  -> emit report with rule IDs, severity, location, and fix hints
```

## Rule catalog overview

The machine-readable seed lives in [`../validator/rules.json`](../validator/rules.json).

| Group | Example rule | Severity | Automation |
| --- | --- | --- | --- |
| Identity | `identity.missing-stable-identity` | error | automatic |
| Identity | `identity.same-identity-different-type` | error | automatic |
| Identity | `identity.breakpoint-specific-id` | error | automatic |
| Identity | `identity.decor-asset-flags-not-identities` | error | automatic |
| Identity | `identity.multiple-identity-tags` | warning | automatic |
| Syntax | `syntax.decor-asset-value-not-kebab-case` | error | automatic |
| Syntax | `syntax.identity-value-not-kebab-case` | warning | automatic |
| Syntax | `syntax.duplicate-tag` | error | automatic |
| Syntax | `syntax.figma-metadata-tag-invalid` | error | automatic |
| Structure | `layout.page-root-missing-auto-layout` | error | automatic |
| Structure | `layout.page-root-cannot-be-asset` | error | automatic |
| Structure | `layout.section-missing-auto-layout` | error | automatic |
| Structure | `layout.container-missing-auto-layout` | error | automatic |
| Structure | `layout.group-outside-asset` | error | automatic |
| Structure | `layout.positioned-without-intent` | warning | automatic |
| Section | `section.component-source-unclassified` | warning | heuristic |
| Section | `section.redundant-instance-section-tag` | warning | heuristic |
| Component | `component.ui-kit-used-as-section` | warning | heuristic |
| Responsive | `responsive.identity-missing-in-required-breakpoint` | error | automatic |
| Responsive | `responsive.view-missing-required-breakpoint` | error | automatic |
| Responsive | `responsive.tree-cardinality-changed` | error | automatic |
| Responsive | `responsive.parent-changed-across-breakpoints` | error | automatic |
| Responsive | `responsive.visual-intent-drift` | error | automatic |
| Content | `content.text-changed-between-breakpoints` | error | heuristic |
| Content | `content.decorative-asset-text-excluded-from-product-drift` | info | automatic |
| Content | `content.manual-line-break-in-dynamic-text` | error | heuristic |
| Structure | `layout.one-child-wrapper-without-role` | warning | heuristic |
| Structure | `layout.overlap-without-overlay-role` | warning | heuristic |
| Interaction | `interaction.clickable-without-action` | warning | heuristic |
| Interaction | `interaction.link-without-href` | info | automatic |
| Interaction | `interaction.control-without-action` | info | automatic |
| Interaction | `interaction.href-placeholder-invalid` | error | automatic |
| Interaction | `interaction.href-invalid` | error | automatic |
| Interaction | `interaction.optional-id-value-invalid` | error | automatic |
| Interaction | `interaction.action-invalid` | error | automatic |
| Interaction | `interaction.control-action-duplicate` | error | automatic |
| Interaction | `interaction.modal-target-missing` | error | automatic |
| Interaction | `interaction.form-target-missing` | error | automatic |
| Interaction | `interaction.reset-target-missing` | warning | automatic |
| Routing | `routing.page-route-missing` | info | automatic |
| Routing | `routing.page-root-required` | error | automatic |
| Routing | `routing.default-view-missing` | warning | automatic |
| Routing | `routing.route-not-production-url` | error | automatic |
| Height | `height.fixed-height-without-reason` | warning | automatic |
| Overflow | `overflow.text-clipping-risk` | error | heuristic |
| Asset | `asset.raster-text-without-reason` | error | heuristic/manual |
| Accessibility | `accessibility.decorative-layer-exposed` | warning | automatic |
| Interaction | `interaction.form-field-missing-label` | warning | automatic |

For `layout.section-missing-auto-layout`, automatic means a non-page FRAME or COMPONENT carrying `[section]` is present in the audited tree. A placed INSTANCE is atomic: Page Check 0.8 neither resolves its source component nor emits a section-layout finding for the instance. Select and audit the editable source tree separately.

## Suggested report format

```json
{
  "methodology": "BRIDGE",
  "status": "not-ready",
  "summary": {
    "errors": 3,
    "warnings": 8,
    "info": 4
  },
  "issues": [
    {
      "ruleId": "interaction.modal-target-missing",
      "severity": "error",
      "nodeId": "contact-cta",
      "breakpoint": 320,
      "message": "Button references modal `contact-modal`, but no modal target exists.",
      "fix": "Create `[modal=contact-modal]` or change the action."
    }
  ]
}
```

## Checklist modes

### Designer quick check

Use before showing the file to engineering:

- missing identities;
- missing actions;
- obvious fixed-height text;
- missing modal/state targets;
- changed mobile copy.

### Reviewer strict check

Use before approving a handoff:

- full rule catalog;
- edge-case checklist;
- state coverage;
- accessibility warnings;
- adapter capability notes.

### Adapter certification check

Use to prove that a target implementation path supports BRIDGE:

- supported tags;
- supported actions;
- unsupported visual features;
- asset fallback behavior;
- responsive mapping rules.

## What should block handoff immediately

- Missing stable identity on important elements.
- Duplicate identities inside a breakpoint/view scope.
- Responsive trees compared across different `[view=...]` values. Each view is a separate responsive contract and is compared only across its own breakpoints.
- Breakpoint-specific optional identity value, for example `[control=button-reviews-box-375]` inside a `[bp=375]` root.
- Same identity used for different logical types.
- Page root has native Auto Layout disabled; zero/one child, `[asset]`, `[decor]`, or exception metadata on the page root does not suppress the rule.
- Page root carries `[asset]`; this is a separate blocker, does not create an opaque boundary, and does not stop descendant validation.
- Frame-built section has native Auto Layout disabled, unless that exact section is a legitimate opaque whole-visual `[asset]` with no live content flow.
- Generic Auto Layout-capable container has two or more visible meaningful direct flow children while Auto Layout is disabled.
- Figma `GROUP` exists outside an opaque `[asset]` subtree. Manual-layout plus reason documents a proposed deviation but does not suppress the structural error.
- Stable decorative/asset root identity missing on a required breakpoint.
- Responsive element tree cardinality or parent-child topology changes without a structural exception.
- Visual intent drift such as `sneg [decor] [asset]` on desktop becoming plain `sneg` on mobile.
- Final clickable element without known `[href=...]` or `[action=...]`; draft `[link]` / `[control]` markers are TODOs, not syntax errors.
- Invalid unknown href placeholder `[href=#]`; use `[link]` instead.
- Fake or placeholder `[route=...]` value; omit route until the production URL is known.
- Action target missing.
- Page root without route is a Draft TODO (`routing.page-route-missing`), not a blocker.
- Modal without close behavior.
- Text fixed height with no overflow policy.
- Dynamic text that relies on manual line breaks.
- Hidden keyed layers used as source of truth.
- Rasterized text without explicit reason.

## False positives are acceptable

A validator should prefer useful friction over silent failure. False positives are acceptable if the report explains how to mark an intentional exception:

```text
[bridge-exception=overlay] [reason=decorative-layered-composition]
```

The goal is not to forbid complex design. The goal is to make complexity explicit. Structural Auto Layout/GROUP errors remain reported even when `[bridge-exception=manual-layout] [reason=...]` is present; those tags provide evidence for a separate deviation-acceptance gate rather than a Page Check pass. `[bridge-exception=overlay] [reason=...]` may satisfy positioning intent for the exact absolute overlay node.
