import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = '/bridge-design-methodology';

for (const locale of ['ru', 'en', 'zh']) {
  test(`${locale} home has no overflow and no serious accessibility violations`, async ({ page }) => {
    await page.goto(`${base}/${locale}/`);
    await expect(page.locator('h1#_top')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.bridge-handoff-map')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([]);
  });
}

for (const locale of ['ru', 'en', 'zh']) {
  test(`${locale} custom routes keep the locale document language`, async ({ page }) => {
    for (const route of ['check/', 'rules/', 'tags/']) {
      await page.goto(`${base}/${locale}/${route}`);
      await expect(page.locator('html')).toHaveAttribute('lang', locale === 'zh' ? 'zh-CN' : locale);
      await expect(page.locator('main')).toBeVisible();
    }
  });
}

test('primary quick-start action is keyboard operable', async ({ page }) => {
  await page.goto(`${base}/ru/`);
  const quickStart = page.locator('.bridge-actions .bridge-button-primary');
  await quickStart.focus();
  await expect(quickStart).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`${base}/ru/start/designer-quick-start/?$`));
});

test('check hub exposes three clear review paths', async ({ page }) => {
  await page.goto(`${base}/ru/check/`);
  await expect(page.locator('h1')).toHaveCount(1);
  const paths = page.locator('.check-hub-hero nav a');
  await expect(paths).toHaveCount(3);
  await expect(paths.nth(1)).toHaveAttribute('href', `${base}/ru/check/designer-checklist/`);
  await expect(paths.nth(2)).toHaveAttribute('href', `${base}/ru/check/full-review/`);
  await paths.first().click();
  await expect(page.locator('#figma-page-check')).toBeVisible();
  await expect(page.locator('.plugin-brief-cta')).toHaveAttribute('href', /figma\.com\/community\/plugin\//);
});

test('tag registry filters and rule deep links resolve', async ({ page }) => {
  await page.goto(`${base}/ru/tags/`);
  await expect(page.locator('h1')).toHaveCount(1);
  await page.locator('[data-tag-search]').fill('модальное окно');
  await expect(page.locator('[data-tag]:visible')).toHaveCount(1);
  await page.goto(`${base}/ru/rules/#motion.driver-missing`);
  const target = page.locator('#motion\\.driver-missing');
  await expect(target).toBeVisible();
  await expect(page.locator('[data-rule-search]')).toHaveValue('motion.driver-missing');
});

test('reduced motion disables nonessential animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${base}/ru/`);
  const duration = await page.locator('.bridge-handoff-map').evaluate((element) => getComputedStyle(element).animationDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
});
