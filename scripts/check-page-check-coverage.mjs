import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(resolve(root, 'validator/rules.json'), 'utf8'));
const coverage = JSON.parse(readFileSync(resolve(root, 'validator/page-check-coverage.json'), 'utf8'));

const catalogById = new Map(catalog.rules.map((rule) => [rule.id, rule]));
const automatic = coverage.automaticRuleIds || [];
const heuristic = coverage.heuristicRuleIds || [];
const implemented = [...automatic, ...heuristic];
const errors = [];

// Reviewed against checkSelectedPagePreflight and every shared validator it
// invokes. This independent set turns the snapshot into an exact emitted-rule
// union rather than a curated subset that could silently under-count coverage.
const expectedImplementedRuleIds = [
  'component.page-instance-declares-component-tag',
  'content.text-changed-between-breakpoints',
  'identity.breakpoint-specific-id',
  'identity.duplicate-identity',
  'identity.missing-stable-identity',
  'identity.multiple-identity-tags',
  'identity.same-identity-different-type',
  'interaction.action-invalid',
  'interaction.control-action-duplicate',
  'interaction.control-without-action',
  'interaction.form-target-missing',
  'interaction.href-invalid',
  'interaction.link-has-second-destination',
  'interaction.link-without-href',
  'interaction.modal-target-missing',
  'interaction.optional-id-value-invalid',
  'interaction.reset-target-missing',
  'interaction.state-target-missing',
  'layout.container-missing-auto-layout',
  'layout.group-outside-asset',
  'layout.page-root-cannot-be-asset',
  'layout.page-root-missing-auto-layout',
  'layout.positioned-without-intent',
  'layout.section-missing-auto-layout',
  'responsive.identity-missing-in-required-breakpoint',
  'responsive.missing-breakpoint-root',
  'responsive.parent-changed-across-breakpoints',
  'responsive.tree-cardinality-changed',
  'responsive.view-missing-required-breakpoint',
  'responsive.visual-intent-drift',
  'routing.default-view-missing',
  'routing.duplicate-route',
  'routing.href-anchor-missing',
  'routing.href-internal-route-missing',
  'routing.page-root-required',
  'routing.page-route-missing',
  'routing.page-view-route-drift',
  'routing.route-not-production-url',
  'syntax.decor-asset-value-not-kebab-case',
  'syntax.duplicate-tag',
  'syntax.figma-metadata-tag-invalid',
  'syntax.identity-value-not-kebab-case',
];

if (coverage.catalogVersion !== catalog.version) {
  errors.push(`catalogVersion ${coverage.catalogVersion} does not match ${catalog.version}`);
}

if (coverage.counts.catalogRules !== catalog.rules.length) {
  errors.push(`catalogRules is ${coverage.counts.catalogRules}; expected ${catalog.rules.length}`);
}

if (coverage.counts.pageCheckRules !== implemented.length) {
  errors.push(`pageCheckRules is ${coverage.counts.pageCheckRules}; expected ${implemented.length}`);
}

if (coverage.counts.automaticRules !== automatic.length) {
  errors.push(`automaticRules is ${coverage.counts.automaticRules}; expected ${automatic.length}`);
}

if (coverage.counts.heuristicRules !== heuristic.length) {
  errors.push(`heuristicRules is ${coverage.counts.heuristicRules}; expected ${heuristic.length}`);
}

const duplicates = implemented.filter((id, index) => implemented.indexOf(id) !== index);
if (duplicates.length) errors.push(`duplicate rule IDs: ${[...new Set(duplicates)].join(', ')}`);

const actualImplementedRuleIds = [...implemented].sort();
if (JSON.stringify(actualImplementedRuleIds) !== JSON.stringify(expectedImplementedRuleIds)) {
  const missing = expectedImplementedRuleIds.filter((id) => !actualImplementedRuleIds.includes(id));
  const unexpected = actualImplementedRuleIds.filter((id) => !expectedImplementedRuleIds.includes(id));
  errors.push(
    `implementation rule set drifted${missing.length ? `; missing: ${missing.join(', ')}` : ''}`
      + `${unexpected.length ? `; unexpected: ${unexpected.join(', ')}` : ''}`,
  );
}

for (const id of implemented) {
  const rule = catalogById.get(id);
  if (!rule) {
    errors.push(`unknown rule ID: ${id}`);
    continue;
  }
  const expected = automatic.includes(id) ? 'automatic' : 'heuristic';
  if (rule.automation !== expected) {
    errors.push(`${id} is ${rule.automation} in the catalog; expected ${expected}`);
  }
}

if (errors.length) {
  console.error(`Page Check coverage is invalid:\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Page Check coverage verified: ${implemented.length} of ${catalog.rules.length} rules.`);
}
