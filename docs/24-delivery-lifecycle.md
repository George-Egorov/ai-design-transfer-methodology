# Delivery lifecycle

BRIDGE is complete only when intent remains traceable from design through release. The lifecycle is:

> **design → contract → implementation → QA → release or declared deviation**

![Lifecycle from design evidence through contract, implementation, QA, and managed deviation](../assets/diagrams/delivery-lifecycle.svg)

*A deviation is a controlled branch that must return to verification; it is not a shortcut around the contract.*

## One chain of evidence

Each important requirement receives a stable requirement id and links to its evidence:

```text
REQ-CATALOG-017
  design: Catalog / Default / 1200 → product-grid
  contract: bridge.data.displays → product-grid
  implementation: ProductGrid + catalog query adapter
  tests: catalog-grid-default, catalog-grid-empty, catalog-grid-keyboard
  deviations: none
```

Do not create five unrelated specifications. Figma shows authored visual/structural evidence; structured BRIDGE metadata records intent Figma cannot express; code realizes it; tests verify outcomes; deviations record known differences. Stable identities connect the evidence.

## Roles and accountability

| Role | Accountable for |
| --- | --- |
| Product/design owner | Product meaning, complete states, design evidence, content, responsive intent. |
| Contract owner | Consistency, identity mapping, structured metadata, acceptance criteria, change log. |
| Implementation owner | Semantic behavior, target-platform decisions, code and implementation evidence. |
| QA/accessibility owner | Coverage, environments, expected results, findings, regression evidence. |
| Deviation approver | User/business impact decision, mitigation, owner, expiry and follow-up. |

One person may fill several roles. The author must not be the only person able to interpret the design, and a known divergence cannot be silently approved by the implementer who introduced it.

## Lifecycle record

A transfer unit—page, flow, section, or component—has one lifecycle record:

> **Non-standalone module fragment.** This excerpt shows only `bridge.lifecycle` (plus `contractVersion` for context) and intentionally omits other required envelope fields. Insert it into the required `bridge` envelope from the [transfer contract](04-transfer-contract.md#required-envelope) before exchange or full-contract validation.

```json
{
  "bridge": {
    "contractVersion": "0.2.0",
    "lifecycle": {
      "transferId": "catalog-default",
      "contractRevision": "7",
      "sourceRevision": "figma-version-2026-08-13T10:20Z",
      "targetRevision": "build-1842",
      "status": "qa",
      "owners": {
        "design": "catalog-design",
        "contract": "design-systems",
        "implementation": "storefront",
        "qa": "quality"
      },
      "requirements": ["REQ-CATALOG-017", "REQ-CATALOG-021"],
      "evidence": {
        "design": ["page=catalog;view=default;bp=1200"],
        "tests": ["catalog-grid-default", "catalog-grid-keyboard"]
      },
      "deviations": []
    }
  }
}
```

Names are illustrative. A repository, issue tracker, design plugin, or build system may store the record, but it must be versioned, linkable, and delivered with the transfer unit.

## Stage 1: design

The design owner prepares representative, production-relevant evidence:

- root page/view/breakpoint identities and real routes when known;
- same logical tree across responsive states, plus every declared transformation;
- stable element identity and component/template provenance;
- realistic content and runtime-data fixtures;
- complete reactions, targets, forms, async and failure states;
- motion states and fallbacks;
- accessibility intent and alternatives;
- essential media/experience plus asset art direction and representative low-capability conditions;
- known target constraints and candidate exceptions.

**Design gate:** a reviewer who is not the author can identify structure, variants, content/data meaning, actions, targets, responsive behavior, accessibility expectations, and unresolved decisions without a private explanation.

Output: versioned design reference, fixture/scenario list, open-decision list, and initial requirement ids.

## Stage 2: contract

The contract owner combines evidence instead of duplicating it:

1. extract technical truth from Figma or the source tool;
2. resolve stable identity as role, template, design instance, runtime data, and target identity;
3. attach structured data, responsive, reaction, motion, accessibility, and lifecycle contracts;
4. define acceptance criteria and target capabilities;
5. turn every unknown or unsupported capability into an owned open question with scope, blocking status, review point, and safe fallback;
6. define expected data volume, virtualization/pagination threshold, asset delivery intent, and implementation-owned performance budgets;
7. validate references, targets, schemas, state reachability, parity, and exceptions;
8. freeze a contract revision for implementation.

**Contract gate:** every required decision is either explicit, inherited from a pinned component/system contract, or recorded as an owned open decision that blocks the affected scope. No implementation-critical meaning exists only in chat or a meeting.

Output: pinned source revision, structured contract, trace matrix, target capability statement, validation report, and approved implementation scope.

## Stage 3: implementation

The implementation owner maps the contract to the target platform. The adapter or developer must:

- preserve semantic identity and relationships rather than copy coordinates blindly;
- use native target behavior and the design system where they satisfy the contract;
- implement exact declared frames/scenes first, then fluid/container behavior;
- map runtime records through stable data keys rather than Figma fixture order;
- implement all reachable states, reactions, history/focus effects, and fallbacks;
- record target-specific decisions that are not visually observable;
- implement and measure asset, data-volume, loading, low-bandwidth/offline/data-saver/low-power, and capability-fallback budgets;
- flag impossible or harmful requirements before substituting another behavior.

**Implementation gate:** the feature builds, deterministic contract checks pass, every requirement points to implementation evidence, and no known divergence is hidden.

Output: implementation revision, mapping/decision notes, automated tests, and candidate deviation records.

## Stage 4: QA

QA verifies observable outcomes against the frozen contract, not against memory or a single screenshot.

Required coverage includes:

- exact declared breakpoints and the ranges between them;
- container-driven changes and each declared structural transformation;
- typical and stress data, every required data state, and localization;
- happy, invalid, pending, empty, partial, failure, cancellation, retry, and history paths;
- reverse/re-entry/reduced-motion behavior for motion;
- keyboard, focus, zoom/reflow, screen-reader, contrast, target size, and media requirements;
- supported browsers, devices, target runtimes, and fallback conditions;
- asset dimensions/quality/art direction/loading priority and data-volume/virtualization thresholds under the declared capability profiles;
- low bandwidth, offline, data saver, low power, missing capability, and budget evidence as applicable;
- component/system inheritance and visual regression at meaningful states.

Classify results as `pass`, `fail`, `not-applicable`, `blocked`, or `accepted-deviation`; include evidence and environment. “Looks close” is not a result.

**QA gate:** every acceptance criterion has a result; blockers are resolved; accepted deviations are approved and visible; regression coverage exists for high-risk behavior.

Output: linked QA report, evidence, defect records, approved deviations, and release recommendation.

## Stage 5: release and operation

At release, pin together:

- design/source revision;
- contract and rules/schema versions;
- implementation/build revision;
- test environment and evidence revision;
- active deviations and expiry dates.

After release, runtime evidence may reveal content lengths, data volumes, device conditions, assistive-technology issues, or performance limitations absent from fixtures. Feed these back into the source design, component contract, examples, and tests. Do not patch production forever while the canonical contract remains wrong.

## Open-question protocol

BRIDGE promises no **untracked** unknowns, not omniscience. A decision may remain `unknown`, `unsupported`, or `TBD` only in `bridge.openQuestions[]` with a stable id, exact scope, accountable owner, blocking status, due date or named review gate, safe fallback, and status/decision link.

At each lifecycle gate:

- review every question whose scope enters the next stage;
- block the scope when its fallback would be unsafe, inaccessible, misleading, destructive, or impossible to test;
- carry a non-blocking fallback into implementation and QA acceptance criteria;
- close the record only with a linked decision and updated affected evidence;
- escalate overdue questions instead of silently assuming an answer.

A question that remains only in conversation, chat, an unlinked task, or a person's memory is a blind spot and fails readiness.

## Change control and contract drift

A change begins at the owner of the truth it alters:

| Change | Update first | Then reassess |
| --- | --- | --- |
| Copy, visual hierarchy, or product flow | Design evidence | Contract, implementation, tests |
| Data schema/source/format | Data contract | Fixtures, displays, states, tests |
| Interaction/state behavior | Reaction contract | Designs, focus/history, implementation, tests |
| Component API or target limitation | Implementation/system contract | Design mapping, deviations, regressions |
| Accessibility finding | Requirement and affected evidence | Design, contract, implementation, all variants |

Run impact analysis by stable identity and requirement id. A source revision change after contract freeze either creates a new contract revision or is explicitly proven non-semantic. Silent screenshot replacement is contract drift.

## Deviation protocol

A **deviation** is an intentional, reviewed mismatch between the accepted contract and the implementation or supported target. It is not an undocumented workaround.

Every deviation is stored under `bridge.lifecycle.deviations`:

> **Non-standalone module fragment.** This excerpt isolates one `bridge.lifecycle.deviations` record and intentionally omits the remaining lifecycle and required envelope fields. Insert it into a complete lifecycle record inside the required [contract envelope](04-transfer-contract.md#required-envelope).

```json
{
  "bridge": {
    "lifecycle": {
      "deviations": [{
        "id": "DEV-CATALOG-004",
        "requirement": "REQ-CATALOG-021",
        "scope": ["catalog", "catalog-360"],
        "difference": "Comparison table uses horizontal scroll instead of the declared card transformation",
        "reason": "Card mapping loses grouped header relationships in target version",
        "impact": "Comparison remains available with preserved table semantics and no data loss, but narrow-screen users need additional horizontal navigation",
        "mitigation": "Sticky first column, overflow instructions, edge affordance",
        "evidence": ["qa-catalog-360-table-scroll"],
        "owner": "storefront",
        "approvedBy": "product-and-accessibility",
        "status": "accepted",
        "reviewDate": "2026-11-30",
        "resolution": "Reassess after target table component upgrade"
      }]
    }
  }
}
```

Required rules:

- identify the violated requirement and exact affected scope;
- explain user, accessibility, data, and maintenance impact;
- compare realistic alternatives;
- provide mitigation and verification evidence;
- name an accountable owner and approver;
- use an expiry/review date for temporary deviations;
- surface it in handoff, QA, and release records;
- close it only after the contract and implementation converge and are retested.

A deviation that prevents WCAG 2.2 AA cannot be relabeled as conforming. Security, privacy, legal, and data-integrity constraints override visual fidelity and must be escalated to the relevant owner.

## Definition of ready and done

### Ready for implementation

- [ ] Scope and revisions are pinned.
- [ ] Stable identities and target mapping are unambiguous.
- [ ] Structured contracts cover data, transformations, reactions, motion, and accessibility where applicable.
- [ ] Acceptance criteria and test scenarios exist.
- [ ] Required decisions have owners; blocking decisions are resolved.
- [ ] Every remaining unknown/unsupported item is a scoped, owned, reviewable open question with a safe tested fallback.
- [ ] Target capabilities, essential media/experience, data volume, degradation conditions, and implementation-owned budgets are declared.
- [ ] Candidate deviations have not been hidden as “implementation details.”

### Done for release

- [ ] Implemented behavior traces to the accepted contract.
- [ ] Required exact, fluid, state, data, motion, and accessibility tests pass.
- [ ] Every failure is fixed, blocked with an owner, or approved as a visible deviation.
- [ ] Active deviations have mitigation and review dates.
- [ ] Source, contract, code/build, and QA revisions are linked.
- [ ] Runtime feedback has a route back to the canonical source.

## Worked change example

A catalog table is designed at 1200 and 360 px. The contract declares same-tree reflow until the `comparison-panel` container is below 480 px, then a table-to-disclosure transformation mapping every column to a labeled field. Implementation discovers that the target disclosure component cannot preserve multi-row selection.

The team does not silently drop selection on mobile:

1. `REQ-CATALOG-021` states that selection survives presentation changes.
2. The developer records the capability gap before substituting behavior.
3. Design evaluates keeping the semantic scrollable table versus adding selection to the disclosure component.
4. Accessibility and product owners approve the scrollable-table mitigation temporarily.
5. QA tests keyboard scrolling, headers, focus, selection, zoom, and Back/Forward at the affected range.
6. The release links `DEV-CATALOG-004` with an owner and expiry.
7. When the component gains selection, the team implements the original transformation, reruns the tests, and closes the deviation.

This is the BRIDGE lifecycle: the gap is visible, owned, tested, and eventually removed.
