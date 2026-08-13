# BRIDGE machine-readable contracts

This directory is the canonical machine-readable surface of BRIDGE. It separates compact layer-name tags from rich structured handoff metadata and makes documentation, localization, examples, and plugin coverage verifiable.

## Canonical files

- [`tags.json`](tags.json) and [`tags.schema.json`](tags.schema.json) — layer-tag registry: lifecycle status, source of truth, valid scope and value grammar, identity role, and companion constraints.
- [`tag-examples.json`](tag-examples.json) — executable valid and invalid tag examples.
- [`bridge.schema.json`](bridge.schema.json) — the namespaced structured `bridge` contract for identity, data, responsive transformations, reactions, motion, accessibility, capability profiles, lifecycle evidence, exceptions, and tracked open questions.
- [`examples/bridge-contract.valid.json`](examples/bridge-contract.valid.json) — a complete schema-valid reference envelope.
- [`rules.json`](rules.json) and [`rules.schema.json`](rules.schema.json) — stable validator rule vocabulary.
- [`page-check-coverage.json`](page-check-coverage.json) — verified Page Check implementation snapshot. It intentionally discloses no private source path.
- [`methodology-coverage.json`](methodology-coverage.json) — explicit automatic, heuristic, or manual validation ownership for the expanded methodology. Manual checks still require recorded evidence.
- [`site-content.json`](site-content.json) — canonical EN/RU route/source manifest used by the site generator.

## Validation

Run from the repository root with the Node version in `.nvmrc`:

```sh
npm run lint:contracts
npm run lint:rules
npm run lint:coverage
npm run lint:links
npm run content:sync
npm run content:check
```

`npm test` runs the complete contract, Russian-copy, link, generated-content, Astro type, and production-build pipeline. The generated site publishes compatibility alias `/data/bridge-rules.json` plus `/data/rules.json`, tag/schema files, and copied authored diagram assets.

## Contract boundary

Use short tags only for identity anchors and transfer intent that Figma cannot already express. Use native Figma metadata for node type, layout, positioning, component source, and visual properties. Put data schemas, state machines, responsive mappings, timelines, accessibility profiles, target capabilities, delivery evidence, deviations, and unknowns in structured `bridge` metadata.
