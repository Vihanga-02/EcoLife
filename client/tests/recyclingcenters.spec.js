import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/home');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'you@example.com' }).click();
  await page.getByRole('textbox', { name: 'you@example.com' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: '••••••••' }).click();
  await page.getByRole('textbox', { name: '••••••••' }).fill('password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Recycling' }).click();
  await page.getByRole('button', { name: 'Add Center' }).click();
  await page.getByRole('textbox', { name: 'e.g. Colombo Central Recycling' }).click();
  await page.getByRole('textbox', { name: 'e.g. Colombo Central Recycling' }).fill('abc');
  await page.getByRole('textbox', { name: 'e.g. Colombo', exact: true }).click();
  await page.getByRole('textbox', { name: 'e.g. Colombo', exact: true }).fill('colombo');
  await page.getByRole('textbox', { name: 'e.g. 123 Main St, Colombo' }).click();
  await page.getByRole('textbox', { name: 'e.g. 123 Main St, Colombo' }).fill('123 main street');
  await page.getByRole('textbox', { name: 'e.g. 011 234' }).click();
  await page.getByRole('textbox', { name: 'e.g. 011 234' }).fill('0112345678');
  await page.getByRole('textbox', { name: 'e.g. 9 AM - 5 PM' }).click();
  await page.getByRole('textbox', { name: 'e.g. 9 AM - 5 PM' }).fill('10 am - 6 pm');
  await page.locator('.gm-style > div > div:nth-child(2)').click();
  await page.getByRole('button', { name: 'Plastic' }).click();
  await page.getByRole('button', { name: 'Paper' }).click();
  await page.getByRole('button', { name: 'Glass' }).click();
  await page.locator('button').filter({ hasText: /^Add Center$/ }).click();
  await page.getByRole('button').nth(5).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();
  await page.getByRole('textbox', { name: 'e.g. Colombo Central Recycling' }).click();
  await page.getByRole('textbox', { name: 'e.g. Colombo Central Recycling' }).fill('abc123');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
});