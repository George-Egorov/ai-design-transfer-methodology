# Contributing to BRIDGE

BRIDGE accepts improvements to the public methodology, documentation, schemas, validator catalog, examples, and site. The Figma plugin implementation is private and is not part of this repository.

## Source of truth

- Author English methodology in `docs/*.md` and Russian parity in `docs/ru/*.md`.
- Author paired recipes in `examples/README.md` and `examples/README.ru.md`.
- Register every generated page pair in `validator/site-content.json`.
- Treat `validator/tags.json`, `validator/rules.json`, and `validator/bridge.schema.json` as machine-readable contracts.
- Do not edit generated Markdown under `src/content/docs/en/` or `src/content/docs/ru/`.

## Local workflow

```bash
nvm use
npm ci
npm run dev
```

Before opening a pull request:

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm audit
```

`npm test` validates schemas and fixtures, EN/RU rule parity, Russian terminology, Page Check coverage, canonical and built links, generated-content parity, Astro types, and the production build.

## Contract changes

For a new tag, structured field, or rule:

1. explain the user problem and why existing metadata is insufficient;
2. update the schema/registry and a valid fixture or executable case;
3. add EN/RU documentation and examples;
4. declare automatic, heuristic, or manual validation ownership;
5. state compatibility and migration impact before changing an existing meaning.

Short layer tags are identity and intent anchors. Rich data, responsive transforms, reactions, motion, accessibility, target capabilities, lifecycle evidence, deviations, and open questions belong under structured `bridge` metadata.

## Visuals and accessibility

Prefer editable SVG for diagrams, include a meaningful `<title>` and `<desc>`, and keep a PNG fallback when a downstream surface needs it. Every interactive change must support keyboard operation, visible focus, touch targets, reduced motion, and both RU/EN layouts.

## Pull request scope

Keep a change internally consistent: documentation, machine-readable truth, examples, localized copy, and tests should land together. Do not expose private plugin source URLs, issue trackers, release feeds, or implementation details.
