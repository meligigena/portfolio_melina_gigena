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
  const downloadLink = page.getByRole('link', { name: 'Descargar Curso Completo de Codex', exact: true });
  await expect(downloadLink).toHaveAttribute('download', 'Melina-Gigena-Codex.pdf');
  const downloadResponse = await request.get(await downloadLink.getAttribute('href'));
  // A filename supplied by the HTTP response takes precedence over the HTML hint.
  const responseFilename = downloadResponse.headers()['content-disposition']?.match(/filename="([^"]+)"/)?.[1];
  const expectedFilename = responseFilename || await downloadLink.getAttribute('download');
  const downloadEvent = page.waitForEvent('download');
  await downloadLink.click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe(expectedFilename);
  expect(await download.failure()).toBeNull();
});
