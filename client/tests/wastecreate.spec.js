
import { test, expect } from '@playwright/test';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test('waste create validation and submit', async ({ page }) => {
  await page.goto('http://localhost:5173/home');
  await page.getByRole('link', { name: 'Waste Tracker Log your waste' }).click();
  await page.getByRole('button', { name: 'Log Waste' }).click();
  await page.getByRole('button', { name: '📄 Paper', exact: true }).click();

  // Submit without quantity
  await page.locator('form').getByRole('button', { name: 'Log Waste' }).click();

  // Validation message check
  await expect(page.getByText('Quantity must be greater than 0.')).toBeVisible();

  // Enter valid data
  await page.getByPlaceholder('e.g.').fill('6');
  await page.locator('form').getByRole('combobox').selectOption('count');
  await page.locator('form').getByRole('button', { name: 'Log Waste' }).click();
});