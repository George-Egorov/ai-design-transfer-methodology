import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = '/bridge-design-methodology';

for (const locale of ['ru', 'en']) {
  test(`${locale} home has no overflow and no serious accessibility violations`, async ({ page }) => {
    await page.goto(`${base}/${locale}/`);
    await expect(page.locator('h1#_top')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('[data-coverage-map]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([]);
  });
}

test('coverage tabs are keyboard operable', async ({ page }) => {
  await page.goto(`${base}/ru/`);
  const first = page.locator('[data-coverage-tab]').first();
  await first.focus();
  await page.keyboard.press('ArrowDown');
  const second = page.locator('[data-coverage-tab]').nth(1);
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-coverage-panel]').nth(1)).toBeVisible();
});

test('preflight persists progress and copies a reproducible report', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(`${base}/ru/check/`);
  await expect(page.locator('h1')).toHaveCount(1);
  const first = page.locator('[data-preflight] input[type="checkbox"]').first();
  await first.check();
  await expect(page.locator('[data-progress-value]')).toHaveText('8%');
  await page.reload();
  await expect(page.locator('[data-preflight] input[type="checkbox"]').first()).toBeChecked();
  await page.locator('[data-copy]').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Быстрая проверка BRIDGE');
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
  const duration = await page.locator('.bridge-layers-panel:visible').evaluate((element) => getComputedStyle(element).animationDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
});
