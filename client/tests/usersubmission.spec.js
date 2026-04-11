import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/home');
  await page.getByRole('navigation').getByRole('link', { name: 'Recycle Centers' }).click();
  await page.getByRole('button', { name: 'Grid' }).click();
  await page.getByRole('button', { name: 'Drop off here' }).first().click();
  await page.getByRole('combobox').selectOption('Paper');
  await page.getByPlaceholder('e.g.').click();
  await page.getByPlaceholder('e.g.').fill('10');
  await page.getByRole('button', { name: 'Submit Request' }).click();
// ASSERTION: toast message
  await expect(
    page.getByText('Request submitted successfully! We will review it soon.')
  ).toBeVisible();

});








