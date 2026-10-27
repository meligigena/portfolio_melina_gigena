import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const detailPath = '/proyectos/invitacion-xv';
const demoURL = 'https://invitacion-15s-mia-jazmin.vercel.app/demo';

test('flow arrowheads stay joined to centered connectors at every breakpoint', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(detailPath);
  await expect(page.locator('.cs-flow-connector')).toHaveCount(4);
  for (const width of [1440, 1000, 999, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(async () => page.locator('.cs-flow-connector').evaluateAll((connectors) => Math.max(...connectors.map((connector) => {
      const line = connector.querySelector('.cs-flow-line').getBoundingClientRect();
      const arrow = connector.querySelector('.cs-flow-arrow').getBoundingClientRect();
      const card = connector.parentElement.querySelector('button').getBoundingClientRect();
      const vertical = innerWidth < 1000;
      const center = (box) => vertical ? box.left + box.width / 2 : box.top + box.height / 2;
      return Math.max(Math.abs(center(line) - center(arrow)), Math.abs(center(line) - center(card)));
    }))), { message: `Joined and centered connectors at ${width}px` }).toBeLessThanOrEqual(1);
  }
});

const workspaceScreenshots = [
  { title: 'Registro de confirmaciones', filename: '01_confirmaciones.png', section: '#gestion', width: 1484, height: 555 },
  { title: 'Panel de estadísticas', filename: '02_estadisticas.png', section: '#gestion', width: 1461, height: 438 },
  { title: 'Selección de mensajes', filename: '03_seleccion_mensajes.png', section: '#mensajes', tab: 'Seleccionar', width: 1176, height: 397 },
  { title: 'Generación de presentaciones', filename: 'menu1.png', section: '#mensajes', tab: 'Generar', width: 1163, height: 102 },
  { title: 'Resultado en Google Slides', filename: '05_presentacion_slides.png', section: '#mensajes', tab: 'Presentar', width: 1077, height: 534 },
  { title: 'Administración de invitados', filename: 'menu2.png', section: '#gestion', width: 982, height: 167 },
];

test('approved Workspace screenshots retain original bytes and expand accessibly', async ({ page, request }, testInfo) => {
  await page.goto(detailPath);
  await expect(page.getByText('Capturas de una demostración con datos ficticios.', { exact: true })).toBeVisible();
  for (const capture of workspaceScreenshots) {
    if (capture.tab) await page.locator(capture.section).getByRole('tab', { name: capture.tab, exact: true }).click();
    const trigger = page.locator(capture.section).getByRole('button', { name: `Ampliar ${capture.title}`, exact: true });
    await trigger.scrollIntoViewIfNeeded();
    const image = trigger.getByRole('img');
    await expect(image).toHaveJSProperty('naturalWidth', capture.width);
    await expect(image).toHaveJSProperty('naturalHeight', capture.height);
    const response = await request.get(await image.getAttribute('src'));
    expect(response.ok()).toBe(true);
    const original = await readFile(new URL('../../assets/projects/invitation/' + capture.filename, import.meta.url));
    expect((await response.body()).equals(original), capture.filename + ' must remain byte-for-byte identical').toBe(true);
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: capture.title, exact: true });
    await expect(dialog).toBeVisible();
    const expanded = dialog.getByRole('img');
    await expect(expanded).toHaveJSProperty('naturalWidth', capture.width);
    await dialog.getByRole('button', { name: 'Ver detalles', exact: true }).click();
    expect(await expanded.evaluate((image) => image.getBoundingClientRect().width)).toBe(capture.width);
    if (capture.filename.startsWith('menu')) {
      expect(await dialog.locator('.cs-dialog-image').evaluate((element) => Math.abs(element.scrollWidth - element.clientWidth - element.scrollLeft))).toBeLessThanOrEqual(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
  for (const section of ['#gestion', '#mensajes']) {
    for (const block of await page.locator(section + ' [data-case-reveal]').all()) {
      await block.scrollIntoViewIfNeeded();
      await expect(block).toHaveCSS('opacity', '1');
    }
    await page.locator(section).screenshot({ path: 'output/playwright/workspace-' + testInfo.project.name + '-' + section.slice(1) + '.png' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});

test('automation and guest actions work with keyboard, pointer and touch without external writes', async ({ page }, testInfo) => {
  const writes = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET' || /script\.google|docs\.google/.test(request.url())) writes.push(request.url());
  });
  await page.goto(detailPath);
  const tabs = page.getByRole('tablist', { name: 'Explorar la generación de la presentación' });
  await tabs.getByRole('tab', { name: 'Seleccionar', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  const generation = page.getByRole('tabpanel', { name: 'Generar', exact: true });
  await expect(generation).toBeVisible();
  await expect(tabs.getByRole('tab', { name: 'Generar', exact: true })).toBeFocused();
  await expect(generation.getByRole('img')).toHaveJSProperty('naturalHeight', 102);
  await expect(generation).toContainText('Mensajes para Mía');
  await page.keyboard.press('End');
  await expect(page.getByRole('tabpanel', { name: 'Presentar', exact: true })).toBeVisible();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tabpanel', { name: 'Seleccionar', exact: true })).toBeVisible();
  for (const label of ['Generar', 'Presentar']) {
    const tab = tabs.getByRole('tab', { name: label, exact: true });
    if (testInfo.project.name === 'mobile') await tab.tap(); else await tab.click();
    const panel = page.getByRole('tabpanel', { name: label, exact: true });
    await expect(panel).toBeVisible();
    await expect(panel.locator('.cs-sequence-copy')).toHaveCSS('opacity', '1');
    await panel.screenshot({ path: `output/playwright/sequence-${testInfo.project.name}-${label === 'Generar' ? 'menu' : 'slides'}.png` });
  }
  const guests = page.getByRole('tablist', { name: 'Explorar la gestión de invitados' });
  await guests.getByRole('tab', { name: 'Dar de baja', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tabpanel', { name: 'Recuperar invitado', exact: true })).toContainText('previamente dado de baja');
  await expect(guests.getByRole('tab', { name: 'Recuperar invitado', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tabpanel', { name: 'Dar de baja', exact: true })).toContainText('gestionar su baja');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await guests.getByRole('tab', { name: 'Recuperar invitado', exact: true }).click();
  await expect(page.getByRole('tabpanel', { name: 'Recuperar invitado', exact: true }).locator('.cs-sequence-copy')).toHaveCSS('transform', 'none');
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('demo captures provide real 2x pixels and keep their aspect ratio without upscaling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(detailPath);
  for (const [title, width] of [['Apertura de la invitación', 2880], ['Invitación en mobile', 780], ['Calendario de la demo', 752], ['Reproductor de música', 2850], ['Formulario de asistencia', 1240]]) {
    const trigger = page.getByRole('button', { name: `Ampliar ${title}`, exact: true });
    await trigger.scrollIntoViewIfNeeded();
    const image = trigger.getByRole('img');
    await expect(image).toHaveJSProperty('naturalWidth', width);
    const dimensions = await image.evaluate((element) => ({ width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height, ratio: element.naturalWidth / element.naturalHeight }));
    expect(dimensions.width).toBeLessThanOrEqual(width / 2);
    expect(Math.abs(dimensions.width / dimensions.height - dimensions.ratio)).toBeLessThan(0.01);
  }
});

test('case study supports direct access, refresh and navigation', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(detailPath);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Invitación digital interactiva — XV Mía Jazmín');
  await expect(page).toHaveTitle(/XV Mía Jazmín.*Melina Gigena/);
  await page.reload();
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('.site-header a[href="/#proyectos"]')).toHaveText('Proyectos');
  for (const link of await page.getByRole('link', { name: 'Ver demo', exact: true }).all()) {
    await expect(link).toHaveAttribute('href', demoURL);
    await expect(link).toHaveAttribute('target', '_blank');
  }
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('.project-technologies li')).toHaveText(['HTML', 'CSS', 'JavaScript', 'Vercel', 'Google Apps Script', 'Google Sheets', 'Google Slides']);
  await expect.poll(() => page.locator('img').evaluateAll((images) => images.every((image) => !image.complete || image.naturalWidth > 0))).toBe(true);
  await page.getByRole('link', { name: 'Volver a mis proyectos', exact: true }).click();
  await expect(page).toHaveURL(/\/#proyectos$/);
  expect(errors).toEqual([]);
});

test('integration flow explains each stage and remains readable with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(detailPath + '/');
  const flow = page.getByRole('group', { name: 'Explorar el flujo de integración' });
  await expect(flow.getByRole('button')).toHaveCount(5);
  await flow.getByRole('button', { name: /Google Sheets/ }).click();
  await expect(flow.getByRole('button', { name: /Google Sheets/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#flow-description')).toContainText('grupos');
  await flow.getByRole('button', { name: /Google Slides/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#flow-description')).toContainText('proyectar');
  await expect(page.getByRole('button', { name: 'Repetir recorrido' })).toBeHidden();
  await expect(page.locator('.cs-flow-step')).toHaveCount(5);
  expect(await page.locator('.cs-flow-step').evaluateAll((steps) => steps.every((step) => getComputedStyle(step).opacity === '1'))).toBe(true);
});

test('screenshots expand with keyboard and restore focus after Escape', async ({ page }) => {
  await page.goto(detailPath);
  const trigger = page.getByRole('button', { name: 'Ampliar Apertura de la invitación', exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Apertura de la invitación' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('img')).toHaveJSProperty('naturalWidth', 2880);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('flow animation completes, replays and clears when reduced motion changes', async ({ page }) => {
  await page.goto(detailPath);
  await page.locator('#integracion').scrollIntoViewIfNeeded();
  const lastIcon = page.locator('.cs-flow-icon').last();
  await expect(lastIcon).toHaveCSS('opacity', '1');
  await page.getByRole('button', { name: 'Repetir recorrido' }).click();
  await expect.poll(() => lastIcon.evaluate((element) => Number(getComputedStyle(element).opacity))).toBeLessThan(1);
  await expect(lastIcon).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('button', { name: 'Repetir recorrido' })).toBeHidden();
  expect(await page.locator('.cs-flow-icon').evaluateAll((icons) => icons.every((icon) => getComputedStyle(icon).opacity === '1'))).toBe(true);
  for (const line of await page.locator('.cs-flow-line').all()) {
    expect(await line.evaluate((element) => {
      const transform = new DOMMatrix(getComputedStyle(element).transform);
      return transform.m11 === 1 && transform.m22 === 1;
    })).toBe(true);
  }
});

test('demo and detail open new tabs without changing the gallery position', async ({ page, context }) => {
  await context.route(demoURL, (route) => route.fulfill({ contentType: 'text/html', body: '<title>Demo navigation test</title>' }));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('button', { name: 'Proyecto siguiente' }).click();
  await expect(page.locator('.project-counter')).toHaveText('2 de 2');
  const card = page.locator('[data-project="invitacion"]');
  await expect.poll(() => card.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return Math.abs(box.left + box.width / 2 - innerWidth / 2);
  })).toBeLessThanOrEqual(2);
  for (const [label, expectedURL] of [['Ver detalles', /\/proyectos\/invitacion-xv$/], ['Ver demo', demoURL]]) {
    const link = card.getByRole('link', { name: label, exact: true });
    await link.scrollIntoViewIfNeeded();
    let previousScroll;
    let stableSamples = 0;
    await expect.poll(async () => {
      const current = await page.evaluate(() => scrollY);
      stableSamples = current === previousScroll ? stableSamples + 1 : 0;
      previousScroll = current;
      return stableSamples;
    }).toBeGreaterThanOrEqual(3);
    const scroll = await page.evaluate(() => scrollY);
    const popupPromise = page.waitForEvent('popup');
    await link.click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL(expectedURL);
    expect(await page.evaluate(() => scrollY)).toBe(scroll);
    await expect(page.locator('.project-counter')).toHaveText('2 de 2');
    await popup.close();
  }
});

test('detail stays within the viewport and produces review screenshots', async ({ page }, testInfo) => {
  await page.goto(detailPath);
  await page.evaluate(() => document.fonts.ready);
  for (const section of ['.cs-hero', '#integracion', '#experiencia', '#confirmacion', '#gestion', '#mensajes', '#cierre']) {
    await page.locator(section).scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator(section).evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  for (const element of await page.locator('[data-case-reveal]').all()) {
    await element.scrollIntoViewIfNeeded();
    await expect(element).toHaveCSS('opacity', '1');
  }
  await page.locator('#integracion').scrollIntoViewIfNeeded();
  await expect(page.locator('.cs-flow-icon').last()).toHaveCSS('opacity', '1');
  await page.locator('#mensajes').scrollIntoViewIfNeeded();
  await expect(page.getByRole('tabpanel', { name: 'Seleccionar', exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'output/playwright/case-study-' + testInfo.project.name + '.png', fullPage: true });
  if (testInfo.project.name === 'desktop') {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await page.getByRole('button', { name: 'Ampliar Formulario de asistencia', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Formulario de asistencia' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});
