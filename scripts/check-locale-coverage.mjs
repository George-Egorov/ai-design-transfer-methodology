import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'validator/site-content.json'), 'utf8'));
const rules = JSON.parse(readFileSync(join(root, 'src/data/rules.zh.json'), 'utf8'));
const tags = JSON.parse(readFileSync(join(root, 'validator/tags.json'), 'utf8'));
const generatedPath = join(root, 'src/content/docs/.bridge-generated.json');
const problems = [];
const cjk = /[\u3400-\u9fff]/u;
const englishProse = /^[ \t]*(?:[A-Z][A-Za-z]+\s+){4,}[A-Za-z][^`]*[.!?:]?[ \t]*$/u;

if (JSON.stringify(manifest.locales) !== JSON.stringify(['en', 'ru', 'zh'])) {
  problems.push('site-content.json: ожидается канонический порядок локалей en, ru, zh');
}

const generated = existsSync(generatedPath)
  ? JSON.parse(readFileSync(generatedPath, 'utf8'))
  : { files: [] };
const generatedFiles = new Set(generated.files || []);

for (const page of manifest.pages) {
  for (const locale of manifest.locales) {
    const source = page.source[locale];
    if (!source || !existsSync(join(root, source))) {
      problems.push(`${page.route}: отсутствует источник ${locale}`);
    }
    const generatedFile = `${locale}/${page.route}.md`;
    if (!generatedFiles.has(generatedFile)) problems.push(`${page.route}: отсутствует generated ${generatedFile}`);
  }

  const zhSource = page.source.zh && join(root, page.source.zh);
  if (!zhSource || !existsSync(zhSource)) continue;
  const markdown = readFileSync(zhSource, 'utf8');
  const prose = markdown.replace(/```[\s\S]*?```/gu, '').replace(/`[^`]*`/gu, '');
  const h1 = prose.match(/^#\s+(.+)$/gmu) || [];
  if (h1.length !== 1) problems.push(`${page.source.zh}: должен быть ровно один H1`);
  if (!cjk.test(h1[0] || '')) problems.push(`${page.source.zh}: H1 не переведён на китайский`);
  for (const [index, line] of prose.split('\n').entries()) {
    if (englishProse.test(line) && !cjk.test(line)) {
      problems.push(`${page.source.zh}:${index + 1}: английская проза в zh-локали`);
    }
  }
}

for (const [id, entry] of Object.entries(rules)) {
  for (const field of ['title', 'description', 'fix']) {
    if (!cjk.test(entry?.[field] || '')) problems.push(`rules.zh ${id}.${field}: отсутствует китайский текст`);
  }
}

for (const tag of tags.tags) {
  if (!cjk.test(tag.title?.zh || '')) problems.push(`tags.zh ${tag.key}.title: отсутствует китайский текст`);
  if (tag.notes && !cjk.test(tag.notes.zh || '')) problems.push(`tags.zh ${tag.key}.notes: отсутствует китайский текст`);
}

if (problems.length) {
  console.error(`Проверка покрытия локалей нашла ${problems.length} проблем:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}

console.log(`Покрытие локалей проверено: ${manifest.pages.length} страниц, ${tags.tags.length} тегов, ${Object.keys(rules).length} правил.`);
