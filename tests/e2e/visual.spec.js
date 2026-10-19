import { test, expect } from '@playwright/test';

async function scrollTo(page, selector) {
  await page.locator(selector).evaluate((element) => {
    window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - document.querySelector('header').offsetHeight - 20, behavior: 'instant' });
  });
}

async function snapshot(page, name, project) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await page.screenshot({ path: 'output/playwright/updated-' + project + '-' + name + '.png' });
  expect(overflow, 'Horizontal overflow in ' + name).toBeLessThanOrEqual(1);
}

test('responsive sections remain legible and produce review screenshots', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.locator('.portrait-frame').evaluate((element) => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return Math.hypot(matrix.m11, matrix.m12);
  })).toBeGreaterThan(0.9999);
  await expect(page.locator('.intro-role button')).toHaveCount(0);
  await snapshot(page, 'inicio', testInfo.project.name);

  await scrollTo(page, '#sobre-mi');
  await expect(page.locator('.profile-description')).toHaveCSS('opacity', '1');
  await snapshot(page, 'perfil', testInfo.project.name);
  if (testInfo.project.name === 'desktop') {
    await page.locator('#proyectos').evaluate((element) => window.scrollTo(0, element.parentElement.getBoundingClientRect().top + scrollY));
  } else await scrollTo(page, '#proyectos');
  await expect(page.locator('.project-filters')).toHaveCSS('opacity', '1');
  await snapshot(page, 'proyectos', testInfo.project.name);
  await page.getByRole('button', { name: 'Análisis de datos', exact: true }).click();
  await expect(page.locator('.project-empty')).toBeVisible();
  await snapshot(page, 'datos', testInfo.project.name);
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await scrollTo(page, '#certificados');
  await expect(page.locator('.certificate-card').last()).toHaveCSS('opacity', '1');
  await snapshot(page, 'certificados', testInfo.project.name);
  await scrollTo(page, '#contacto');
  await expect(page.locator('.contact-email')).toHaveCSS('opacity', '1');
  await snapshot(page, 'contacto', testInfo.project.name);
});

test('short desktop and narrow mobile viewports keep the header and cards within bounds', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Additional viewport sizes are tested once.');
  for (const size of [{ width: 1366, height: 720 }, { width: 1440, height: 810 }, { width: 1024, height: 820 }, { width: 1024, height: 768 }, { width: 1024, height: 700 }, { width: 320, height: 740 }]) {
    await page.setViewportSize(size);
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const contact = page.getByRole('link', { name: /Contactame/ });
    const headerBox = await page.locator('.site-header').boundingBox();
    const contactBox = await contact.boundingBox();
    expect(contactBox.x + contactBox.width).toBeLessThanOrEqual(headerBox.width);
    await page.locator('#proyectos').evaluate((element) => {
      const wrapper = element.dataset.mode === 'pinned' ? element.parentElement : element;
      window.scrollTo(0, wrapper.getBoundingClientRect().top + scrollY);
    });
    await expect(page.locator('.project-card').first()).toBeVisible();
    const bounds = await page.locator('.project-card').first().boundingBox();
    if (size.width >= 1024) {
      await expect(page.locator('#proyectos')).toHaveAttribute('data-mode', 'pinned');
      expect(bounds.y).toBeGreaterThanOrEqual(headerBox.height);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(size.height - 40);
      const viewport = await page.locator('.projects-viewport').boundingBox();
      expect(bounds.y, 'The enlarged card must clear the clipping edge').toBeGreaterThanOrEqual(viewport.y);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.y + viewport.height);
      const range = await page.locator('#proyectos').evaluate((element) => ({
        start: element.parentElement.getBoundingClientRect().top + scrollY,
        distance: element.parentElement.offsetHeight - element.offsetHeight,
      }));
      for (const progress of [0.35, 0.6, 1]) {
        await page.evaluate(async (y) => {
          window.scrollTo(0, y);
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }, range.start + range.distance * progress);
        const cards = await page.locator('.project-card').evaluateAll((elements) => elements.map((element) => {
          const box = element.getBoundingClientRect();
          return { top: box.top, bottom: box.bottom, left: box.left, right: box.right, scale: new DOMMatrix(getComputedStyle(element).transform).m22 };
        }));
        for (const card of cards) {
          expect(card.top).toBeGreaterThanOrEqual(viewport.y);
          expect(card.bottom).toBeLessThanOrEqual(viewport.y + viewport.height);
          if (Math.abs((card.left + card.right) / 2 - size.width / 2) <= 2) {
            expect(card.left).toBeGreaterThanOrEqual(0);
            expect(card.right).toBeLessThanOrEqual(size.width);
            expect(card.scale).toBeGreaterThanOrEqual(1.08);
          }
        }
        expect(cards[0].right).toBeLessThan(cards[1].left);
      }
      const titleOverflow = await page.locator('.invitation-concept > span:first-child').evaluate((element) => element.scrollWidth - element.closest('.project-cover').clientWidth);
      expect(titleOverflow, 'The invitation cover title must fit its column').toBeLessThanOrEqual(0);
    }
    await snapshot(page, size.width + 'x' + size.height, testInfo.project.name);
  }
});
