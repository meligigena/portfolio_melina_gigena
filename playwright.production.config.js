import { defineConfig } from '@playwright/test';
import localConfig from './playwright.config.js';

export default defineConfig({
  ...localConfig,
  testMatch: ['**/project-detail.spec.js', '**/portfolio.spec.js', '**/certificates.spec.js'],
  timeout: 90000,
  expect: { timeout: 10000 },
  retries: 0,
  workers: 1,
  outputDir: 'test-results/production',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report/production', open: 'never' }]],
  use: { ...localConfig.use, baseURL: 'https://portfolio-melina-gigena.vercel.app' },
  projects: localConfig.projects.filter((project) => ['desktop', 'mobile'].includes(project.name)),
  webServer: undefined,
});
