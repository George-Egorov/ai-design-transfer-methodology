import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(resolve(root, 'validator/site-content.json'), 'utf8'));
const problems = [];

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

function body(markdown) {
  return markdown.replace(/^---[\s\S]*?---\s*/u, '').replace(/```[\s\S]*?```/gu, '');
}

function countWords(markdown, locale) {
  const value = body(markdown);
  if (locale === 'zh') return [...value].filter((char) => /\p{L}|\p{N}/u.test(char)).length;
  return [...value.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)].length;
}

function headingCount(markdown) {
  return [...body(markdown).matchAll(/^#{1,6}\s+/gmu)].length;
}

const limits = {
  'start/designer-quick-start': { en: 800, ru: 800, zh: 1200 },
  examples: { en: 900, ru: 900, zh: 1500 },
  'check/designer-checklist': { en: 700, ru: 700, zh: 1200 },
};

for (const page of manifest.pages) {
  const sources = Object.fromEntries(manifest.locales.map((locale) => [locale, page.source[locale]]));
  const headings = manifest.locales.map((locale) => headingCount(read(sources[locale])));
  if (new Set(headings).size !== 1) {
    problems.push(`${page.route}: localized heading counts differ (${headings.join(', ')})`);
  }
  for (const locale of manifest.locales) {
    if (!page.sidebarLabel?.[locale]) problems.push(`${page.route}: missing ${locale} sidebar label`);
  }
  const limit = limits[page.route];
  if (!limit) continue;
  for (const locale of manifest.locales) {
    const words = countWords(read(sources[locale]), locale);
    if (words > limit[locale]) problems.push(`${sources[locale]}: ${words} words/characters exceeds ${limit[locale]}`);
    const text = read(sources[locale]);
    if (/BRIDGE 0\.|Page Check 0\.|interactive preflight|browser simulation|интерактивн.*провер/iu.test(text)) {
      problems.push(`${sources[locale]}: technical/versioned entry-copy leak`);
    }
  }
}

for (const page of manifest.pages) {
  if (page.description?.zh === 'BRIDGE 方法论的中文文档页面，说明设计交付、结构化数据与验证规则。') {
    problems.push(`${page.route}: generic Chinese description remains`);
  }
}

if (problems.length) {
  console.error(`Documentation concision check found ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Documentation concision verified across ${manifest.pages.length} pages and ${manifest.locales.length} locales.`);
}
