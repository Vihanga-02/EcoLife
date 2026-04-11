import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/home');
  await page.getByRole('link', { name: 'Energy Monitor Track' }).click();
  await page.getByRole('button', { name: 'Add Appliance' }).click();
  await page.getByRole('textbox', { name: 'e.g. Samsung Refrigerator' }).click();
  await page.getByRole('textbox', { name: 'e.g. Samsung Refrigerator' }).fill('Fan');
  await page.locator('form').getByRole('button', { name: 'Add Appliance' }).click();

  // ASSERTION
  const validationError = page.getByText('Name and wattage are required.');
  await expect(validationError).toBeVisible();
});