import { test, expect } from '@playwright/test';

test('all four original PDFs can be opened and downloaded', async ({ page, request }) => {
  await page.goto('/#certificados');
  await expect(page.locator('.certificate-card')).toHaveCount(4);
  const previewHeights = await page.locator('.certificate-preview').evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
  expect(Math.max(...previewHeights) - Math.min(...previewHeights)).toBeLessThanOrEqual(2);
  await expect(page.locator('.certificate-card').last()).toContainText('Constancia de resultados');
  for (const certificate of await page.locator('.certificate-card').all()) {
    const preview = certificate.locator('.certificate-preview');
    await expect(preview).toHaveAttribute('target', '_blank');
    const href = await preview.getAttribute('href');
    const response = await request.get(href);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/pdf');
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
    await expect(certificate.getByRole('link', { name: /Descargar/ })).toHaveAttribute('href', href);
  }
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Descargar Curso Completo de Codex', exact: true }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('Melina-Gigena-Codex.pdf');
  expect(await download.failure()).toBeNull();
});
