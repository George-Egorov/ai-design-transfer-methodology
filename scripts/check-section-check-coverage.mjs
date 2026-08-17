import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(resolve(root, 'validator/rules.json'), 'utf8'));
const coverage = JSON.parse(readFileSync(resolve(root, 'validator/section-check-coverage.json'), 'utf8'));
const pageCoverage = JSON.parse(readFileSync(resolve(root, 'validator/page-check-coverage.json'), 'utf8'));

const catalogById = new Map(catalog.rules.map((rule) => [rule.id, rule]));
const areas = coverage.coverageAreas || [];
const automatic = areas.flatMap((area) => area.automaticRuleIds || []);
const heuristic = areas.flatMap((area) => area.heuristicRuleIds || []);
const implemented = [...automatic, ...heuristic];
const local = areas
  .filter(({ applicability }) => applicability === 'always')
  .flatMap((area) => [...(area.automaticRuleIds || []), ...(area.heuristicRuleIds || [])]);
const selectedVariants = areas
  .filter(({ applicability }) => applicability === 'selected-variants')
  .flatMap((area) => [...(area.automaticRuleIds || []), ...(area.heuristicRuleIds || [])]);
const pageOrFileNotEmitted = coverage.notablePageOrFileRuleIdsNotEmitted || [];
const errors = [];

// Reviewed against the plugin's section-check call graph. Keep this independent
// of the manifest counts so a shared validator cannot add an emitted rule while
// leaving the public coverage snapshot silently under-counted.
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
  'interaction.href-invalid',
  'interaction.link-has-second-destination',
  'interaction.link-without-href',
  'interaction.optional-id-value-invalid',
  'layout.container-missing-auto-layout',
  'layout.group-outside-asset',
  'layout.positioned-without-intent',
  'layout.section-missing-auto-layout',
  'responsive.identity-missing-in-required-breakpoint',
  'responsive.parent-changed-across-breakpoints',
  'responsive.tree-cardinality-changed',
  'responsive.visual-intent-drift',
  'syntax.decor-asset-value-not-kebab-case',
  'syntax.duplicate-tag',
  'syntax.figma-metadata-tag-invalid',
  'syntax.identity-value-not-kebab-case',
];

const duplicates = (values) => values.filter((value, index) => values.indexOf(value) !== index);

if (coverage.catalogVersion !== catalog.version) {
  errors.push(`catalogVersion ${coverage.catalogVersion} does not match ${catalog.version}`);
}
if (coverage.pluginVersion !== pageCoverage.pluginVersion) {
  errors.push(`pluginVersion ${coverage.pluginVersion} does not match Page Check snapshot ${pageCoverage.pluginVersion}`);
}
if (coverage.counts.catalogRules !== catalog.rules.length) {
  errors.push(`catalogRules is ${coverage.counts.catalogRules}; expected ${catalog.rules.length}`);
}
if (coverage.counts.sectionCheckRules !== implemented.length) {
  errors.push(`sectionCheckRules is ${coverage.counts.sectionCheckRules}; expected ${implemented.length}`);
}
if (coverage.counts.automaticRules !== automatic.length) {
  errors.push(`automaticRules is ${coverage.counts.automaticRules}; expected ${automatic.length}`);
}
if (coverage.counts.heuristicRules !== heuristic.length) {
  errors.push(`heuristicRules is ${coverage.counts.heuristicRules}; expected ${heuristic.length}`);
}
if (coverage.counts.localRules !== local.length) {
  errors.push(`localRules is ${coverage.counts.localRules}; expected ${local.length}`);
}
if (coverage.counts.selectedVariantRules !== selectedVariants.length) {
  errors.push(`selectedVariantRules is ${coverage.counts.selectedVariantRules}; expected ${selectedVariants.length}`);
}

const expectedAreaIds = ['boundary', 'intrinsic', 'layout', 'interactions', 'variants', 'instance'];
const actualAreaIds = areas.map(({ id }) => id);
if (JSON.stringify(actualAreaIds) !== JSON.stringify(expectedAreaIds)) {
  errors.push(`coverage area order is ${actualAreaIds.join(', ')}; expected ${expectedAreaIds.join(', ')}`);
}
for (const id of duplicates(actualAreaIds)) errors.push(`duplicate coverage area: ${id}`);
for (const id of duplicates(implemented)) errors.push(`duplicate implemented rule ID: ${id}`);
for (const id of duplicates(pageOrFileNotEmitted)) errors.push(`duplicate page/file rule ID: ${id}`);

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
    errors.push(`unknown implemented rule ID: ${id}`);
    continue;
  }
  const expected = automatic.includes(id) ? 'automatic' : 'heuristic';
  if (rule.automation !== expected) errors.push(`${id} is ${rule.automation}; expected ${expected}`);
}
for (const id of pageOrFileNotEmitted) {
  if (!catalogById.has(id)) errors.push(`unknown page/file rule ID: ${id}`);
  if (implemented.includes(id)) errors.push(`${id} is both implemented and never emitted`);
}

for (const [key, expectedLabel] of Object.entries({ ready: 'Ready', partial: 'Partial', blocked: 'Blocked' })) {
  if (coverage.resultStatuses?.[key]?.label !== expectedLabel) {
    errors.push(`resultStatuses.${key}.label must be ${expectedLabel}`);
  }
  if (coverage.resultStatuses?.[key]?.claim !== 'section-source-only') {
    errors.push(`resultStatuses.${key}.claim must remain section-source-only`);
  }
}

if (errors.length) {
  console.error(`Check selected section coverage is invalid:\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(
    `Check selected section coverage verified: ${implemented.length} of ${catalog.rules.length} rules (${local.length} local, ${selectedVariants.length} selected-variant).`,
  );
}
