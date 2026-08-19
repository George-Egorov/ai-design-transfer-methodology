import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const jsonCache = new Map();

function readJson(path) {
  const absolute = resolve(root, path);
  if (jsonCache.has(absolute)) return jsonCache.get(absolute);
  try {
    const parsed = JSON.parse(readFileSync(absolute, 'utf8'));
    jsonCache.set(absolute, parsed);
    return parsed;
  } catch (error) {
    problems.push(`${path}: invalid JSON (${error.message})`);
    return undefined;
  }
}

const schemaPairs = [
  ['validator/rules.schema.json', 'validator/rules.json'],
  ['validator/rules.ru.schema.json', 'src/data/rules.ru.json'],
  ['validator/tags.schema.json', 'validator/tags.json'],
  ['validator/tag-examples.schema.json', 'validator/tag-examples.json'],
  ['validator/page-check-coverage.schema.json', 'validator/page-check-coverage.json'],
  ['validator/section-check-coverage.schema.json', 'validator/section-check-coverage.json'],
  ['validator/site-content.schema.json', 'validator/site-content.json'],
  ['validator/methodology-coverage.schema.json', 'validator/methodology-coverage.json'],
  ['validator/bridge.schema.json', 'validator/examples/bridge-contract.valid.json'],
];

const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
addFormats(ajv);
for (const [schemaPath] of schemaPairs) {
  const schema = readJson(schemaPath);
  if (!schema) continue;
  try {
    ajv.addSchema(schema);
  } catch (error) {
    problems.push(`${schemaPath}: invalid JSON Schema (${error.message})`);
  }
}

for (const [schemaPath, dataPath] of schemaPairs) {
  const schema = readJson(schemaPath);
  const data = readJson(dataPath);
  if (!schema || !data) continue;
  try {
    const validate = ajv.getSchema(schema.$id) || ajv.compile(schema);
    if (!validate(data)) {
      for (const error of validate.errors || []) {
        problems.push(`${dataPath}${error.instancePath || '/'}: ${error.message}`);
      }
    }
  } catch (error) {
    problems.push(`${schemaPath}: could not compile schema (${error.message})`);
  }
}

const bridgeSchema = readJson('validator/bridge.schema.json');
const canonicalContractVersion = bridgeSchema?.$defs?.bridge?.properties?.contractVersion?.const;
if (typeof canonicalContractVersion !== 'string') {
  problems.push('validator/bridge.schema.json: contractVersion must pin the canonical contract version with const');
}
if (bridgeSchema) {
  const validateBridge = ajv.getSchema(bridgeSchema.$id) || ajv.compile(bridgeSchema);
  for (const docsPath of ['docs/04-transfer-contract.md', 'docs/ru/04-kontrakt-perenosa.md']) {
    const markdown = readFileSync(resolve(root, docsPath), 'utf8');
    const candidates = [...markdown.matchAll(/```json\s*\n([\s\S]*?)\n```/gu)]
      .map((match) => match[1])
      .filter((source) => /["']bridge["']\s*:/u.test(source));
    if (candidates.length !== 1) {
      problems.push(`${docsPath}: expected exactly one canonical bridge JSON fixture; found ${candidates.length}`);
      continue;
    }
    let fixture;
    try { fixture = JSON.parse(candidates[0]); }
    catch (error) { problems.push(`${docsPath}: canonical bridge fixture is invalid JSON (${error.message})`); continue; }
    if (!validateBridge(fixture)) {
      for (const error of validateBridge.errors || []) problems.push(`${docsPath}${error.instancePath || '/'}: ${error.message}`);
    }
    const currentCatalogVersion = readJson('validator/rules.json')?.version;
    const currentMethodologyVersion = readJson('package.json')?.version;
    if (fixture.bridge?.rulesVersion !== currentCatalogVersion) {
      problems.push(`${docsPath}: rulesVersion ${fixture.bridge?.rulesVersion} does not match ${currentCatalogVersion}`);
    }
    if (fixture.bridge?.methodologyVersion !== currentMethodologyVersion) {
      problems.push(`${docsPath}: methodologyVersion ${fixture.bridge?.methodologyVersion} does not match ${currentMethodologyVersion}`);
    }
    if (fixture.bridge?.contractVersion !== canonicalContractVersion) {
      problems.push(`${docsPath}: contractVersion ${fixture.bridge?.contractVersion} does not match canonical ${canonicalContractVersion}`);
    }
  }

  const sectionFixturePath = 'validator/examples/bridge-section-contract.valid.json';
  const sectionFixture = readJson(sectionFixturePath);
  if (sectionFixture) {
    if (!validateBridge(sectionFixture)) {
      for (const error of validateBridge.errors || []) {
        problems.push(`${sectionFixturePath}${error.instancePath || '/'}: ${error.message}`);
      }
    } else {
      const contract = sectionFixture.bridge;
      const scope = contract.context.scope;
      const elements = new Map(contract.identity.elements.map((element) => [element.bridgeKey, element]));
      const structureContexts = new Map((contract.structure?.contexts || []).map((context) => [context.id, context]));
      const responsiveContexts = new Map((contract.responsive?.contexts || []).map((context) => [context.id, context]));
      if (!elements.has(scope.rootIdentity)) {
        problems.push(`${sectionFixturePath}: scope.rootIdentity ${scope.rootIdentity} is not declared in identity.elements`);
      }
      for (const contextId of scope.contextIds) {
        if (!structureContexts.has(contextId)) {
          problems.push(`${sectionFixturePath}: scope context ${contextId} has no structure context`);
        }
        if (!responsiveContexts.has(contextId)) {
          problems.push(`${sectionFixturePath}: scope context ${contextId} has no responsive context`);
        }
        if (structureContexts.get(contextId)?.rootIdentity !== scope.rootIdentity) {
          problems.push(`${sectionFixturePath}: structure context ${contextId} does not use scope root ${scope.rootIdentity}`);
        }
      }
      const rootSourceNodes = elements.get(scope.rootIdentity)?.designInstance?.sourceNodes || [];
      const rootContextIds = new Set(rootSourceNodes.map(({ contextId }) => contextId));
      for (const contextId of scope.contextIds) {
        if (!rootContextIds.has(contextId)) {
          problems.push(`${sectionFixturePath}: scope root has no source node for context ${contextId}`);
        }
      }
      for (const sourceNode of rootSourceNodes) {
        const terminalLayer = String(sourceNode.layerPath || '').split('/').at(-1)?.trim() || '';
        if (!terminalLayer.includes(`[section=${scope.rootIdentity}]`)) {
          problems.push(`${sectionFixturePath}: selected root path for ${sourceNode.contextId} must terminate at [section=${scope.rootIdentity}]`);
        }
      }
      for (const context of responsiveContexts.values()) {
        if (context.labelSource === 'inferred-from-selected-root-width' && context.width === undefined) {
          problems.push(`${sectionFixturePath}: inferred context ${context.id} must record its selected root width`);
        }
      }
    }

    const invalidSectionFixture = structuredClone(sectionFixture);
    delete invalidSectionFixture.bridge.context.scope.rootIdentity;
    if (validateBridge(invalidSectionFixture)) {
      problems.push(`${sectionFixturePath}: section scope without rootIdentity unexpectedly validates`);
    }
    const inheritedAssetFixture = structuredClone(sectionFixture);
    inheritedAssetFixture.bridge.context.scope.assetBoundary = 'ancestor-opaque';
    if (validateBridge(inheritedAssetFixture)) {
      problems.push(`${sectionFixturePath}: section scope below an ancestor asset unexpectedly validates`);
    }
  }

  // Keep the focused, non-standalone examples executable too. They intentionally
  // omit the required contract envelope, so validate the documented module
  // against its own canonical `$defs` entry rather than weakening the full schema.
  const fragmentCases = [
    { paths: ['examples/README.md', 'examples/README.ru.md'], module: 'responsive', definition: 'responsive' },
    { paths: ['docs/20-data-and-visualization.md', 'docs/ru/20-dannye-i-vizualizaciya.md'], module: 'data', definition: 'data' },
    { paths: ['docs/21-motion-and-scroll.md', 'docs/ru/21-motion-i-scroll.md'], module: 'motion', definition: 'motion' },
    { paths: ['docs/22-state-machines-and-reactions.md', 'docs/ru/22-sostoyaniya-i-reakcii.md'], module: 'interaction', definition: 'interaction' },
    { paths: ['docs/23-accessibility-profile.md', 'docs/ru/23-profil-dostupnosti.md'], module: 'accessibility', definition: 'accessibility' },
    { paths: ['docs/24-delivery-lifecycle.md', 'docs/ru/24-zhiznennyj-cikl-peredachi.md'], module: 'lifecycle', definition: 'lifecycle' },
  ];
  const fragmentFiles = new Map();
  const readJsonBlocks = (docsPath) => {
    if (fragmentFiles.has(docsPath)) return fragmentFiles.get(docsPath);
    const markdown = readFileSync(resolve(root, docsPath), 'utf8');
    const blocks = [];
    for (const [index, match] of [...markdown.matchAll(/```json\s*\n([\s\S]*?)\n```/gu)].entries()) {
      try { blocks.push({ index: index + 1, value: JSON.parse(match[1]) }); }
      catch (error) { problems.push(`${docsPath}: JSON block ${index + 1} is invalid (${error.message})`); }
    }
    fragmentFiles.set(docsPath, { markdown, blocks });
    return { markdown, blocks };
  };

  for (const { paths, module, definition } of fragmentCases) {
    const reference = `${bridgeSchema.$id}#/$defs/${definition}`;
    let validate;
    try { validate = ajv.getSchema(reference) || ajv.compile({ $ref: reference }); }
    catch (error) { problems.push(`validator/bridge.schema.json: could not compile fragment ${definition} (${error.message})`); continue; }
    for (const docsPath of paths) {
      const { markdown, blocks } = readJsonBlocks(docsPath);
      if (!/Non-standalone (?:module )?fragment|Неполный фрагмент(?: модуля)?/u.test(markdown)) {
        problems.push(`${docsPath}: module JSON must be labeled as a non-standalone fragment`);
      }
      const candidates = blocks.filter(({ value }) => value?.bridge?.[module] !== undefined);
      if (!candidates.length) {
        problems.push(`${docsPath}: no bridge.${module} JSON fragment found`);
        continue;
      }
      // Lifecycle also contains a deliberately narrower deviation excerpt. The
      // first lifecycle example is the complete module fragment; deviation
      // records are validated separately below.
      const candidate = candidates[0];
      if (!validate(candidate.value.bridge[module])) {
        for (const error of validate.errors || []) {
          problems.push(`${docsPath} JSON block ${candidate.index}${error.instancePath || '/'}: ${error.message}`);
        }
      }
    }
  }

  const validateDeviation = ajv.getSchema(`${bridgeSchema.$id}#/$defs/deviation`)
    || ajv.compile({ $ref: `${bridgeSchema.$id}#/$defs/deviation` });
  for (const docsPath of ['docs/24-delivery-lifecycle.md', 'docs/ru/24-zhiznennyj-cikl-peredachi.md']) {
    const { blocks } = readJsonBlocks(docsPath);
    const deviations = blocks.flatMap(({ index, value }) =>
      (value?.bridge?.lifecycle?.deviations || []).map((deviation) => ({ index, deviation })),
    );
    if (!deviations.length) problems.push(`${docsPath}: no lifecycle deviation JSON fragment found`);
    for (const { index, deviation } of deviations) {
      if (!validateDeviation(deviation)) {
        for (const error of validateDeviation.errors || []) {
          problems.push(`${docsPath} JSON block ${index}${error.instancePath || '/'}: ${error.message}`);
        }
      }
    }
  }
}

const catalog = readJson('validator/rules.json');
const localization = readJson('src/data/rules.ru.json');
const tagRegistry = readJson('validator/tags.json');
const tagExamples = readJson('validator/tag-examples.json');
const contentManifest = readJson('validator/site-content.json');
const methodologyCoverage = readJson('validator/methodology-coverage.json');

function duplicates(values) {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) (seen.has(value) ? repeated : seen).add(value);
  return [...repeated];
}

if (catalog && localization) {
  const ruleIds = catalog.rules.map(({ id }) => id);
  for (const id of duplicates(ruleIds)) problems.push(`validator/rules.json: duplicate rule id ${id}`);
  const catalogSet = new Set(ruleIds);
  const localizationIds = Object.keys(localization);
  for (const id of ruleIds) if (!Object.hasOwn(localization, id)) problems.push(`src/data/rules.ru.json: missing ${id}`);
  for (const id of localizationIds) if (!catalogSet.has(id)) problems.push(`src/data/rules.ru.json: unknown ${id}`);
}

const tagByKey = new Map();
if (tagRegistry) {
  for (const tag of tagRegistry.tags) {
    if (tagByKey.has(tag.key)) problems.push(`validator/tags.json: duplicate tag key ${tag.key}`);
    tagByKey.set(tag.key, tag);
    if (tag.status === 'deprecated' && tag.authoredInLayerName) {
      problems.push(`validator/tags.json: deprecated ${tag.key} cannot be authored in layer names`);
    }
    if (tag.sourceOfTruth === 'figma-metadata' && tag.authoredInLayerName) {
      problems.push(`validator/tags.json: metadata-derived ${tag.key} cannot be authored in layer names`);
    }
    if (tag.form === 'boolean' && tag.value !== null) {
      problems.push(`validator/tags.json: boolean ${tag.key} must have null value grammar`);
    }
    if (tag.form !== 'boolean' && !tag.value) {
      problems.push(`validator/tags.json: ${tag.key} needs a value grammar`);
    }
    if (tag.value?.pattern) {
      try { new RegExp(tag.value.pattern, 'u'); } catch (error) {
        problems.push(`validator/tags.json: ${tag.key} has invalid pattern (${error.message})`);
      }
    }
  }
  for (const tag of tagRegistry.tags) {
    const companionKeys = [
      ...(tag.companions.requires || []),
      ...(tag.companions.requiresAny || []),
      ...(tag.companions.conflicts || []),
      ...(tag.companions.recommended || []),
      ...(tag.companions.recommendedWhen?.any || []),
      ...(tag.companions.requiresValue ? [tag.companions.requiresValue.key] : []),
    ];
    for (const key of companionKeys) {
      if (!tagByKey.has(key)) problems.push(`validator/tags.json: ${tag.key} references unknown companion ${key}`);
      if (key === tag.key) problems.push(`validator/tags.json: ${tag.key} references itself as a companion`);
    }
  }
}

const tagPattern = /\[([a-z][a-z0-9-]*)(?:=([^\]\r\n]*))?\]/gu;
function validateLayerName(layerName, scope, ancestorLayerNames = []) {
  const errors = [];
  const parsed = [];
  for (const match of layerName.matchAll(tagPattern)) parsed.push({ key: match[1], value: match[2] });
  const byKey = new Map();
  for (const item of parsed) {
    if (byKey.has(item.key)) errors.push({ code: 'duplicate-tag', key: item.key });
    else byKey.set(item.key, item);
  }

  for (const item of parsed) {
    const definition = tagByKey.get(item.key);
    if (!definition) {
      errors.push({ code: 'unknown-tag', key: item.key });
      continue;
    }
    if (!definition.authoredInLayerName || definition.status === 'deprecated') {
      errors.push({ code: 'deprecated-tag', key: item.key });
    }
    if (!definition.scope.includes(scope)) errors.push({ code: 'scope-invalid', key: item.key });
    if (definition.form === 'property' && item.value === undefined) {
      errors.push({ code: 'form-value-required', key: item.key });
    }
    if (definition.form === 'boolean' && item.value !== undefined) {
      errors.push({ code: 'form-boolean-required', key: item.key });
    }
    if (item.value !== undefined && definition.value) {
      const grammar = definition.value;
      const patternMatches = !grammar.pattern || new RegExp(grammar.pattern, 'u').test(item.value);
      const enumMatches = !grammar.enum || grammar.enum.includes(item.value);
      const lengthMatches = !grammar.minLength || item.value.length >= grammar.minLength;
      if (!patternMatches || !enumMatches || !lengthMatches) errors.push({ code: 'invalid-value', key: item.key });
      if (definition.identityBearing && /-(?:[0-9]{3,4}|mobile|desktop|tablet)$/u.test(item.value)) {
        errors.push({ code: 'breakpoint-specific-identity', key: item.key });
      }
    }

    const companions = definition.companions;
    for (const key of companions.requires || []) {
      if (!byKey.has(key)) errors.push({ code: 'missing-companion', key: item.key, companion: key });
    }
    if (companions.requiresAny?.length && !companions.requiresAny.some((key) => byKey.has(key))) {
      errors.push({ code: 'missing-companion', key: item.key, companion: companions.requiresAny.join('|') });
    }
    for (const key of companions.conflicts || []) {
      if (byKey.has(key)) errors.push({ code: 'conflicting-tags', key: item.key, companion: key });
    }
    if (companions.requiresValue) {
      const companion = byKey.get(companions.requiresValue.key);
      if (!companion || companion.value !== companions.requiresValue.value) {
        errors.push({ code: 'companion-value-mismatch', key: item.key, companion: companions.requiresValue.key });
      }
    }
  }
  if (byKey.has('section') && ancestorLayerNames.some((name) => {
    const ancestorKeys = new Set([...name.matchAll(tagPattern)].map((match) => match[1]));
    // A page root carrying [asset] is already invalid and never becomes opaque;
    // mirror the plugin's page-root exception instead of hiding descendants.
    return ancestorKeys.has('asset') && !ancestorKeys.has('page');
  })) {
    errors.push({ code: 'scope-invalid', key: 'section' });
  }
  return errors;
}

if (tagExamples && tagRegistry) {
  const caseIds = [...tagExamples.valid, ...tagExamples.invalid].map(({ id }) => id);
  for (const id of duplicates(caseIds)) problems.push(`validator/tag-examples.json: duplicate case id ${id}`);
  for (const example of tagExamples.valid) {
    const errors = validateLayerName(example.layerName, example.scope, example.ancestorLayerNames);
    if (errors.length) problems.push(`validator/tag-examples.json valid/${example.id}: ${errors.map(({ code, key }) => `${code}:${key}`).join(', ')}`);
  }
  for (const example of tagExamples.invalid) {
    const actual = [...new Set(validateLayerName(example.layerName, example.scope, example.ancestorLayerNames).map(({ code }) => code))].sort();
    const expected = [...example.expectedErrorCodes].sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      problems.push(`validator/tag-examples.json invalid/${example.id}: expected ${expected.join(', ')}, received ${actual.join(', ') || 'no errors'}`);
    }
  }
}

const canonicalFiles = new Set(['README.md', 'README.ru.md']);
if (contentManifest) {
  const routes = contentManifest.pages.map(({ route }) => route);
  const orders = contentManifest.pages.map(({ order }) => order);
  for (const route of duplicates(routes)) problems.push(`validator/site-content.json: duplicate route ${route}`);
  for (const order of duplicates(orders)) problems.push(`validator/site-content.json: duplicate order ${order}`);
  for (const page of contentManifest.pages) {
    for (const locale of contentManifest.locales) {
      const source = page.source[locale];
      canonicalFiles.add(source);
      if (!existsSync(resolve(root, source))) problems.push(`validator/site-content.json: missing ${locale} source ${source}`);
    }
  }

  const manifestedDocs = new Set([...canonicalFiles].filter((file) => file.startsWith('docs/')));
  const discoveredDocs = [
    ...readdirSync(join(root, 'docs'), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => `docs/${entry.name}`),
    ...readdirSync(join(root, 'docs', 'ru'), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => `docs/ru/${entry.name}`),
    ...readdirSync(join(root, 'docs', 'zh'), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => `docs/zh/${entry.name}`),
    'docs/zh/examples/README.md',
  ];
  for (const file of discoveredDocs) if (!manifestedDocs.has(file)) problems.push(`validator/site-content.json: canonical doc is not manifested: ${file}`);
  for (const file of manifestedDocs) if (!discoveredDocs.includes(file)) problems.push(`validator/site-content.json: manifest references missing canonical doc: ${file}`);
}

if (tagRegistry) {
  const ignoredGenericKeys = new Set(['property']);
  const negativeCue = /\b(?:do not|don['’]t|invalid|bad|wrong|deprecated)\b|не\s+(?:созда|использ|добав|кодир|пиш)|(?:请勿|不要|不得|不应|禁止|无须|无需)|недопустим|неверн|плохо|ошиб/iu;
  for (const file of canonicalFiles) {
    const absolute = resolve(root, file);
    if (!existsSync(absolute)) continue;
    const lines = readFileSync(absolute, 'utf8').split('\n');
    lines.forEach((line, index) => {
      const tagSource = line
        .replace(/!?\[[^\]]*\]\([^)]+\)/gu, '')
        .replace(/\b(?:bridge\.)?[a-z][a-zA-Z0-9_.]*\[[a-z0-9._:/-]+\]/gu, '');
      for (const match of tagSource.matchAll(tagPattern)) {
        const key = match[1];
        if (tagByKey.has(key) || ignoredGenericKeys.has(key) || negativeCue.test(line)) continue;
        problems.push(`${file}:${index + 1}: undocumented BRIDGE-like tag [${key}]`);
      }
    });
  }
}

function allDuplicates(values) {
  return duplicates(values.filter((value) => value !== undefined));
}

const bridgeFixture = readJson('validator/examples/bridge-contract.valid.json');
if (bridgeFixture?.bridge) {
  const contract = bridgeFixture.bridge;
  if (contract.contractVersion !== canonicalContractVersion) {
    problems.push(`validator/examples/bridge-contract.valid.json: contractVersion ${contract.contractVersion} != canonical ${canonicalContractVersion}`);
  }
  if (contract.rulesVersion !== catalog.version) problems.push(`validator/examples/bridge-contract.valid.json: rulesVersion ${contract.rulesVersion} != ${catalog.version}`);
  const packageVersion = readJson('package.json')?.version;
  if (contract.methodologyVersion !== packageVersion) problems.push(`validator/examples/bridge-contract.valid.json: methodologyVersion ${contract.methodologyVersion} != ${packageVersion}`);
  const elements = contract.identity?.elements || [];
  const elementIdList = elements.map(({ bridgeKey }) => bridgeKey);
  const elementIds = new Set(elementIdList);
  for (const id of allDuplicates(elementIdList)) problems.push(`validator/examples/bridge-contract.valid.json: duplicate bridgeKey ${id}`);
  const contextIds = [
    ...(contract.structure?.contexts || []).map(({ id }) => id),
    ...(contract.responsive?.contexts || []).map(({ id }) => id),
  ];
  const contextSet = new Set(contextIds);
  for (const element of elements) {
    for (const node of element.designInstance.sourceNodes) {
      if (!contextSet.has(node.contextId)) problems.push(`validator/examples/bridge-contract.valid.json: ${element.bridgeKey} references unknown context ${node.contextId}`);
    }
  }
  const refChecks = [];
  for (const context of contract.structure?.contexts || []) refChecks.push(['structure root', context.rootIdentity]);
  for (const display of contract.data?.displays || []) {
    refChecks.push(['data display', display.displayId]);
    if (display.accessibleEquivalent) refChecks.push(['accessible equivalent', display.accessibleEquivalent]);
  }
  for (const transformation of contract.responsive?.transformations || []) {
    for (const mapping of transformation.mappings || []) {
      for (const ref of [...mapping.source, ...mapping.target]) refChecks.push(['responsive mapping', ref]);
    }
    for (const ref of [...(transformation.focusOrder || []), ...(transformation.readingOrder || [])]) refChecks.push(['responsive order', ref]);
  }
  for (const element of contract.accessibility?.elements || []) refChecks.push(['accessibility element', element.element]);
  for (const [kind, ref] of refChecks) if (!elementIds.has(ref)) problems.push(`validator/examples/bridge-contract.valid.json: ${kind} references unknown identity ${ref}`);

  for (const machine of contract.interaction?.stateMachines || []) {
    const states = new Set(machine.states);
    if (!states.has(machine.initial)) problems.push(`validator/examples/bridge-contract.valid.json: ${machine.id} initial state ${machine.initial} is undeclared`);
    for (const transition of machine.transitions) {
      const from = Array.isArray(transition.from) ? transition.from : [transition.from];
      for (const state of from) if (!states.has(state)) problems.push(`validator/examples/bridge-contract.valid.json: ${transition.id} references unknown from state ${state}`);
      if (transition.to && !states.has(transition.to)) problems.push(`validator/examples/bridge-contract.valid.json: ${transition.id} references unknown to state ${transition.to}`);
      for (const outcome of transition.outcomes || []) if (outcome.to && !states.has(outcome.to)) problems.push(`validator/examples/bridge-contract.valid.json: ${transition.id} outcome references unknown state ${outcome.to}`);
    }
  }

  const lifecycleEvidence = new Set((contract.lifecycle?.evidence || []).map(({ id }) => id));
  for (const requirement of contract.lifecycle?.requirements || []) {
    for (const evidence of requirement.evidence || []) if (!lifecycleEvidence.has(evidence)) problems.push(`validator/examples/bridge-contract.valid.json: ${requirement.id} references unknown evidence ${evidence}`);
  }
  for (const question of contract.openQuestions || []) {
    if (!elementIds.has(question.scopeRef)) problems.push(`validator/examples/bridge-contract.valid.json: ${question.id} references unknown scope ${question.scopeRef}`);
  }
}

if (methodologyCoverage && catalog && contentManifest) {
  if (methodologyCoverage.catalogVersion !== catalog.version) {
    problems.push(`validator/methodology-coverage.json: catalogVersion ${methodologyCoverage.catalogVersion} != ${catalog.version}`);
  }
  const rulesById = new Map(catalog.rules.map((rule) => [rule.id, rule]));
  const manifestSources = new Set(contentManifest.pages.flatMap(({ source }) => Object.values(source)));
  const mappedRuleIds = new Set();
  for (const area of methodologyCoverage.areas) {
    for (const source of Object.values(area.source)) {
      if (!existsSync(resolve(root, source))) problems.push(`validator/methodology-coverage.json: missing source ${source}`);
      if (!manifestSources.has(source)) problems.push(`validator/methodology-coverage.json: source not in site manifest ${source}`);
    }
    for (const check of area.checks) {
      for (const id of check.ruleIds) {
        mappedRuleIds.add(id);
        const rule = rulesById.get(id);
        if (!rule) problems.push(`validator/methodology-coverage.json: unknown rule ${id}`);
        else if (rule.automation !== check.level) problems.push(`validator/methodology-coverage.json: ${id} is ${rule.automation}, mapped as ${check.level}`);
      }
    }
  }
  const expandedRule = /^(?:data\.|motion\.|delivery\.|capability\.|contract\.)/u;
  const specificallyExpanded = new Set([
    'responsive.transformation-mapping-incomplete',
    'interaction.reaction-guard-ambiguous',
    'interaction.reaction-effect-incomplete',
    'interaction.async-outcome-missing',
    'accessibility.reaction-focus-effect-missing',
    'accessibility.page-profile-missing',
    'accessibility.component-profile-missing',
  ]);
  for (const rule of catalog.rules) {
    if ((expandedRule.test(rule.id) || specificallyExpanded.has(rule.id)) && !mappedRuleIds.has(rule.id)) {
      problems.push(`validator/methodology-coverage.json: expanded rule has no readiness mapping: ${rule.id}`);
    }
  }
}

if (problems.length) {
  console.error(`BRIDGE contract validation found ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`BRIDGE contracts verified: ${catalog.rules.length} rules, ${tagRegistry.tags.length} registered tags, ${tagExamples.valid.length + tagExamples.invalid.length} executable tag cases, and ${contentManifest.pages.length} localized page pairs.`);
}
