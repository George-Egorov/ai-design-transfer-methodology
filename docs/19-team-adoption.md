# Adopt BRIDGE with one real file

Do not begin by renaming a library or migrating an archive. Run a small pilot on one production page, let someone other than its designer use the result, and decide from evidence whether BRIDGE belongs in the team workflow.

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

### 3. Check the page

Select the page root and run **Check page** in the plugin. In version 0.7.0 it reports 24 catalog rules: 23 automatic checks and one heuristic check. Review the [coverage file](../validator/page-check-coverage.json) when exact scope matters.

The full [catalog contains 102 rules](../validator/rules.json). Rules outside current plugin coverage require structured-contract checks, the [designer checklist](17-designer-checklist.md), heuristic/manual review, or target QA according to the [coverage manifest](../validator/methodology-coverage.json). A clean plugin report is therefore not a claim that every catalog rule has been evaluated.

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
2. run **Check page** before a file enters handoff;
3. reuse the proven names and tags in new pages and templates;
4. review exceptions in the same place as other implementation decisions;
5. evaluate another representative page after one or two delivery cycles.

Apply BRIDGE to active work as it changes. There is no need to rewrite an archive, rename an entire component library, or block delivery until every historical file conforms.

## What not to do

- Do not tag dimensions, spacing, colors, or other facts already stored by Figma.
- Do not rename the whole library before the first measured handoff.
- Do not treat every warning as a blocker without product and technical context.
- Do not use a polished toy file that avoids real states and interactions.
- Do not present the 24 Page Check rules as automation of the full 102-rule catalog.
- Do not turn BRIDGE into a separate specification that drifts away from the design.

## Cost, infrastructure, and data

| Question | Current answer |
| --- | --- |
| License and payment | The methodology and this public repository are MIT-licensed; the plugin implementation is private. Plugin version 0.7.0 requests no payments and has no paid BRIDGE account. |
| Infrastructure | No BRIDGE backend or team server is required. The published plugin declares no network access. |
| Stored data | Language and the copied target are stored locally in Figma client storage. Explicit actions may rename selected layers or attach BRIDGE metadata to the document. Nothing is sent to an external BRIDGE service. |
| Migration | No archive migration is required. Start with one active file and expand only where the workflow proves useful. |

The plugin facts in this table describe the published 0.7.0 build. The plugin implementation repository is private; the public methodology repository remains the source for contract, coverage, and process claims.

Figma itself remains the host product and is governed by the workspace plan and policies your organization already uses.

## Keep these references open

- [Designer quick start](00-designer-quick-start.md)
- [Figma plugin BRIDGE](https://www.figma.com/community/plugin/1654485530503673254/bridge)
- [Designer checklist](17-designer-checklist.md)
- [Full rule catalog](../validator/rules.json)
- [Page Check coverage](../validator/page-check-coverage.json)
- [Transfer contract](04-transfer-contract.md)
- [Current status and roadmap](12-project-roadmap.md)
