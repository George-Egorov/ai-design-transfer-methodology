# Adopt BRIDGE with one real file

Do not begin by renaming the archive or rebuilding the component library. Run a small pilot on one working page or one new section and measure whether the handoff became clearer.

## What the pilot should answer

- Can another person find the page and its widths?
- Can they understand actions, states, and content rules?
- Did the number of follow-up questions fall?
- Is the preparation effort worth repeating?

## Choose a useful scope

Pick a page with real content, at least one responsive decision, and a meaningful interaction. Avoid a clean demo file with no states or changing data.

For a new section inside an existing product, mark the selected root instead of inventing page metadata:

```text
checkout-summary [section=checkout-summary]
```

Keep the host page outside the first pilot. See the [selected-section contract](04-transfer-contract.md) when the team needs the integration details.

## Assign three roles

| Role | Responsibility |
| --- | --- |
| Designer | Prepares the selected area and does not explain it during the handoff test. |
| Developer or reviewer | Reads the file, records questions, and runs the available check. |
| Owner or manager | Sets the success threshold and decides whether to continue. |

One person may have more than one role, but the handoff test needs someone other than the author.

## Run the pilot in five steps

### 1. Record the starting point

Ask the recipient to read the file before any changes. Record time, questions, and assumptions.

### 2. Add only missing meaning

Follow the [designer quick start](00-designer-quick-start.md). Do not rewrite the archive or duplicate Figma properties.

### 3. Check the declared area

Use the plugin for a page or the selected-section command for an isolated section. Treat the report as one input, not as proof that every product question is solved.

### 4. Repeat the handoff

Give the file to the recipient again without a call. Ask the same questions and record the same measurements.

### 5. Decide what to repeat

Keep only changes that reduced guessing. Classify remaining items as a blocker, an owned open question, an intentional exception, or a process improvement.

## A practical success threshold

Start with these targets:

- the recipient answers the core questions in five minutes;
- no blocking issue remains in the declared area;
- every open question has an owner and a next date;
- the before/after time and question count are recorded.

## Do not turn the pilot into migration

- Do not rename the whole library before measuring the first handoff.
- Do not make every warning a blocker.
- Do not hide real states or data to make the example look clean.
- Do not claim that one ready section makes the host page ready.

Continue with the [designer checklist](17-designer-checklist.md), [full review](08-preflight-checklist.md), or [roadmap](12-project-roadmap.md) only when the pilot shows a benefit.
