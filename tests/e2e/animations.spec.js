import { test, expect } from '@playwright/test';

async function open(page) {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
}

async function activeSpecialty(page) {
  return page.locator('.specialty-text').evaluateAll((labels) => labels.filter((label) => {
    const style = getComputedStyle(label);
    return style.visibility === 'visible' && Number(style.opacity) > 0.98;
  }).map((label) => label.textContent).join(''));
}

test('specialties rotate in order, stay centered and have no pause control or layout shift', async ({ page }) => {
  await open(page);
  await expect(page.locator('.intro-role button')).toHaveCount(0);
  const badge = page.locator('.intro-role');
  await expect.poll(() => badge.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m42)).toBe(0);
  const initial = await badge.boundingBox();
  const description = page.locator('.intro-description');
  const top = (await description.boundingBox()).y;
  for (const title of ['Desarrollo de software', 'Análisis de datos', 'Sistemas de Información', 'Desarrollo de software']) {
    await expect.poll(() => activeSpecialty(page), { timeout: 6500, intervals: [80] }).toBe(title);
    await expect(badge.getByText(title, { exact: true })).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    const box = await badge.boundingBox();
    const label = await badge.getByText(title, { exact: true }).boundingBox();
    expect(Math.abs(label.x + label.width / 2 - box.x - box.width / 2)).toBeLessThanOrEqual(1);
    expect(Math.abs(label.y + label.height / 2 - box.y - box.height / 2)).toBeLessThanOrEqual(1);
    expect(box).toEqual(initial);
    expect(Math.abs((await description.boundingBox()).y - top)).toBeLessThanOrEqual(1);
  }
});

test('the compact header preserves its logo, contact link and touch targets', async ({ page }, testInfo) => {
  await open(page);
  const mobile = testInfo.project.name === 'mobile';
  const maxHeight = mobile ? 64 : testInfo.project.name === 'tablet' ? 70 : 80;
  const header = await page.locator('.site-header').boundingBox();
  expect(header.height).toBeLessThanOrEqual(maxHeight);
  expect(await page.locator('.wordmark').evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeLessThanOrEqual(mobile ? 24 : 30);
  expect((await page.locator('.wordmark').boundingBox()).height).toBeGreaterThanOrEqual(44);
  await expect(page.getByRole('link', { name: /Contactame/ })).toBeVisible();
});

test('specialty transitions start every 2.95 seconds after a 2.45-second hold', async ({ page }) => {
  await open(page);
  const interval = await page.locator('.specialty-text').evaluateAll((elements) => new Promise((resolve, reject) => {
    const starts = [];
    const beginning = performance.now();
    let moving = false;
    function sample(now) {
      const next = elements.some((element) => {
        const style = getComputedStyle(element);
        const opacity = Number(style.opacity);
        return opacity > 0.01 && opacity < 0.99 && new DOMMatrix(style.transform).m42 < 0;
      });
      if (next && !moving) starts.push(now);
      moving = next;
      if (starts.length === 3) resolve(starts[2] - starts[1]);
      else if (now - beginning > 13000) reject(new Error('Specialties did not rotate while visible.'));
      else requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  }));
  // Discard the first sample, which can start midway through a transition.
  expect(interval).toBeGreaterThan(2800);
  expect(interval).toBeLessThan(3100);
});

test('contact star flashes periodically and rests outside the viewport', async ({ page }) => {
  await open(page);
  await page.locator('#contacto').scrollIntoViewIfNeeded();
  const star = page.locator('.contact-spark');
  await star.scrollIntoViewIfNeeded();
  await expect(star).toBeInViewport({ ratio: 0.5 });
  const scale = () => star.evaluate((element) => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return Math.hypot(matrix.m11, matrix.m12);
  });
  await expect.poll(scale, { timeout: 8500, intervals: [80] }).toBeGreaterThan(1.02);
  await expect.poll(scale, { timeout: 2500, intervals: [80] }).toBeLessThanOrEqual(1.001);
  await expect.poll(scale, { timeout: 8500, intervals: [80] }).toBeGreaterThan(1.02);
  await page.locator('#inicio').scrollIntoViewIfNeeded();
  await expect.poll(scale).toBeLessThanOrEqual(1.001);
  const resting = await star.getAttribute('style');
  await page.waitForTimeout(400);
  expect(await star.getAttribute('style')).toBe(resting);
});

test('contact star keeps a one-second flare with a 5.1-second rest between cycles', async ({ page }) => {
  await open(page);
  await page.locator('#contacto').scrollIntoViewIfNeeded();
  await page.locator('.contact-spark').scrollIntoViewIfNeeded();
  const cycle = await page.locator('.contact-spark').evaluate((element) => new Promise((resolve, reject) => {
    const starts = [];
    const beginning = performance.now();
    let flashing = false;
    function sample(now) {
      const matrix = new DOMMatrix(getComputedStyle(element).transform);
      const next = Math.hypot(matrix.m11, matrix.m12) > 1.02;
      if (next && !flashing) starts.push(now);
      flashing = next;
      if (starts.length === 3) resolve(starts[2] - starts[1]);
      else if (now - beginning > 22000) reject(new Error('The star did not repeat while visible.'));
      else requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  }));
  expect(cycle).toBeGreaterThan(5940);
  expect(cycle).toBeLessThan(6260);
});

test('reduced motion shows all specialties and keeps the contact star static', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await expect(page.locator('.specialty-pause')).toBeHidden();
  for (const label of await page.locator('.specialty-text').all()) {
    await expect(label).toBeVisible();
    await expect(label).toHaveCSS('opacity', '1');
  }
  await page.locator('#contacto').scrollIntoViewIfNeeded();
  const star = page.locator('.contact-spark');
  const initial = await star.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(500);
  expect(await star.evaluate((element) => getComputedStyle(element).transform)).toBe(initial);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
});
