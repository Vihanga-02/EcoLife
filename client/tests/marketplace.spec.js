import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/marketplace');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'you@example.com' }).click();
  await page.getByRole('textbox', { name: 'you@example.com' }).fill('kaveesha123@gmail.com');
  await page.getByRole('textbox', { name: '••••••••' }).click();
  await page.getByRole('textbox', { name: '••••••••' }).fill('kaveesha123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Marketplace List or claim' }).click();
  await page.getByRole('button', { name: 'List an Item' }).click();
  await page.getByRole('button', { name: 'New Listing' }).click();
  await page.getByRole('textbox', { name: 'e.g. Used Bicycle in Good' }).click();
  await page.getByRole('textbox', { name: 'e.g. Used Bicycle in Good' }).fill('used dell laptop');
  await page.getByRole('textbox', { name: 'Describe your item — age,' }).click();
  await page.getByRole('textbox', { name: 'Describe your item — age,' }).fill('old but working fine');
  await page.locator('.w-12.h-12.bg-green-100').click();
  await page.setInputFiles('input[type="file"]', 'public/test.jpg');
  await page.getByRole('combobox').selectOption('Electronics');
  await page.getByRole('button', { name: 'Fair' }).click();
  await page.getByRole('button', { name: 'List Item' }).click();
  await page.getByRole('button', { name: 'Edit item' }).first().click();
  await page.getByRole('button', { name: 'Good' }).click();
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.getByRole('button', { name: 'Delete item' }).first().click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
});