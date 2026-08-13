import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const markdownFiles = [
  join(root, 'README.ru.md'),
  join(root, 'examples', 'README.ru.md'),
  ...readdirSync(join(root, 'docs', 'ru'))
    .filter((name) => name.endsWith('.md'))
    .map((name) => join(root, 'docs', 'ru', name)),
];

const astroFiles = [join(root, 'src', 'components', 'RulesExplorer.astro')];
const files = [...markdownFiles, ...astroFiles];

const forbiddenTerms = [
  'breakpoint',
  'identity',
  'handoff',
  'preflight',
  'wrapper',
  'target',
  'asset',
  'decor',
  'overflow policy',
  'fixed height',
  'root frame',
  'instance',
  'source component',
  'responsive',
  'design source',
  'no-code',
  'pipeline',
  'roadmap',
  'severity',
  'rule catalog',
  'modal target',
  'production route',
  'draft marker',
];

const forbiddenPattern = new RegExp(
  `\\b(${forbiddenTerms.map((term) => term.replaceAll(' ', '\\s+')).join('|')})(?:s|ies)?\\b`,
  'iu',
);

const informalPattern =
  /\b(используй|добавляй|пиши|не пиши|не добавляй|проверяй|сохрани|создавай|задай|убери|помечай|считай|моделируй)\b/iu;

const allowedHeadingWords = new Set([
  'BRIDGE',
  'Figma',
  'UI',
  'Kit',
  'Page',
  'Sections',
  'WCAG',
]);

const issues = [];

for (const file of files) {
  const fileName = relative(root, file);
  const lines = readFileSync(file, 'utf8').split('\n');
  let fenced = false;

  lines.forEach((sourceLine, index) => {
    const lineNumber = index + 1;
    const isAstro = file.endsWith('.astro');

    if (isAstro && !/[А-ЯЁа-яё]/u.test(sourceLine)) return;

    if (sourceLine.trimStart().startsWith('```')) {
      fenced = !fenced;
      return;
    }

    if (fenced) return;

    const candidateLine = isAstro
      ? (sourceLine.match(/(['"`])([^'"`]*[А-ЯЁа-яё][^'"`]*)\1/u)?.[2] || '')
      : sourceLine;

    const prose = candidateLine
      .replace(/`[^`]*`/gu, '')
      .replace(/\]\([^)]*\)/gu, ']()')
      .replace(/<[^>]+>/gu, '')
      .replace(/https?:\/\/\S+/gu, '');

    const canonicalBridgeLine =
      /\*\*(Breakpoints|Roles|Identity|Dependencies|Geometry|Exceptions)\*\*/u.test(candidateLine) ||
      /^\d+\. \*\*[BRIDGE] — (Breakpoints|Roles|Identity|Dependencies|Geometry|Exceptions):/u.test(
        candidateLine,
      ) ||
      /^- \*\*BRIDGE (Contract|Preflight|Adapter|Linter|Exception|ready)/u.test(sourceLine);

    const terminologyFile = fileName.endsWith('18-terminologiya.md');

    if (!terminologyFile && !canonicalBridgeLine) {
      const term = prose.match(forbiddenPattern);
      if (term) {
        issues.push(`${fileName}:${lineNumber}: замените смешанный термин «${term[0]}»`);
      }
    }

    const informal = prose.match(informalPattern);
    if (informal) {
      issues.push(`${fileName}:${lineNumber}: используйте обращение на «вы» вместо «${informal[0]}»`);
    }

    if (!isAstro && sourceLine.startsWith('#')) {
      const latinWords = prose.match(/[A-Za-z]{3,}/gu) ?? [];
      const disallowed = latinWords.filter((word) => !allowedHeadingWords.has(word));
      if (disallowed.length > 0) {
        issues.push(
          `${fileName}:${lineNumber}: проверьте английское слово в заголовке: ${disallowed.join(', ')}`,
        );
      }
    }
  });
}

if (issues.length > 0) {
  console.error(`Проверка русской документации нашла ${issues.length} проблем:\n`);
  console.error(issues.join('\n'));
  process.exit(1);
}

console.log(`Русская документация проверена: ${files.length} файлов, замечаний нет.`);
