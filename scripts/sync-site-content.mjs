import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentRoot = join(root, 'src', 'content', 'docs');
const generatedManifestFile = join(contentRoot, '.bridge-generated.json');
const validatorRoot = join(root, 'validator');
const publicData = join(root, 'public', 'data');
const publicSchema = join(root, 'public', 'schema');
const checkOnly = process.argv.includes('--check');
const siteBase = process.env.SITE_BASE || '/bridge-design-methodology';

if (!siteBase.startsWith('/') || /[?#]/u.test(siteBase) || siteBase.split('/').includes('..')) {
  throw new Error(`SITE_BASE must be an absolute URL path without traversal, query, or fragment: ${siteBase}`);
}

const basePrefix = siteBase === '/' ? '' : siteBase.replace(/\/+$/u, '');
const manifestPath = join(root, 'validator', 'site-content.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const locales = manifest.locales;
const entries = manifest.pages.map(({ route, source, order, description, sidebarLabel }) => ({
  route,
  order,
  description,
  sidebarLabel,
  ...source,
}));

function assertUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) throw new Error(`Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

function assertInsideRoot(path, label) {
  const absolute = resolve(root, path);
  if (absolute !== root && !absolute.startsWith(`${root}${sep}`)) {
    throw new Error(`${label} escapes the repository: ${path}`);
  }
  return absolute;
}

if (JSON.stringify(locales) !== JSON.stringify(['en', 'ru', 'zh'])) {
  throw new Error('validator/site-content.json must declare locales in canonical en, ru, zh order.');
}
assertUnique(entries.map(({ route }) => route), 'documentation route');
assertUnique(entries.map(({ order }) => order), 'sidebar order');
for (const locale of locales) {
  assertUnique(entries.map((entry) => entry[locale]), `${locale} source`);
}

const sourceMap = new Map();
for (const entry of entries) {
  for (const locale of locales) {
    const source = assertInsideRoot(entry[locale], `${locale} source`);
    if (!existsSync(source) || !statSync(source).isFile()) {
      throw new Error(`Missing ${locale} source for ${entry.route}: ${relative(root, source)}`);
    }
    sourceMap.set(source, { locale, route: entry.route });
  }
}

function pageUrl(locale, route, anchor = '') {
  const normalizedRoute = route ? `${route.replace(/^\/+|\/+$/gu, '')}/` : '';
  return `${basePrefix}/${locale}/${normalizedRoute}${anchor}`;
}

function sourceEntryFor(sourceFile) {
  return entries.find((entry) => locales.some((locale) => resolve(root, entry[locale]) === sourceFile));
}

const schemaSources = readdirSync(validatorRoot, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.schema.json'))
  .map((entry) => [join(validatorRoot, entry.name), entry.name])
  .sort((left, right) => left[1].localeCompare(right[1], 'en'));

const publicDataFiles = new Map([
  [join(validatorRoot, 'rules.json'), 'bridge-rules.json'],
  [join(validatorRoot, 'page-check-coverage.json'), 'page-check-coverage.json'],
  [join(validatorRoot, 'section-check-coverage.json'), 'section-check-coverage.json'],
  [join(validatorRoot, 'methodology-coverage.json'), 'methodology-coverage.json'],
  [join(validatorRoot, 'tags.json'), 'tags.json'],
  [join(validatorRoot, 'examples', 'bridge-section-contract.valid.json'), 'bridge-section-contract.valid.json'],
]);

// Canonical Markdown links point at the schema endpoint declared by each `$id`.
// Schema aliases remain in /data so relative `$schema` references in the public
// JSON contracts continue to resolve without breaking existing consumers.
const publicValidatorLinks = new Map(
  [...publicDataFiles].map(([source, name]) => [source, `data/${name}`]),
);
for (const [source, name] of schemaSources) publicValidatorLinks.set(source, `schema/${name}`);

function rewriteLinks(markdown, sourceFile, locale) {
  const rewrittenMarkdownLinks = markdown.replace(/(!?\[[^\]]*\])\(([^)]+)\)/gu, (match, label, rawDestination) => {
    const destination = rawDestination.trim();
    if (
      !destination ||
      destination.startsWith('#') ||
      destination.startsWith('http://') ||
      destination.startsWith('https://') ||
      destination.startsWith('mailto:') ||
      destination.startsWith('tel:') ||
      destination.startsWith('data:')
    ) {
      return match;
    }

    const [pathPart, anchorPart] = destination.split('#', 2);
    if (isAbsolute(pathPart)) return match;
    const resolvedTarget = resolve(dirname(sourceFile), pathPart);
    const sourceEntry = sourceEntryFor(sourceFile);
    const equivalentTargets = sourceEntry
      ? locales.map((sourceLocale) => resolve(dirname(resolve(root, sourceEntry[sourceLocale])), pathPart))
      : [];
    const mapped = sourceMap.get(resolvedTarget) || equivalentTargets.map((target) => sourceMap.get(target)).find(Boolean);
    const anchor = anchorPart ? `#${anchorPart}` : '';

    if (mapped) return `${label}(${pageUrl(locale, mapped.route, anchor)})`;

    const publicValidatorPath = publicValidatorLinks.get(resolvedTarget)
      || equivalentTargets.map((target) => publicValidatorLinks.get(target)).find(Boolean);
    if (publicValidatorPath) return `${label}(${basePrefix}/${publicValidatorPath}${anchor})`;

    const assetsRoot = resolve(root, 'assets');
    const assetTarget = [resolvedTarget, ...equivalentTargets].find((target) => existsSync(target));
    if (assetTarget && statSync(assetTarget).isDirectory() && assetTarget.startsWith(`${assetsRoot}${sep}`)) {
      const assetDirectory = relative(root, assetTarget).split(sep).join('/');
      if (label.startsWith('!')) return match;
      return `${label}(https://github.com/Poliklot/bridge-design-methodology/tree/main/${assetDirectory})`;
    }
    if (resolvedTarget === assetsRoot) {
      if (label.startsWith('!')) return match;
      return `${label}(https://github.com/Poliklot/bridge-design-methodology/tree/main/assets)`;
    }
    const assetFileTarget = [resolvedTarget, ...equivalentTargets].find((target) => target.startsWith(`${assetsRoot}${sep}`));
    if (assetFileTarget) {
      const assetPath = relative(assetsRoot, assetFileTarget).split(sep).join('/');
      return `${label}(${basePrefix}/assets/${assetPath}${anchor})`;
    }

    return match;
  });

  // Raw HTML in canonical Markdown bypasses Markdown link rewriting. Rewrite only
  // authored relative assets; remote and already-rooted URLs remain untouched.
  return rewrittenMarkdownLinks.replace(
    /\b(src|srcset)=(['"])((?:\.\.\/)+assets\/([^'"]+))\2/gu,
    (_match, attribute, quote, _destination, assetPath) =>
      `${attribute}=${quote}${basePrefix}/assets/${assetPath}${quote}`,
  );
}

function extractTitle(markdown, source) {
  const matches = [...markdown.matchAll(/^#\s+(.+)$/gmu)];
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one H1 in ${relative(root, source)}; found ${matches.length}.`);
  }
  return matches[0][1].replaceAll('`', '').trim();
}

function githubSlug(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/gu, '')
    .replace(/[`*_~]/gu, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/gu, '-')
    .replace(/-+/gu, '-');
}

function headingAliases(localizedMarkdown, canonicalMarkdown) {
  const canonicalHeadings = canonicalMarkdown
    .split('\n')
    .filter((line) => /^#{1,6}\s+/u.test(line))
    .map((line) => githubSlug(line.replace(/^#{1,6}\s+/u, '')));
  let headingIndex = 0;
  let fenced = false;
  return localizedMarkdown.split('\n').map((line) => {
    if (line.trimStart().startsWith('```')) {
      fenced = !fenced;
      return line;
    }
    if (fenced) return line;
    const match = line.match(/^(#{1,6}\s+)(.+)$/u);
    if (!match) return line;
    const alias = canonicalHeadings[headingIndex++];
    return alias ? `${match[1]}<a id="${alias}"></a>${match[2]}` : line;
  }).join('\n');
}

function extractDescription(markdown, locale, overrides) {
  const explicit = overrides?.[locale];
  if (explicit) return explicit;

  const body = markdown
    .replace(/^#\s+.+$/mu, '')
    .replace(/<picture>[\s\S]*?<\/picture>/gu, '')
    .replace(/```[\s\S]*?```/gu, '')
    .replace(/^#{2,}\s+.+$/gmu, '')
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('|') && !line.startsWith('-') && !line.startsWith('!'));

  return (body || (locale === 'ru' ? 'Документация BRIDGE.' : locale === 'zh' ? 'BRIDGE 中文文档。' : 'BRIDGE documentation.'))
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
    .replace(/[*_`>]/gu, '')
    .slice(0, 220);
}

const outputs = new Map();
for (const entry of entries) {
  for (const locale of locales) {
    const source = resolve(root, entry[locale]);
    const raw = readFileSync(source, 'utf8').replace(/\r\n?/gu, '\n');
    const title = extractTitle(raw, source);
    const description = extractDescription(raw, locale, entry.description);
    let body = rewriteLinks(raw.replace(/^#\s+.+\n+/u, ''), source, locale);
    if (locale === 'zh') {
      const canonical = readFileSync(resolve(root, entry.en), 'utf8').replace(/^#\s+.+\n+/u, '');
      body = headingAliases(body, canonical);
    }
    const output = join(contentRoot, locale, `${entry.route}.md`);
    const sidebarLabel = entry.sidebarLabel?.[locale];
    const sidebar = sidebarLabel
      ? `sidebar:\n  label: ${JSON.stringify(sidebarLabel)}\n  order: ${entry.order}`
      : `sidebar:\n  order: ${entry.order}`;
    const generated = `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\neditUrl: false\n${sidebar}\n---\n\n<!-- Generated from ${relative(root, source)}. Do not edit this file directly. -->\n\n${body}`;
    outputs.set(output, generated.endsWith('\n') ? generated : `${generated}\n`);
  }
}

const generatedFiles = [...outputs.keys()].map((file) => relative(contentRoot, file).split(sep).join('/')).sort();
const generatedManifest = `${JSON.stringify({ version: manifest.version, files: generatedFiles }, null, 2)}\n`;

function sameFile(path, expected) {
  return existsSync(path) && readFileSync(path, 'utf8') === expected;
}

function atomicWrite(path, contents) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp-${process.pid}`;
  writeFileSync(temporary, contents);
  renameSync(temporary, path);
}

function readPreviousGeneratedFiles() {
  if (!existsSync(generatedManifestFile)) return [];
  const previous = JSON.parse(readFileSync(generatedManifestFile, 'utf8'));
  if (!Array.isArray(previous.files)) throw new Error('Generated content manifest has an invalid files list.');
  return previous.files;
}

function publicCopies() {
  const copies = new Map();
  for (const [source, name] of publicDataFiles) {
    if (!existsSync(source)) continue;
    if (name === 'bridge-section-contract.valid.json') {
      const fixture = JSON.parse(readFileSync(source, 'utf8'));
      // The canonical fixture lives under validator/examples and resolves its
      // schema one directory up. Its public copy is flattened into /data, where
      // the generated schema alias is a sibling instead.
      fixture.$schema = './bridge.schema.json';
      copies.set(join(publicData, name), Buffer.from(`${JSON.stringify(fixture, null, 2)}\n`));
      continue;
    }
    copies.set(join(publicData, name), readFileSync(source));
  }
  for (const [source, name] of schemaSources) {
    if (!existsSync(source)) continue;
    const contents = readFileSync(source);
    copies.set(join(publicSchema, name), contents);
    copies.set(join(publicData, name), contents);
  }
  const rulesSource = join(validatorRoot, 'rules.json');
  if (existsSync(rulesSource)) copies.set(join(publicData, 'rules.json'), readFileSync(rulesSource));
  return copies;
}


// Compare or materialize generated Markdown first; all source reads and rendering above
// complete before any existing output is touched.
const mismatches = [];
for (const [output, contents] of outputs) {
  if (!sameFile(output, contents)) {
    if (checkOnly) mismatches.push(relative(root, output));
    else atomicWrite(output, contents);
  }
}

const previousGenerated = readPreviousGeneratedFiles();
for (const staleRelative of previousGenerated) {
  if (generatedFiles.includes(staleRelative)) continue;
  const stale = resolve(contentRoot, staleRelative);
  if (!stale.startsWith(`${contentRoot}${sep}`)) throw new Error(`Unsafe generated path: ${staleRelative}`);
  if (checkOnly) {
    if (existsSync(stale)) mismatches.push(relative(root, stale));
  } else {
    rmSync(stale, { force: true });
  }
}

if (!sameFile(generatedManifestFile, generatedManifest)) {
  if (checkOnly) mismatches.push(relative(root, generatedManifestFile));
  else atomicWrite(generatedManifestFile, generatedManifest);
}

const expectedPublicCopies = publicCopies();
for (const [target, contents] of expectedPublicCopies) {
  const current = existsSync(target) ? readFileSync(target) : undefined;
  if (!current || !current.equals(contents)) {
    if (checkOnly) mismatches.push(relative(root, target));
    else {
      mkdirSync(dirname(target), { recursive: true });
      const temporary = `${target}.tmp-${process.pid}`;
      writeFileSync(temporary, contents);
      renameSync(temporary, target);
    }
  }
}

// /public/data and /public/schema are fully generated. Reject or remove stale
// entries so a renamed schema cannot remain published after its source is gone.
const expectedPublicTargets = new Set(expectedPublicCopies.keys());
for (const directory of [publicData, publicSchema]) {
  if (!existsSync(directory)) continue;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isFile() && expectedPublicTargets.has(path)) continue;
    if (checkOnly) mismatches.push(relative(root, path));
    else rmSync(path, { recursive: true, force: true });
  }
}

function relativeFileMap(directory) {
  const files = new Map();
  if (!existsSync(directory)) return files;
  const visit = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile()) files.set(relative(directory, path).split(sep).join('/'), readFileSync(path));
    }
  };
  visit(directory);
  return files;
}

// Public authored assets are copied by subdirectory so plugin media already in
// public/assets is never removed. Each directory swap is recoverable and check
// mode verifies an exact byte-for-byte tree, including stale public files.
for (const directory of ['brand', 'diagrams']) {
  const source = join(root, 'assets', directory);
  if (!existsSync(source)) continue;
  const target = join(root, 'public', 'assets', directory);
  if (checkOnly) {
    const sourceFiles = relativeFileMap(source);
    const targetFiles = relativeFileMap(target);
    const names = new Set([...sourceFiles.keys(), ...targetFiles.keys()]);
    for (const name of names) {
      const sourceContents = sourceFiles.get(name);
      const targetContents = targetFiles.get(name);
      if (!sourceContents || !targetContents || !sourceContents.equals(targetContents)) {
        mismatches.push(`${relative(root, target)}/${name}`);
      }
    }
  } else {
    const staging = join(root, '.cache', `sync-site-content-${process.pid}`, directory);
    rmSync(staging, { recursive: true, force: true });
    mkdirSync(dirname(staging), { recursive: true });
    cpSync(source, staging, { recursive: true });
    const backup = `${target}.backup-${process.pid}`;
    mkdirSync(dirname(target), { recursive: true });
    try {
      if (existsSync(target)) renameSync(target, backup);
      renameSync(staging, target);
      rmSync(backup, { recursive: true, force: true });
    } catch (error) {
      if (existsSync(backup) && !existsSync(target)) renameSync(backup, target);
      throw error;
    }
  }
}
rmSync(join(root, '.cache', `sync-site-content-${process.pid}`), { recursive: true, force: true });

if (mismatches.length) {
  console.error(`Generated site content is stale (${mismatches.length} paths):\n- ${mismatches.sort().join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`${checkOnly ? 'Verified' : 'Prepared'} ${outputs.size} localized documentation pages from validator/site-content.json.`);
}
