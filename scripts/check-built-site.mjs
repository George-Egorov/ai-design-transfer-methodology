import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const validatorRoot = join(root, 'validator');
const base = (process.env.SITE_BASE || '/bridge-design-methodology').replace(/^\/+|\/+$/gu, '');
const baseRoot = dist;
const publicRoot = `https://poliklot.github.io/${base ? `${base}/` : ''}`;
const problems = [];

if (!existsSync(baseRoot)) {
  console.error(`Built-site check cannot find ${relative(root, baseRoot)}. Run npm run build first.`);
  process.exit(1);
}

const htmlFiles = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
}
walk(dist);

function targetForPath(pathname) {
  let normalized = pathname.replace(/^\/+/, '');
  if (base && normalized.startsWith(`${base}/`)) normalized = normalized.slice(base.length + 1);
  else if (base && normalized === base) normalized = '';
  else if (base && normalized && !normalized.startsWith('_astro/') && !normalized.startsWith('assets/') && !normalized.startsWith('data/') && !normalized.startsWith('pagefind/')) return join(dist, '__outside-configured-base__', normalized);
  const direct = join(baseRoot, normalized);
  if (extname(direct)) return direct;
  return join(direct, 'index.html');
}

function anchors(file) {
  const html = readFileSync(file, 'utf8');
  return new Set([...html.matchAll(/\bid=["']([^"']+)["']/gu)].map((match) => match[1]));
}

const anchorCache = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const references = [
    ...[...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gu)].map((match) => match[1]),
    ...[...html.matchAll(/\bsrcset=["']([^"']+)["']/gu)].flatMap((match) =>
      match[1].split(',').map((candidate) => candidate.trim().split(/\s+/u)[0]).filter(Boolean),
    ),
  ];
  for (const raw of references) {
    if (!raw || /^(?:https?:|mailto:|tel:|data:|javascript:)/u.test(raw)) continue;
    let url;
    try { url = new URL(raw, `https://example.test/${relative(dist, file).replaceAll('\\', '/')}`); }
    catch { problems.push(`${relative(root, file)}: invalid URL ${raw}`); continue; }
    const target = raw.startsWith('#') ? file : targetForPath(url.pathname);
    if (!existsSync(target) || !statSync(target).isFile()) {
      problems.push(`${relative(root, file)}: missing built target ${raw}`);
      continue;
    }
    if (url.hash && extname(target) === '.html') {
      let id;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { id = url.hash.slice(1); }
      if (!anchorCache.has(target)) anchorCache.set(target, anchors(target));
      if (!anchorCache.get(target).has(id)) problems.push(`${relative(root, file)}: missing built anchor ${raw}`);
    }
  }
}

function verifyCopy(source, target, label) {
  if (!existsSync(source)) {
    problems.push(`${label}: missing source ${relative(root, source)}`);
    return;
  }
  if (!existsSync(target) || !statSync(target).isFile()) {
    problems.push(`${label}: missing built copy ${relative(root, target)}`);
    return;
  }
  if (!readFileSync(source).equals(readFileSync(target))) {
    problems.push(`${label}: built copy differs ${relative(root, target)}`);
  }
}

function verifyDirectory(source, target, label) {
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name);
    const targetPath = join(target, entry.name);
    if (entry.isDirectory()) verifyDirectory(sourcePath, targetPath, label);
    else verifyCopy(sourcePath, targetPath, label);
  }
}

for (const directory of ['brand', 'diagrams']) {
  verifyDirectory(join(root, 'assets', directory), join(dist, 'assets', directory), `public ${directory} asset`);
}

const publicDataContracts = [
  ['rules.json', 'bridge-rules.json'],
  ['rules.json', 'rules.json'],
  ['page-check-coverage.json', 'page-check-coverage.json'],
  ['methodology-coverage.json', 'methodology-coverage.json'],
  ['tags.json', 'tags.json'],
];

for (const [sourceName, targetName] of publicDataContracts) {
  const source = join(validatorRoot, sourceName);
  const generated = join(root, 'public', 'data', targetName);
  verifyCopy(source, generated, 'generated public validator contract');
  verifyCopy(generated, join(dist, 'data', targetName), 'built public validator contract');
}

const schemaNames = readdirSync(validatorRoot, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.schema.json'))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, 'en'));

for (const schemaName of schemaNames) {
  const source = join(validatorRoot, schemaName);
  const generatedCanonical = join(root, 'public', 'schema', schemaName);
  const generatedAlias = join(root, 'public', 'data', schemaName);
  const canonicalTarget = join(dist, 'schema', schemaName);
  verifyCopy(source, generatedCanonical, 'generated canonical public schema');
  verifyCopy(generatedCanonical, canonicalTarget, 'built canonical public schema');
  verifyCopy(source, generatedAlias, 'generated public data schema alias');
  verifyCopy(generatedAlias, join(dist, 'data', schemaName), 'built public data schema alias');

  let schema;
  try {
    schema = JSON.parse(readFileSync(source, 'utf8'));
  } catch (error) {
    problems.push(`validator/${schemaName}: invalid JSON (${error.message})`);
    continue;
  }
  let id;
  try {
    id = new URL(schema.$id);
  } catch {
    problems.push(`validator/${schemaName}: invalid or missing $id`);
    continue;
  }
  const expectedId = new URL(`schema/${schemaName}`, publicRoot).href;
  if (id.href !== expectedId) {
    problems.push(`validator/${schemaName}: $id ${id.href} does not match ${expectedId}`);
    continue;
  }
  const idTarget = targetForPath(id.pathname);
  if (!existsSync(idTarget) || !statSync(idTarget).isFile()) {
    problems.push(`validator/${schemaName}: $id endpoint is missing from the build (${id.href})`);
  }
}

function verifySchemaReference(documentPath, documentUrl, reference, label) {
  let schemaUrl;
  try {
    schemaUrl = new URL(reference, documentUrl);
  } catch {
    problems.push(`${documentPath}: invalid ${label} ${reference}`);
    return;
  }
  if (schemaUrl.origin !== new URL(publicRoot).origin) return;
  const target = targetForPath(schemaUrl.pathname);
  if (!existsSync(target) || !statSync(target).isFile()) {
    problems.push(`${documentPath}: ${label} endpoint is missing from the build (${schemaUrl.href})`);
  }
}

const builtData = join(dist, 'data');
if (!existsSync(builtData)) {
  problems.push('missing built data directory');
} else {
  for (const entry of readdirSync(builtData, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const file = join(builtData, entry.name);
    let document;
    try {
      document = JSON.parse(readFileSync(file, 'utf8'));
    } catch (error) {
      problems.push(`${relative(root, file)}: invalid JSON (${error.message})`);
      continue;
    }
    const documentUrl = new URL(`data/${entry.name}`, publicRoot);
    if (typeof document.$schema === 'string') {
      verifySchemaReference(relative(root, file), documentUrl, document.$schema, '$schema');
    }
    if (typeof document.structuredMetadata?.schema === 'string') {
      verifySchemaReference(relative(root, file), documentUrl, document.structuredMetadata.schema, 'structured metadata schema');
    }
  }
}

const sitemap = join(dist, 'sitemap-0.xml');
if (!existsSync(sitemap)) {
  problems.push('missing built sitemap-0.xml');
} else {
  const xml = readFileSync(sitemap, 'utf8');
  if (xml.includes(`<loc>${publicRoot}</loc>`)) problems.push('sitemap includes the noindex redirect root');
  if (xml.includes('/404')) problems.push('sitemap includes the 404 page');
  for (const locale of ['en', 'ru', 'zh']) {
    if (!xml.includes(`<loc>${publicRoot}${locale}/</loc>`)) problems.push(`sitemap is missing ${locale} root`);
  }
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/gu) || []) {
    for (const hreflang of ['en', 'ru', 'zh-CN']) {
      const matches = block.match(new RegExp(`hreflang="${hreflang}"`, 'gu')) || [];
      if (matches.length !== 1) problems.push(`sitemap alternate group has ${matches.length} ${locale} links`);
    }
  }
}

const notFound = join(dist, '404.html');
if (!existsSync(notFound)) {
  problems.push('missing built 404.html');
} else {
  const html = readFileSync(notFound, 'utf8');
  if (!/name="robots" content="noindex, nofollow"/u.test(html)) problems.push('404 page is not noindex');
  if (base && !html.includes(`href="/${base}/ru/"`)) problems.push('404 home action does not include the configured base path');
}

if (problems.length) {
  console.error(`Built-site link check found ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Built site verified across ${htmlFiles.length} HTML files: links, anchors, assets, schema endpoints, contracts, sitemap, and 404.`);
}
