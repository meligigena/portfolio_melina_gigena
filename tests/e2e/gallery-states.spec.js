import { test, expect } from '@playwright/test';

async function fixture(page, count) {
  await page.goto('http://127.0.0.1:4174/tests/fixtures/gallery.html?count=' + count);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('#proyectos')).toHaveAttribute('data-mode', /empty|pinned|native/);
}

test('every project centers without overlap while all cards move to the left', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Vertical scrolling pins the desktop gallery.');
  await fixture(page, 4);
  await page.locator('#proyectos').evaluate((section) => window.scrollTo(0, section.parentElement.getBoundingClientRect().top + scrollY));
  const cards = page.locator('.project-card');
  let previous;
  for (let index = 0; index < 4; index++) {
    if (index) await page.getByRole('button', { name: 'Proyecto siguiente' }).click();
    await expect.poll(() => cards.nth(index).evaluate((element) => {
      const box = element.getBoundingClientRect();
      return Math.abs(box.left + box.width / 2 - document.documentElement.clientWidth / 2);
    })).toBeLessThanOrEqual(2);
    const boxes = await cards.evaluateAll((elements) => elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, scale: new DOMMatrix(getComputedStyle(element).transform).m22, opacity: Number(getComputedStyle(element).opacity) };
    }));
    const viewport = await page.locator('.projects-viewport').boundingBox();
    expect(boxes[index].scale).toBeGreaterThanOrEqual(1.08);
    expect(boxes[index].top).toBeGreaterThanOrEqual(viewport.y);
    expect(boxes[index].bottom).toBeLessThanOrEqual(viewport.y + viewport.height);
    expect(boxes[index].left).toBeGreaterThanOrEqual(0);
    expect(boxes[index].right).toBeLessThanOrEqual(viewport.width);
    const spatialOrder = [...boxes].sort((a, b) => a.left - b.left);
    for (let neighbor = 1; neighbor < spatialOrder.length; neighbor++) {
      expect(spatialOrder[neighbor - 1].right).toBeLessThan(spatialOrder[neighbor].left);
    }
    boxes.forEach((box) => expect(box.opacity).toBe(1));
    if (previous) boxes.forEach((box, card) => expect(box.left).toBeLessThan(previous[card].left - 100));
    previous = boxes;
  }
  await page.getByRole('button', { name: 'Proyecto anterior' }).click();
  await expect.poll(() => cards.nth(2).evaluate((element) => {
    const box = element.getBoundingClientRect();
    return Math.abs(box.left + box.width / 2 - document.documentElement.clientWidth / 2);
  })).toBeLessThanOrEqual(2);
  await page.locator('.projects-viewport').focus();
  await page.keyboard.press('Home');
  await expect.poll(() => cards.first().evaluate((element) => {
    const box = element.getBoundingClientRect();
    return Math.abs(box.left + box.width / 2 - document.documentElement.clientWidth / 2);
  })).toBeLessThanOrEqual(2);
});

test('empty and single-project galleries do not pin or expose redundant controls', async ({ page }) => {
  for (const count of [0, 1]) {
    await fixture(page, count);
    await expect(page.locator('.project-card')).toHaveCount(count);
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    await expect(page.getByRole('group', { name: 'Elegir proyecto' })).toHaveCount(0);
    if (count === 1) {
      const center = await page.locator('.project-card').evaluate((element) => {
        const box = element.getBoundingClientRect();
        return Math.abs(box.left + box.width / 2 - window.innerWidth / 2);
      });
      expect(center).toBeLessThanOrEqual(2);
    } else {
      await expect(page.locator('.project-empty')).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});

test('multiple projects keep semantic order, support keyboard selection and rebuild after filtering', async ({ page }, testInfo) => {
  await fixture(page, 4);
  const section = page.locator('#proyectos');
  await expect(page.locator('.project-slot')).toHaveCount(4);
  expect(await page.locator('.project-card').evaluateAll((cards) => cards.map((card) => card.dataset.project))).toEqual(['fixture-0', 'fixture-1', 'fixture-2', 'fixture-3']);
  const viewport = page.locator('.projects-viewport');
  await viewport.focus();
  await page.keyboard.press('End');
  await expect(page.locator('.project-counter')).toHaveText('4 de 4');
  const last = page.locator('[data-project="fixture-3"]');
  await expect.poll(() => last.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return Math.abs(box.left + box.width / 2 - document.documentElement.clientWidth / 2);
  })).toBeLessThanOrEqual(2);
  if (testInfo.project.name === 'desktop') {
    await expect(section).toHaveAttribute('data-mode', 'pinned');
    await expect(page.locator('.pin-spacer')).toHaveCount(1);
    await expect(last).toHaveCSS('opacity', '1');
    await expect.poll(() => last.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m22)).toBeGreaterThanOrEqual(1.099);
  }
  const data = page.getByRole('button', { name: 'Análisis de datos', exact: true });
  await data.click();
  await expect(section).toHaveAttribute('data-mode', 'empty');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await expect(page.locator('.project-counter')).toHaveText('1 de 4');
  await viewport.focus();
  await page.keyboard.press('Home');
  await expect.poll(() => page.locator('[data-project="fixture-0"]').evaluate((element) => {
    const box = element.getBoundingClientRect();
    return Math.abs(box.left + box.width / 2 - innerWidth / 2);
  })).toBeLessThanOrEqual(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
