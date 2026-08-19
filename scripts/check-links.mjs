import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(resolve(root, 'validator/site-content.json'), 'utf8'));
const files = [
  'README.md',
  'README.ru.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  ...manifest.pages.flatMap(({ source }) => Object.values(source)),
];
const canonicalSourceByLocale = new Map();
for (const page of manifest.pages) {
  for (const source of Object.values(page.source)) {
    if (source.startsWith('docs/zh/')) canonicalSourceByLocale.set(resolve(root, source), resolve(root, page.source.en));
  }
}
const problems = [];
const headingsByFile = new Map();

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

function headings(file) {
  if (headingsByFile.has(file)) return headingsByFile.get(file);
  const counts = new Map();
  const anchors = new Set();
  let fenced = false;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (line.trimStart().startsWith('```')) { fenced = !fenced; continue; }
    if (fenced) continue;
    const match = line.match(/^#{1,6}\s+(.+)$/u);
    if (!match) continue;
    const base = githubSlug(match[1]);
    const count = counts.get(base) || 0;
    counts.set(base, count + 1);
    anchors.add(count ? `${base}-${count}` : base);
  }
  headingsByFile.set(file, anchors);
  return anchors;
}

for (const sourcePath of [...new Set(files)]) {
  const source = resolve(root, sourcePath);
  if (!existsSync(source)) continue;
  const markdown = readFileSync(source, 'utf8');
  for (const match of markdown.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/gu)) {
    const destination = match[1].trim();
    if (!destination || /^(?:https?:|mailto:|tel:|data:)/u.test(destination)) continue;
    const [pathPart, encodedAnchor] = destination.split('#', 2);
    const linkBase = canonicalSourceByLocale.get(source) || source;
    const target = pathPart ? resolve(dirname(linkBase), pathPart) : linkBase;
    if (!existsSync(target)) {
      problems.push(`${sourcePath}: missing link target ${destination}`);
      continue;
    }
    if (encodedAnchor && ['.md', '.mdx'].includes(extname(target))) {
      let anchor;
      try { anchor = decodeURIComponent(encodedAnchor); } catch { anchor = encodedAnchor; }
      if (!headings(target).has(anchor)) {
        problems.push(`${sourcePath}: missing anchor #${anchor} in ${relative(root, target)}`);
      }
    }
  }
}

if (problems.length) {
  console.error(`Markdown link check found ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Markdown links verified across ${new Set(files).size} canonical files.`);
}
