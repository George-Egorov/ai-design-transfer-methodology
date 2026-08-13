import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const catalog = JSON.parse(readFileSync(`${root}/validator/rules.json`, 'utf8'));
const localization = JSON.parse(readFileSync(`${root}/src/data/rules.ru.json`, 'utf8'));

const issues = [];
const catalogIds = catalog.rules.map((rule) => rule.id);
const catalogIdSet = new Set(catalogIds);
const localizedIds = Object.keys(localization);

if (catalogIdSet.size !== catalogIds.length) {
  issues.push('validator/rules.json содержит повторяющиеся идентификаторы правил');
}

for (const id of catalogIds) {
  if (!Object.hasOwn(localization, id)) {
    issues.push(`${id}: отсутствует русская локализация`);
  }
}

for (const id of localizedIds) {
  if (!catalogIdSet.has(id)) {
    issues.push(`${id}: лишняя локализация без соответствующего правила в каталоге`);
  }
}

const stripCodeAndKnownNames = (value) =>
  value
    .replace(/`[^`]*`/gu, ' ')
    .replace(/<[^>]*>/gu, ' ')
    .replace(/\b(?:BRIDGE|Figma|Escape|Lottie|kebab-case)\b/giu, ' ');

const untranslatedPhrasePattern =
  /(?:\b[A-Za-z][A-Za-z-]{2,}\b(?:[\s,;:()—–-]+|$)){4,}/gu;

for (const rule of catalog.rules) {
  const entry = localization[rule.id];
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;

  const keys = Object.keys(entry).sort();
  if (keys.join(',') !== 'description,fix,title') {
    issues.push(`${rule.id}: ожидаются только поля title, description и fix`);
  }

  for (const field of ['title', 'description', 'fix']) {
    const value = entry[field];
    const minimumLength = field === 'title' ? 5 : 20;
    if (typeof value !== 'string' || value.trim().length < minimumLength) {
      issues.push(`${rule.id}.${field}: перевод отсутствует или слишком короткий`);
      continue;
    }

    const minimumRussianLetters = field === 'title' ? 3 : 8;
    if ((value.match(/[А-ЯЁа-яё]/gu) ?? []).length < minimumRussianLetters) {
      issues.push(`${rule.id}.${field}: в переводе недостаточно русского текста`);
    }

    if (field !== 'title' && value.trim() === rule[field].trim()) {
      issues.push(`${rule.id}.${field}: вместо перевода скопирован английский оригинал`);
    }

    const prose = stripCodeAndKnownNames(value);
    const untranslated = prose.match(untranslatedPhrasePattern);
    if (untranslated) {
      issues.push(
        `${rule.id}.${field}: проверьте непереведённый английский фрагмент «${untranslated[0].trim()}»`,
      );
    }
  }
}

if (issues.length > 0) {
  console.error(`Проверка локализации правил нашла ${issues.length} проблем:\n`);
  console.error(issues.join('\n'));
  process.exit(1);
}

console.log(`Русская локализация правил проверена: ${catalogIds.length} из ${catalogIds.length}.`);
