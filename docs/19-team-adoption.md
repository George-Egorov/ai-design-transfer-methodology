# Adopt BRIDGE with one real scope

Do not begin by renaming a library or migrating an archive. Run a small pilot on one production page or one new selected section, let someone other than its designer use the result, and decide from evidence whether BRIDGE belongs in the team workflow.

## What the pilot should answer

The pilot is successful only if it answers practical questions:

- Can another person identify the page, view, breakpoints, actions, targets, and export intent without a call with the author?
- Does BRIDGE reveal missing intent before implementation starts?
- How much preparation and review time does the team actually spend?
- Which findings block handoff, which need discussion, and which are intentional exceptions?

The goal is not to make one showcase file look perfect. The goal is to test a repeatable handoff on representative work.

## Choose a useful pilot

Use one active page that is small enough to review in a session and rich enough to expose real ambiguity. It should contain:

- at least two breakpoints;
- at least one link or control with a real destination;
- at least one modal, state, form, anchor, or other target;
- a component or section whose structure matters;
- content plus either decoration or an exported asset.

Avoid a toy screen created only for the pilot. Do not migrate old files first: an untouched archive is not a blocker.

### When the host product is legacy

Do not retrofit page tags onto an otherwise non-BRIDGE file merely to validate one new section. Create or select an explicit boundary such as:

```text
checkout-summary [section=checkout-summary]
```

Select that root and run **Check selected section**. For responsive evidence, explicitly select two or more roots with the same `[section]` value; the command compares only those selected variants and never discovers legacy siblings. Do not add `[page]`, `[bp]`, `[view]`, or `[route]` to the section. A single selected root declares one requested source context and does not fail merely because unrequested variants are absent. The selected root may itself be `[section=id] [asset]` when the entire section is one opaque visual, but a section nested below a different asset ancestor is Blocked because the audit cannot pierce that boundary.

![Selected-section gate isolating one BRIDGE section inside a legacy page, with asset and instance boundaries and file/host-dependent references outside the selected roots deferred](../assets/diagrams/section-scope-gate.svg)

*Only the selected section subtree is checked. Opaque assets stop traversal, descendant instances are trusted atomic boundaries, decorative layers remain traversed, and file/host resolution is a separate check.*

The result is intentionally narrow:

- **Ready** — no blocking findings, warnings/TODOs, or deferred checks remain for the declared selected scope;
- **Partial** — the selected source has no blocking error but still has a warning/TODO, a selected-root `INSTANCE`, an indistinguishable selected context, or a deferred reference that needs file/host lookup;
- **Blocked** — the tagged boundary is missing/invalid or lies below an inherited opaque asset boundary, selected roots are nested or mix section identities, or a blocking finding remains.

Complete valid `http:`, `https:`, `mailto:`, and `tel:` hrefs are authored-resolved and do not cause Partial; incomplete or malformed external hrefs are blocking syntax errors, not Deferred. A normal descendant instance is a trusted atomic boundary and also does not lower Ready; only a selected section root that is itself an `INSTANCE` is partial source evidence.

Ready means **section source ready for the declared contexts**, not that the host page, route, complete responsive set, journey, implementation, product, or WCAG conformance is ready. Resolve only file/host-dependent references outside the selected roots plus host placement in a separate file/integration check. See the [transfer contract](04-transfer-contract.md#selected-section-scope-inside-a-legacy-host) and [section-scope preflight](08-preflight-checklist.md#selected-section-profile-for-a-legacy-host).

## Assign three roles

| Role | Responsibility |
| --- | --- |
| Designer | Prepares the selected page and explains nothing during the handoff test. |
| Developer or reviewer | Reads the file, runs the checks, and records every question or assumption. |
| Manager or process owner | Defines the success threshold, protects the pilot scope, and decides whether to expand it. |

One person may hold more than one role, but the author and the person testing the handoff should not be the same person.

## Run the pilot in five steps

### 1. Record the baseline

Before changing the file, ask the receiver to inspect it without the author. Record:

- time needed to identify the page and its breakpoints;
- unanswered questions about interactions, targets, states, and assets;
- assumptions that would otherwise reach implementation;
- time spent by the designer giving follow-up explanations.

This is the comparison point, not a score for the designer.

### 2. Add only missing intent

Follow the [designer quick start](00-designer-quick-start.md). Keep geometry, Auto Layout, component data, and visual styling in Figma. Use stable names and BRIDGE tags only for intent that Figma does not already express.

The [BRIDGE Assistant plugin](https://www.figma.com/community/plugin/1654485530503673254/bridge) can apply common tags, connect controls to targets, and show the file map. It does not require a separate BRIDGE account.

### 3. Check the declared scope

For a BRIDGE page, select the page root and run **Check page**. For the legacy-host profile above, select the tagged section root or its explicitly chosen variants and run **Check selected section**. The two commands have separate coverage contracts; do not turn a section into a fake page to reuse Page Check.

The public coverage snapshots record exact emitted-rule unions for both commands: Page Check reports 42 catalog rules (40 automatic and 2 heuristic), while **Check selected section** reports 26 (24 automatic and 2 heuristic; 20 local and 6 selected-variant). The counts are not additive because the scopes overlap. Review the [Page Check coverage file](../validator/page-check-coverage.json) or the separate [selected-section coverage file](../validator/section-check-coverage.json) when exact scope matters.

During either check, BRIDGE watches only the declared audit boundary. Background activity in legacy frames or other BRIDGE pages on the same Figma canvas does not invalidate the report. If a layer inside the audited roots changes once while it is being read, the plugin repeats the read automatically; if the same scope keeps changing, it stops and explains that the audited area changed—not that BRIDGE edited the file.

The full [catalog contains 107 rules](../validator/rules.json). Rules outside current plugin coverage require structured-contract checks, the [designer checklist](17-designer-checklist.md), heuristic/manual review, or target QA according to the [coverage manifest](../validator/methodology-coverage.json). A clean plugin report is therefore not a claim that every catalog rule has been evaluated. Page Check also treats a placed INSTANCE as atomic; audit an editable source component separately when its section structure matters.

Fix unresolved blockers. Discuss warnings in context. Record intentional exceptions and their reasons instead of hiding them.

### 4. Repeat the handoff without the author

Give the prepared file to the receiver again. The receiver should be able to find:

1. the page, view, and required breakpoints;
2. corresponding elements across breakpoints;
3. each link or action and its target;
4. content, decoration, and exportable assets;
5. any documented exception, transformation, open question, or capability fallback that changes implementation.

Record the same time and question counts as in the baseline. If a core answer still has to be supplied verbally, the contract is incomplete.

### 5. Decide from the result

Classify the findings with the team:

- **blocking** — implementation would otherwise require guessing;
- **open question** — the unknown is explicit, scoped, owned, classified as blocking/non-blocking, assigned a review point, and given a safe fallback;
- **accepted exception** — the deviation is intentional and has a reason;
- **workflow improvement** — a reusable convention, template, or checklist change.

Expand BRIDGE only if the second handoff is clearer enough to justify the preparation cost. Keep the pilot notes; they are more useful than a general claim that handoff “felt better.”

## Use measurable success criteria

Set the threshold before the pilot. A practical starting point is:

- the receiver answers the five handoff questions in five minutes without the author;
- no unresolved blocking result remains in the plugin report;
- every known manual concern, exception, or open question has an owner, scope, blocking status, review point, and written decision or safe fallback;
- the number of clarification questions and total handoff time are recorded before and after;
- the developer can start implementation without private context that exists only in chat or a meeting.

Change the time threshold for the complexity of your work, but keep the measurement and the questions consistent.

## Roll out without a migration project

If the pilot works:

1. add the [designer checklist](17-designer-checklist.md) to design review;
2. run **Check page** for a page scope or **Check selected section** for an isolated section scope before handoff;
3. reuse the proven names and tags in new pages and templates;
4. review exceptions in the same place as other implementation decisions;
5. evaluate another representative page after one or two delivery cycles.

Apply BRIDGE to active work as it changes. There is no need to rewrite an archive, rename an entire component library, or block delivery until every historical file conforms.

## What not to do

- Do not tag dimensions, spacing, colors, or other facts already stored by Figma.
- Do not rename the whole library before the first measured handoff.
- Do not treat every warning as a blocker without product and technical context.
- Do not use a polished toy file that avoids real states and interactions.
- Do not present the 42 Page Check rules or the 26 selected-section rules as automation of the full 107-rule catalog.
- Do not turn BRIDGE into a separate specification that drifts away from the design.

## Cost, infrastructure, and data

| Question | Current answer |
| --- | --- |
| License and payment | The methodology and this public repository are MIT-licensed; the plugin implementation is private. The plugin requests no payments and has no paid BRIDGE account. |
| Infrastructure | No BRIDGE backend or team server is required. The published plugin declares no network access. |
| Stored data | Language and the copied target are stored locally in Figma client storage. Explicit actions may rename selected layers or attach BRIDGE metadata to the document. Nothing is sent to an external BRIDGE service. |
| Migration | No archive migration is required. Start with one active page or one explicitly selected new section and expand only where the workflow proves useful. |

The Figma Community page remains authoritative for the currently installable build because publication is a separate manual step. The plugin implementation repository is private; the public methodology repository remains the source for contract, coverage, and process claims.

Figma itself remains the host product and is governed by the workspace plan and policies your organization already uses.

## Keep these references open

- [Designer quick start](00-designer-quick-start.md)
- [Figma plugin BRIDGE](https://www.figma.com/community/plugin/1654485530503673254/bridge)
- [Designer checklist](17-designer-checklist.md)
- [Full rule catalog](../validator/rules.json)
- [Page Check coverage](../validator/page-check-coverage.json)
- [Selected-section coverage](../validator/section-check-coverage.json)
- [Transfer contract](04-transfer-contract.md)
- [Current status and roadmap](12-project-roadmap.md)
