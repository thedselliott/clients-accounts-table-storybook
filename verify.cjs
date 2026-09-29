/**
 * DEV-ONLY verification script — drives the esbuild-bundled dev harness with
 * Playwright to confirm the real interactions actually work, since Storybook
 * itself can't be installed in this sandbox (npm registry blocked by org
 * policy). Not part of the deliverable.
 */
const path = require('path');
process.env.NODE_PATH = '/opt/node-tools/node_modules';
require('module').Module._initPaths();
const { chromium } = require('playwright');

const consoleErrors = [];
const results = {};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push('PAGEERROR: ' + err.message));

  await page.goto('http://localhost:8934/dev-preview.html', { waitUntil: 'networkidle' });

  const initialRows = await page.locator('[role="row"]').count();
  results.initialRowishElements = initialRows;

  // --- search filtering ---
  await page.getByLabel('Open search').click();
  const searchInput = page.getByPlaceholder('Search clients & accounts');
  await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  await searchInput.fill('Sierra');
  await page.waitForTimeout(200);
  const gridRows = page.locator('[role="grid"] [role="row"]');
  results.rowsAfterSearch = await gridRows.count();
  results.searchedRowText = await gridRows.first().innerText().catch(() => null);
  await searchInput.fill('');
  await page.waitForTimeout(200);
  results.rowsAfterClearingSearch = await gridRows.count();

  // --- sort toggle ---
  const clientHeader = page.getByRole('columnheader', { name: /client/i });
  await clientHeader.click();
  results.ariaSortAfterFirstClick = await clientHeader.getAttribute('aria-sort');
  await clientHeader.click();
  results.ariaSortAfterSecondClick = await clientHeader.getAttribute('aria-sort');
  await clientHeader.click();
  results.ariaSortAfterThirdClick = await clientHeader.getAttribute('aria-sort');

  // --- column visibility ---
  await page.getByRole('button', { name: 'Filters' }).click();
  const balanceCheckbox = page.getByRole('group', { name: 'Column visibility' }).getByLabel(/Balance/);
  await balanceCheckbox.uncheck();
  results.balanceHeaderVisibleAfterHide = await page
    .getByRole('columnheader', { name: /balance/i })
    .count();
  await balanceCheckbox.check();
  results.balanceHeaderVisibleAfterShow = await page
    .getByRole('columnheader', { name: /balance/i })
    .count();

  // --- mouse selection ---
  const firstRow = gridRows.first();
  const firstCheckbox = firstRow.locator('input[type="checkbox"]');
  await firstCheckbox.check();
  results.firstRowAriaSelectedAfterClick = await firstRow.getAttribute('aria-selected');

  // --- keyboard navigation + selection ---
  await firstRow.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Space');
  const secondRow = gridRows.nth(1);
  results.secondRowAriaSelectedAfterKeyboard = await secondRow.getAttribute('aria-selected');

  // --- live region result count ---
  results.liveRegionText = await page.locator('[aria-live="polite"]').innerText();

  // --- loading / error / empty states ---
  await page.locator('#btn-loading').click();
  await page.waitForTimeout(100);
  results.loadingMessageVisible = await page.getByText('Loading accounts…').isVisible();
  await page.locator('#btn-loading').click();

  await page.locator('#btn-error').click();
  await page.waitForTimeout(100);
  results.errorMessageVisible = await page.getByText('Could not load accounts').isVisible();
  await page.locator('#btn-error').click();

  await page.locator('#btn-empty').click();
  await page.waitForTimeout(100);
  results.emptyMessageVisible = await page.getByText('No accounts to show yet.').isVisible();
  await page.locator('#btn-empty').click();

  await page.screenshot({ path: '/tmp/datagrid-verification.png', fullPage: true });

  results.consoleErrors = consoleErrors;

  console.log(JSON.stringify(results, null, 2));

  await browser.close();
})().catch((err) => {
  console.error('SCRIPT FAILED', err);
  process.exit(1);
});
