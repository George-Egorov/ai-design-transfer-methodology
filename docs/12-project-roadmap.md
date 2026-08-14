# Status and roadmap

**Updated 14 August 2026.** BRIDGE is a public, MIT-licensed methodology and open-source documentation/validator repository. The BRIDGE Assistant plugin is publicly installable from Figma Community, but its implementation repository is private. Public installation does not imply public plugin source, issues, or release history.

## Current releases

| Product | Version | Status |
| --- | --- | --- |
| BRIDGE methodology and site | **0.10.0** | Bilingual canonical docs, strict source Auto Layout policy, lifecycle, structured contract/schema, tag registry, and validator artifacts. |
| BRIDGE rule catalog | **0.5.0 — 107 rules** | Explicit automatic, heuristic, and manual coverage across methodology surfaces. |
| BRIDGE Assistant for Figma | **0.8.0** | Publicly installable build with blocking source-structure checks plus common tags, target connection, navigation, and page-scoped checking. Implementation remains private. |

The methodology remains pre-1.0. Pin versions: the structured payload, schema, rules, and wording may change with documented methodology releases.

## Available now

### A complete transfer method

The canonical guidance covers:

- short design anchors and five-dimensional identity mapping;
- viewport/container responsiveness, fluid rules, and declared transformations;
- content, data displays, tables, grids, charts, provenance, formatting, and failure states;
- state machines, forms, async behavior, focus, URL/history, and recovery;
- motion, long-scroll scenes, reverse/re-entry, reduced motion, and fallbacks;
- WCAG 2.2 AA accessibility profile, RTL/bidirectional context, and target capabilities;
- design → contract → implementation → QA → deviation lifecycle;
- explicit open questions so an unknown is owned instead of becoming a blind spot.

### Structured contract and validation artifacts

Version 0.9 introduced the pre-1.0 [structured transfer contract](04-transfer-contract.md) and [JSON Schema](../validator/bridge.schema.json). Version 0.10 adds blocking native Auto Layout and GROUP boundaries to source validation. The repository also publishes:

- a canonical registry for the compact layer-tag grammar;
- English/Russian rule catalog version 0.5.0;
- schema and example fixtures;
- methodology and Page Check coverage manifests;
- checks for localization, references, examples, coverage, and site content.

Structured metadata supplements Figma/source metadata and short tags. It is not a claim that a universal production adapter already exists.

### Publicly installable Figma helper

[Install BRIDGE Assistant from Figma Community](https://www.figma.com/community/plugin/1654485530503673254/bridge). Version 0.8.0 supports the practical page workflow and the declared source-structure gate without a separate BRIDGE account.

The plugin's implementation/source repository, private issues, and internal release records are not public methodology resources. Use the public installation page for availability; use this repository for the public contract, rules, examples, and roadmap.

## Automation scope: 30 of 107

The rule catalog contains **107** rules. Plugin Page Check 0.8.0 covers **30** rule ids: **29 automatic** and **1 heuristic**. Exact machine truth lives in [Page Check coverage](../validator/page-check-coverage.json).

The remaining rules are not “missing errors.” Many require manual product, semantic, content, accessibility, target-capability, performance, or lifecycle judgment. The [methodology coverage manifest](../validator/methodology-coverage.json) makes automatic, heuristic, and manual ownership explicit.

Therefore:

- a clean Page Check result means only that its declared page-scoped checks passed;
- the full checklist, structured-contract validation, manual review, target QA, and deviation review remain required;
- automation must never claim that all 107 rules ran when only 30 did.

## Known limitations

### Pre-1.0 schema compatibility

The 0.9 structured contract is usable and versioned but not frozen. Before 1.0, fields may evolve. Producers and consumers must pin `contractVersion`, reject unsupported shapes visibly, and migrate without losing stable identity/requirement links.

### No universal adapter

BRIDGE defines target-independent intent and capability profiles. It does not yet ship one adapter that can generate production-quality output for every web, native, no-code, editor, and design-system target.

### Source-tool checks are intentionally scoped

Page Check operates on a selected page/root and cannot prove runtime data, browser history, screen-reader output, performance budgets, backend behavior, or production conformance. It treats placed INSTANCE nodes as atomic and does not resolve their source components for the section-layout rule; source roots require a separate audit. The remaining concerns require structured evidence and implementation QA.

### Representative examples are not exhaustive product decisions

The methodology defines how to record data, state, motion, accessibility, capability, and lifecycle decisions. Each product must still supply its own values, owners, supported targets, budgets, and safe fallbacks.

## Before 1.0

1. Stabilize the structured contract and publish a compatibility/migration policy.
2. Expand validator rules only where results can remain honest about automatic, heuristic, and manual evidence.
3. Add validated full fixtures for more platforms, data displays, stateful flows, motion, RTL, and capability profiles.
4. Define adapter certification: supported contract modules, fallbacks, deviations, and test evidence.
5. Maintain the public changelog and introduce decision records for methodology/schema/rule changes.
6. Continue measured pilots and document preparation cost, clarification reduction, defects, and accessibility outcomes.

## After 1.0

Potential work includes target-specific adapters, deeper source-tool inspection, design-system mappings, richer reporting, and ecosystem integrations. These remain proposals until scoped, owned, and published in a methodology release.

## Public references

- [Documentation site](https://poliklot.github.io/bridge-design-methodology/)
- [Public methodology repository](https://github.com/Poliklot/bridge-design-methodology)
- [Methodology releases](https://github.com/Poliklot/bridge-design-methodology/releases)
- [Figma Community installation](https://www.figma.com/community/plugin/1654485530503673254/bridge)
- [Delivery lifecycle](24-delivery-lifecycle.md)
