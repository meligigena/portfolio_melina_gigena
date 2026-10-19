import { test, expect } from '@playwright/test';

async function ready(page) {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('#proyectos')).toHaveAttribute('data-mode', /pinned|native|reduced/);
}

async function overflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

async function galleryRange(page) {
  return page.locator('#proyectos').evaluate((section) => {
    const spacer = section.parentElement;
    return {
      start: spacer.getBoundingClientRect().top + window.scrollY,
      distance: spacer.offsetHeight - section.offsetHeight,
    };
  });
}

async function cardState(card) {
  return card.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return { left: box.left, right: box.right, center: box.left + box.width / 2, viewport: document.documentElement.clientWidth, top: box.top, bottom: box.bottom, height: window.innerHeight, scale: new DOMMatrix(getComputedStyle(element).transform).m22, opacity: Number(getComputedStyle(element).opacity) };
  });
}

test('public content, links and local resources', async ({ page }) => {
  const errors = [];
  const missing = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', (response) => { if (response.url().startsWith('http://127.0.0.1') && response.status() >= 400) missing.push(response.url()); });
  await ready(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('MelinaGigena.');
  await expect(page.locator('.project-card')).toHaveCount(2);
  await expect(page.locator('.project-link')).toHaveAttribute('href', 'https://solfanara.com');
  await expect(page.locator('.project-link')).toHaveAttribute('target', '_blank');
  await expect(page.locator('[data-project="invitacion"]')).toContainText('Próximamente');
  await expect(page.locator('[data-project="invitacion"] a')).toHaveCount(0);
  await expect(page.locator('.gallery-heading > p')).toHaveCount(0);
  await expect(page.locator('.section-heading > p')).toHaveCount(0);
  await expect(page.locator('.portrait-note')).toHaveText('Curiosidad para aprender, tecnología para crear.');
  await expect(page.getByRole('heading', { name: 'Un poco sobre mí', exact: true })).toHaveCount(1);
  await expect(page.getByRole('link', { name: /Contactame/ })).toHaveAttribute('href', '#contacto');
  expect(await page.locator('.site-header').evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgb(233, 164, 191)');
  expect(await page.locator('.wordmark').evaluate((element) => getComputedStyle(element).fontFamily)).toContain('Manrope');
  expect(await page.evaluate(() => document.fonts.check('600 32px Manrope'))).toBe(true);
  await expect(page.locator('a[href="https://github.com/meligigena"]').first()).toBeVisible();
  await expect(page.locator('a[href="https://www.linkedin.com/in/melina-gigena-560828338/"]').first()).toBeVisible();
  await expect(page.locator('.contact-email')).toHaveAttribute('href', 'https://mail.google.com/mail/u/0/?fs=1&to=melinag1510@gmail.com&tf=cm');
  await expect(page.locator('.contact-email')).toHaveAttribute('target', '_blank');
  await expect(page.locator('.contact-email')).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page.locator('a[href*="/cvs/"]')).toHaveCount(0);
  const portraitCollision = await page.locator('.portrait-composition').evaluate((element) => {
    const note = element.querySelector('.portrait-note').getBoundingClientRect();
    const captionElement = element.querySelector('figcaption');
    const text = [...captionElement.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    const range = document.createRange();
    range.selectNodeContents(text);
    const caption = range.getBoundingClientRect();
    return note.left < caption.right && note.right > caption.left && note.top < caption.bottom && note.bottom > caption.top;
  });
  expect(portraitCollision).toBe(false);
  await page.locator('#contacto').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: '¿Creamos algo juntos?' })).toBeVisible();
  await expect.poll(() => overflow(page)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
  expect(missing).toEqual([]);
  expect(await page.evaluate(() => [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src))).toEqual([]);
});

test('contact opens a new Gmail tab with the exact composition parameters', async ({ page, context }) => {
  await context.route('https://mail.google.com/**', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Gmail navigation test</title>' }));
  await ready(page);
  const newTab = page.waitForEvent('popup');
  await page.locator('.contact-email').click();
  const popup = await newTab;
  await expect(popup).toHaveURL('https://mail.google.com/mail/u/0/?fs=1&to=melinag1510@gmail.com&tf=cm');
  expect(Object.fromEntries(new URL(popup.url()).searchParams)).toEqual({ fs: '1', to: 'melinag1510@gmail.com', tf: 'cm' });
  await popup.close();
});

test('keyboard-accessible skills and visible focus', async ({ page }) => {
  await ready(page);
  const area = page.locator('.skill-area').filter({ hasText: 'Interfaces web' });
  const summary = area.locator('summary');
  await summary.focus();
  await expect(summary).toBeFocused();
  expect(await summary.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(area).toHaveAttribute('open', '');
  await expect(area.getByText('Diseño responsive', { exact: true })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(area).not.toHaveAttribute('open', '');
  await expect.poll(() => overflow(page)).toBeLessThanOrEqual(1);
});

test('desktop carousel moves left, centers both endpoints and reverses on scroll up', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop pinning is tested at 1440 × 900.');
  await ready(page);
  const section = page.locator('#proyectos');
  await expect(section).toHaveAttribute('data-mode', 'pinned');
  const range = await galleryRange(page);
  expect(range.distance).toBeGreaterThan(0);
  expect(range.distance).toBeLessThan(1400);
  const first = page.locator('[data-project="sol-fanara"]');
  const last = page.locator('[data-project="invitacion"]');
  const trackX = () => page.locator('.projects-track').evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m41);

  await page.evaluate((y) => window.scrollTo(0, y), range.start);
  await expect.poll(async () => Math.abs((await cardState(first)).center - (await cardState(first)).viewport / 2)).toBeLessThanOrEqual(2);
  const initial = await cardState(first);
  expect(initial.left).toBeGreaterThanOrEqual(0);
  expect(initial.scale).toBeGreaterThanOrEqual(1.08);
  const initialLast = await cardState(last);
  expect(initialLast.left).toBeGreaterThan(initial.right);
  expect(initialLast.scale).toBeLessThan(0.95);
  await expect(first.getByRole('link', { name: 'Ver proyecto' })).toBeVisible();
  await page.screenshot({ path: 'output/playwright/carousel-desktop-start.png' });
  const samples = [];
  let previousX = await trackX();
  for (const progress of [0.3, 0.6]) {
    await page.evaluate(async (y) => {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }, range.start + range.distance * progress);
    const entering = await cardState(last);
    expect(entering.left).toBeGreaterThan((await cardState(first)).right);
    expect(entering.opacity).toBe(1);
    expect(entering.center).toBeLessThan(initialLast.center - 100);
    expect((await cardState(first)).center).toBeLessThan(initial.center - 100);
    expect(await trackX()).toBeLessThan(previousX - 100);
    previousX = await trackX();
    samples.push(entering);
    expect(await section.evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThanOrEqual(1);
  }
  expect(samples[1].center).toBeLessThan(samples[0].center);
  expect(samples[1].scale).toBeGreaterThan(samples[0].scale);
  await page.evaluate((y) => window.scrollTo(0, y), range.start + range.distance);
  await expect.poll(async () => Math.abs((await cardState(last)).center - (await cardState(last)).viewport / 2)).toBeLessThanOrEqual(2);
  const completed = await cardState(last);
  expect(completed.scale).toBeGreaterThanOrEqual(1.08);
  expect(completed.left).toBeGreaterThanOrEqual(0);
  expect(completed.right).toBeLessThanOrEqual(completed.viewport);
  expect(completed.top).toBeLessThan(samples[0].top - 20);
  expect(completed.top).toBeGreaterThanOrEqual(85);
  expect(completed.bottom).toBeLessThan(completed.height - 40);
  expect((await cardState(first)).scale).toBeLessThan(initial.scale - 0.15);
  await expect(last.getByRole('heading')).toBeVisible();
  await page.screenshot({ path: 'output/playwright/carousel-desktop-complete.png' });
  await page.evaluate((y) => window.scrollTo(0, y), range.start + range.distance * 0.3);
  await expect.poll(async () => Math.abs((await cardState(last)).center - samples[0].center)).toBeLessThanOrEqual(2);
  await page.evaluate((y) => window.scrollTo(0, y), range.start);
  await expect.poll(async () => Math.abs((await cardState(first)).center - initial.center)).toBeLessThanOrEqual(2);
  expect((await cardState(first)).scale).toBeGreaterThanOrEqual(1.08);
  await page.locator('.gallery-skip').click();
  await expect(page.getByRole('heading', { name: 'Aprender para construir.' })).toBeInViewport();
  await page.locator('#contacto').scrollIntoViewIfNeeded();
  await expect(page.locator('.contact-email')).toBeInViewport();
  await expect.poll(() => overflow(page)).toBeLessThanOrEqual(1);
});

test('clicking a visible project link preserves the current scroll sequence', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Pinned navigation is a desktop interaction.');
  await context.route('https://solfanara.com/**', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Project navigation test</title>' }));
  await ready(page);
  const range = await galleryRange(page);
  await page.evaluate((y) => window.scrollTo(0, y), range.start);
  const first = page.locator('[data-project="sol-fanara"]');
  await expect.poll(async () => Math.abs((await cardState(first)).center - (await cardState(first)).viewport / 2)).toBeLessThanOrEqual(2);
  const initialY = await page.evaluate(() => scrollY);
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Ver proyecto', exact: true }).click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL('https://solfanara.com/');
  await expect(page.locator('.project-counter')).toHaveText('1 de 2');
  expect(await page.evaluate(() => scrollY)).toBe(initialY);
  await popup.close();
});

test('keyboard controls and native horizontal gestures', async ({ page }, testInfo) => {
  await ready(page);
  const next = page.getByRole('button', { name: 'Proyecto siguiente' });
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.project-counter')).toHaveText('2 de 2');
  const last = page.locator('[data-project="invitacion"]');
  await expect.poll(async () => Math.abs((await cardState(last)).center - (await cardState(last)).viewport / 2)).toBeLessThanOrEqual(2);
  if (testInfo.project.name === 'desktop') expect((await cardState(last)).scale).toBeGreaterThanOrEqual(1.08);
  const previous = page.getByRole('button', { name: 'Proyecto anterior' });
  await previous.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.project-counter')).toHaveText('1 de 2');
  const software = page.getByRole('button', { name: 'Desarrollo de software', exact: true });
  await software.click();
  await expect(software).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.project-card')).toHaveCount(2);
  if (testInfo.project.name !== 'desktop') {
    const viewport = page.locator('.projects-viewport');
    const initialTop = await page.evaluate(() => window.scrollY);
    if (testInfo.project.name === 'mobile') {
      const bounds = await viewport.boundingBox();
      const y = Math.max(110, Math.min(bounds.y + 90, 760));
      const session = await page.context().newCDPSession(page);
      const startX = bounds.x + bounds.width * 0.85;
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: startX, y }] });
      for (let step = 1; step <= 8; step++) {
        await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: startX - bounds.width * 0.65 * step / 8, y }] });
      }
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await session.detach();
    } else {
      await viewport.evaluate((element) => element.scrollBy({ left: element.clientWidth, behavior: 'instant' }));
    }
    await expect(page.locator('.project-counter')).toHaveText('2 de 2');
    expect(await page.evaluate(() => window.scrollY)).toBe(initialTop);
  }
  await page.locator('.gallery-skip').focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.locator('.certificate-preview').first()).toBeFocused();
  await expect.poll(() => overflow(page)).toBeLessThanOrEqual(1);
});

test('reduced motion preserves all content and actions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page);
  await expect(page.locator('#proyectos')).toHaveAttribute('data-mode', 'reduced');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  for (const card of await page.locator('.project-card').all()) {
    await card.scrollIntoViewIfNeeded();
    expect((await cardState(card)).scale).toBe(1);
    await expect(card.getByRole('heading')).toBeVisible();
  }
  await page.locator('#contacto').scrollIntoViewIfNeeded();
  await expect(page.locator('.contact-email')).toBeVisible();
  await expect.poll(() => overflow(page)).toBeLessThanOrEqual(1);
});

test('viewport changes rebuild and clean up the gallery', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Breakpoint switching is tested once.');
  await ready(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('#proyectos')).toHaveAttribute('data-mode', 'native');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect.poll(() => page.locator('.projects-track').evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m41)).toBe(0);
  await expect.poll(() => overflow(page)).toBeLessThanOrEqual(1);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('#proyectos')).toHaveAttribute('data-mode', 'pinned');
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  const range = await galleryRange(page);
  await page.evaluate((y) => window.scrollTo(0, y), range.start + range.distance);
  const last = page.locator('[data-project="invitacion"]');
  await expect.poll(async () => Math.abs((await cardState(last)).center - (await cardState(last)).viewport / 2)).toBeLessThanOrEqual(2);
  expect((await cardState(last)).scale).toBeGreaterThanOrEqual(1.08);
});

test('the final project stays centered before pinning ends and then releases', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Pinning is a desktop interaction.');
  await ready(page);
  const range = await galleryRange(page);
  await page.evaluate((y) => window.scrollTo(0, y), range.start + range.distance - 140);
  const last = page.locator('[data-project="invitacion"]');
  await expect.poll(async () => Math.abs((await cardState(last)).center - (await cardState(last)).viewport / 2)).toBeLessThanOrEqual(2);
  const state = await cardState(last);
  expect(state.left).toBeGreaterThanOrEqual(0);
  expect(state.scale).toBeGreaterThanOrEqual(1.08);
  expect(await page.locator('#proyectos').evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThanOrEqual(1);
  await page.evaluate((y) => window.scrollTo(0, y), range.start + range.distance + 80);
  await expect.poll(() => page.locator('#proyectos').evaluate((element) => element.getBoundingClientRect().top)).toBeLessThan(-60);
});

test('project filters preserve focus and remove obsolete pinning', async ({ page }) => {
  await ready(page);
  const all = page.getByRole('button', { name: 'Todos', exact: true });
  const data = page.getByRole('button', { name: 'Análisis de datos', exact: true });
  await expect(all).toHaveAttribute('aria-pressed', 'true');
  await data.focus();
  const filterTop = (await data.boundingBox()).y;
  await page.keyboard.press('Enter');
  await expect(data).toBeFocused();
  await expect(data).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.project-card')).toHaveCount(0);
  await expect(page.getByText('Próximamente, proyectos de análisis de datos.', { exact: true })).toBeVisible();
  await expect(page.locator('#proyectos')).toHaveAttribute('data-mode', 'empty');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  expect(Math.abs((await data.boundingBox()).y - filterTop)).toBeLessThanOrEqual(2);
  await all.click();
  await expect(page.locator('.project-card')).toHaveCount(2);
  await expect(page.locator('.project-counter')).toHaveText('1 de 2');
  await expect.poll(() => overflow(page)).toBeLessThanOrEqual(1);
});
